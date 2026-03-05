import React, { useState } from 'react';
import './ProphecyTimeline.css';

// ============================================================
// DATA: Fulfilled Prophecies
// Sourced from official Satsangs of Baba Jaigurudev Ji Maharaj
// ============================================================
const fulfilledProphecies = [
    {
        yearSpoken: '1970s',
        yearFulfilled: '2020',
        hindi: 'एक ऐसी महामारी आएगी जो पूरे विश्व को हिला देगी। लोग घरों में बंद हो जाएंगे।',
        english: 'A pandemic will come that will shake the entire world. People will be confined to their homes.',
        category: 'World Event',
        icon: '🦠'
    },
    {
        yearSpoken: '1980s',
        yearFulfilled: '1991',
        hindi: 'सोवियत संघ टूट जाएगा और कई देश अलग हो जाएंगे।',
        english: 'The Soviet Union will break apart and many nations will separate.',
        category: 'Political Change',
        icon: '🌍'
    },
    {
        yearSpoken: '1970s',
        yearFulfilled: '2004',
        hindi: 'समुद्र में ऐसी लहरें आएंगी जो तटीय क्षेत्रों को तबाह कर देंगी।',
        english: 'Waves will come from the sea that will devastate coastal regions. (2004 Indian Ocean Tsunami)',
        category: 'Natural Calamity',
        icon: '🌊'
    },
    {
        yearSpoken: '1980s',
        yearFulfilled: '2000s',
        hindi: 'मानव हर चीज़ मशीन से करने लगेगा। एक छोटी सी चीज़ में पूरी दुनिया समा जाएगी।',
        english: 'Humans will do everything through machines. The entire world will fit into one small device. (Smartphones/Internet)',
        category: 'Technology',
        icon: '📱'
    },
    {
        yearSpoken: '1960s',
        yearFulfilled: 'Ongoing',
        hindi: 'मांसाहार और नशे के कारण नई-नई बीमारियाँ आएंगी जिनका कोई इलाज नहीं होगा।',
        english: 'Due to non-vegetarianism and intoxicants, new diseases will emerge for which there will be no cure.',
        category: 'Health',
        icon: '⚕️'
    },
    {
        yearSpoken: '1990s',
        yearFulfilled: '2010s',
        hindi: 'आतंकवाद पूरे विश्व में फैलेगा। कोई भी देश सुरक्षित नहीं रहेगा।',
        english: 'Terrorism will spread across the entire world. No country will remain safe.',
        category: 'World Event',
        icon: '⚠️'
    },
];

// ============================================================
// DATA: Upcoming Prophecies
// Sourced from recent Satsangs & YouTube Shorts on jaigurudevukm
// ============================================================
const upcomingProphecies = [
    {
        yearSpoken: '2020s',
        expectedWhen: 'Only a few years away',
        hindi: 'युग परिवर्तन होगा — समय बदलेगा। यह सबसे बड़ा परिवर्तन है जो सृष्टि में होने वाला है। अभी बहुत कम समय बचा है — तैयारी करो।',
        english: 'The Time will change (Yug Parivartan). This is the greatest transformation to happen in all of creation. Very little time remains. Prepare now.',
        category: 'Yug Parivartan',
        icon: '🌅',
        urgent: true
    },
    {
        yearSpoken: '2020s',
        expectedWhen: 'Near Future',
        hindi: 'एक बड़ा प्राकृतिक विनाश आएगा जो पृथ्वी को साफ करेगा। जो लोग शाकाहारी और नशामुक्त होंगे, वे सुरक्षित रहेंगे।',
        english: 'A great natural destruction will come that will cleanse the earth. Those who are vegetarian and free from intoxicants will remain safe.',
        category: 'Natural Change',
        icon: '🌏',
        urgent: true
    },
    {
        yearSpoken: '2020s',
        expectedWhen: 'Upcoming',
        hindi: 'तीसरा विश्व युद्ध होगा। परमाणु हथियारों का प्रयोग होगा। इससे बचने का एकमात्र रास्ता ईश्वर की शरण है।',
        english: 'A third world war will occur. Nuclear weapons will be used. The only way to survive this is to take refuge in God.',
        category: 'World Event',
        icon: '🕊️',
        urgent: true
    },
    {
        yearSpoken: '2020s',
        expectedWhen: 'After Parivartan',
        hindi: 'सत्युग में हर तरफ शांति होगी। सत्य और शांति का राज रहेगा। कोई रोग नहीं होगा, कोई दुःख नहीं होगा।',
        english: 'In the new era of Satyug there will be peace everywhere. Truth will reign. There will be no disease, no sorrow.',
        category: 'Satyug',
        icon: '✨'
    },
    {
        yearSpoken: '2020s',
        expectedWhen: 'Near Future',
        hindi: 'अर्थव्यवस्था बुरी तरह चरमराएगी। देश-दुनिया में भुखमरी होगी। जो अन्न संग्रह करेगा वो बचेगा।',
        english: 'The economy will collapse severely. There will be famine across nations. Those who store grain/food provisions will survive.',
        category: 'Economy',
        icon: '📉'
    },
    {
        yearSpoken: '2020s',
        expectedWhen: 'Ongoing',
        hindi: 'जो लोग ध्यान और सत्संग में लगे रहेंगे, जो शाकाहारी हैं और नशामुक्त हैं — उन पर आने वाली विपदाओं का प्रभाव बहुत कम होगा।',
        english: 'Those engaged in dhyan (meditation) and satsang, who are vegetarian and free from intoxicants — the impact of coming calamities will be greatly reduced for them.',
        category: 'Spiritual Protection',
        icon: '🙏'
    },
];

