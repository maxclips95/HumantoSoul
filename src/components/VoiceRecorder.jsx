import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import './VoiceRecorder.css';

const MAX_SECONDS = 120; // 2 minute max

export default function VoiceRecorder() {
    const [status, setStatus] = useState('idle'); // idle | recording | recorded | uploading | done | error
    const [seconds, setSeconds] = useState(0);
    const [audioUrl, setAudioUrl] = useState(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');

    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);
    const blobRef = useRef(null);
    const timerRef = useRef(null);
    const streamRef = useRef(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
            if (streamRef.current) {
                streamRef.current.getTracks().forEach(t => t.stop());
            }
            if (audioUrl) URL.revokeObjectURL(audioUrl);
        };
    }, [audioUrl]);

    const startRecording = async () => {
        setError('');
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamRef.current = stream;
            chunksRef.current = [];

            const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
            mediaRecorderRef.current = mr;

            mr.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mr.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                blobRef.current = blob;
                const url = URL.createObjectURL(blob);
                setAudioUrl(url);
                setStatus('recorded');
                stream.getTracks().forEach(t => t.stop());
            };

            mr.start(250);
            setStatus('recording');
            setSeconds(0);

            // Timer — auto-stop at MAX_SECONDS
            timerRef.current = setInterval(() => {
                setSeconds(prev => {
                    if (prev >= MAX_SECONDS - 1) {
                        stopRecording();
                        return MAX_SECONDS;
                    }
                    return prev + 1;
                });
            }, 1000);
        } catch {
            setError('Microphone access denied. Please allow mic permission and try again.');
        }
    };

    const stopRecording = () => {
        clearInterval(timerRef.current);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
    };

    const discard = () => {
        setStatus('idle');
        setAudioUrl(null);
        setSeconds(0);
        blobRef.current = null;
        chunksRef.current = [];
    };

    const sendVoiceNote = async () => {
        if (!blobRef.current) return;
        if (!phone.trim() && !name.trim()) {
            setError('Please enter at least your name or phone number before sending.');
            return;
        }
        setStatus('uploading');
        setError('');
        try {
            const form = new FormData();
            form.append('voiceNote', blobRef.current, 'voice-message.webm');
            form.append('name', name);
            form.append('phone', phone);
            await axios.post('/api/contact/voice', form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setStatus('done');
        } catch {
            setError('Failed to send. Please try again or call us directly.');
            setStatus('recorded');
        }
    };

    const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
    const progress = Math.min((seconds / MAX_SECONDS) * 100, 100);

    if (status === 'done') {
        return (
            <div className="vr-card vr-done">
                <div className="vr-done-icon">🙏</div>
                <h3>Jai Gurudev!</h3>
                <p>Your voice message has been received. The team will get back to you soon.</p>
                <p>आपका संदेश मिल गया। हम जल्द ही संपर्क करेंगे।</p>
            </div>
        );
    }

    return (
        <div className="vr-card">
            <div className="vr-header">
                <span className="vr-icon">🎙️</span>
                <div>
                    <h3 className="vr-title">Send a Voice Message</h3>
                    <p className="vr-subtitle">Not comfortable typing? Record your message in Hindi or any language. अपना संदेश बोलकर भेजें।</p>
                </div>
            </div>

            {/* Name & Phone — minimal fields for illiterate users */}
            {(status === 'idle' || status === 'recording' || status === 'recorded') && (
                <div className="vr-fields">
                    <input
                        className="vr-input"
                        type="text"
                        placeholder="Your Name (नाम)"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        className="vr-input"
                        type="tel"
                        placeholder="Phone Number (मोबाइल नंबर)"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                    />
                </div>
            )}

            {/* Recorder UI */}
            <div className="vr-recorder">
                {status === 'idle' && (
                    <button className="vr-btn vr-btn--record" onClick={startRecording}>
                        <span className="vr-mic-dot"></span>
                        Start Recording / रिकॉर्ड करें
                    </button>
                )}

                {status === 'recording' && (
                    <div className="vr-recording-panel">
                        <div className="vr-pulse-ring">
                            <div className="vr-mic-live">🎙️</div>
                        </div>
                        <div className="vr-timer">{fmt(seconds)} / {fmt(MAX_SECONDS)}</div>
                        <div className="vr-progress-bar">
                            <div className="vr-progress-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                        <p className="vr-hint">बोलते रहें... Press stop when done.</p>
                        <button className="vr-btn vr-btn--stop" onClick={stopRecording}>
                            ⏹ Stop Recording
                        </button>
                    </div>
                )}

                {status === 'recorded' && audioUrl && (
                    <div className="vr-preview">
                        <p className="vr-recorded-label">✅ Recording ready — listen before sending:</p>
                        <audio controls src={audioUrl} className="vr-audio-player" />
                        <div className="vr-actions">
                            <button className="vr-btn vr-btn--send" onClick={sendVoiceNote}>
                                📤 Send Voice Message
                            </button>
                            <button className="vr-btn vr-btn--discard" onClick={discard}>
                                🗑 Record Again
                            </button>
                        </div>
                    </div>
                )}

                {status === 'uploading' && (
                    <div className="vr-uploading">
                        <div className="vr-spinner"></div>
                        <p>Sending your message... भेजा जा रहा है...</p>
                    </div>
                )}
            </div>

            {error && <p className="vr-error">⚠️ {error}</p>}
        </div>
    );
}
