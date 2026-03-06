import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import '../styles.css';

export default function VirtualTour() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${window.API_BASE || ''}/api/virtual_tours`)
            .then(res => res.json())
            .then(data => {
                // If API fails or table doesn't exist yet, fallback to the static Ujjain video
                if (Array.isArray(data) && data.length > 0) {
                    setTours(data);
                } else {
                    setTours([{ id: 'static', video_id: '9XQUN9FBLBw', title: 'Baba Jaigurudev Ashram, Ujjain (M.P.) — सम्पूर्ण दर्शन' }]);
                }
            })
            .catch(() => {
                setTours([{ id: 'static', video_id: '9XQUN9FBLBw', title: 'Baba Jaigurudev Ashram, Ujjain (M.P.) — सम्पूर्ण दर्शन' }]);
            })
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <SEO
                title="Virtual Tour - Experience the Divine Ashram | Human to Soul"
                description="Take a virtual journey through the sacred grounds of the Baba Jaigurudev Ashram. Feel the peace and spiritual energy from wherever you are."
                keywords="baba jaigurudev ashram, ujjain ashram, virtual tour, divine ashram, spiritual journey, 360 tour, darshan"
                url="https://www.humantosoul.com/virtual-tour"
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Virtual Tour", url: "https://www.humantosoul.com/virtual-tour" }
                ]}
            />

            <section className="section" style={{ minHeight: "60vh", backgroundColor: "#fff5f0", padding: "30px 20px" }}>
                <div style={{ maxWidth: "1200px", margin: "0 auto", textAlign: "center" }}>

                    <h1 style={{
                        color: "#c41e3a",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        fontSize: "2.2rem",
                        fontWeight: "800",
                        marginBottom: "10px"
                    }}>
                        EXPERIENCE THE DIVINE ASHRAM
                    </h1>

                    <p style={{
                        color: "#555",
                        fontSize: "1.1rem",
                        lineHeight: "1.4",
                        maxWidth: "750px",
                        margin: "0 auto 30px auto",
                        fontWeight: "300"
                    }}>
                        Take a virtual journey through the sacred grounds of our Ashram. Feel the peace and spiritual energy from wherever you are.
                    </p>

                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                            <div style={{ border: '5px solid #f3f3f3', borderTop: '5px solid #c41e3a', borderRadius: '50%', width: '50px', height: '50px', animation: 'spin 1s linear infinite' }}></div>
                        </div>
                    ) : (
                        <div style={{
                            display: "grid",
                            gridTemplateColumns: tours.length === 1 ? "1fr" : "repeat(auto-fill, minmax(480px, 1fr))",
                            gap: "30px",
                            maxWidth: tours.length === 1 ? "860px" : "100%",
                            margin: "0 auto"
                        }}>
                            {tours.map(tour => (
                                <div key={tour.id} style={{
                                    borderRadius: "15px",
                                    overflow: "hidden",
                                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                                    background: "#000"
                                }}>
                                    <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                                        <iframe
                                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                                            src={`https://www.youtube.com/embed/${tour.video_id}?rel=0`}
                                            title={tour.title}
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                            allowFullScreen
                                        />
                                    </div>
                                    {tour.title && (
                                        <p style={{ margin: 0, padding: "14px 16px", background: "#fff", color: "#333", fontWeight: "600", fontSize: "0.95rem", textAlign: "left", borderTop: "2px solid #f2c6c6" }}>
                                            {tour.title}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    <div style={{
                        marginTop: "80px",
                        padding: "40px",
                        backgroundColor: "#fff",
                        borderRadius: "20px",
                        boxShadow: "0 15px 35px rgba(196, 30, 58, 0.08)",
                        border: "1px solid #f2c6c6"
                    }}>
                        <h2 style={{ color: "#c41e3a", marginBottom: "20px", fontSize: "1.8rem" }}>Beyond the Virtual — Visit in Person</h2>
                        <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#444", margin: "0 auto 30px auto", maxWidth: "850px" }}>
                            A virtual tour is just the beginning. The spiritual energy, peace, and profound stillness of the Ashram must be experienced in person.
                            <strong> We warmly invite all seekers to visit us at least once</strong> to attend our spiritual programmes, join the satsang, and feel the divine presence that transforms lives.
                        </p>
                        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="https://www.google.com/maps/search/?api=1&query=Baba+Jaigurudev+Ashram+Ujjain" target="_blank" rel="noopener noreferrer" className="bp-btn bp-btn--gold" style={{ textDecoration: 'none' }}>Get Directions →</a>
                            <Link to="/contact" className="bp-btn bp-btn--outline">Plan Your Visit 🙏</Link>
                        </div>
                    </div>

                    <p style={{ marginTop: "50px", color: "#aaa", fontSize: "0.9rem" }}>
                        * More ashram locations and virtual tours will be added here in the future.
                    </p>
                </div>
            </section>
        </>
    );
}
