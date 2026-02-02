import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- COMPONENTS ---
const PrarthanaCard = ({ item, onReadMore }) => {
    const limit = 200;
    const isDual = item.content && item.content.includes('|||');
    const displayTitle = isDual ? item.title.split('|||')[0].trim() : item.title;
    const displayText = isDual ? item.content.split('|||')[0].trim() : (item.content || "");
    const isLong = displayText.length > limit;

    return (
        <div className="card" style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '20px' }}>
            <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 className="card-title" style={{ marginTop: '0', fontSize: '1.25rem', marginBottom: '10px', color: '#c41e3a' }}>{displayTitle}</h3>

                <p className="card-text" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', flex: 1, color: '#333' }}>
                    {isLong ? displayText.substring(0, limit) + "..." : displayText}
                </p>

                <button
                    onClick={() => onReadMore(item)}
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
                    Read More / विस्तार से पढ़ें
                </button>
            </div>
        </div>
    );
};

const PrarthanaModal = ({ item, onClose }) => {
    const [activeTab, setActiveTab] = useState('hindi');
    if (!item) return null;

    const isDual = item.content && item.content.includes('|||');
    const hindiTitle = isDual ? item.title.split('|||')[0].trim() : item.title;
    const englishTitle = isDual ? item.title.split('|||')[1].trim() : "";
    const hindiContent = isDual ? item.content.split('|||')[0].trim() : item.content;
    const englishContent = isDual ? item.content.split('|||')[1].trim() : "";

    const isDualView = activeTab === 'dual';

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
            <div style={{ maxWidth: isDualView ? '1200px' : '900px', width: '100%', position: 'relative', transition: 'max-width 0.3s ease' }}>
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
                        fontSize: '2rem',
                        borderBottom: '1px solid #333',
                        paddingBottom: '20px',
                        marginBottom: '20px',
                        lineHeight: '1.2',
                        color: '#c41e3a'
                    }}>
                        {activeTab === 'english' && englishTitle ? englishTitle : hindiTitle}
                    </h1>

                    {isDual && (
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap' }}>
                            <button
                                onClick={() => setActiveTab('hindi')}
                                style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: activeTab === 'hindi' ? '#c41e3a' : '#333', color: 'white' }}
                            >
                                हिंदी (Hindi)
                            </button>
                            <button
                                onClick={() => setActiveTab('english')}
                                style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: activeTab === 'english' ? '#c41e3a' : '#333', color: 'white' }}
                            >
                                English
                            </button>
                            <button
                                onClick={() => setActiveTab('dual')}
                                style={{ padding: '10px 20px', border: 'none', borderRadius: '5px', cursor: 'pointer', background: activeTab === 'dual' ? '#c41e3a' : '#333', color: 'white' }}
                            >
                                Dual View (दोनों)
                            </button>
                        </div>
                    )}

                    <div style={{
                        display: isDualView ? 'grid' : 'block',
                        gridTemplateColumns: isDualView ? '1fr 1fr' : 'none',
                        gap: '30px',
                        fontSize: '1.25rem',
                        lineHeight: '1.8',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {(activeTab === 'hindi' || isDualView) && (
                            <div style={{ background: '#111', padding: '30px', borderRadius: '10px', color: '#fff' }}>
                                {isDualView && <div style={{ color: '#c41e3a', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #333' }}>हिंदी (Hindi)</div>}
                                {hindiContent}
                            </div>
                        )}
                        {(activeTab === 'english' || isDualView) && (
                            <div style={{ background: '#111', padding: '30px', borderRadius: '10px', color: '#fff' }}>
                                {isDualView && <div style={{ color: '#c41e3a', fontWeight: 'bold', marginBottom: '15px', borderBottom: '1px solid #333' }}>English</div>}
                                {englishContent || item.content}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

function Prarthana() {
    const [items, setItems] = useState([]);
    const [selectedPrarthana, setSelectedPrarthana] = useState(null);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get('/api/prarthana');
                setItems(response.data);
            } catch (error) {
                console.error('Error fetching prarthana:', error);
            }
        };
        fetchItems();
    }, []);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (selectedPrarthana) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedPrarthana]);

    // Split items: First one (Featured) vs Rest (Grid)
    const featuredItem = items.length > 0 ? items[0] : null;
    const gridItems = items.length > 1 ? items.slice(1) : [];

    return (
        <section className="section" style={{ paddingTop: '0' }}>
            <div style={{ marginTop: '0px' }}>
                {items.length === 0 ? (
                    <p style={{ textAlign: 'center' }}>No items added yet.</p>
                ) : (
                    <>
                        {/* FEATURED ITEM */}
                        {featuredItem && (
                            <div style={{ marginBottom: '40px', padding: '30px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', borderLeft: '5px solid #c41e3a' }}>
                                <h2 style={{ color: '#c41e3a', marginBottom: '15px', fontSize: '1.8rem' }}>
                                    {featuredItem.content && featuredItem.content.includes('|||') ? featuredItem.title.split('|||')[0].trim() : featuredItem.title}
                                </h2>
                                <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '1.15rem', color: '#333' }}>
                                    {featuredItem.content && featuredItem.content.includes('|||') ? featuredItem.content.split('|||')[0].trim() : featuredItem.content}
                                </p>
                                <button
                                    onClick={() => setSelectedPrarthana(featuredItem)}
                                    style={{
                                        background: '#c41e3a',
                                        border: 'none',
                                        color: 'white',
                                        padding: '10px 20px',
                                        borderRadius: '5px',
                                        cursor: 'pointer',
                                        marginTop: '20px',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    Read Full / विस्तार से पढ़ें
                                </button>
                            </div>
                        )}

                        {/* GRID ITEMS */}
                        {gridItems.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                                gap: '25px',
                                maxWidth: '100%',
                            }}>
                                {gridItems.map((item, index) => (
                                    <PrarthanaCard
                                        key={item.id || index}
                                        item={item}
                                        onReadMore={setSelectedPrarthana}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {selectedPrarthana && (
                <PrarthanaModal
                    item={selectedPrarthana}
                    onClose={() => setSelectedPrarthana(null)}
                />
            )}
        </section>
    );
}

export default Prarthana;

