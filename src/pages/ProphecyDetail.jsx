import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import SEO from '../components/common/SEO';
import ReactMarkdown from 'react-markdown';

export default function ProphecyDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProphecy = async () => {
            try {
                const res = await axios.get(`/api/prophecies/${id}`);
                setItem(res.data);
            } catch (err) {
                console.error("Error loading prophecy:", err);
                setError("Prophecy not found or server error.");
            } finally {
                setLoading(false);
            }
        };
        fetchProphecy();
    }, [id]);

    if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
    if (error) return <div style={{ textAlign: "center", padding: "50px", color: "red" }}>{error}</div>;
    if (!item) return null;

    // Helper to split transcript if bilingual
    const hasTranscript = item.transcript && item.transcript.includes('|||');
    const hindiText = hasTranscript ? item.transcript.split('|||')[0] : item.transcript;
    const englishText = hasTranscript ? item.transcript.split('|||')[1] : null;

    const shareUrl = window.location.href;
    const shareText = `Check out this prophecy: ${item.title}`;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: "'Segoe UI', sans-serif" }}>

            <SEO
                title={item.title}
                description={item.description || item.summary || "Spiritual prophecy and warning from Baba Jai Gurudev."}
                keywords={`prophecy, ${item.year || 'future'}, spiritual warning, jai gurudev`}
                image={item.thumbnail || item.image}
                type="article"
            />

            <Link to="/blog" style={{ textDecoration: 'none', color: '#666', marginBottom: '20px', display: 'inline-block' }}>
                &larr; Back to Blog
            </Link>

            <article>
                <header style={{ marginBottom: '30px' }}>
                    {item.year && (
                        <span style={{
                            background: '#c41e3a',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            {item.year}
                        </span>
                    )}
                    <h1 style={{
                        marginTop: '15px',
                        fontSize: '2.5rem',
                        color: '#333',
                        lineHeight: '1.2'
                    }}>
                        {item.title}
                    </h1>

                    {/* Social Share Buttons - Styled like Nav Menu */}
                    <style>
                        {`
                            .share-btn {
                                background-color: #c41e3a;
                                color: white !important;
                                padding: 8px 15px;
                                border-radius: 4px;
                                text-decoration: none;
                                display: inline-flex;
                                align-items: center;
                                gap: 8px;
                                font-weight: bold;
                                transition: background-color 0.3s, transform 0.2s;
                                font-size: 0.9rem;
                            }
                            .share-btn:hover {
                                background-color: #a01830;
                                transform: translateY(-2px);
                                color: #FFD700 !important;
                            }
                        `}
                    </style>
                    <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="share-btn" title="Share on WhatsApp">
                            <i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }}></i> WhatsApp
                        </a>
                        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="share-btn" title="Share on Facebook">
                            <i className="fab fa-facebook" style={{ fontSize: '1.2rem' }}></i> Facebook
                        </a>
                        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="share-btn" title="Share on X">
                            <i className="fa-brands fa-x-twitter" style={{ fontSize: '1.2rem' }}></i> X
                        </a>
                        <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="share-btn" title="Share on Telegram">
                            <i className="fab fa-telegram" style={{ fontSize: '1.2rem' }}></i> Telegram
                        </a>
                    </div>
                </header>



                {/* Summary / Description */}
                <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', marginBottom: '40px', whiteSpace: 'pre-wrap' }}>
                    {item.description}
                </div>

                {/* Full Transcript Section */}
                {item.transcript && (
                    <div style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '8px', borderLeft: '4px solid #c41e3a' }}>

                        {hasTranscript ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                                <div>
                                    <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Hindi</h3>
                                    <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                                        <ReactMarkdown>{hindiText}</ReactMarkdown>
                                    </div>
                                </div>
                                <div>
                                    <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>English</h3>
                                    <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                                        <ReactMarkdown>{englishText}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ lineHeight: '1.8', marginTop: '20px', fontSize: '1.1rem' }}>
                                <ReactMarkdown>{item.transcript}</ReactMarkdown>
                            </div>
                        )}
                    </div>
                )}

            </article>
        </div>
    );
}

// Helper to extract YouTube ID
function getYouTubeId(url) {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}
