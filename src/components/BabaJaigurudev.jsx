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

            <h2
                className="section-title"
                style={{ textAlign: "center", color: "red", fontWeight: "bold" }}
            >
                {profile?.title || 'Baba Jaigurudev Ji Maharaj'}
            </h2>

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

                <p>
                    The world-renowned Supreme Sant Baba Jaigurudev Ji Maharaj was born in a
                    small village on the sacred land of Uttar Pradesh, India. From early
                    childhood, he possessed deep faith in religion and an intense desire
                    to know the path to the realization of God. His father passed away
                    during his childhood. Before leaving her body, his mother expressed
                    her final wish and commanded him to definitely attain God by finding
                    the true path of divine realization.
                </p>

                <h4 style={{ color: "red", marginTop: "25px" }}>
                    In Search of God from a Young Age
                </h4>

                <p>
                    At a very young age, Swami Ji Maharaj set out in search of God. He
                    devotedly served mahants and priests at many temples, hoping that they
                    might grant him a vision of God. By serving learned people, he studied
                    religious scriptures. These scriptures confirmed that God exists, but
                    did not reveal how He can be attained.
                </p>

                <p>
                    Baba Jaigurudev Ji Maharaj then associated with ascetics in disguise,
                    serving them by bathing them and cleaning their clothes. Despite this,
                    he did not attain a vision of God. Someone advised him that God could
                    be attained by offering prayers in a mosque. Following this advice,
                    he learned namaz by humbly requesting the maulvis.
                </p>

                <p>
                    One day, while offering namaz, he heard a heart-wrenching cry from
                    behind the mosque. He immediately stopped praying and went behind the
                    mosque, where he saw a goat being slaughtered. By then, he had already
                    attained a glimpse of higher spiritual awareness. This disturbed him
                    deeply, and he left that place.
                </p>

                <h4 style={{ color: "red", marginTop: "25px" }}>
                    Tireless Service for God-Realization
                </h4>

                <p>
                    During a journey to Kashmir, Swami Ji joined a group of sadhus in search
                    of God. These sadhus consumed intoxicants such as bhang and cannabis.
                    Driven by longing for God, Swami Ji served them by preparing bhang and
                    filling their chillums, though he himself had never even smoked a
                    bidi. He continued every small and large service solely to attain God.
                </p>

                <p>
                    One day, a sadhu forcefully inhaled a chillum and died instantly. This
                    shattered Swami Ji’s faith, filling him with despair. Believing that
                    God did not exist and there was no path to attain Him, he decided to
                    end his life by jumping into Dal Lake.
                </p>

                <p>
                    As he reached the lake, a sweet voice spoke from behind: “Child, the
                    means to attain God exists. You will receive it from a householder.”
                    He perceived the form of a divine being. The sweetness and attraction
                    of the voice dispelled his suicidal thoughts instantly.
                </p>

                <p>
                    While returning from Kashmir, he met a trikal-darshi saint who told
                    him that his wish would be fulfilled within six months.
                </p>

                <h4 style={{ color: "red", marginTop: "25px" }}>
                    Meeting the True Guru
                </h4>

                <p>
                    This was around the early period of 1945. At that time, the great saint
                    Ghurelal Ji Maharaj lived in Chirauli village near Aligarh. One day, he
                    instructed his elder son to bring a young man from the bus stand with
                    a healthy body, fair complexion, radiant face, and long hair.
                </p>

                <p>
                    Guided by divine inspiration, Swami Ji got down at the bus stand. He
                    was taken to Ghurelal Ji Maharaj, where he recognized the same divine
                    form he had seen in Kashmir. Swami Ji wept uncontrollably at his Guru’s
                    feet. Ghurelal Ji Maharaj said, “Why are you crying? You have wandered
                    enough; now you have arrived.”
                </p>

                <p>
                    He initiated Swami Ji into Surat Shabd Yoga and revealed the secret of
                    God-realization practiced by all true saints. Swami Ji practiced
                    meditation for eighteen hours a day. After one month, by the Guru’s
                    grace, he began to experience divine realization. Surviving on one
                    meal a day, he soon attained the highest spiritual state.
                </p>

                <p>
                    Before leaving for his divine abode in 1948, Guru Ji declared that
                    Tulsidas (Swami Ji) would lead the congregation after him.
                </p>

                <h4 style={{ color: "red", marginTop: "25px" }}>
                    Service to Humanity
                </h4>

                <p>
                    Swami Ji Maharaj worked tirelessly for the welfare of souls. By 1971,
                    he had over Ten crore disciples. He spread the message of vegetarianism
                    and freedom from intoxication across the nation, transforming millions
                    into moral, hardworking, honest, and disciplined individuals.
                </p>

                <p>
                    He guided millions on the path of God-realization and devotion, relieved
                    their suffering, and showed them the way to happiness. He established
                    the power of the name “Jaigurudev,” declaring that chanting it removes
                    difficulties and reduces suffering at the time of death.
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
