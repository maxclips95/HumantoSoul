import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AnnouncementCard = ({ announcement, onReadMore }) => {
    const limit = 200; // Character limit for snippet
    const text = announcement.description || "";
    const isLong = text.length > limit;

    return (
        <div className="card" style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span className="year-badge" style={{ background: '#c41e3a', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-block', marginBottom: '10px', alignSelf: 'flex-start' }}>
                    {announcement.year}
                </span>
                <h3 className="card-title" style={{ marginTop: '0', fontSize: '1.25rem', marginBottom: '10px' }}>{announcement.title}</h3>

                <p className="card-text" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', flex: 1 }}>
                    {isLong ? text.substring(0, limit) + "..." : text}
                </p>

                {isLong && (
                    <button
                        onClick={() => onReadMore(announcement)}
                        style={{
                            background: '#c41e3a',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginTop: '15px',
                            fontSize: '0.9rem',
                            alignSelf: 'flex-start'
                        }}
                    >
                        Read More
                    </button>
                )}

                {announcement.fileUrl && (
                    <div style={{ marginTop: '15px' }}>
                        <a href={announcement.fileUrl} target="_blank" rel="noopener noreferrer" className="card-btn" style={{ display: 'inline-block' }}>
                            View Document
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

const ReadingModal = ({ announcement, onClose }) => {
    if (!announcement) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            color: 'white',
            zIndex: 10000,
            overflowY: 'auto',
            padding: '40px 20px',
            display: 'flex',
            justifyContent: 'center'
        }}>
            <div style={{ maxWidth: '900px', width: '100%', position: 'relative' }}>
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
                    <span style={{
                        background: 'rgba(255,255,255,0.2)',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '0.9rem'
                    }}>
                        {announcement.year}
                    </span>
                    <h1 style={{
                        marginTop: '20px',
                        fontSize: '2.5rem',
                        borderBottom: '1px solid #333',
                        paddingBottom: '20px',
                        marginBottom: '30px',
                        lineHeight: '1.2'
                    }}>
                        {announcement.title}
                    </h1>
                    <div style={{
                        fontSize: '1.2rem',
                        lineHeight: '2',
                        whiteSpace: 'pre-wrap',
                        color: '#ddd'
                    }}>
                        {announcement.description}
                    </div>
                </div>
            </div>
        </div>
    );
};

function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('/api/announcements');
                // Sort by ID (descending) assuming ID is timestamp
                const sorted = response.data.sort((a, b) => (b.id || 0) - (a.id || 0));

                // --- DEDUPLICATION LOGIC ---
                // Remove duplicates based on title + description roughly, or just ID if reliable.
                // Since the user had issues with duplicates before, let's be safe.
                const unique = [];
                const seen = new Set();
                sorted.forEach(item => {
                    const key = item.id + item.title;
                    if (!seen.has(key)) {
                        unique.push(item);
                        seen.add(key);
                    }
                });
                // ---------------------------

                setAnnouncements(unique);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };
        fetchAnnouncements();
    }, []);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (selectedAnnouncement) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedAnnouncement]);

    return (
        <section className="section" style={{ padding: '0 25px' }}>
            {announcements.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No announcements at the moment.</p>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '25px',
                    maxWidth: '95%',
                    margin: '0 auto'
                }}>
                    {announcements.map((announcement) => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                            onReadMore={setSelectedAnnouncement}
                        />
                    ))}
                </div>
            )}

            {selectedAnnouncement && (
                <ReadingModal
                    announcement={selectedAnnouncement}
                    onClose={() => setSelectedAnnouncement(null)}
                />
            )}
        </section>
    );
}

export default Announcements;
