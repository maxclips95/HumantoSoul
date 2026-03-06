import React from "react";

const API = typeof window !== 'undefined' ? (window.API_BASE || '') : '';

const saints = [
    {
        name: "Kabir Das Ji",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kabir_Guru.jpg/120px-Kabir_Guru.jpg"
    },
    {
        name: "Guru Nanak Dev Ji",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Guru_Nanak_Artistic_Rendition.jpg/120px-Guru_Nanak_Artistic_Rendition.jpg"
    },
    {
        name: "Guru Angad Dev Ji",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Guru_Angad_Artistic_Rendition.jpg/120px-Guru_Angad_Artistic_Rendition.jpg"
    },
    {
        name: "Guru Amardas Ji",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Guru_Amar_Das.jpg/120px-Guru_Amar_Das.jpg"
    },
    {
        name: "Guru Ramdas Ji",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Guru_Ram_Das.jpg/120px-Guru_Ram_Das.jpg"
    },
    {
        name: "Guru Arjun Dev Ji",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Guru_Arjan_Dev.jpg/120px-Guru_Arjan_Dev.jpg"
    },
    {
        name: "Guru Hargobind Ji",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/GuruHargobind.jpg/120px-GuruHargobind.jpg"
    },
    {
        name: "Guru Har Rai Ji",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Guru_Har_Rai.jpg/120px-Guru_Har_Rai.jpg"
    },
    {
        name: "Guru Harikishan Ji",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Guru_Har_Krishan.jpg/120px-Guru_Har_Krishan.jpg"
    },
    {
        name: "Guru Tegh Bahadur Ji",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Guru_Tegh_Bahadur.jpg/120px-Guru_Tegh_Bahadur.jpg"
    },
    {
        name: "Guru Gobind Singh",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Guru_Gobind_Singh.jpg/120px-Guru_Gobind_Singh.jpg"
    },
    {
        name: "Ratan Rao Ji",
        img: null,
        placeholder: "रतन राव जी"
    },
    {
        name: "Tulsidas Ji",
        sub: "(Hathras)",
        img: `${API}/uploads/lineage/tulsidas.jpg`
    },
    {
        name: "Shivdayal Ji Maharaj",
        sub: "(Radha Swami Ji Maharaj)",
        img: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Shiv_Dayal_Singh.jpg/120px-Shiv_Dayal_Singh.jpg"
    },
    {
        name: "Garibdas Ji Maharaj",
        img: null,
        placeholder: "गरीबदास जी\nमहाराज"
    },
    {
        name: "Pandit Vishnudayal Ji Maharaj",
        img: `${API}/uploads/lineage/vishnudayal.jpg`
    },
    {
        name: "Pandit Ghurelal Ji Maharaj",
        sub: "(Dada Guru Ji Maharaj)",
        img: `${API}/uploads/lineage/ghurelal.jpg`
    },
    {
        name: "The Great Master Baba Jaigurudev Ji Maharaj",
        sub: "(Tulsidas Ji Maharaj)",
        img: `${API}/uploads/lineage/jaigurudev.jpg`
    },
];

const imgStyle = {
    width: 130,
    height: 155,
    objectFit: "cover",
    borderRadius: 8,
    border: "2px solid #e0cce8",
    display: "block",
    margin: "0 auto",
};

const SaintCard = ({ saint }) => {
    const [failed, setFailed] = React.useState(false);
    return (
        <div style={{ textAlign: "center", width: 140, flexShrink: 0 }}>
            {saint.img && !failed ? (
                <img
                    src={saint.img}
                    alt={saint.name}
                    style={imgStyle}
                    onError={() => setFailed(true)}
                />
            ) : (
                <div style={{
                    ...imgStyle,
                    background: "#e8d5f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.85rem",
                    color: "#444",
                    whiteSpace: "pre-line",
                    padding: 6,
                    fontWeight: "bold",
                }}>
                    {saint.placeholder || ""}
                </div>
            )}
            <p style={{ fontSize: "0.78rem", color: "#c41e3a", marginTop: 6, fontWeight: "bold", lineHeight: 1.3 }}>
                {saint.name}
            </p>
            {saint.sub && (
                <p style={{ fontSize: "0.7rem", color: "#555", lineHeight: 1.2, marginTop: 2 }}>
                    {saint.sub}
                </p>
            )}
        </div>
    );
};

