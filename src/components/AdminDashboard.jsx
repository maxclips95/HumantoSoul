import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('announcements');
    const [data, setData] = useState([]);
    const [automatedData, setAutomatedData] = useState([]);
    const [textProphecies, setTextProphecies] = useState([]); // Array for text cards
    const [loading, setLoading] = useState(false);

    // Form States
    const [formData, setFormData] = useState({});
    const [textForm, setTextForm] = useState({ title: '', year: '2026', content: '' }); // Form for text prophecies
    const [editingTextId, setEditingTextId] = useState(null); // ID being edited for text prophecies
    const [editingId, setEditingId] = useState(null); // ID being edited for general items
    const [file, setFile] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [cdrFile, setCdrFile] = useState(null);

    // Password Change States
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [passwordMessage, setPasswordMessage] = useState('');
    const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
    const [showSubscribersModal, setShowSubscribersModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) navigate('/admin-login');

        // RESET DATA to avoid type mismatch crashes during transition (Object vs Array)
        setData([]);
        setAutomatedData([]);

        fetchData(activeTab);
    }, [activeTab, navigate]);

    const fetchData = async (section) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');

            if (section === 'newsletter') {
                const subRes = await axios.get(`${BASE_URL}/api/newsletter/subscribers`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setData({ count: subRes.data.count, subscribers: subRes.data.subscribers });
                setLoading(false);
                return;
            }

            const res = await axios.get(`${BASE_URL}/api/${section}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (section === 'prophecies' || section === 'videoreview') {
                setData(res.data.manual || []);
                setAutomatedData(res.data.automated || []);
                if (section === 'prophecies') {
                    // Also fetch highlight data (now array)
                    try {
                        const hRes = await axios.get(`${BASE_URL}/api/prophecy-highlight`);
                        setTextProphecies(Array.isArray(hRes.data) ? hRes.data : []);
                    } catch (err) { console.error('Error fetching text prophecies:', err); }
                }
            } else {
                setData(res.data);
            }
        } catch (error) {
            console.error(`Error fetching ${section}:`, error);
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.name === 'pdfFile') setPdfFile(e.target.files[0]);
        else if (e.target.name === 'cdrFile') setCdrFile(e.target.files[0]);
        else if (e.target.name === 'bookPdf') setPdfFile(e.target.files[0]); // Reusing pdfFile state for book pdf
        else setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let dataToSend;
        let isJson = false;

        // Handle Prarthana separately (send as JSON)
        if (activeTab === 'prarthana') {
            dataToSend = { ...formData };
            isJson = true;
        } else {
            // All other tabs use FormData (Multipart)
            dataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null && formData[key] !== undefined) {
                    dataToSend.append(key, formData[key]);
                }
            });

            // Add files
            if (activeTab === 'downloads') {
                if (pdfFile) dataToSend.append('pdfFile', pdfFile);
                if (cdrFile) dataToSend.append('cdrFile', cdrFile);
            } else if (activeTab === 'literature') {
                if (file) dataToSend.append('image', file);
                if (pdfFile) dataToSend.append('pdf', pdfFile);
                dataToSend.append('type', 'book');
            } else if (file) {
                let fileField = activeTab === 'gallery' || activeTab === 'literature' || activeTab === 'profiles' ? 'image' : 'file';
                dataToSend.append(fileField, file);
            }
            if (activeTab === 'literature') dataToSend.append('type', 'book');
        }

        try {
            // Use 'videos' endpoint for videoreview tab
            const endpoint = activeTab === 'videoreview' ? 'videos' : activeTab;
            const url = editingId ? `${BASE_URL}/api/${endpoint}/${editingId}` : `${BASE_URL}/api/${endpoint}`;
            const method = editingId ? 'PUT' : 'POST';

            console.log(`Sending ${method} to ${url}`, isJson ? dataToSend : formData);

            const token = localStorage.getItem('token');
            const axiosConfig = {
                method,
                url,
                data: dataToSend,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            };

            // Explicitly set Content-Type for JSON (though axios usually detects it)
            if (isJson) {
                axiosConfig.headers['Content-Type'] = 'application/json';
            }

            await axios(axiosConfig);

            fetchData(activeTab);
            setFormData({});
            setEditingId(null);
            setFile(null);
            setPdfFile(null);
            setCdrFile(null);
            alert(editingId ? 'Updated successfully!' : 'Added successfully!');
        } catch (error) {
            console.error('Error saving item:', error);
            const msg = error.response?.data?.message || error.message || 'Unknown error';
            alert(`Failed to save item: ${msg}`);
        }
    };

    const handleEdit = (item) => {
        setEditingId(item.id);
        // Exclude file fields and system fields from formData
        const { id, src, image, pdf, fileUrl, cdr, ...rest } = item;
        setFormData(rest);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const cancelEdit = () => {
        setEditingId(null);
        setFormData({});
        setFile(null);
        setPdfFile(null);
        setCdrFile(null);
    };

    const handleFetchTranscript = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            await axios.post(`${BASE_URL}/api/videos/${id}/transcript`, {}, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData('prophecies');
        } catch (error) {
            const msg = error.response?.data?.message || 'Transcript fetch failed.';
            const details = error.response?.data?.details || 'YouTube may not have captions for this video.';
            alert(`${msg}\n\nDetails: ${details}`);
        }
        setLoading(false);
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${BASE_URL}/api/videos/${id}`, { transcriptStatus: 'Approved' }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData('prophecies');
        } catch (error) {
            console.error('Approval failed:', error);
        }
    };

    const handleUpdateVideo = async (id, updatedTranscript) => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`${BASE_URL}/api/videos/${id}`, { transcript: updatedTranscript }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData('prophecies');
            setEditingId(null);
            setFormData({});
        } catch (error) {
            console.error('Update failed:', error);
        }
    };


    const handleSaveTextProphecy = async () => {
        try {
            const token = localStorage.getItem('token');

            if (editingTextId) {
                // UPDATE EXISTING
                await axios.put(`${BASE_URL}/api/prophecy-highlight/${editingTextId}`, textForm, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Text Prophecy updated successfully!');
                setEditingTextId(null);
            } else {
                // ADD NEW
                await axios.post(`${BASE_URL}/api/prophecy-highlight`, textForm, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                alert('Text Prophecy added successfully!');
            }

            setTextForm({ title: '', year: '2026', content: '' }); // Reset form
            fetchData('prophecies'); // Refresh list
        } catch (error) {
            console.error('Error saving text prophecy:', error);
            alert('Failed to save.');
        }
    };

    const handleDeleteTextProphecy = async (id) => {
        if (!window.confirm('Delete this text prophecy?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/api/prophecy-highlight/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData('prophecies');
        } catch (error) {
            console.error('Error deleting text prophecy:', error);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`${BASE_URL}/api/${activeTab}/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchData(activeTab);
        } catch (error) {
            console.error('Error deleting:', error);
        }
    };

    // Password Change Handler
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setPasswordMessage('');

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage('New passwords do not match!');
            return;
        }

        if (passwordData.newPassword.length < 8) {
            setPasswordMessage('New password must be at least 8 characters!');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(`${BASE_URL}/api/auth/change-password`, {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            setPasswordMessage('✅ ' + res.data.message);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });

            // Log out after password change
            setTimeout(() => {
                localStorage.removeItem('token');
                navigate('/admin-login');
            }, 2000);
        } catch (error) {
            setPasswordMessage('❌ ' + (error.response?.data?.message || 'Failed to change password'));
        }
    };

    const renderForm = () => {
        switch (activeTab) {
            case 'announcements':
                return (
                    <>
                        <input type="text" name="year" placeholder="Year" value={formData.year || ''} onChange={handleInputChange} required />
                        <input type="text" name="title" placeholder="Title" value={formData.title || ''} onChange={handleInputChange} required />
                        <textarea name="description" placeholder="Description" value={formData.description || ''} onChange={handleInputChange} required style={{ minHeight: '200px', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.5', padding: '10px' }} />
                        <label>Upload Document (PDF/Image): <input type="file" onChange={handleFileChange} /></label>
                    </>
                );
            case 'gallery':
                return (
                    <>
                        <input type="text" name="alt" placeholder="Description/Alt Text" value={formData.alt || ''} onChange={handleInputChange} required />
                        <label>Upload Image: <input type="file" onChange={handleFileChange} required /></label>
                    </>
                );
            case 'literature':
                return (
                    <>
                        <input type="text" name="title" placeholder="Book Title" value={formData.title || ''} onChange={handleInputChange} required />
                        <input type="text" name="author" placeholder="Author" value={formData.author || ''} onChange={handleInputChange} />
                        <textarea name="description" placeholder="Description" value={formData.description || ''} onChange={handleInputChange} required style={{ minHeight: '150px', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.5', padding: '10px' }} />
                        <label>Cover Image: <input type="file" onChange={handleFileChange} /></label>
                        <label>Book PDF: <input type="file" name="bookPdf" accept="application/pdf" onChange={handleFileChange} /></label>
                    </>
                );
            case 'prarthana':
                return (
                    <>
                        <input type="text" name="title" placeholder="Prayer Title" value={formData.title || ''} onChange={handleInputChange} required />
                        <textarea name="content" placeholder="Content (Lyrics)" value={formData.content || ''} onChange={handleInputChange} required style={{ height: '150px' }} />
                    </>
                );

            case 'downloads':
                return (
                    <>
                        <input type="text" name="type" placeholder="Type (e.g. निमंत्रण, परचा)" value={formData.type || ''} onChange={handleInputChange} required />
                        <input type="text" name="title" placeholder="Title (e.g. भण्डारा)" value={formData.title || ''} onChange={handleInputChange} required />
                        <input type="text" name="location" placeholder="Location (e.g. उज्जैन)" value={formData.location || ''} onChange={handleInputChange} required />
                        <input type="text" name="year" placeholder="Year (e.g. 2023)" value={formData.year || ''} onChange={handleInputChange} required />
                        <label>Upload PDF: <input type="file" name="pdfFile" accept="application/pdf" onChange={handleFileChange} /></label>
                        <label>Upload CDR: <input type="file" name="cdrFile" onChange={handleFileChange} /></label>
                    </>
                );
            case 'prophecies':
                return (
                    <>
                        {/* TEXT PROPHECIES SECTION */}
                        <div style={{ marginBottom: '30px', padding: '20px', background: '#fff3f3', borderRadius: '8px', border: '1px solid #ffccd2' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#c41e3a', borderBottom: '1px solid #ffccd2', paddingBottom: '10px' }}>
                                Text Prophecy Cards (Displayed at top)
                            </h4>

                            {/* List of Existing Text Prophecies */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                                {textProphecies.map(item => (
                                    <div key={item.id} style={{ background: 'white', padding: '15px', borderRadius: '5px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
                                            <span style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#666' }}>{item.year}</span>
                                            <div style={{ display: 'flex', gap: '5px' }}>
                                                <button
                                                    onClick={() => {
                                                        setTextForm({ title: item.title, year: item.year, content: item.content });
                                                        setEditingTextId(item.id);
                                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                                    }}
                                                    style={{ color: '#2196F3', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                    title="Edit"
                                                >
                                                    ✎
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteTextProphecy(item.id)}
                                                    style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer', fontSize: '1.2rem' }}
                                                    title="Delete"
                                                >
                                                    🗑
                                                </button>
                                            </div>
                                        </div>
                                        <h5 style={{ margin: '5px 0', fontSize: '1rem' }}>{item.title}</h5>
                                        <p style={{ fontSize: '0.85rem', color: '#555', height: '60px', overflow: 'hidden' }}>{item.content}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Text Prophecy Form */}
                            <h5 style={{ margin: '10px 0' }}>{editingTextId ? 'Edit Text Card' : 'Add New Text Card'}</h5>
                            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                                <input
                                    type="text"
                                    placeholder="Title"
                                    value={textForm.title}
                                    onChange={(e) => setTextForm({ ...textForm, title: e.target.value })}
                                    style={{ flex: 2, padding: '8px', boxSizing: 'border-box', minWidth: 0 }}
                                />
                                <input
                                    type="text"
                                    placeholder="Year"
                                    value={textForm.year}
                                    onChange={(e) => setTextForm({ ...textForm, year: e.target.value })}
                                    style={{ flex: 1, padding: '8px', boxSizing: 'border-box', minWidth: 0 }}
                                />
                            </div>
                            <textarea
                                placeholder="Content..."
                                value={textForm.content}
                                onChange={(e) => setTextForm({ ...textForm, content: e.target.value })}
                                style={{ width: '100%', minHeight: '100px', padding: '10px', marginBottom: '10px', boxSizing: 'border-box' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="button" onClick={handleSaveTextProphecy} style={{ background: '#c41e3a', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', flex: 1 }}>
                                    {editingTextId ? 'Update Text Card' : 'Add Text Card'}
                                </button>
                                {editingTextId && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingTextId(null);
                                            setTextForm({ title: '', year: '2026', content: '' });
                                        }}
                                        style={{ background: '#666', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>

                        <hr style={{ margin: '20px 0', border: 'none', borderTop: '1px solid #ddd' }} />
                        <h4 style={{ margin: '0 0 15px 0' }}>Add New Video Prophecy</h4>

                        <input type="text" name="title" placeholder="Video Title" value={formData.title || ''} onChange={handleInputChange} required />
                        <input type="text" name="link" placeholder="YouTube Link (e.g. https://youtu.be/...)" value={formData.link || ''} onChange={handleInputChange} required />
                        <textarea name="description" placeholder="Description" value={formData.description || ''} onChange={handleInputChange} style={{ minHeight: '100px', resize: 'vertical', fontFamily: 'inherit', fontSize: '14px', lineHeight: '1.5', padding: '10px' }} />
                    </>
                );
            case 'profiles':
                return (
                    <>
                        <select name="id" value={formData.id || ''} onChange={handleInputChange} required disabled={editingId}>
                            <option value="">Select Profile to Update</option>
                            <option value="jaigurudev">Baba Jaigurudev Ji Maharaj</option>
                            <option value="umakant">Baba Umakant Ji Maharaj</option>
                        </select>
                        <input type="text" name="title" placeholder="Display Title" value={formData.title || ''} onChange={handleInputChange} required />
                        <textarea name="description" placeholder="Short Quote/Summary" value={formData.description || ''} onChange={handleInputChange} style={{ minHeight: '100px', resize: 'vertical' }} />
                        <label>Profile Photo: <input type="file" onChange={handleFileChange} /></label>
                    </>
                );
            case 'videoreview':
                return (
                    <>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '10px' }}>Editing transcript for: <strong>{formData.title}</strong></p>
                        <textarea name="transcript" placeholder="Enter video transcript..." value={formData.transcript || ''} onChange={handleInputChange} required style={{ minHeight: '300px', width: '100%', padding: '10px' }} />
                        {editingId && (
                            <button type="button" onClick={() => handleUpdateVideo(editingId, formData.transcript)} style={{ padding: '12px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Save & Review
                            </button>
                        )}
                    </>
                );
            case 'newsletter':
                return (
                    <>
                        <div style={{ background: '#e3f2fd', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #bbdefb', color: '#0d47a1' }}>
                            <strong>ℹ️ Broadcast Mode</strong><br />
                            Send a special email message to all subscribers. Use this sparingly for important announcements.
                            <br /><br />
                            <strong>Total Subscribers:</strong> {data.count || '0'}
                            {data.subscribers && data.subscribers.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => setShowSubscribersModal(true)}
                                    style={{ marginLeft: '15px', background: 'none', border: 'none', color: '#1a73e8', textDecoration: 'underline', cursor: 'pointer', padding: 0, fontWeight: 'bold' }}>
                                    View All Subscribers
                                </button>
                            )}
                        </div>

                        {/* SUB-LIST MODAL */}
                        {showSubscribersModal && (
                            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                                <div style={{ background: 'white', padding: '30px', borderRadius: '10px', maxWidth: '600px', width: '90%', maxHeight: '80vh', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>
                                        <h3 style={{ margin: 0, color: '#c41e3a' }}>Newsletter Subscribers</h3>
                                        <button onClick={() => setShowSubscribersModal(false)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#666' }}>&times;</button>
                                    </div>
                                    <div style={{ flex: 1, overflowY: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                            <thead style={{ background: '#f5f5f5', position: 'sticky', top: 0 }}>
                                                <tr>
                                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Email Address</th>
                                                    <th style={{ padding: '10px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>Subscribed On</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.subscribers.map((s, idx) => (
                                                    <tr key={idx} style={{ background: idx % 2 === 0 ? 'white' : '#fafafa' }}>
                                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{s.email}</td>
                                                        <td style={{ padding: '10px', borderBottom: '1px solid #eee' }}>{new Date(s.subscribed_at).toLocaleDateString()}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                        <button onClick={() => setShowSubscribersModal(false)} style={{ padding: '8px 16px', background: '#333', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close Window</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <label>Email Subject:</label>
                        <input type="text" name="subject" placeholder="Important Announcement from Jai Gurudev Ashram" value={formData.subject || ''} onChange={handleInputChange} required />

                        <label>Message Content:</label>
                        <textarea name="message" placeholder="Type your message here..." value={formData.message || ''} onChange={handleInputChange} required style={{ minHeight: '300px', padding: '10px', fontSize: '14px', lineHeight: '1.6' }} />

                        <button
                            type="button"
                            onClick={async () => {
                                if (!window.confirm(`Are you sure you want to send this broadcast to ALL ${data.count || 'subscribers'}?`)) return;

                                try {
                                    const token = localStorage.getItem('token');
                                    const res = await axios.post(`${BASE_URL}/api/newsletter/broadcast`,
                                        { subject: formData.subject, message: formData.message },
                                        { headers: { 'Authorization': `Bearer ${token}` } }
                                    );
                                    alert(res.data.message);
                                    setFormData({}); // Reset form
                                } catch (err) {
                                    console.error('Broadcast failed:', err);
                                    alert('Failed to send broadcast: ' + (err.response?.data?.message || err.message));
                                }
                            }}
                            style={{ padding: '15px', background: '#c41e3a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>
                            📤 Send Broadcast to All Subscribers
                        </button>
                    </>
                );
            default: return null;
        }
    };

    return (
        <div className="admin-dashboard" style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 0 20px rgba(0,0,0,0.1)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <h1 style={{ color: '#c41e3a', margin: 0 }}>Jai Gurudev CMS</h1>
                <button onClick={() => { localStorage.removeItem('token'); navigate('/admin-login'); }} style={{ background: '#333', color: 'white', padding: '8px 16px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Logout</button>
            </div>

            {/* TABS */}
            <div className="tabs" style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
                {['announcements', 'gallery', 'literature', 'prarthana', 'prophecies', 'downloads', 'profiles', 'videoreview', 'newsletter', 'settings'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{
                            padding: '10px 20px',
                            background: activeTab === tab ? '#c41e3a' : '#f0f0f0',
                            color: activeTab === tab ? 'white' : '#333',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                            flex: '1 1 auto'
                        }}
                    >
                        {tab === 'videoreview' ? 'Video Summaries' : tab === 'newsletter' ? '📧 Newsletter' : tab === 'settings' ? '⚙️ Settings' : tab}
                    </button>
                ))}
            </div>

            {/* Settings Panel - Show instead of CRUD when settings tab is active */}
            {activeTab === 'settings' ? (
                <div style={{ background: '#f9f9f9', padding: '30px', borderRadius: '8px', maxWidth: '500px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '25px', color: '#c41e3a' }}>🔐 Change Admin Password</h3>

                    {passwordMessage && (
                        <div style={{
                            padding: '10px 15px',
                            marginBottom: '20px',
                            borderRadius: '5px',
                            background: passwordMessage.includes('✅') ? '#d4edda' : '#f8d7da',
                            color: passwordMessage.includes('✅') ? '#155724' : '#721c24'
                        }}>
                            {passwordMessage}
                        </div>
                    )}

                    <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Current Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPasswords.current ? 'text' : 'password'}
                                    value={passwordData.currentPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px 40px 10px 10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                />
                                <button type="button" onClick={() => setShowPasswords(p => ({ ...p, current: !p.current }))}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888', padding: 0 }}
                                    title={showPasswords.current ? 'Hide password' : 'Show password'}
                                >{showPasswords.current ? '🙈' : '👁️'}</button>
                            </div>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPasswords.new ? 'text' : 'password'}
                                    value={passwordData.newPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    required
                                    minLength={8}
                                    style={{ width: '100%', padding: '10px 40px 10px 10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                />
                                <button type="button" onClick={() => setShowPasswords(p => ({ ...p, new: !p.new }))}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888', padding: 0 }}
                                    title={showPasswords.new ? 'Hide password' : 'Show password'}
                                >{showPasswords.new ? '🙈' : '👁️'}</button>
                            </div>
                            <small style={{ color: '#666' }}>Minimum 8 characters</small>
                        </div>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Confirm New Password</label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    type={showPasswords.confirm ? 'text' : 'password'}
                                    value={passwordData.confirmPassword}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    required
                                    style={{ width: '100%', padding: '10px 40px 10px 10px', borderRadius: '4px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                />
                                <button type="button" onClick={() => setShowPasswords(p => ({ ...p, confirm: !p.confirm }))}
                                    style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888', padding: 0 }}
                                    title={showPasswords.confirm ? 'Hide password' : 'Show password'}
                                >{showPasswords.confirm ? '🙈' : '👁️'}</button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            style={{
                                padding: '12px',
                                background: '#c41e3a',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                marginTop: '10px'
                            }}
                        >
                            Change Password
                        </button>
                    </form>
                </div>
            ) : (
                <div style={activeTab === 'newsletter' ? { display: 'block' } : { display: 'grid', gridTemplateColumns: '350px 1fr', gap: '40px' }}>
                    {/* ADD NEW FORM */}
                    <div className="form-section" style={{ background: '#f9f9f9', padding: '20px', borderRadius: '8px', height: 'fit-content', width: activeTab === 'newsletter' ? '100%' : 'auto' }}>
                        <h3 style={{ marginTop: 0, marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px' }}>
                            {activeTab === 'newsletter' ? '📢 Send Global Broadcast' : (editingId ? 'Edit' : 'Add') + ' ' + activeTab}
                        </h3>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {renderForm()}
                            {activeTab !== 'newsletter' && (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button type="submit" style={{ flex: 1, padding: '12px', background: '#c41e3a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                        {editingId ? 'Update Item' : 'Save Item'}
                                    </button>
                                    {editingId && (
                                        <button type="button" onClick={cancelEdit} style={{ padding: '12px', background: '#666', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            )}
                        </form>
                    </div>

                    {/* LIST VIEW */}
                    {(activeTab !== 'settings' && activeTab !== 'newsletter') && (
                        <div className="list-section">
                            <h3 style={{ marginTop: 0 }}>Existing Items</h3>
                            {loading ? <p>Loading...</p> : (
                                <div style={{ display: 'grid', gap: '15px' }}>
                                    {(activeTab === 'videoreview' ? [...data, ...automatedData] : data).map(item => (
                                        <div key={item.id} style={{ display: 'flex', alignItems: 'center', padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)', border: '1px solid #eee' }}>
                                            {/* THUMBNAIL */}
                                            {(item.thumbnail || item.src || item.image || (item.link && item.link.includes('youtube'))) && (
                                                <img
                                                    src={item.thumbnail || item.src || item.image || `https://img.youtube.com/vi/${item.link?.split('v=')[1]?.split('&')[0] || item.link?.split('/').pop()}/0.jpg`}
                                                    alt={item.title || item.alt}
                                                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '15px', border: '1px solid #ddd' }}
                                                    onError={(e) => { e.target.style.display = 'none' }}
                                                />
                                            )}

                                            {/* CONTENT */}
                                            <div style={{ flex: 1, maxWidth: '100%', overflow: 'hidden' }}>
                                                <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{item.title || item.alt || "Untitled"}</h4>
                                                <p style={{ margin: 0, fontSize: '0.85rem', color: '#666', whiteSpace: 'pre-wrap', wordBreak: 'break-word', maxHeight: '100px', overflow: 'hidden' }}>
                                                    {(item.transcript ? item.transcript.substring(0, 200) + (item.transcript.length > 200 ? '...' : '') : item.description || item.content?.substring(0, 150) + '...' || (item.year ? `Year: ${item.year}` : ''))}
                                                </p>
                                                {item.transcriptStatus && (
                                                    <span style={{ fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px', background: item.transcriptStatus === 'Approved' ? '#e8f5e9' : '#fff3e0', color: item.transcriptStatus === 'Approved' ? '#2e7d32' : '#ef6c00', marginTop: '5px', display: 'inline-block' }}>
                                                        {item.transcriptStatus}
                                                    </span>
                                                )}
                                            </div>

                                            {/* ACTIONS */}
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginLeft: '10px', minWidth: '100px' }}>
                                                {activeTab === 'videoreview' ? (
                                                    <>
                                                        <button onClick={() => handleFetchTranscript(item.id)} disabled={loading} style={{ background: loading ? '#ccc' : '#2196F3', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: loading ? 'not-allowed' : 'pointer', fontSize: '0.8rem' }}>
                                                            {loading ? 'Fetching...' : 'Get Transcript'}
                                                        </button>
                                                        <button onClick={() => handleEdit(item)} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                            Edit Transcript
                                                        </button>
                                                        {item.transcriptStatus === 'Draft' && (
                                                            <button onClick={() => handleApprove(item.id)} style={{ background: '#c41e3a', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem' }}>
                                                                Approve
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <button onClick={() => handleEdit(item)} style={{ background: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>
                                                            Edit
                                                        </button>
                                                        <button onClick={() => handleDelete(item.id)} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '4px', padding: '5px 10px', cursor: 'pointer' }}>
                                                            Delete
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {data.length === 0 && <p style={{ color: '#888', fontStyle: 'italic' }}>No items found. Add one on the left.</p>}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;