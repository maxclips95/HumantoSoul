import React, { useEffect, useState } from "react";
import axios from "axios";
import TranscriptModal from "./TranscriptModal";

export default function ProphecySection() {
    const [items, setItems] = useState([]);
    const [visibleItems, setVisibleItems] = useState(5);
    const [highlight, setHighlight] = useState(null);
    const [selectedTranscript, setSelectedTranscript] = useState(null);

    useEffect(() => {
        axios.get("/api/prophecies")
            .then((res) => {
                const data = res.data;
                let allItems = [];
                if (Array.isArray(data)) {
                    allItems = data;
                } else {
                    const manual = Array.isArray(data.manual) ? data.manual : [];
                    const automated = Array.isArray(data.automated) ? data.automated : [];
                    allItems = [...manual, ...automated];
                }

                // Deduplicate by Link
                const uniqueItems = [];
                const seenLinks = new Set();
                for (const item of allItems) {
                    if (item.link && !seenLinks.has(item.link)) {
                        uniqueItems.push(item);
                        seenLinks.add(item.link);
                    }
                }

                // Sort: videos with approved transcripts first
                uniqueItems.sort((a, b) => {
                    const aHasTranscript = a.transcriptStatus === 'Approved' ? 1 : 0;
                    const bHasTranscript = b.transcriptStatus === 'Approved' ? 1 : 0;
                    return bHasTranscript - aHasTranscript;
                });
                setItems(uniqueItems);
            })
            .catch(console.error);

        // Fetch Global Highlight
        axios.get("/api/prophecy-highlight")
            .then(res => {
                const data = res.data;
                if (data && (data.title || data.content)) {
                    setHighlight(data);
                }
            })
            .catch(err => console.error("Error fetching highlight:", err));
    }, []);

    const loadMore = () => {
        setVisibleItems(prev => prev + 5);
    };

    if (items.length === 0) return null;

    return (
        <div className="prophecy-section-container" style={{ marginTop: "40px", marginBottom: "40px" }}>

            {highlight && (
                <div style={{
                    background: '#fff',
                    padding: '30px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                    marginBottom: '40px',
                    borderLeft: '5px solid #c41e3a'
                }}>
                    <h2 style={{ color: '#c41e3a', marginTop: 0, fontSize: '1.8rem' }}>{highlight.title}</h2>
                    <p style={{
                        color: '#333',
                        fontSize: '1.1rem',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {highlight.content}
                    </p>
                </div>
            )}

            <div className="card-grid">
                {items.slice(0, visibleItems).map((item, index) => (
                    <div key={index} className="card" style={{ position: "relative" }}>
                        {item.year && (
                            <div
                                className="year-badge"
                                style={{
                                    position: "absolute",
                                    top: "10px",
                                    right: "10px",
                                    background: "#c41e3a",
                                    color: "white",
                                    padding: "5px 10px",
                                    borderRadius: "5px",
                                    fontWeight: "bold",
                                    zIndex: 1,
                                }}
                            >
                                {item.year}
                            </div>
                        )}
                        {item.thumbnail ? (
                            <a href={item.link} target="_blank" rel="noreferrer">
                                <img src={item.thumbnail?.startsWith('/') ? `${window.API_BASE || ''}${item.thumbnail}` : item.thumbnail} alt={item.title} className="card-img" />
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    background: 'rgba(196, 30, 58, 0.8)',
                                    borderRadius: '50%',
                                    width: '50px',
                                    height: '50px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    fontSize: '24px'
                                }}>▶</div>
                            </a>
                        ) : item.image && (
                            <img src={item.image?.startsWith('/') ? `${window.API_BASE || ''}${item.image}` : item.image} alt={item.title} className="card-img" />
                        )}

                        <div className="card-content">
                            <h3 className="prophecy-title">{item.title}</h3>
                            <div
                                className="prophecy-text"
                                style={{ lineHeight: "1.5", color: "#333", whiteSpace: "pre-wrap" }}
                            >
                                {item.transcriptStatus === 'Approved' ? (
                                    <>
                                        {item.transcript && item.transcript.includes('|||') ? (
                                            <>
                                                <div style={{ marginBottom: '10px' }}>
                                                    <em style={{ fontSize: '0.8rem', color: '#c41e3a', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>हिंदी:</em>
                                                    <span style={{ fontSize: '0.9rem', color: '#555' }}>
                                                        {item.transcript.split('|||')[0].trim().substring(0, 150)}...
                                                    </span>
                                                </div>
                                                <div style={{ marginBottom: '12px' }}>
                                                    <em style={{ fontSize: '0.8rem', color: '#c41e3a', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>English:</em>
                                                    <span style={{ fontSize: '0.9rem', color: '#555' }}>
                                                        {item.transcript.split('|||')[1].trim().substring(0, 150)}...
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        setSelectedTranscript({
                                                            title: item.title,
                                                            hindi: item.transcript.split('|||')[0].trim(),
                                                            english: item.transcript.split('|||')[1].trim(),
                                                            link: item.link
                                                        });
                                                    }}
                                                    style={{
                                                        background: '#c41e3a',
                                                        color: 'white',
                                                        border: 'none',
                                                        padding: '8px 16px',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer',
                                                        fontWeight: 'bold',
                                                        fontSize: '0.85rem',
                                                        width: '100%'
                                                    }}
                                                >
                                                    📖 Read Full Transcript
                                                </button>
                                            </>
                                        ) : (
                                            <span style={{ display: 'block', fontSize: '0.9rem' }}>
                                                {item.transcript ? item.transcript.substring(0, 200) + "..." : 'No transcript available'}
                                            </span>
                                        )}
                                    </>
                                ) : (item.text || item.description?.substring(0, 100) + "...")}
                            </div>
                            {item.link && (
                                <a
                                    href={item.link}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: '#c41e3a', fontWeight: 'bold', textDecoration: 'none', display: 'block', marginTop: '10px' }}
                                >
                                    Watch Video →
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {visibleItems < items.length && (
                <div className="load-more-container" style={{ textAlign: 'center', marginTop: '30px' }}>
                    <button className="load-more-btn" onClick={loadMore}>
                        Load More
                    </button>
                </div>
            )}

            {/* Transcript Modal */}
            {selectedTranscript && (
                <TranscriptModal
                    title={selectedTranscript.title}
                    hindiText={selectedTranscript.hindi}
                    englishText={selectedTranscript.english}
                    videoLink={selectedTranscript.link}
                    onClose={() => setSelectedTranscript(null)}
                />
            )}
        </div>
    );
}
