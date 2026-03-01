import React, { useEffect, useState } from 'react';

function Downloads() {
    const [downloads, setDownloads] = useState([]);
    const [loading, setLoading] = useState(true); // Start as true while fetching
    // SAMPLE DATA TO MATCH REFERENCE IMAGE
    useEffect(() => {
        fetch(`${window.API_BASE || ''}/api/downloads`)
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setDownloads(data);
                } else {
                    // Empty state handled in render, no sample data fallback to enforce "functional" request
                    setDownloads([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Error fetching downloads:', err);
                setLoading(false);
            });
    }, []);

    const BASE_URL = window.API_BASE || '';

    return (
        <section className="section">

            {loading && (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading downloads...</p>
            )}

            {!loading && (
                <>
                    {/* CARD GRID */}
                    <div className="card-grid" style={{ gap: '30px' }}>
                        {downloads.map((item, index) => (
                            <div key={index} className="card" style={{
                                border: '1px solid #eee',
                                borderRadius: '10px',
                                overflow: 'hidden',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                display: 'flex',
                                flexDirection: 'column'
                            }}>
                                {/* HEADER - TYPE */}
                                <div style={{
                                    background: '#d62027',
                                    color: 'white',
                                    textAlign: 'center',
                                    padding: '10px',
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}>
                                    {item.type}
                                </div>

                                {/* BODY - CONTENT */}
                                <div style={{
                                    padding: '20px',
                                    textAlign: 'center',
                                    flex: '1',
                                    background: 'white'
                                }}>
                                    <h3 style={{
                                        color: '#d62027',
                                        fontSize: '1.4rem',
                                        marginBottom: '5px',
                                        fontWeight: 'bold'
                                    }}>
                                        {item.title}
                                    </h3>
                                    <p style={{ color: '#d62027', fontSize: '1rem', margin: '5px 0' }}>
                                        {item.location}
                                    </p>
                                    <p style={{ color: '#d62027', fontSize: '1rem', fontWeight: 'bold' }}>
                                        {item.year}
                                    </p>
                                </div>

                                {/* FOOTER - BUTTONS */}
                                <div style={{
                                    background: '#d62027',
                                    padding: '15px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: '10px'
                                }}>
                                    {item.pdf ? (
                                        <a href={`${BASE_URL}${item.pdf}`} download target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                                            <button className="btn" style={{
                                                background: 'white',
                                                color: '#d62027',
                                                fontWeight: 'bold',
                                                padding: '8px',
                                                borderRadius: '5px',
                                                width: '100%'
                                            }}>
                                                PDF
                                            </button>
                                        </a>
                                    ) : <div style={{ flex: 1 }}></div>}

                                    {item.cdr ? (
                                        <a href={`${BASE_URL}${item.cdr}`} download target="_blank" rel="noreferrer" style={{ flex: 1 }}>
                                            <button className="btn" style={{
                                                background: 'white',
                                                color: '#d62027',
                                                fontWeight: 'bold',
                                                padding: '8px',
                                                borderRadius: '5px',
                                                width: '100%'
                                            }}>
                                                CDR
                                            </button>
                                        </a>
                                    ) : <div style={{ flex: 1 }}></div>}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

        </section>
    );
}

export default Downloads;