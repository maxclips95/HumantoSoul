// src/components/YouTubeFeed.jsx
import React, { useEffect, useState } from "react";
import VideoModal from "./VideoModal";
import "../styles.css";

export default function YouTubeFeed() {
  const [shorts, setShorts] = useState([]);
  const [full, setFull] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleShorts, setVisibleShorts] = useState(6);
  const [visibleFull, setVisibleFull] = useState(6);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/youtube");
        const data = await res.json();

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
        <h2 className="section-title">Latest YouTube Videos</h2>
        <p style={{ textAlign: "center" }}>Loading videos...</p>
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

      {/* SHORTS */}
      {shorts.length > 0 && (
        <>
          <h2 className="section-title">Short Sandesh</h2>

          <div className="card-grid">
            {shorts.slice(0, visibleShorts).map((video) => (
              <div
                key={video.id}
                className="card"
                onClick={() => openModal(video.id)}
              >
                <img src={video.thumbnail} alt={video.title} className="card-img" />
                <div className="card-content">
                  <h3>{video.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {visibleShorts < shorts.length && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={() => setVisibleShorts((prev) => prev + 15)}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {/* FULL */}
      {full.length > 0 && (
        <>
          <h2 className="section-title">Satsang Videos & Clip</h2>

          <div className="card-grid">
            {full.slice(0, visibleFull).map((video) => (
              <div
                key={video.id}
                className="card"
                onClick={() => openModal(video.id)}
              >
                <img src={video.thumbnail} alt={video.title} className="card-img" />
                <div className="card-content">
                  <h3>{video.title}</h3>
                </div>
              </div>
            ))}
          </div>

          {visibleFull < full.length && (
            <div className="load-more-container">
              <button
                className="load-more-btn"
                onClick={() => setVisibleFull((prev) => prev + 15)}
              >
                Load More
              </button>
            </div>
          )}
        </>
      )}

      {selectedVideo && <VideoModal videoId={selectedVideo} onClose={closeModal} />}
    </section>
  );
}
