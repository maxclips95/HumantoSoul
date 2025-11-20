import React, { useState } from 'react';

function Gallery() {
    const [currentPage, setCurrentPage] = useState(1);
    const imagesPerPage = 9;
    
    const galleryImages = Array.from({ length: 27 }, (_, i) => ({
        id: i + 1,
        src: `https://via.placeholder.com/300?text=Image+${i + 1}`,
        alt: `Gallery Image ${i + 1}`
    }));

    const totalPages = Math.ceil(galleryImages.length / imagesPerPage);
    const startIndex = (currentPage - 1) * imagesPerPage;
    const currentImages = galleryImages.slice(startIndex, startIndex + imagesPerPage);

    const goToPage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <section className="section">
            <h2 className="section-title">Gallery</h2>
            
            <div className="card-grid">
                {currentImages.map((image) => (
                    <div key={image.id} className="card">
                        <img src={image.src} alt={image.alt} className="card-image" />
                        <div className="card-content" style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.8rem', color: '#666' }}>Jai Gurudev</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <button 
                    onClick={() => goToPage(currentPage - 1)} 
                    disabled={currentPage === 1}
                    className="btn"
                    style={{ marginRight: '10px' }}
                >
                    Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                    onClick={() => goToPage(currentPage + 1)} 
                    disabled={currentPage === totalPages}
                    className="btn"
                    style={{ marginLeft: '10px' }}
                >
                    Next
                </button>
            </div>
        </section>
    );
}

export default Gallery;