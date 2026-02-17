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

            // Detect Language
            const hasHindi = /[\u0900-\u097F]/.test(text);
            utterance.lang = hasHindi ? 'hi-IN' : 'en-US';

            // IMPORTANT: Explicitly select a Hindi voice if needed
            if (hasHindi) {
                const hindiVoice = voices.find(v => v.lang.includes('hi') || v.name.toLowerCase().includes('hindi'));
                if (hindiVoice) {
                    utterance.voice = hindiVoice;
                    console.log("Selected Hindi Voice:", hindiVoice.name);
                }
            } else {
                // Try to pick a clear English voice if available (e.g., Google US English)
                const englishVoice = voices.find(v => v.name.includes('Google US English') || v.lang === 'en-US');
                if (englishVoice) {
                    utterance.voice = englishVoice;
                }
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
