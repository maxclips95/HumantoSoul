import React from 'react';
import SEO from '../components/common/SEO';
import '../styles.css';

export default function VirtualTour() {
    return (
        <>
            <SEO
                title="Virtual Tour - Experience the Divine Ashram | Human to Soul"
                description="Take a virtual journey through the sacred grounds of the Baba Jaigurudev Ashram in Ujjain. Feel the peace and spiritual energy from wherever you are."
                keywords="baba jaigurudev ashram, ujjain ashram, virtual tour, divine ashram, spiritual journey, 360 tour, darshan"
                url="https://www.humantosoul.com/virtual-tour"
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Virtual Tour", url: "https://www.humantosoul.com/virtual-tour" }
                ]}
            />

            <section className="section" style={{ minHeight: "80vh", backgroundColor: "#fff5f0", padding: "60px 20px" }}>
                <div style={{ maxWidth: "1000px", margin: "0 auto", textAlign: "center" }}>

                    <h1 style={{
                        color: "#c41e3a",
                        textTransform: "uppercase",
                        letterSpacing: "2px",
                        fontSize: "2.5rem",
                        fontWeight: "800",
                        marginBottom: "15px"
                    }}>
                        EXPERIENCE THE DIVINE ASHRAM
                    </h1>

                    <p style={{
                        color: "#555",
                        fontSize: "1.2rem",
                        lineHeight: "1.6",
                        maxWidth: "800px",
                        margin: "0 auto 40px auto",
                        fontWeight: "300"
                    }}>
                        Take a virtual journey through the sacred grounds of our Ashram. Feel the peace and spiritual energy from wherever you are.
                    </p>

                    <div style={{
                        position: "relative",
                        paddingBottom: "56.25%", /* 16:9 Aspect Ratio */
                        height: 0,
                        overflow: "hidden",
                        borderRadius: "15px",
                        boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                        backgroundColor: "#000"
                    }}>
                        <iframe
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                border: 0
                            }}
                            src="https://www.youtube.com/embed/YOUR_VIDEO_ID_HERE?rel=0" // PLACEHOLDER: Replace 'YOUR_VIDEO_ID_HERE' with the real video ID
                            title="Baba Jaigurudev Ashram Ujjain Virtual Tour"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen>
                        </iframe>
                    </div>

                    <p style={{ marginTop: "40px", color: "#888", fontSize: "0.9rem" }}>
                        * More ashram locations and virtual tours will be added here in the future.
                    </p>

                </div>
            </section>
        </>
    );
}
