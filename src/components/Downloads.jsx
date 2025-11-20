import React from 'react';

function Downloads() {
    const downloads = [
        { year: '2023', type: 'भगवद्गीता', format: 'PDF' },
        { year: '2023', type: 'भगवद्गीता', format: 'CDR' },
        { year: '2023', type: 'नववर्ष', format: 'PDF' },
        { year: '2023', type: 'नववर्ष', format: 'CDR' },
        { year: '2023', type: 'गुरु पूर्णिमा', format: 'PDF' },
        { year: '2023', type: 'गुरु पूर्णिमा', format: 'CDR' },
        { year: '2022', type: 'भगवद्गीता', format: 'PDF' },
        { year: '2022', type: 'भगवद्गीता', format: 'CDR' },
        { year: '2022', type: 'गुरु पूर्णिमा', format: 'PDF' },
        { year: '2022', type: 'गुरु पूर्णिमा', format: 'CDR' }
    ];

    return (
        <section className="section">
            <h2 className="section-title">Downloads</h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '30px' }}>
                <select style={{ padding: '8px', borderRadius: '5px' }}>
                    <option>कार्यक्रम चुनें</option>
                    <option>भगवद्गीता</option>
                    <option>नववर्ष</option>
                    <option>गुरु पूर्णिमा</option>
                </select>
                <select style={{ padding: '8px', borderRadius: '5px' }}>
                    <option>वर्ष चुनें</option>
                    <option>2023</option>
                    <option>2022</option>
                </select>
                <select style={{ padding: '8px', borderRadius: '5px' }}>
                    <option>प्रकार चुनें</option>
                    <option>PDF</option>
                    <option>CDR</option>
                </select>
            </div>

            <div className="card-grid">
                {downloads.map((download, index) => (
                    <div key={index} className="card">
                        <div className="card-content">
                            <h3 className="card-title">{download.type}</h3>
                            <p className="card-text">वर्ष: {download.year}</p>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>PDF</button>
                                <button className="btn" style={{ padding: '5px 10px', fontSize: '0.8rem' }}>CDR</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Downloads;