import React, { useEffect, useState } from "react";
import axios from "axios";

function BabaUmakant() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        axios.get('/api/profiles')
            .then(res => {
                const one = res.data.find(p => p.id === 'umakant');
                if (one) setProfile(one);
            })
            .catch(console.error);
    }, []);

    return (
        <section style={{ backgroundColor: "#fff5f0", padding: "40px 20px" }}>

            {/* Page Title */}
            <h2
                style={{
                    textAlign: "center",
                    color: "red",
                    fontWeight: "bold",
                    marginBottom: "25px",
                }}
            >
                {profile?.title || 'About Baba Umakant Ji Maharaj'}
            </h2>

            {/* Image & Quote */}
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
                {profile?.image ? (
                    <img
                        src={profile.image?.startsWith('/') ? `${window.API_BASE || ''}${profile.image}` : profile.image}
                        alt="Baba Umakant Ji Maharaj"
                        style={{
                            borderRadius: "50%",
                            width: "400px",
                            height: "400px",
                            objectFit: "cover",
                            border: "4px solid #f2c6c6",
                            padding: "5px",
                            boxShadow: '0 8px 25px rgba(196, 30, 58, 0.15)'
                        }}
                    />
                ) : (
                    <div style={{ width: '400px', height: '400px', borderRadius: '50%', background: '#eee', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888' }}>
                        No Image
                    </div>
                )}

                <p
                    style={{
                        marginTop: "15px",
                        fontSize: "1rem",
                        fontStyle: "italic",
                    }}
                >
                    {profile?.description || '“Freedom from the cycle of birth and death is possible only through true devotion and meditation.”'}
                </p>

                <div style={{ color: "red", fontSize: "20px", marginTop: "10px" }}>
                    · · ·
                </div>
            </div>

            {/* Content */}
            <div
                style={{
                    maxWidth: "1000px",
                    margin: "0 auto",
                    lineHeight: "1.8",
                    fontSize: "0.95rem",
                }}
            >
                <p>
                    The Most Revered Supreme Sant Baba Umakant Ji Maharaj was born in a
                    small village in the state of Uttar Pradesh, India. He was raised in
                    a religious family. Due to his deep spiritual inclination from
                    childhood, after completing his education, he was naturally drawn in
                    the year 1973 to Baba Jaigurudev Ji Maharaj. He received Naamdaan
                    (spiritual initiation) and, as per his Guru’s command, devoted himself
                    to service and devotional practice.
                </p>

                <p>
                    In the initial years, Baba Umakant Ji Maharaj lived with his Guru and
                    occasionally returned to his village for short periods to serve his
                    parents. From the year 1976 onward, he remained continuously with his
                    Guru, Baba Jaigurudev Ji Maharaj, like a shadow.
                </p>

                <p>
                    Such was the immense grace of his Guru that Baba Jaigurudev Ji Maharaj
                    entrusted Baba Umakant Ji Maharaj with all forms of close personal
                    service. He also sent him across the country to conduct satsangs,
                    writing in his letters: “I am sending Umakant Tiwari; understand that
                    it is I myself who am coming.”
                </p>

                <p>
                    Baba Jaigurudev Ji Maharaj formally instructed Baba Umakant Ji Maharaj
                    to give Naamdaan to new seekers and to take responsibility for the care
                    and guidance of existing initiates.
                </p>

                <h4 style={{ color: "red", marginTop: "25px" }}>
                    Appointment as Spiritual Successor
                </h4>

                <p>
                    It has been an established tradition of Sant Mat that before leaving
                    the physical body, the living Sant Satguru appoints a successor to
                    continue the spiritual mission. Accordingly, nearly five years before
                    leaving his body, on 16 May 2007, during a satsang held at Basiratganj,
                    District Unnao (Uttar Pradesh), Baba Jaigurudev Ji Maharaj publicly
                    declared his most devoted disciple of forty years, Baba Umakant Ji
                    Maharaj, as the one who would care for the old devotees and grant
                    Naamdaan to new seekers after his departure.
                </p>

                <p>
                    In his own words, Baba Jaigurudev Ji Maharaj said: “Whenever I come
                    from now on, it will be through him. For spiritual welfare and for new
                    seekers who come for Naamdaan, Umakant Tiwari will grant it. He will
                    continue to guide the old initiates, correct those who stray, and
                    make them practice bhajan and meditation. Remember this clearly. If
                    you continue sincere remembrance, I will take care of you as well.
                    And whoever comes seeking Naamdaan will be guided and initiated by
                    him.”
                </p>

                {/* Succession Video */}
                <div style={{ marginTop: '30px', marginBottom: '30px', textAlign: 'center' }}>
                    <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', maxWidth: '800px', margin: '0 auto', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                        <iframe
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%'
                            }}
                            src="https://www.youtube.com/embed/5A8alRxWaJA"
                            title="Spiritual Succession Announcement"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                    <p style={{ marginTop: '10px', fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
                        Video: Announcement of Spiritual Succession
                    </p>
                </div>

                <h4 style={{ color: "red", marginTop: "25px" }}>
                    Establishment of Baba Jaigurudev Dharma Vikas Sanstha, Ujjain
                </h4>

                <p>
                    After Baba Jaigurudev Ji Maharaj left his physical body at the Mathura
                    Ashram, Baba Umakant Ji Maharaj, amid extremely challenging
                    circumstances, left everything behind and arrived empty-handed in
                    Ujjain, Madhya Pradesh. With the cooperation of devotees, he
                    established an ashram and founded the Baba Jaigurudev Dharma Vikas Sanstha, Ujjain.
                </p>

                <p>
                    To continue the Guru’s mission and to share the sorrow of his physical departure, Baba Umakant Ji Maharaj traveled throughout the country, conducting satsangs and explaining that although Guru Maharaj had departed physically, he remains ever-present in the form of the divine Word. He taught that through continuous simran, meditation, and bhajan performed with concentration, seekers would experience inner visions just as they had earlier experienced outer ones.
                </p>

                <p>
                    As people began following these instructions, they started receiving both material and spiritual benefits. Large numbers of devotees joined Baba Umakant Ji Maharaj, while millions longed to receive Naamdaan, as only one living Sant at a time holds the authority to grant it.
                </p>

                <p>
                    While touring the country, Baba Umakant Ji Maharaj arrived in Jaipur and on 21 July 2013 announced that Naamdaan would be given there the following morning. The announcement was met with a powerful chant of “Jaigurudev” from the devotees. Showing compassion to deserving souls, and acting under his Guru’s command, Baba Umakant Ji Maharaj formally began granting Naamdaan from the open stage on Guru Purnima, 22 July 2013, in Jaipur, Rajasthan, in the presence of a massive gathering.
                </p>

                <h4 style={{ color: "red", marginTop: "25px" }}>
                    Ongoing Spiritual Mission
                </h4>

                <p>
                    Supreme Sant Baba Umakant Ji Maharaj has, to date, granted Naamdaan to
                    crores of people. Following the footsteps of his Guru, he travels
                    extensively in India and abroad, guiding people to live a vegetarian,
                    intoxication-free, hardworking, moral, and patriotic life.
                </p>

                <p>
                    While living a householder’s life, he teaches that the human body
                    itself is the true temple, mosque, church, and gurudwara, within
                    which the divine vision of God can be attained. He remains constantly
                    engaged in fulfilling his Guru’s mission: to establish Satya Yug on
                    this earth, to stop cow slaughter, human violence, and the killing of
                    animals and birds, and to uplift souls by making people virtuous,
                    vegetarian, and free from intoxication.
                </p>

                <p>
                    Through the practice of Naamdaan given by Supreme Sant Baba Umakant Ji
                    Maharaj, millions are experiencing both worldly and spiritual
                    benefits, leading them toward inner peace and ultimate liberation.
                </p>
            </div>
        </section>
    );
}

export default BabaUmakant;
