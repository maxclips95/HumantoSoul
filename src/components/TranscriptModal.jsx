import React, { useState, useEffect } from "react";

const TranscriptModal = ({ title, hindiText, englishText, videoLink, onClose }) => {
    const [activeTab, setActiveTab] = useState('hindi');

    // Disable body scroll when modal is open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const isDual = activeTab === 'dual';

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            color: 'white',
            zIndex: 10000,
            overflowY: 'auto',
            padding: '40px 20px',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div style={{ maxWidth: isDual ? '1200px' : '900px', width: '100%', position: 'relative', transition: 'max-width 0.3s ease' }}>
                <button
                    onClick={onClose}
                    style={{
                        position: 'fixed',
                        top: '20px',
                        right: '30px',
                        background: 'none',
                        border: '2px solid white',
                        color: 'white',
                        fontSize: '20px',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001
                    }}
                >
                    ✕
                </button>

                <div style={{ marginTop: '40px', paddingBottom: '60px' }}>
                    <h1 style={{
                        marginTop: '20px',
                        fontSize: '1.8rem',
                        borderBottom: '1px solid #333',
                        paddingBottom: '20px',
                        marginBottom: '20px',
                        lineHeight: '1.3'
                    }}>
                        {title}
                    </h1>

                    {/* Toggle Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        marginBottom: '25px',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => setActiveTab('hindi')}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                background: activeTab === 'hindi' ? '#c41e3a' : '#333',
                                color: 'white',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            हिंदी (Hindi)
                        </button>
                        <button
                            onClick={() => setActiveTab('english')}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                background: activeTab === 'english' ? '#c41e3a' : '#333',
                                color: 'white',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setActiveTab('dual')}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                background: activeTab === 'dual' ? '#c41e3a' : '#333',
                                color: 'white',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Dual View (दोनों)
                        </button>
                    </div>

                    {/* Transcript Content */}
                    <div style={{
                        display: isDual ? 'grid' : 'block',
                        gridTemplateColumns: isDual ? '1fr 1fr' : 'none',
                        gap: '20px',
                        fontSize: '1.15rem',
                        lineHeight: '2',
                        whiteSpace: 'pre-wrap',
                        color: '#e0e0e0'
                    }}>
                        {activeTab === 'hindi' && (
                            <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', minHeight: '300px' }}>
                                {hindiText}
                            </div>
                        )}
                        {activeTab === 'english' && (
                            <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', minHeight: '300px' }}>
                                {englishText}
                            </div>
                        )}
                        {activeTab === 'dual' && (
                            <>
                                <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', minHeight: '300px' }}>
                                    <div style={{ color: '#c41e3a', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>हिंदी (Hindi)</div>
                                    {hindiText}
                                </div>
                                <div style={{ background: '#1a1a1a', padding: '25px', borderRadius: '10px', minHeight: '300px' }}>
                                    <div style={{ color: '#c41e3a', fontWeight: 'bold', marginBottom: '10px', borderBottom: '1px solid #333', paddingBottom: '5px' }}>English</div>
                                    {englishText}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Watch Video Link */}
                    {videoLink && (
                        <a
                            href={videoLink}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                                display: 'inline-block',
                                marginTop: '25px',
                                padding: '12px 24px',
                                background: '#c41e3a',
                                color: 'white',
                                textDecoration: 'none',
                                borderRadius: '8px',
                                fontWeight: 'bold',
                                fontSize: '1rem'
                            }}
                        >
                            ▶ Watch Video
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TranscriptModal;
