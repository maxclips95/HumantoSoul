import React, { useState } from 'react';
import axios from 'axios';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');
        setMessage('');

        try {
            const response = await axios.post('/api/newsletter/subscribe', { email });
            if (response.data.success) {
                setStatus('success');
                setMessage('Thank you for subscribing! 🙏');
                setEmail('');
            }
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Something went wrong. Please try again.');
        }
    };

    return (
        <div style={{
            marginTop: '20px',
            padding: '20px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
            <h4 style={{ color: '#fff', marginBottom: '10px', fontSize: '1.1rem' }}>
                📩 Join Our Spiritual Newsletter
            </h4>
            <p style={{ color: '#eee', fontSize: '0.9rem', marginBottom: '15px' }}>
                Receive updates on satsangs, prophecies, and ashram news directly in your inbox.
            </p>

            <form onSubmit={handleSubscribe} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        fontSize: '1rem',
                        outline: 'none'
                    }}
                />
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#FF9933',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                        transition: 'background 0.3s'
                    }}
                >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe Now'}
                </button>
            </form>

            {message && (
                <p style={{
                    marginTop: '10px',
                    fontSize: '0.9rem',
                    color: status === 'success' ? '#4ade80' : '#f87171',
                    fontWeight: '500'
                }}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default Newsletter;
