import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        year: '',
        title: '',
        description: '',
        file: null,
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/admin-login');
        }
    }, [navigate]);

    useEffect(() => {
        // Fetch existing announcements
        const fetchAnnouncements = async () => {
            try {
                const response = await axios.get('/api/announcements');
                setAnnouncements(response.data);
            } catch (error) {
                console.error('Error fetching announcements:', error);
            }
        };
        fetchAnnouncements();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('year', formData.year);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('file', formData.file);

        try {
            const response = await axios.post('/api/announcements', formDataToSend);
            setAnnouncements([...announcements, response.data]);
            setFormData({ year: '', title: '', description: '', file: null });
        } catch (error) {
            console.error('Error adding announcement:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/announcements/${id}`);
            setAnnouncements(announcements.filter((announcement) => announcement._id !== id));
        } catch (error) {
            console.error('Error deleting announcement:', error);
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            {/* Upload Form */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="year"
                    placeholder="Year"
                    value={formData.year}
                    onChange={handleInputChange}
                    required
                />
                <input
                    type="text"
                    name="title"
                    placeholder="Title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                ></textarea>
                <input
                    type="file"
                    name="file"
                    onChange={handleFileChange}
                    required
                />
                <button type="submit">Add Announcement</button>
            </form>

            {/* Announcements List */}
            <div className="announcements-list">
                {announcements.map((announcement) => (
                    <div key={announcement._id} className="announcement-item">
                        <h3>{announcement.title} ({announcement.year})</h3>
                        <p>{announcement.description}</p>
                        <a href={announcement.fileUrl} target="_blank" rel="noopener noreferrer">
                            View File
                        </a>
                        <button onClick={() => handleDelete(announcement._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;