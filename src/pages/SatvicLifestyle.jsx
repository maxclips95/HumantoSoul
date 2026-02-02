import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/SatvicLifestyle.css'; // We will create this
import SatvicExplorer from '../components/SatvicExplorer'; // We will create this

function SatvicLifestyle() {
    const [pledgeStats, setPledgeStats] = useState({ total: 0, recent: [] });
    const [showPledgeModal, setShowPledgeModal] = useState(false);

    useEffect(() => {
        fetch('/api/satvic/stats')
            .then(res => res.json())
            .then(data => setPledgeStats(data))
            .catch(err => console.error(err));
    }, []);

    return (
        <div className="satvic-page">
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
                    fetch('/api/satvic/stats').then(r => r.json()).then(setPledgeStats);
                }} refreshStats={() => {
                    fetch('/api/satvic/stats').then(r => r.json()).then(setPledgeStats);
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
            const res = await fetch('/api/satvic/pledge', {
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
