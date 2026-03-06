import React from 'react';
import { Link } from 'react-router-dom';
import './StartHere.css';

const steps = [
    {
        number: '01',
        icon: '🙏',
        title: 'Who is Baba Jaigurudev?',
        hindi: 'बाबा जयगुरुदेव जी महाराज',
        description: 'Param Sant Baba Jaigurudev Ji Maharaj — the divine spiritual master who guided tens of millions of souls to God-realization through Dhyan, Satsang, and the Sant Mat path.',
        link: '/baba-jaigurudev',
        linkText: 'Learn His Life & Teachings →',
    },
    {
        number: '02',
        icon: '🌿',
        title: 'Why Vegetarianism?',
        hindi: 'शाकाहार क्यों जरूरी है?',
        description: 'Baba Ji taught that non-vegetarian food is the root cause of physical disease, mental unrest, and spiritual blockage. A satvic, vegetarian diet is the first step on the path to God.',
        link: '/vegetarian-living',
        linkText: 'Discover the Satvic Path →',
    },
    {
        number: '03',
        icon: '🧘',
        title: 'How to Meditate (Dhyan)',
        hindi: 'ध्यान कैसे करें?',
        description: 'The Sant Mat practice of Surat Shabd Yoga — turning the soul\'s attention inward to the divine Sound (Shabd). Baba Jaigurudev himself practiced this 18 hours daily to attain God-realization.',
        link: '/meditation',
        linkText: 'Learn Dhyan Meditation →',
    },
    {
        number: '04',
        icon: '📺',
        title: 'Watch a Satsang',
        hindi: 'सत्संग सुनिए',
        description: 'Satsang (company of truth) is the heart of spiritual life. Watch a divine Satsang or prophecy video from Baba Umakant Ji Maharaj — with full Hindi and English transcripts.',
        link: '/prophecies',
        linkText: 'Watch Prophecy Satsangs →',
    },
];

export default function StartHere() {
    return (
        <section className="start-here-section">
            <div className="start-here-header">
                <span className="start-here-eyebrow">New to the Mission?</span>
                <h2 className="start-here-title">Begin Your Spiritual Journey</h2>
                <p className="start-here-subtitle">
                    आपका स्वागत है — Welcome. Whether you are new or returning, here is your guided path.
                </p>
            </div>

            <div className="start-here-steps">
                {steps.map((step) => (
                    <div key={step.number} className="start-step">
                        <div className="start-step-number">{step.number}</div>
                        <div className="start-step-icon">{step.icon}</div>
                        <div className="start-step-body">
                            <h3 className="start-step-title">{step.title}</h3>
                            <p className="start-step-hindi">{step.hindi}</p>
                            <p className="start-step-description">{step.description}</p>
                            <Link to={step.link} className="start-step-link">{step.linkText}</Link>
                        </div>
                    </div>
                ))}
            </div>

            <div className="start-here-cta">
                <div className="start-here-cta-card">
                    <p>✨ Ready to receive Naamdaan (Spiritual Initiation)?</p>
                    <p className="start-here-cta-sub">Naamdaan is given completely free of cost at monthly programmes held across India. Find one near you.</p>
                    <Link to="/downloads" className="start-here-btn">View Monthly Programmes →</Link>
                </div>
            </div>
        </section>
    );
}
