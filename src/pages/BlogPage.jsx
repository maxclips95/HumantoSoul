import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';

export default function BlogPage() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const prophecyRes = await axios.get('/api/prophecies');

                // Normalize Prophecies
                // Backend returns { manual: [], automated: [] } for prophecies
                const prophecies = [
                    ...(prophecyRes.data.manual || []),
                    ...(prophecyRes.data.automated || [])
                ].filter(p => {
                    // FILTER: 
                    // 1. Exclude Hindi titles (Regex for Devanagari)
                    // 2. Exclude "Satsang" schedule items (contain pipes or specific keyword)
                    const hasHindi = /[\u0900-\u097F]/.test(p.title);
                    const isSchedule = /satsang/i.test(p.title) && p.title.includes('|');
                    return !hasHindi && !isSchedule;
                }).map(p => ({
                    id: p.id,
                    type: 'prophecy',
                    title: p.title,
                    excerpt: p.summary || p.description || p.transcript?.substring(0, 200), // Prioritize Summary, then Description
                    date: p.year,
                    image: p.thumbnail,
                    linkId: p.id
                })).filter(p => p.excerpt && p.excerpt.length > 5); // Filter out empty posts

                // Sort (Newest first)
                const allPosts = [...prophecies].sort((a, b) => {
                    if (b.date !== a.date) return (b.date || '').localeCompare(a.date || '');
                    return b.id - a.id;
                });

                setPosts(allPosts);
            } catch (err) {
                console.error("Failed to load blog:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        fetchData();
    }, []);

    if (loading) return <div className="loader">Loading Insights...</div>;

    return (
        <div className="blog-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
            <SEO
                title="Spiritual Teachings & Prophecies - Meditation, Dhyan & Satsang | Baba Jaigurudev"
                description="Read the latest spiritual teachings, prophecies, and wisdom from Baba Jaigurudev Mission. Topics include meditation (dhyan), satsang, yog sadhna, inner peace, power, prosperity, soul awakening, and divine predictions. आध्यात्मिक शिक्षण, बाबा जयगुरुदेव।"
                keywords="spiritual teachings, spiritual insights, prophecy teachings, meditation teachings, dhyan, satsang, yog sadhna, yoga, inner peace, power, prosperity, soul awakening, baba jaigurudev, baba umakant, jai gurudev, sant mat, satyug updates, 2026 predictions, bhavishyavani, God, atma, आध्यात्मिक शिक्षण, ध्यान, सत्संग, भविष्यवाणी"
                url="https://www.humantosoul.com/blog"
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Teachings", url: "https://www.humantosoul.com/blog" }
                ]}
            />
            <header style={{ textAlign: 'center', marginBottom: '60px' }}>
                <h1 style={{ fontSize: '3rem', color: '#c41e3a', marginBottom: '10px' }}>Spiritual Teachings</h1>
                <p style={{ fontSize: '1.2rem', color: '#666' }}>Latest prophecies, teachings, and wisdom from the mission.</p>
            </header>

            <div className="blog-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '30px'
            }}>
                {posts.map((post, index) => (
                    <Link
                        key={`${post.type}-${post.id}`}
                        to={`/prophecy/${post.linkId}`}
                        style={{ textDecoration: 'none', color: 'inherit' }}
                    >
                        <article style={{
                            border: '1px solid #eee',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            backgroundColor: 'white'
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)';
                            }}
                        >
                            {/* Color Strip Indicator */}
                            <div style={{ height: '10px', background: '#c41e3a' }}></div>

                            <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <div style={{ marginBottom: '15px' }}>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        textTransform: 'uppercase',
                                        fontWeight: 'bold',
                                        color: '#c41e3a',
                                        background: '#fff0f0',
                                        padding: '4px 8px',
                                        borderRadius: '4px'
                                    }}>
                                        Teachings
                                    </span>
                                    {post.date && <span style={{ marginLeft: '10px', fontSize: '0.85rem', color: '#888' }}>{post.date}</span>}
                                </div>

                                <h2 style={{ fontSize: '1.4rem', margin: '0 0 15px 0', lineHeight: '1.3' }}>
                                    {post.title}
                                </h2>

                                <p style={{ fontSize: '1rem', color: '#555', lineHeight: '1.6', flex: 1 }}>
                                    {post.excerpt ? (post.excerpt.length > 120 ? post.excerpt.substring(0, 120) + '...' : post.excerpt) : ''}
                                </p>

                                <div style={{ marginTop: '20px', color: '#c41e3a', fontWeight: '600', fontSize: '0.9rem' }}>
                                    Read Full Post &rarr;
                                </div>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
