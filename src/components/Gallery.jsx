import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Gallery() {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            try {
                const response = await axios.get('/api/gallery');
                setImages(response.data);
            } catch (error) {
                console.error('Error fetching gallery:', error);
            }
            setLoading(false);
        };
        fetchImages();
    }, []);

    if (loading) return <p style={{ textAlign: 'center' }}>Loading Gallery...</p>;

    return (
        <section className="section" style={{ paddingTop: '0' }}>
            <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', border: 0 }}>
                Jai Gurudev Photo Gallery
            </h1>

            {images.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>No images uploaded yet.</p>
            ) : (
                <div className="card-grid">
                    {images.map((image) => (
                        <div key={image.id} className="card">
                            <img src={image.src?.startsWith('/') ? `${window.API_BASE || ''}${image.src}` : image.src} alt={image.alt || 'Gallery Image'} className="card-image" style={{ width: '100%', height: 'auto', display: 'block' }} />
                            <div className="card-content" style={{ textAlign: 'center' }}>
                                <p style={{ fontSize: '0.9rem', color: '#666' }}>{image.alt || 'Jai Gurudev'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default Gallery;
