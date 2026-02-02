import React from 'react';

function Testimonials() {
    const videos = [
        { title: "Testimonial New 1", url: "https://www.youtube.com/watch?v=_i7a_fo3RR4" },
        { title: "Testimonial New 2", url: "https://www.youtube.com/watch?v=osLa9c-m7oc" },
        { title: "Testimonial New 3", url: "https://www.youtube.com/watch?v=izV_3vffk3o" },
        { title: "Testimonial New 4", url: "https://www.youtube.com/watch?v=tBtJEVliFys" },
        { title: "Testimonial New 5", url: "https://www.youtube.com/watch?v=5MkXgp6tGw8" },
        { title: "Testimonial New 6", url: "https://www.youtube.com/watch?v=dP07Y5YcPgQ" },
        { title: "Testimonial 1", url: "https://www.youtube.com/watch?v=bNyBiNQAz1M" },
        { title: "Testimonial 2", url: "https://www.youtube.com/watch?v=aB8Ligcj5pc" },
        { title: "Testimonial 3", url: "https://www.youtube.com/watch?v=LR9Y2966F5s" },
        { title: "Testimonial 4", url: "https://www.youtube.com/watch?v=SBQREcktM8o" }
    ];

    return (
        <section className="section">
            <h2 className="section-title">Transforming Life</h2> {/* Updated section title */}
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                Here you can watch testimonials from followers and devotees. Click on any video to view it.
            </p>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                padding: '0 20px',
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {videos.map((video, index) => (
                    <div key={index} style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden' }}>
                            <iframe
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                }}
                                src={video.url.replace('watch?v=', 'embed/')}
                                title={video.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                        <p>{video.title}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Testimonials;
