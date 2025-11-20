// src/components/VideoSeries.jsx
import React, { useState } from 'react';
import VideoModal from './VideoModal';

function VideoSeries() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentVideoId, setCurrentVideoId] = useState('');

    const topics = [
        { name: "Prarthana", videoId: "dQw4w9WgXcQ" },
        { name: "TV Episode", videoId: "dQw4w9WgXcQ" },
        { name: "Sadhn/Meditation", videoId: "dQw4w9WgXcQ" },
        { name: "Vakt Guru", videoId: "dQw4w9WgXcQ" },
        { name: "Guru Mahima", videoId: "dQw4w9WgXcQ" }
    ];

    const openVideo = (videoId) => {
        setCurrentVideoId(videoId);
        setIsModalOpen(true);
    };

    const closeVideo = () => {
        setIsModalOpen(false);
        setCurrentVideoId('');
    };

    return (
        <section className="section">
            <h2 className="section-title">Video Series by Topic</h2>
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                Here you can watch video series on different topics. Click on any topic to view the list of related Satsangs, TV episodes, or Prarthanas.
            </p>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', marginBottom: '40px' }}>
                {topics.map((topic, index) => (
                    <button 
                        key={index} 
                        className="btn" 
                        style={{ 
                            padding: '15px 30px', 
                            fontSize: '1.1rem',
                            backgroundColor: '#c41e3a',
                            border: 'none',
                            borderRadius: '10px',
                            cursor: 'pointer'
                        }}
                        onClick={() => openVideo(topic.videoId)}
                    >
                        <i className={`fas fa-play`} style={{ marginRight: '10px' }}></i>
                        {topic.name}
                    </button>
                ))}
            </div>

            {/* Video Modal */}
            <VideoModal 
                isOpen={isModalOpen} 
                onClose={closeVideo} 
                videoId={currentVideoId} 
            />
        </section>
    );
}

export default VideoSeries;