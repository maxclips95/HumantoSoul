// src/components/Carousel.jsx
import React, { useState, useEffect } from 'react';

function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slides = [
        `${process.env.PUBLIC_URL}/assets/images/Slide1.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/Slide2.jpg`,
        `${process.env.PUBLIC_URL}/assets/images/Slide3.jpg`
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [slides.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="carousel" style={{
            maxWidth: '100%',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            backgroundColor: '#fff'
        }}>
            <div 
                className="carousel-slide" 
                style={{ 
                    display: 'flex', 
                    transition: 'transform 0.5s ease-in-out',
                    transform: `translateX(-${currentIndex * 100}%)`
                }}
            >
                {slides.map((slide, index) => (
                    <div key={index} style={{ width: '100%', flexShrink: 0 }}>
                        <img 
                            src={slide} 
                            alt={`Slide ${index + 1}`} 
                            style={{ 
                                width: '100%', 
                                height: '700px', 
                                objectFit: 'cover',
                                border: '1px solid #ddd'
                            }} 
                        />
                    </div>
                ))}
            </div>
            
            <div className="carousel-dots" style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '20px'
            }}>
                {slides.map((_, index) => (
                    <div 
                        key={index} 
                        className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(index)}
                        style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: index === currentIndex ? '#c41e3a' : '#ccc',
                            margin: '0 5px',
                            cursor: 'pointer'
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
}

export default Carousel;