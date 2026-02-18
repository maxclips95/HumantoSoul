import React, { useState, useEffect } from 'react';

const VoiceAssistant = () => {
    const [speaking, setSpeaking] = useState(false);
    const [available, setAvailable] = useState(false);
    const [paused, setPaused] = useState(false);
    const [voices, setVoices] = useState([]);

    useEffect(() => {
        let interval;

        const loadVoices = () => {
            const availableVoices = window.speechSynthesis.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
                setAvailable(true);
                if (interval) clearInterval(interval);
            }
        };

        loadVoices();

        // Chrome loads voices asynchronously
        if (window.speechSynthesis.onvoiceschanged !== undefined) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        // Robustness: Force check every 500ms for 5 seconds to ensure loading
        interval = setInterval(loadVoices, 500);
        setTimeout(() => clearInterval(interval), 5000);

        // --- NEW: Listen for Google Translate Language Changes ---
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'lang') {
                    console.log("Language changed to:", document.documentElement.lang);
                    // Reload voices to ensure we have the right one for the new lang
                    loadVoices();
                    // Stop speaking if language changes mid-speech to avoid confused accents
                    window.speechSynthesis.cancel();
                    setSpeaking(false);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang']
        });

        return () => {
            clearInterval(interval);
            observer.disconnect();
        };
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

        // Safety: If voices are empty, try to load them again (fix for some browsers)
        if (voices.length === 0) {
            const availableVoices = synth.getVoices();
            if (availableVoices.length > 0) {
                setVoices(availableVoices);
            }
        }

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

            // Normalize "auto" or empty to English
            if (!pageLang || pageLang === 'auto') pageLang = 'en-US';

            // Google Translate uses 2-letter codes (e.g. "hi", "es"), but voices often use 4-letter (e.g. "hi-IN", "es-ES")
            // Special check for Hindi characters if lang is ambiguous
            if (pageLang.startsWith('en') && /[\u0900-\u097F]/.test(text)) {
                pageLang = 'hi-IN';
            }

            utterance.lang = pageLang;

            // 2. Find Best Matching Voice
            // Strategy: Exact Match -> Loose Match (Language only) -> Microsoft/Google specific -> Default
            let bestVoice = voices.find(v => v.lang === pageLang);

            if (!bestVoice) {
                // Try matching just the language code (e.g. "fr" matches "fr-FR" or "fr-CA")
                const shortLang = pageLang.split('-')[0];
                bestVoice = voices.find(v => v.lang.startsWith(shortLang));
            }

            // If still no voice, and we are on Mobile/Android, sometimes "Google [Lang]" exists
            if (!bestVoice) {
                // Try to find a voice that has the language name in its name (e.g. name="Google Hindi")
                // This is a fuzzy fallback for some systems
                const langNameMap = {
                    'hi': 'Hindi',
                    'es': 'Spanish',
                    'fr': 'French',
                    'de': 'German',
                    'it': 'Italian',
                    'ru': 'Russian',
                    'ja': 'Japanese',
                    'zh': 'Chinese',
                };
                const shortLang = pageLang.split('-')[0];
                const langName = langNameMap[shortLang];
                if (langName) {
                    bestVoice = voices.find(v => v.name.includes(langName));
                }
            }

            // If found, assign it.
            if (bestVoice) {
                utterance.voice = bestVoice;
                console.log(`Voice Selected: ${bestVoice.name} (${bestVoice.lang}) for Page Lang: ${pageLang}`);
            } else {
                console.warn(`No voice found for ${pageLang}. Using browser default.`);
                // Fallback attempt: If no specific voice, try dragging generic English if lang is obscure
                if (!pageLang.startsWith('en')) {
                    const genericEnglish = voices.find(v => v.lang.startsWith('en'));
                    if (genericEnglish && !utterance.voice) {
                        // Don't force it, but keeps it as backup options logic if needed in future
                    }
                }
            }

            // User Feedback: If we suspect failure (no voice + non-English), warn user
            if (!bestVoice && !pageLang.startsWith('en')) {
                // We won't block it, but we log robustness
            }

            // Critical: Cancel again right before speaking to prevent "queue stuck" issues
            window.speechSynthesis.cancel();

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

                if (e.error === 'not-allowed') {
                    alert("Voice play not allowed. Please interact with the validation document first.");
                } else if (e.error === 'voice-unavailable') {
                    alert(`Voice for language (${pageLang}) is unavailable on this device.`);
                }
            };

            try {
                synth.speak(utterance);
                setSpeaking(true);
                setPaused(false);
            } catch (err) {
                console.error("Synth Error:", err);
                alert("Text-to-Speech failed. Please refresh.");
            }
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
                    backgroundColor: speaking && !paused ? '#FFD700' : '#00008B',
                    color: speaking && !paused ? '#333' : 'white',
                    border: 'none',
                    boxShadow: '0 4px 15px rgba(0, 0, 139, 0.4)',
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
                        border: '2px solid #00008B',
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
