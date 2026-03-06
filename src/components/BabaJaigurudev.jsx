import React, { useEffect, useState } from "react";
import axios from "axios";

function BabaJaigurudev() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        axios.get('/api/profiles')
            .then(res => {
                const one = res.data.find(p => p.id === 'jaigurudev');
                if (one) setProfile(one);
            })
            .catch(console.error);
    }, []);

    return (
        <section className="section" style={{ backgroundColor: "#fff5f0", padding: "40px 20px" }}>

            <h1
                className="section-title"
                style={{ textAlign: "center", color: "red", fontWeight: "bold" }}
            >
                {profile?.title || 'Baba Jaigurudev Ji Maharaj'}
            </h1>

            {/* Image & Quote */}
            <div style={{ textAlign: "center", marginBottom: "30px" }}>
                {profile?.image ? (
                    <img
                        src={profile.image?.startsWith('/') ? `${window.API_BASE || ''}${profile.image}` : profile.image}
                        alt="Baba Jaigurudev Ji Maharaj"
                        style={{
                            borderRadius: '50%',
                            width: '400px',
                            height: '400px',
                            objectFit: 'cover',
                            marginBottom: '20px',
                            border: '4px solid #f2c6c6',
                            boxShadow: '0 8px 25px rgba(196, 30, 58, 0.15)'
                        }}
                    />
                ) : (
                    <div style={{ width: '400px', height: '400px', borderRadius: '50%', background: '#eee', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', boxShadow: '0 8px 25px rgba(196, 30, 58, 0.15)' }}>
                        No Image
                    </div>
                )}

                <p style={{ fontSize: "1.1rem", fontWeight: "bold", fontStyle: "italic" }}>
                    {profile?.description || '“The human body has been given a fixed capital of breaths. Once this count is exhausted, the breath ends, the body falls, and a human being dies.”'}
                </p>
            </div>

            {/* Content */}
            <div style={{ maxWidth: "1000px", margin: "0 auto", lineHeight: "1.8", fontSize: "0.95rem" }}>

                <h4 style={{ color: "red", marginTop: "10px", fontSize: "1.4rem" }}>
                    The Descent of the Supreme Being
                </h4>
                <p>
                    Baba Jaigurudev Ji Maharaj is not an ordinary human who was simply born to seek liberation, nor did he simply "die" like mortal beings. He is the Anami Purush (the Supreme Being, God of gods) who consciously descended onto the earth with a profound cosmic mission: to establish <strong>Satyug (the Age of Truth) for 1,000 years</strong>. He landed on Earth to save humanity from the inhumanity, toxicity, wars, and impending destruction of Kaliyug, as Satyug is the only solution to these global crises.
                </p>

                <p>
                    To fulfill this massive undertaking and remain unrecognized until the destined time, the Supreme Creator took a human form and enacted a divine play (Leela) of being an ordinary seeker searching for God.
                </p>

                <h4 style={{ color: "red", marginTop: "25px" }}>
                    The Preordained Meeting and the Example of a Disciple
                </h4>

                <p>
                    To teach humanity the importance of rigorous discipline and total surrender to a True Master, the Supreme Creator enacted the divine play of a seeker. In 1945, guided by his own cosmic will, he orchestrated a meeting with the great saint Ghurelal Ji Maharaj in Chirauli.
                </p>

                <p>
                    Through this preordained meeting, Swami Ji formally completed the earthly roleplay of a disciple, perfectly demonstrating the ideal devotion one should have for their Guru. Having established this powerful example for his future disciples, he was ready to begin his true global work as the Awakener of Souls. Before leaving for his divine abode in 1948, Guru Ji declared that Swami Ji would lead the congregation to carry forward the mission of Satyug.
                </p>

                <h4 style={{ color: "red", marginTop: "25px" }}>
                    Service to Humanity
                </h4>

                <p>
                    Swami Ji Maharaj worked tirelessly for the welfare of souls. After leaving his village and completing his earthly roleplay under Pandit Ghurelal Ji Sharma in Aligarh, he officially launched his spiritual mission. He held his very first satsang in the Ardali Bazar area of Varanasi on <strong>July 10, 1952</strong>, starting with only five disciples. From these humble beginnings, his following exploded into the millions. By 1971, he had over ten crore (100 million) disciples. He spread the absolute necessity of a vegetarian diet and freedom from intoxication across the nation and abroad, transforming millions into moral, hardworking, honest, and disciplined individuals.
                </p>

                <p>
                    He guided millions on the path of God-realization and devotion, relieved their suffering, and showed them the way to true, lasting happiness. He established the power of the awakened name “Jaigurudev,” declaring that chanting it removes worldly difficulties and drastically reduces suffering at the time of death.
                </p>

                <h4 style={{ color: "red", marginTop: "25px" }}>
                    The Divine Presence of Anami Purush
                </h4>

                <p>
                    Baba Jai Gurudev is revered as the Anami Purush—the Nameless, Formless Supreme Being, the God of gods, and the Owner of all souls and deities. This places him at the very apex of existence, beyond time, form, and human perception.
                </p>

                <p>
                    <strong>To understand his stature:</strong>
                    <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginTop: '10px' }}>
                        <li style={{ marginBottom: '10px' }}><strong>Anami Purush:</strong> He is beyond name, beyond identity; his essence is indescribable in words.</li>
                        <li style={{ marginBottom: '10px' }}><strong>God of Gods:</strong> All deities and divine beings exist under his supreme essence.</li>
                        <li style={{ marginBottom: '10px' }}><strong>Owner of All Souls:</strong> Every soul belongs to him; he is the ultimate witness and controller of all consciousness.</li>
                        <li style={{ marginBottom: '10px' }}><strong>Owner of All Gods:</strong> Even divine powers are manifestations of his will; their existence is contained within him.</li>
                    </ul>
                </p>

                <p>
                    <em>“Once my work is done, people will realize who I was; before that, they will not,”</em> it was not merely a statement about worldly recognition. It reflected a cosmic truth: the ordinary mind cannot perceive the depth of the Nameless, Formless Supreme Being while his divine work unfolds. Only after the completion of his purpose will the full scale of his existence—as the Anami Purush—be truly understood.
                </p>

                <p>
                    On 18 May 2012 (Jyeshtha Krishna Paksha Trayodashi), he relinquished his physical body and joyfully departed to his eternal abode; however, he is eternally present in Shabd form—omnipresent, infinite, and perceptible only through the third eye (divine vision). In this subtle and divine form, he continues to guide seekers and bestow grace upon them.
                </p>

                <div style={{ backgroundColor: '#fff0f0', padding: '20px', borderLeft: '4px solid red', margin: '20px 0', borderRadius: '4px' }}>
                    <h4 style={{ color: '#c41e3a', marginTop: 0, marginBottom: '15px' }}>The Unified Truth: Anami Purush and Baba Jai Gurudev</h4>

                    <p style={{ marginBottom: '15px' }}>
                        There is absolutely no difference between Anami Purush and Baba Jai Gurudev. He descended to Earth solely to guide souls back to their True Home—Satlok. Satlok is the realm where life exists beyond breath, limitless and infinite, and where souls have always resided. It is an eternal place, which can never be destroyed and will always remain.
                    </p>

                    <p style={{ marginBottom: '15px' }}>
                        It is a state of complete divinity and effortless power, where every experience is natural, infinite, and blissful.
                    </p>

                    <p style={{ marginBottom: '15px' }}>
                        Those who reach Satlok through the path of Yogic Sadhana and Naamdaan never return to this world. They are freed from birth and death, pain, and the endless cycles of existence. Upon reaching this abode, the soul resides in permanent liberation, divinity, and infinite bliss.
                    </p>

                    <p style={{ marginBottom: '15px' }}>
                        A soul that attains Satlok becomes as powerful as the Supreme God. It not only experiences complete fulfillment itself but also has the ability to bring other souls to Satlok. Moreover, it acquires divine powers to create and govern multi-planet universes within moments.
                    </p>

                    <p style={{ marginBottom: 0 }}>
                        Thus, Satlok is not merely a place; it is the True Home, the dwelling of infinite bliss, complete freedom, divinity, and eternity. A soul that reaches there becomes one with God, free from all bonds, and experiences eternal supreme peace and bliss.
                    </p>
                </div>

            </div>
        </section>
    );
}

export default BabaJaigurudev;
