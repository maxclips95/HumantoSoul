import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { processVoiceCommand } from '../../utils/AdvancedVoiceLogic';

const GlobalVoiceSearch = () => {
    const [isListening, setIsListening] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [isSupported, setIsSupported] = useState(false);
    const recognitionRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            setIsSupported(true);
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onstart = () => {
                setIsListening(true);
                // Clear any previous "No speech" message if we are retrying
                setSearchText('');
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                // Do NOT close modal automatically on silence. 
                // Let user decide to retry or close.
            };

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchText(transcript);
                if (event.results[0].isFinal) {
                    processSearch(transcript);
                }
            };

            recognitionRef.current.onerror = (event) => {
                setIsListening(false);
                if (event.error === 'no-speech') {
                    setSearchText("Dig't hear anything. Tap mic to try again.");
                } else if (event.error === 'not-allowed') {
                    setSearchText("Microphone access denied.");
                } else {
                    console.error("Speech Recognition Error", event.error);
                }
            };
        }
    }, []);

    const startListening = () => {
        setModalOpen(true);
        setSearchText('');
        startRecognition();
    };

    const startRecognition = () => {
        if (recognitionRef.current) {
            try {
                const currentLang = document.documentElement.lang || 'en-US';
                recognitionRef.current.lang = currentLang;
                recognitionRef.current.start();
                setSearchText(''); // Clear text on fresh start
            } catch (e) {
                console.error("Speech start error", e);
            }
        }
    }

    const stopListening = () => {
        if (recognitionRef.current) recognitionRef.current.stop();
        // Only close modal if user manually clicks X
        setModalOpen(false);
    };

    const processSearch = (query) => {
        // 1. Get Intelligent Routing Decision
        const { route, searchParam, speechReponse } = processVoiceCommand(query);

        // 2. Voice Feedback (Talk back to user)
        if (speechReponse) {
            const synth = window.speechSynthesis;
            const utter = new SpeechSynthesisUtterance(speechReponse);

            // Match the voice response to the current language
            const currentLang = document.documentElement.lang || 'en-US';
            utter.lang = currentLang;

            synth.cancel(); // Clear queue
            synth.speak(utter);
        }

        setTimeout(() => {
            setModalOpen(false); // Close modal before navigating

            // 3. Navigate
            if (searchParam) {
                navigate(`${route}?search=${encodeURIComponent(searchParam)}`);
            } else {
                navigate(route);
            }
        }, 1500); // Allow time to hear feedback
    };

    if (!isSupported) return null;

    return (
        <>
            {/* Header Button */}
            <button
                onClick={startListening}
                className="nav-item"
                style={{
                    background: 'rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.4)',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    color: 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: '15px',
                    transition: 'all 0.3s'
                }}
                title="Voice Search"
            >
                <i className="fas fa-microphone"></i>
            </button>

            {/* Full Screen Modal Overlay */}
            {modalOpen && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    zIndex: 10000,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    animation: 'fadeIn 0.3s ease'
                }}>
                    <button
                        onClick={stopListening}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: 'none',
                            border: 'none',
                            color: 'white',
                            fontSize: '2rem',
                            cursor: 'pointer'
                        }}
                    >
                        ×
                    </button>

                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        backgroundColor: isListening ? '#00008B' : '#444',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '3rem',
                        marginBottom: '30px',
                        boxShadow: isListening ? '0 0 30px rgba(0, 0, 139, 0.4)' : 'none',
                        transition: 'all 0.3s ease',
                        animation: isListening ? 'pulse 1.5s infinite' : 'none'
                    }}>
                        <i className={`fas fa-${isListening ? 'microphone' : 'microphone-slash'}`}></i>
                    </div>

                    <h2 style={{ marginBottom: '20px', fontWeight: '300' }}>
                        {isListening ? "Listening..." : "Tap to Speak Again"}
                    </h2>

                    {/* Retry Area */}
                    {!isListening && (
                        <button
                            onClick={startRecognition}
                            style={{
                                background: '#00008B',
                                color: 'white',
                                border: 'none',
                                padding: '10px 30px',
                                borderRadius: '25px',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                marginBottom: '20px'
                            }}
                        >
                            Tap to Retry
                        </button>
                    )}

                    <div style={{
                        fontSize: '1.5rem',
                        maxWidth: '80%',
                        textAlign: 'center',
                        minHeight: '50px',
                        borderBottom: '1px solid #666',
                        paddingBottom: '10px'
                    }}>
                        {searchText || "Say 'Prophecies', 'Recipes', 'Books'..."}
                    </div>

                    <style>
                        {`
                        @keyframes pulse {
                            0% { transform: scale(1); boxShadow: 0 0 0 0 rgba(0, 0, 139, 0.7); }
                            70% { transform: scale(1.1); boxShadow: 0 0 0 20px rgba(0, 0, 139, 0); }
                            100% { transform: scale(1); boxShadow: 0 0 0 0 rgba(0, 0, 139, 0); }
                        }
                        @keyframes fadeIn {
                            from { opacity: 0; }
                            to { opacity: 1; }
                        }
                    `}
                    </style>
                </div>
            )}
        </>
    );
};

export default GlobalVoiceSearch;
