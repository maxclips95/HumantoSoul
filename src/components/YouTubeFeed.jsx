// src/components/YouTubeFeed.jsx
import React, { useEffect, useState } from "react";
import VideoModal from "./VideoModal";
import ProphecySection from "./ProphecySection";
import ShareButtons from "./common/ShareButtons";
import "../styles.css";

export default function YouTubeFeed() {
  const [shorts, setShorts] = useState([]);
  const [full, setFull] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleShorts, setVisibleShorts] = useState(6);
  const [visibleFull, setVisibleFull] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const res = await fetch(`${window.API_BASE || ''}/api/youtube`);
        if (!res.ok) throw new Error('Failed to fetch videos');
        const data = await res.json();
        if (!isMounted) return;

        const shortsData =
          (data.shorts?.length
            ? data.shorts
            : data.full?.filter((v) =>
              v.title.toLowerCase().includes("short")
            )) || [];

        const fullData =
          (data.full?.length
            ? data.full.filter(
              (v) => !v.title.toLowerCase().includes("short")
            )
            : []) || [];

        setShorts(shortsData);
        setFull(fullData);
      } catch (err) {
        console.error("Error fetching YouTube feed:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openModal = (id) => setSelectedVideo(id);
  const closeModal = () => setSelectedVideo(null);

  if (loading) {
    return (
      <section className="section youtube-section">
        <h2 className="section-title" style={{ marginBottom: '20px' }}>Latest YouTube Videos</h2>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '200px'
        }}>
          <div style={{
            border: '5px solid #f3f3f3',
            borderTop: '5px solid #c41e3a',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            animation: 'spin 1s linear infinite'
          }}></div>
        </div>
      </section>
    );
  }

  return (
    <section className="section youtube-section">

      {/* ⭐ Channel button — now closer to slider */}
      <div className="channel-link channel-top-button">
        <a
          href="https://www.youtube.com/jaigurudevukm"
          target="_blank"
          rel="noreferrer"
        >
          Visit Official YouTube Channel →
        </a>
      </div>

      <ProphecySection />





      {selectedVideo && <VideoModal videoId={selectedVideo} onClose={closeModal} />}
    </section>
  );
}
