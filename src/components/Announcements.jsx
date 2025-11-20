import React, { useState, useEffect } from 'react';

function Announcements() {
    const [announcements, setAnnouncements] = useState([]);
    const [formData, setFormData] = useState({
        year: '',
        title: '',
        description: '',
        file: null,
    });
    const [filters, setFilters] = useState({
        program: '',
        year: '',
        type: '',
    });

    useEffect(() => {
        // Fetch announcements from backend (mocked for now)
        const fetchAnnouncements = async () => {
            const mockData = [
                { year: 2025, program: 'Program A', type: 'PDF', title: 'Announcement 1', description: 'Description 1', fileUrl: '#' },
                { year: 2024, program: 'Program B', type: 'Image', title: 'Announcement 2', description: 'Description 2', fileUrl: '#' },
            ];
            setAnnouncements(mockData);
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

    const handleSubmit = (e) => {
        e.preventDefault();
        setAnnouncements([...announcements, formData]);
        setFormData({ year: '', title: '', description: '', file: null });
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const filteredAnnouncements = announcements.filter((announcement) => {
        return (
            (!filters.program || announcement.program === filters.program) &&
            (!filters.year || announcement.year.toString() === filters.year) &&
            (!filters.type || announcement.type === filters.type)
        );
    });

    return (
        <div className="announcements">
            <h2>Announcements</h2>

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

            {/* Filters */}
            <div className="filters">
                <select name="program" onChange={handleFilterChange} value={filters.program}>
                    <option value="">Select Program</option>
                    <option value="Program A">Program A</option>
                    <option value="Program B">Program B</option>
                </select>
                <select name="year" onChange={handleFilterChange} value={filters.year}>
                    <option value="">Select Year</option>
                    <option value="2025">2025</option>
                    <option value="2024">2024</option>
                </select>
                <select name="type" onChange={handleFilterChange} value={filters.type}>
                    <option value="">Select Type</option>
                    <option value="PDF">PDF</option>
                    <option value="Image">Image</option>
                </select>
            </div>

            {/* Grid Layout */}
            <div className="grid">
                {filteredAnnouncements.map((announcement, index) => (
                    <div key={index} className="grid-item">
                        <h3>{announcement.title} ({announcement.year})</h3>
                        <p>{announcement.description}</p>
                        <a href={announcement.fileUrl} target="_blank" rel="noopener noreferrer">
                            View File
                        </a>
                    </div>
                ))}
            </div>

            {/* Pagination (Mocked for now) */}
            <div className="pagination">
                <button>Previous</button>
                <button>Next</button>
            </div>
        </div>
    );
}

export default Announcements;