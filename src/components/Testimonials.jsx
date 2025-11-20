import React from 'react';

function Testimonials() {
    const videos = [
        { title: "Testimonial 1", url: "https://www.youtube.com/watch?v=bNyBiNQAz1M" },
        { title: "Testimonial 2", url: "https://www.youtube.com/watch?v=aB8Ligcj5pc" },
        { title: "Testimonial 3", url: "https://www.youtube.com/watch?v=LR9Y2966F5s" },
        { title: "Testimonial 4", url: "https://www.youtube.com/embed/SBQREcktM8o" } // Fixed embed URL
    ];

    return (
        <section className="section">
            <h2 className="section-title">Transforming Life</h2> {/* Updated section title */}
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                Here you can watch testimonials from followers and devotees. Click on any video to view it.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px' }}>
                {videos.map((video, index) => (
                    <div key={index} style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <iframe 
                            width="300" 
                            height="200" 
                            src={video.url.replace('watch?v=', 'embed/')} 
                            title={video.title} 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                        ></iframe>
                        <p>{video.title}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Testimonials;