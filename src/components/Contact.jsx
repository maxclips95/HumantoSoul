import React, { useState } from 'react';
import axios from 'axios';
import VoiceRecorder from './VoiceRecorder';

function Contact() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phoneNumber: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/contact', formData);

            if (response.status !== 200) throw new Error('Submission failed');

            alert('Form submitted successfully!');
            setFormData({
                fullName: '',
                email: '',
                phoneNumber: '',
                message: ''
            });
        } catch (error) {
            alert('Error submitting form. Please try again.');
            console.error('Error:', error);
        }
    };

    return (
        <section className="section" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto 40px auto', textAlign: 'center' }}>
                <h2 style={{ color: "#c41e3a", fontSize: "2.2rem", marginBottom: "15px" }}>You are Welcome!</h2>
                <p style={{ fontSize: "1.2rem", color: "#555", maxWidth: "800px", margin: "0 auto" }}>
                    We invite you to visit our Ashram and attend the spiritual programmes in person at least once.
                    Experience the divinity and the direct guidance of <strong>Baba Umakant Ji Maharaj</strong>.
                </p>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', marginBottom: '20px' }}>
                <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Ujjain Ashram</h3>
                    <p><strong>Address:</strong> Baba Jaigurudev Dharm Vikas Sanstha, Jaigurudev Nagar, Opposite to Pingleshwar Railway Station, Maksi Road, Ujjain (M.P.), India, PIN - 456001</p>
                    <p><strong>Phone:</strong> 9754700200, 9575600700</p>
                    <p><strong>Email Address:</strong> info@jaigurudevukm.com</p>
                    <div style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden' }}>
                        <iframe
                            width="100%"
                            height="200"
                            id="gmap_canvas_ujjain"
                            src="https://maps.google.com/maps?q=Baba%20Jaigurudev%20Dharm%20Vikas%20Sanstha%20Ujjain&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            title="Ujjain Ashram Map"
                        ></iframe>
                    </div>
                </div>

                <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Bawal Ashram</h3>
                    <p><strong>Address:</strong> Baba Umakant Ji Maharaj Ashram, Jaigurudev Nagar, near Kasola Chowk, Bawal, District Rewari (Haryana), India, PIN - 123401</p>
                    <p><strong>Phone:</strong> 8801092023, 9671307438, 7208312873</p>
                    <p><strong>Email Address:</strong> info@jaigurudevukm.com</p>
                    <div style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden' }}>
                        <iframe
                            width="100%"
                            height="200"
                            id="gmap_canvas_bawal"
                            src="https://maps.google.com/maps?q=Baba%20Umakant%20Ji%20Maharaj%20Ashram%20Bawal&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            title="Bawal Ashram Map"
                        ></iframe>
                    </div>
                </div>

                <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Thikariya Ashram</h3>
                    <p><strong>Address:</strong> Baba Umakant Ji Maharaj Ashram, near Tol Plaza, Thikariya, Ajmer Road, Jaipur (Rajasthan), India, PIN - 322024</p>
                    <p><strong>Phone:</strong> 7023704540</p>
                    <p><strong>Email Address:</strong> info@jaigurudevukm.com</p>
                    <div style={{ marginTop: '15px', borderRadius: '8px', overflow: 'hidden' }}>
                        <iframe
                            width="100%"
                            height="200"
                            id="gmap_canvas_thikariya"
                            src="https://maps.google.com/maps?q=Baba%20Umakant%20Ji%20Maharaj%20Ashram%20Thikariya%20Jaipur&t=&z=13&ie=UTF8&iwloc=&output=embed"
                            frameBorder="0"
                            scrolling="no"
                            marginHeight="0"
                            marginWidth="0"
                            title="Thikariya Ashram Map"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* FORM + VOICE NOTE — side by side */}
            <div style={{
                display: 'flex',
                gap: '0',
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexWrap: 'wrap',
                maxWidth: '1060px',
                margin: '0 auto'
            }}>
                {/* LEFT: Contact Form */}
                <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
                    <h3 style={{ color: '#c41e3a', marginBottom: '20px' }}>Contact Form</h3>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name"
                            value={formData.fullName}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        <input
                            type="tel"
                            name="phoneNumber"
                            placeholder="Phone Number"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        <textarea
                            name="message"
                            placeholder="Write your message here"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', resize: 'vertical' }}
                            rows="5"
                        ></textarea>
                        <button type="submit" className="btn" style={{ padding: '10px', fontSize: '1rem' }}>
                            Send
                        </button>
                    </form>
                </div>

                {/* VERTICAL DIVIDER */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '0 28px',
                    alignSelf: 'stretch',
                    minHeight: '200px'
                }}>
                    <div style={{ flex: 1, width: '1px', background: '#e0d0d0' }}></div>
                    <span style={{
                        color: '#c41e3a',
                        fontWeight: '700',
                        fontSize: '0.82rem',
                        padding: '10px 0',
                        whiteSpace: 'nowrap'
                    }}>OR / या</span>
                    <div style={{ flex: 1, width: '1px', background: '#e0d0d0' }}></div>
                </div>

                {/* RIGHT: Voice Recorder */}
                <div style={{ flex: '1 1 400px', maxWidth: '500px' }}>
                    <VoiceRecorder />
                </div>
            </div>

        </section>
    );
}

export default Contact;
