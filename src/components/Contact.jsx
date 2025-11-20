import React, { useState } from 'react';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Form submitted successfully!');
        setFormData({
            fullName: '',
            email: '',
            phoneNumber: '',
            message: ''
        });
    };

    return (
        <section className="section">
            <h2 className="section-title">Contact Us</h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '20px', marginBottom: '40px' }}>
                <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Ujjain Ashram</h3>
                    <p><strong>Address:</strong> Baba Jaigurudev Dharm Vikas Sanstha, Jaigurudev Nagar, Opposite to Pingleshwar Railway Station, Maksi Road, Ujjain (M.P.), India, PIN - 456001</p>
                    <p><strong>Phone:</strong> 9575800700, 8754700200</p>
                    <p><strong>Email Address:</strong> info@jaigurudevukm.com</p>
                </div>
                
                <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Bawal Ashram</h3>
                    <p><strong>Address:</strong> Baba Umakant Ji Maharaj Ashram, Jaigurudev Nagar, near Kasola Chowk, Bawal, District Rewari (Haryana), India, PIN - 123401</p>
                    <p><strong>Phone:</strong> 8801092023, 9671307438, 7208312873</p>
                    <p><strong>Email Address:</strong> info@jaigurudevukm.com</p>
                </div>
                
                <div style={{ flex: '1 1 300px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3>Thikariya Ashram</h3>
                    <p><strong>Address:</strong> Baba Umakant Ji Maharaj Ashram, near Tol Plaza, Thikariya, Ajmer Road, Jaipur (Rajasthan), India, PIN - 322024</p>
                    <p><strong>Phone:</strong> 7023704540</p>
                    <p><strong>Email Address:</strong> info@jaigurudevukm.com</p>
                </div>
            </div>

            <div style={{ maxWidth: '500px', margin: '0 auto' }}>
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
        </section>
    );
}

export default Contact;