import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

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

                // --- SEO DYNAMIC UPDATE ---
                if (res.data.title) {
                    document.title = `${res.data.title} - Prophecy & Warning | Jai Gurudev`;

                    // Optional: Update meta description if you had a helper for it
                    // updateMetaDescription(res.data.description);
                }
            } catch (err) {
                console.error("Error loading prophecy:", err);
                setError("Prophecy not found or server error.");
            } finally {
                setLoading(false);
            }
        };
        fetchProphecy();

        // Cleanup title on unmount
        return () => {
            document.title = "Jai Gurudev - Spiritual Teachings";
        };
    }, [id]);

    if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
    if (error) return <div style={{ textAlign: "center", padding: "50px", color: "red" }}>{error}</div>;
    if (!item) return null;

    // Helper to split transcript if bilingual
    const hasTranscript = item.transcript && item.transcript.includes('|||');
    const hindiText = hasTranscript ? item.transcript.split('|||')[0] : item.transcript;
    const englishText = hasTranscript ? item.transcript.split('|||')[1] : null;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: "'Segoe UI', sans-serif" }}>

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
                </header>



                {/* Summary / Description */}
                <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#444', marginBottom: '40px', whiteSpace: 'pre-wrap' }}>
                    {item.description}
                </div>

                {/* Full Transcript Section */}
                {item.transcript && (
                    <div style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '8px', borderLeft: '4px solid #c41e3a' }}>
                        <h2 style={{ marginTop: 0, fontSize: '1.5rem', color: '#c41e3a' }}>Full Transcript</h2>

                        {hasTranscript ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '20px' }}>
                                <div>
                                    <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>Hindi</h3>
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{hindiText}</div>
                                </div>
                                <div>
                                    <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>English</h3>
                                    <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>{englishText}</div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8', marginTop: '20px' }}>
                                {item.transcript}
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
