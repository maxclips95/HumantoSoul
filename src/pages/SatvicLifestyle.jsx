import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/SatvicLifestyle.css'; // We will create this
import SatvicExplorer from '../components/SatvicExplorer'; // We will create this
import SEO from '../components/common/SEO';

function SatvicLifestyle() {
    const [pledgeStats, setPledgeStats] = useState({ total: 0, recent: [] });
    const [showPledgeModal, setShowPledgeModal] = useState(false);

    useEffect(() => {
        fetch(`${window.API_BASE || ''}/api/satvic/stats`)
            .then(res => res.json())
            .then(data => setPledgeStats(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="satvic-page">
            <SEO
                title="Satvic Lifestyle - Holistic Wellness, Mindfulness, Breathwork & Conscious Living | Baba Jaigurudev"
                description="Transform your life with the proven Satvic lifestyle — holistic wellness, conscious living, breathwork, somatic healing, and digital detox as taught by Baba Jaigurudev. Experience nervous system regulation, anxiety relief, inner peace, power, and prosperity through vegetarianism, yog sadhna, and mindfulness. Free beginner's guide. Trusted by 100 million+ souls. सत्विक जीवन, योग साधना।"
                keywords="satvic lifestyle, holistic wellness, holistic living, holistic health, conscious living, digital detox, breathwork, somatic healing, nervous system regulation, mindfulness, mindfulness practice, mind body harmony, mental wellbeing, mental health, stress reduction, anxiety relief, satvic food, satvic diet, yog sadhna, yoga, yoga nidra, dhyan, meditation, vegetarianism, non-violence, ahimsa, inner peace, peace, power, prosperity, spiritual health, pure living, baba jaigurudev, sant mat, santmat, spiritual growth, soul purification, transformational spirituality, online wellness, free meditation guide, beginner wellness, सत्विक जीवन, शाकाहार, योग साधना, ध्यान, आंतरिक शांति"
                url="https://www.humantosoul.com/satvic-lifestyle"
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Satvic Lifestyle", url: "https://www.humantosoul.com/satvic-lifestyle" }
                ]}
            />
            <div className="satvic-hero">
                <div className="hero-overlay">
                    <div className="hero-content">
                        <h1>Satvic Indian Kitchen</h1>
                        <p className="hero-subtitle">Discover Authentic & Pure Vegetarian Indian Cuisine</p>
                    </div>
                    <div className="hero-bottom-bar">
                        <div className="pledge-counter">
                            <span className="count">100 Million+</span>
                            <span className="label">Souls have taken the Oath</span>
                            <span className="sub-label">({pledgeStats.today || 0} oaths taken here today)</span>
                        </div>
                        <div className="vertical-divider"></div>
                        <button className="cta-button" onClick={() => setShowPledgeModal(true)}>
                            Take the Oath Now
                        </button>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <SatvicExplorer />
            </div>

            {showPledgeModal && (
                <PledgeModal onClose={() => {
                    setShowPledgeModal(false);
                    fetch(`${window.API_BASE || ''}/api/satvic/stats`).then(r => r.json()).then(setPledgeStats);
                }} refreshStats={() => {
                    fetch(`${window.API_BASE || ''}/api/satvic/stats`).then(r => r.json()).then(setPledgeStats);
                }} />
            )}
        </div>
    );
}

function PledgeModal({ onClose, refreshStats }) {
    const [formData, setFormData] = useState({ name: '', email: '', item: 'Meat' });
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${window.API_BASE || ''}/api/satvic/pledge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData.message || `Server Error: ${res.status}`);
            }
            setSubmitted(true);
            refreshStats();
        } catch (err) {
            alert(`Failed: ${err.message}`);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content pledge-modal">
                <button className="close-btn" onClick={onClose}>&times;</button>
                {!submitted ? (
                    <>
                        <h2>Take the Oath</h2>
                        <p>Vow to respect life and purify your soul.</p>
                        <form onSubmit={handleSubmit}>
                            <input type="text" placeholder="Your Name" required
                                value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            <input type="email" placeholder="Email (Optional)"
                                value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            <label>I vow to quit:</label>
                            <select value={formData.item} onChange={e => setFormData({ ...formData, item: e.target.value })}>
                                <option value="Meat">Meat & Fish</option>
                                <option value="Eggs">Eggs</option>
                                <option value="Alcohol">Alcohol/Intoxicants</option>
                                <option value="All">All of the above</option>
                            </select>
                            <button type="submit" className="submit-btn">I Take the Oath</button>
                        </form>
                    </>
                ) : (
                    <div className="success-message">
                        <h3>Jai Gurudev!</h3>
                        <p>Your soul is now walking on the path towards purification. Begin your journey with Satvic food.</p>
                        <button onClick={onClose} className="btn-browse">Browse Satvic Recipes</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SatvicLifestyle;
