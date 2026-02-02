import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

export default function AnnouncementDetail() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await axios.get(`/api/announcements/${id}`);
                setItem(res.data);

                // --- SEO DYNAMIC UPDATE ---
                if (res.data.title) {
                    document.title = `${res.data.title} - Announcement | Jai Gurudev`;
                }
            } catch (err) {
                console.error("Error loading announcement:", err);
                setError("Announcement not found.");
            } finally {
                setLoading(false);
            }
        };
        fetchItem();

        return () => {
            document.title = "Jai Gurudev - Spiritual Teachings";
        };
    }, [id]);

    if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
    if (error) return <div style={{ textAlign: "center", padding: "50px", color: "red" }}>{error}</div>;
    if (!item) return null;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', fontFamily: "'Segoe UI', sans-serif', minHeight: '60vh'" }}>

            <Link to="/blog" style={{ textDecoration: 'none', color: '#666', marginBottom: '20px', display: 'inline-block' }}>
                &larr; Back to Blog
            </Link>

            <article style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <header style={{ marginBottom: '30px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
                    {item.year && (
                        <span style={{
                            background: '#333',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.8rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}>
                            {item.year}
                        </span>
                    )}
                    <h1 style={{
                        marginTop: '15px',
                        fontSize: '2.2rem',
                        color: '#111',
                        lineHeight: '1.3'
                    }}>
                        {item.title}
                    </h1>
                </header>

                <div style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#333', whiteSpace: 'pre-wrap', marginBottom: '40px' }}>
                    {item.description}
                </div>

                {item.fileUrl && (
                    <div style={{ backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                        <div style={{ fontSize: '2rem', marginRight: '15px' }}>📄</div>
                        <div>
                            <h4 style={{ margin: '0 0 5px 0' }}>Attached Document</h4>
                            <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                style={{ color: '#0066cc', textDecoration: 'none', fontWeight: 'bold' }}
                            >
                                View / Download PDF
                            </a>
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}