const CATEGORY_COLORS = {
    'World Event': '#c41e3a',
    'Political Change': '#2c5f8f',
    'Natural Calamity': '#d97706',
    'Technology': '#059669',
    'Health': '#7c3aed',
    'Satyug': '#c41e3a',
    'Yug Parivartan': '#c41e3a',
    'Natural Change': '#d97706',
    'Economy': '#dc2626',
    'Spiritual Protection': '#059669',
};

export default function ProphecyTimeline() {
    const [activeTab, setActiveTab] = useState('fulfilled');

    const scrollToVideos = (e) => {
        e.preventDefault();
        const el = document.getElementById('prophecy-videos');
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            // If not on prophecies page, navigate there
            window.location.href = '/prophecies#prophecy-videos';
        }
    };

    const data = activeTab === 'fulfilled' ? fulfilledProphecies : upcomingProphecies;

    return (
        <section className="prophecy-timeline-section">
            <div className="prophecy-timeline-header">
                <h2 className="prophecy-timeline-title">
                    📜 Prophecy Timeline
                </h2>
                <p className="prophecy-timeline-subtitle">
                    Divine words of Param Sant Baba Jaigurudev Ji Maharaj — spoken decades ago, proven by history, and warning us of what is to come.
                </p>
                <div className="prophecy-timeline-subtitle" style={{ fontSize: '0.95rem', color: '#888', marginTop: '-10px' }}>
                    दिव्य वचन — जो हो चुका और जो होने वाला है
                </div>

                {/* Tab Switcher */}
                <div className="timeline-tabs">
                    <button
                        className={`timeline-tab ${activeTab === 'fulfilled' ? 'timeline-tab--active' : ''}`}
                        onClick={() => setActiveTab('fulfilled')}
                    >
                        ✅ Fulfilled Prophecies
                    </button>
                    <button
                        className={`timeline-tab ${activeTab === 'upcoming' ? 'timeline-tab--active' : ''}`}
                        onClick={() => setActiveTab('upcoming')}
                    >
                        🔮 Upcoming Prophecies
                    </button>
                </div>
            </div>

            <div className="timeline-grid">
                {data.map((item, index) => {
                    const catColor = CATEGORY_COLORS[item.category] || '#c41e3a';
                    return (
                        <div
                            key={index}
                            className={`timeline-card ${item.urgent ? 'timeline-card--urgent' : ''}`}
                            style={{ borderLeft: `4px solid ${catColor}` }}
                        >
                            <div className="timeline-card-top">
                                <span className="timeline-icon">{item.icon}</span>
                                <div className="timeline-meta">
                                    <span className="timeline-category" style={{ background: catColor }}>
                                        {item.category}
                                    </span>
                                    <span className="timeline-year">
                                        🗣️ Spoken: {item.yearSpoken}
                                        {item.yearFulfilled && <> &nbsp;|&nbsp; ✅ Fulfilled: {item.yearFulfilled}</>}
                                        {item.expectedWhen && <> &nbsp;|&nbsp; 🔮 {item.expectedWhen}</>}
                                    </span>
                                </div>
                            </div>

                            <div className="timeline-card-body">
                                <p className="timeline-hindi">{item.hindi}</p>
                                <p className="timeline-english">{item.english}</p>
                            </div>

                            {item.urgent && (
                                <div className="timeline-urgent-badge">
                                    ⚠️ Prepare Now
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="timeline-cta">
                <p>These are the divine words of Baba Jaigurudev Ji Maharaj. The best protection is a pure life.</p>
                <div className="timeline-cta-buttons">
                    <a href="/meditation" className="timeline-btn timeline-btn--primary">Start Dhyan Meditation 🙏</a>
                    <a href="#prophecy-videos" onClick={scrollToVideos} className="timeline-btn timeline-btn--outline">View All Prophecy Videos →</a>
                </div>
            </div>
        </section>
    );
}
