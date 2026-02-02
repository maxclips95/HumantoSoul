import React from 'react';

const AshramTour = () => {
    return (
        <section className="ashram-tour-section" style={{ padding: '20px 20px', backgroundColor: '#fff', textAlign: 'center' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2 style={{
                    color: '#c41e3a',
                    fontSize: '1.8rem',
                    marginBottom: '15px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '1.5px'
                }}>
                    Experience the Divine Ashram
                </h2>
                <p style={{
                    color: '#444',
                    fontSize: '1.1rem',
                    marginBottom: '30px',
                    lineHeight: '1.6',
                    maxWidth: '700px',
                    margin: '0 auto 30px'
                }}>
                    Take a virtual journey through the sacred grounds of our Ashram. Feel the peace and spiritual energy from wherever you are.
                </p>

                <div style={{
                    position: 'relative',
                    paddingBottom: '56.25%', /* 16:9 Aspect Ratio */
                    height: 0,
                    overflow: 'hidden',
                    borderRadius: '15px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    background: '#000'
                }}>
                    <iframe
                        src="https://www.youtube.com/embed/9XQUN9FBLBw"
                        title="Ashram Video Tour"
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            border: 0
                        }}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>


            </div>
        </section>
    );
};

export default AshramTour;
