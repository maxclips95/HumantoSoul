// src/components/BabaUmakant.jsx
import React from 'react';

function BabaUmakant() {
    return (
        <section className="section">
            <h2 className="section-title">Baba Umakant Ji Maharaj</h2>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img 
                    src={`${process.env.PUBLIC_URL}/assets/images/baba-umakant.jpg`} 
                    alt="Baba Umakant Ji Maharaj" 
                    style={{ 
                        borderRadius: '50%', 
                        width: '200px', 
                        height: '200px', 
                        objectFit: 'cover',
                        marginBottom: '20px'
                    }} 
                />
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    "The path of truth and meditation as taught by Baba Umakant Ji Maharaj"
                </p>
            </div>
            <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                <p>
                    Baba Umakant Ji Maharaj is the current spiritual master in the lineage of Baba Jaigurudev Ji Maharaj. He continues to guide devotees on the path of inner meditation and spiritual realization. His teachings emphasize the importance of regular practice and devotion.
                </p>
                <p>
                    His key teachings include:
                </p>
                <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
                    <li>The importance of daily meditation</li>
                    <li>Following the true spiritual path</li>
                    <li>Service to humanity</li>
                    <li>Chanting the divine name</li>
                </ul>
            </div>
        </section>
    );
}

export default BabaUmakant;