import React, { useState, useEffect } from 'react';

const VoiceAssistant = () => {
    const [speaking, setSpeaking] = useState(false);
    const [available, setAvailable] = useState(false);
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            setVoices(availableVoices);
            if (availableVoices.length > 0) {
                setAvailable(true);
            }
        };

        loadVoices();

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }
    }, []);

    const getTextToRead = () => {
        // Prioritize article content, then main content, then body
        const article = document.querySelector('article');
        if (article) return article.innerText;

        const main = document.querySelector('main');
        if (main) return main.innerText;

        // Fallback: Read headers and paragraphs only to avoid reading menu/footer clutter
        const contentNodes = document.querySelectorAll('h1, h2, p, .prophecy-text');
        let text = '';
        contentNodes.forEach(node => {
            if (node.innerText.length > 5 && node.offsetParent !== null) { // Visible and meaningful
                text += node.innerText + '. ';
            }
        });
        return text;
    };

    const handleSpeak = () => {
        const synth = window.speechSynthesis;

        if (speaking) {
            if (paused) {
                synth.resume();
                setPaused(false);
            } else {
                synth.pause();
                setPaused(true);
            }
        } else {
            const text = getTextToRead();
            if (!text) {
                alert("No content found to read.");
                return;
            }

            // Cancel any previous speech
            synth.cancel();

            const utterance = new SpeechSynthesisUtterance(text);

            // 1. Detect Language from HTML tag (updated by Google Translate)
            let pageLang = document.documentElement.lang || 'en-US';

            // Google Translate sometimes sets lang="fr" or "auto". 
            // If it is "auto", we might need to fallback to detection or default.
            if (pageLang === 'auto') pageLang = 'en-US';

            // Special check for Hindi characters if lang is ambiguous
            if (pageLang.startsWith('en') && /[\u0900-\u097F]/.test(text)) {
                pageLang = 'hi-IN';
            }

            utterance.lang = pageLang;
            console.log("Detected Language:", pageLang);

            // 2. Find Best Matching Voice
            // First try exact match (e.g., "hi-IN" == "hi-IN")
            let bestVoice = voices.find(v => v.lang === pageLang);

            // If no exact match, try partial match on language code (e.g., "fr" inside "fr-FR")
            if (!bestVoice) {
                const shortLang = pageLang.split('-')[0]; // "fr" from "fr-FR"
                bestVoice = voices.find(v => v.lang.startsWith(shortLang));
            }

            // If found, assign it. Otherwise, browser uses default for that lang.
            if (bestVoice) {
                utterance.voice = bestVoice;
                console.log("Selected Voice:", bestVoice.name);
            }

            // Adjust rate and pitch for a more natural feel
            utterance.rate = 0.9;
            utterance.pitch = 1.0;

            utterance.onend = () => {
                setSpeaking(false);
                setPaused(false);
            };

            utterance.onerror = (e) => {
                console.error("Speech error:", e);
                setSpeaking(false);
                setPaused(false);
            };

            synth.speak(utterance);
            setSpeaking(true);
            setPaused(false);
        }
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        setPaused(false);
    };

    if (!available) return null;

    return (
        <div style={{ position: 'fixed', bottom: '90px', right: '30px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {speaking && (
                <button
                    onClick={handleStop}
                    style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        backgroundColor: '#333',
                        color: 'white',
                        border: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        transition: 'transform 0.2s'
                    }}
                    title="Stop Reading"
                >
                    <i className="fas fa-stop"></i>
                </button>
            )}

            <button
                onClick={handleSpeak}
                className="voice-fab"
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: speaking && !paused ? '#FFD700' : '#c41e3a',
                    color: speaking && !paused ? '#333' : 'white',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(196, 30, 58, 0.4)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                }}
                title={speaking ? (paused ? "Resume Reading" : "Pause Reading") : "Listen to this page"}
            >
                {speaking && !paused ? (
                    <div className="wave-animation">
                        <i className="fas fa-pause"></i>
                    </div>
                ) : (
                    <i className="fas fa-volume-up"></i>
                )}

                {/* Pulse animation when not active to draw attention */}
                {!speaking && (
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        borderRadius: '50%',
                        border: '2px solid #c41e3a',
                        animation: 'pulse-ring 2s infinite'
                    }}></div>
                )}
            </button>

            <style>
                {`
                    @keyframes pulse-ring {
                        0% { transform: scale(1); opacity: 0.7; }
                        100% { transform: scale(1.5); opacity: 0; }
                    }
                `}
            </style>
        </div>
    );
};

export default VoiceAssistant;
