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
        <section style={{ backgroundColor: "#fff5f0", padding: "40px 20px" }}>

            {/* Main Title */}
            <h1 style={{ textAlign: "center", color: "red", fontWeight: "bold", marginBottom: "40px" }}>
                Sant and Sant Mat
            </h1>

            <div style={{ maxWidth: "1000px", margin: "0 auto", lineHeight: "1.8" }}>

                {/* Section 1: Origins of Santmat */}
                <h3 style={{ color: "#c41e3a", marginBottom: "10px" }}>The Origins of Santmat</h3>
                <p>
                    Santmat is not a new religion or sect, but the ancient, eternal path of the Sants. It is the science of the soul. While various practices have existed since Satyug, Santmat was formalized and made accessible to the masses in Kaliyug by Kabir Das Ji.
                </p>
                <p>
                    One who has complete knowledge of the beginning and the end, who explains the difference between the two, who reveals the inner path from the beginning to the end, and leads the soul back to its true origin—such an awakened being is called a Sant.
                </p>
                <p>
                    Just as a tree does not eat its own fruit but gives it to others; a river does not drink its own water but gives it to others; it does not bathe itself but cleanses others—likewise are the Sants. They incarnate strictly for the liberation of others.
                </p>
                <div style={{
                    background: "#fff", borderLeft: "4px solid #c41e3a", padding: "15px 20px",
                    margin: "20px 0", fontStyle: "italic", color: "#555", borderRadius: "0 8px 8px 0",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
                }}>
                    "A tree never eats its own fruit, nor does a river store its water.<br />
                    For the sake of the highest good, the Sants have taken a human body."
                </div>

                {/* Section 2: Hidden vs Manifest Sants */}
                <h3 style={{ color: "#c41e3a", marginTop: "35px", marginBottom: "10px" }}>
                    Hidden and Manifest Sants (Waqt Ke Guru)
                </h3>
                <p>
                    The spiritual status of a True Master (Waqt Ke Guru) is above rishis, munis, incarnate powers, yogis, and yogeshwars. In Santmat, there are two kinds of Sants: Hidden (Gupt) and Manifest (Pragat).
                </p>
                <p>
                    Before Manifest Sants appeared on earth, Hidden Sants lived here and silently took care of the balance of creation. However, when human actions became extremely corrupt and souls forgot their true home, Satpurush (the Supreme Lord) sent one of His divine sons, Jogjeet (Kabir Das Ji), to the earth as a Manifest Sant.
                </p>
                <p>
                    He revealed the secret of Satlok (the True Abode), explaining how the soul descended into Mrityulok (the realm of death and illusion). He disclosed the spiritual secrets of inner sound and light (Surat Shabd Yoga) and provided the method of liberation.
                </p>
                <p>
                    While Hidden Sants maintain the earthly balance, they do not give Naamdaan (Initiation) nor show the path. <strong>Only a living, Manifest Sant (Waqt Ke Guru) can reveal the inner path of salvation.</strong> By connecting the seeker's soul to the divine Sound Current (Shabd), the living Master guides the soul out of the cycle of 84 lakh (8.4 million) species back to its True Home.
                </p>

                {/* ══════ LINEAGE OF SANTS (Dynamic Grid) ══════ */}
                <h2 style={{
                    textAlign: "center", color: "#c41e3a", fontWeight: "bold",
                    marginTop: "60px", marginBottom: "20px", fontSize: "1.8rem",
                    borderTop: "2px solid #f0d8d8", paddingTop: "40px"
                }}>
                    The Eternal Lineage (Parampara)
                </h2>
                <p style={{ textAlign: "center", color: "#666", marginBottom: "40px", maxWidth: "800px", margin: "0 auto 40px" }}>
                    The divine power of the Master never leaves the earth. When one Manifest Sant departs, the spiritual charge is transferred to the appointed successor to continue the mission of awakening souls.
                </p>

                <div style={{
                    display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "25px",
                    padding: "20px 0"
                }}>
                    {saints.map((saint, index) => {
                        const isLast = index === saints.length - 1;
                        return (
                            <div key={index} style={{
                                position: "relative",
                                padding: isLast ? "15px" : "0",
                                background: isLast ? "#fff" : "transparent",
                                borderRadius: isLast ? "16px" : "0",
                                boxShadow: isLast ? "0 4px 20px rgba(196,30,58,0.15)" : "none",
                                border: isLast ? "2px solid #ffcccc" : "none"
                            }}>
                                {isLast && (
                                    <div style={{
                                        position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)",
                                        background: "#c41e3a", color: "#fff", fontSize: "0.75rem", fontWeight: "bold",
                                        padding: "4px 12px", borderRadius: "12px", whiteSpace: "nowrap", zIndex: 2
                                    }}>
                                        Present Spiritual Master
                                    </div>
                                )}
                                <SaintCard saint={saint} />
                                {/* Add an arrow after every saint except the last one, visible only on desktop */}
                                {!isLast && (
                                    <span style={{
                                        position: "absolute", right: "-18px", top: "50%", transform: "translateY(-50%)",
                                        color: "#f0d8d8", fontSize: "1.5rem", pointerEvents: "none"
                                    }} className="lineage-arrow">
                                        ➔
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

export default SantAndSantMat;