function SantAndSantMat() {
    return (
        <div style={{ backgroundColor: "#fdf5f0", paddingBottom: "60px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>

            {/* HERO SECTION */}
            <section style={{
                background: "linear-gradient(rgba(196, 30, 58, 0.9), rgba(26, 31, 94, 0.85)), url('/assets/images/ashram-bg.jpg') center/cover",
                color: "#fff",
                padding: "80px 20px",
                textAlign: "center",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)"
            }}>
                <h1 style={{ fontSize: "2.8rem", fontWeight: "800", marginBottom: "15px", letterSpacing: "1px" }}>
                    Our Mission &amp; Santmat
                </h1>
                <p style={{ fontSize: "1.2rem", maxWidth: "800px", margin: "0 auto", opacity: 0.9, lineHeight: "1.6" }}>
                    The eternal science of the soul, the journey from illusion to truth, and the urgent call for spiritual awakening before the great transition.
                </p>
            </section>

            <div style={{ maxWidth: "1100px", margin: "-40px auto 0", position: "relative", zIndex: 10, padding: "0 20px" }}>

                {/* URGENT WARNING SECTION (Yug Parivartan) */}
                <div style={{
                    background: "#fff",
                    borderRadius: "12px",
                    padding: "40px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    borderTop: "5px solid #d32f2f",
                    marginBottom: "40px"
                }}>
                    <h2 style={{ color: "#d32f2f", fontSize: "1.8rem", marginBottom: "20px", display: "flex", alignItems: "center", gap: "10px" }}>
                        <i className="fas fa-exclamation-triangle"></i> The Great Transition: Awakening to Satyug
                    </h2>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333", marginBottom: "15px" }}>
                        We are currently living in the most critical period of human history. The dark age of <strong>Kaliyug</strong> is rapidly coming to an end, and within the next few years, the dawn of <strong>Satyug</strong> (the Age of Truth) will establish itself on Earth.
                    </p>
                    <p style={{ fontSize: "1.1rem", lineHeight: "1.8", color: "#333", marginBottom: "15px" }}>
                        Nature is already showing signs of this massive global transition. If humanity does not awaken, transform its destructive habits, and turn towards devotion, the negative forces of Kaliyug will wipe out those who remain attached to sin. <strong>This is a time of immense urgency.</strong>
                    </p>
                    <div style={{ background: "#fff5f5", padding: "20px", borderRadius: "8px", borderLeft: "4px solid #d32f2f", marginTop: "20px" }}>
                        <p style={{ margin: 0, fontWeight: "600", color: "#b71c1c", fontSize: "1.05rem" }}>
                            "To survive this turbulent transition, one must adopt a pure vegetarian diet, give up intoxication, and take refuge in a True Living Master. Only spiritual wealth and the protective mercy of the Master will save souls during this global purification."
                        </p>
                    </div>
                </div>

                {/* TWO-COLUMN CONTENT AREA */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "30px", marginBottom: "50px" }}>

                    {/* The Origins of Santmat */}
                    <div style={{
                        flex: "1 1 500px", background: "#fff", padding: "35px",
                        borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
                    }}>
                        <h3 style={{ color: "#c41e3a", fontSize: "1.5rem", marginBottom: "15px" }}>
                            <i className="fas fa-om" style={{ marginRight: "10px" }}></i> The Origins of Santmat
                        </h3>
                        <p style={{ lineHeight: "1.7", color: "#555", marginBottom: "15px" }}>
                            Santmat is not a new religion or sect; it is the ancient, eternal path of the Sants. It is the pure science of the soul. While various practices have existed since Satyug, Santmat was formalized and made accessible to the masses in Kaliyug by Kabir Das Ji.
                        </p>
                        <p style={{ lineHeight: "1.7", color: "#555" }}>
                            One who has complete knowledge of the beginning and the end, who reveals the inner path, and leads the soul back to its true origin—such an awakened being is called a Sant. Just as a tree gives its fruit to others and a river its water, Sants incarnate strictly for the liberation of trapped souls.
                        </p>
                    </div>

                    {/* Hidden vs Manifest Sants */}
                    <div style={{
                        flex: "1 1 500px", background: "#fff", padding: "35px",
                        borderRadius: "12px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)"
                    }}>
                        <h3 style={{ color: "#c41e3a", fontSize: "1.5rem", marginBottom: "15px" }}>
                            <i className="fas fa-sun" style={{ marginRight: "10px" }}></i> Hidden &amp; Manifest Sants
                        </h3>
                        <p style={{ lineHeight: "1.7", color: "#555", marginBottom: "15px" }}>
                            The spiritual status of a True Master (Waqt Ke Guru) is supreme. In Santmat, there are two kinds of Sants: Hidden (Gupt) and Manifest (Pragat).
                        </p>
                        <p style={{ lineHeight: "1.7", color: "#555" }}>
                            While Hidden Sants maintain the earthly balance silently, they do not give Naamdaan (Initiation) nor show the path. <strong>Only a living, Manifest Sant (Waqt Ke Guru) can reveal the inner path of salvation.</strong> By connecting the seeker's soul to the divine Sound Current (Shabd), the living Master guides the soul out of the cycle of 8.4 million species back to its True Home (Satlok).
                        </p>
                    </div>

                </div>

                {/* ══════ LINEAGE OF SANTS (Images) ══════ */}
                <div style={{ background: "#fff", borderRadius: "12px", padding: "50px 20px", boxShadow: "0 5px 20px rgba(0,0,0,0.05)" }}>
                    <h2 style={{
                        textAlign: "center", color: "#1a1f5e", fontWeight: "800",
                        marginBottom: "15px", fontSize: "2rem"
                    }}>
                        The Eternal Lineage (Parampara)
                    </h2>
                    <p style={{ textAlign: "center", color: "#666", marginBottom: "40px", maxWidth: "800px", margin: "0 auto", fontSize: "1.1rem" }}>
                        The divine power of the Master never leaves the earth. When one Manifest Sant departs, the spiritual charge is gracefully transferred to the appointed successor to continue the mission.
                    </p>

                    <div style={{ textAlign: "center", marginBottom: "10px" }}>
                        <img src="/assets/images/lineage1.png" alt="Lineage of Sants Part 1" style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto 15px", borderRadius: "8px" }} />
                        <img src="/assets/images/lineage2.png" alt="Lineage of Sants Part 2" style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto 15px", borderRadius: "8px" }} />
                        <img src="/assets/images/lineage3.png" alt="Lineage of Sants Part 3" style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto 15px", borderRadius: "8px" }} />

                        <div style={{ textAlign: "center", display: "inline-block", margin: "20px auto 0", background: "#fbf5f5", padding: "15px", borderRadius: "12px", border: "1px solid #f0d8d8" }}>
                            <img src="/assets/images/lineage4.png" alt="Lineage of Sants Part 4" style={{ maxWidth: "100%", height: "auto", display: "block", margin: "0 auto 10px", borderRadius: "8px" }} />
                            <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#c41e3a", margin: "10px 0 0" }}>
                                <i className="fas fa-star" style={{ color: "#FFD700", marginRight: "8px" }}></i>
                                Present Spiritual Master
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default SantAndSantMat;
