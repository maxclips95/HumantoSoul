import React, { useEffect, useState } from "react";
import axios from "axios";
import TranscriptModal from "../components/TranscriptModal";
import SEO from '../components/common/SEO';
import ShareButtons from '../components/common/ShareButtons';


const ReadingModal = ({ title, content, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'black',
      color: 'white',
      zIndex: 10000,
      overflowY: 'auto',
      padding: '40px 20px',
      display: 'flex',
      justifyContent: 'center'
    }}>
      <div style={{ maxWidth: '900px', width: '100%', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'fixed',
            top: '20px',
            right: '30px',
            background: 'none',
            border: '2px solid white',
            color: 'white',
            fontSize: '20px',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10001
          }}
        >
          ✕
        </button>

        <div style={{ marginTop: '40px', paddingBottom: '60px' }}>
          <h1 style={{
            marginTop: '20px',
            fontSize: '2.5rem',
            borderBottom: '1px solid #333',
            paddingBottom: '20px',
            marginBottom: '30px',
            lineHeight: '1.2'
          }}>
            {title}
          </h1>
          <div style={{
            fontSize: '1.2rem',
            lineHeight: '2',
            whiteSpace: 'pre-wrap',
            color: '#ddd'
          }}>
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};





export default function Prophecies() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [textProphecies, setTextProphecies] = useState([]); // Array for text cards
  const [showModal, setShowModal] = useState(false);
  const [selectedText, setSelectedText] = useState(null); // Selected item for modal
  const [selectedTranscript, setSelectedTranscript] = useState(null); // For transcript modal

  useEffect(() => {
    axios.get("/api/prophecies")
      .then((res) => {
        const data = res.data;
        // Handle both flat array (legacy) and nested structure
        let allItems = [];
        if (Array.isArray(data)) {
          allItems = data;
        } else {
          const manual = Array.isArray(data.manual) ? data.manual : [];
          const automated = Array.isArray(data.automated) ? data.automated : [];
          allItems = [...manual, ...automated];
        }

        // Deduplicate by Link (prefer Manual over Automated if link matches, or just keep first)
        const uniqueItems = [];
        const seenLinks = new Set();

        for (const item of allItems) {
          if (item.link && !seenLinks.has(item.link)) {
            uniqueItems.push(item);
            seenLinks.add(item.link);
          }
        }

        // Sort: videos with approved transcripts first, then others
        uniqueItems.sort((a, b) => {
          const aHasTranscript = a.transcriptStatus === 'Approved' ? 1 : 0;
          const bHasTranscript = b.transcriptStatus === 'Approved' ? 1 : 0;
          return bHasTranscript - aHasTranscript;
        });
        setItems(uniqueItems);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    // Fetch Text Prophecies (Array)
    axios.get("/api/prophecy-highlight")
      .then(res => {
        setTextProphecies(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error("Error fetching highlight:", err));
  }, []);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (showModal || selectedTranscript) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal, selectedTranscript]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50vh',
        flexDirection: 'column',
        color: '#c41e3a'
      }}>
        <div className="loader" style={{
          border: '4px solid #f3f3f3',
          borderTop: '4px solid #c41e3a',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ marginTop: '10px', fontSize: '1.1rem', fontWeight: '500' }}>Loading Prophecies...</p>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="2026 Prophecies & Time Change (Parivartan)"
        description="Baba Jai Gurudev's predictions on the coming Time Change (Yug Parivartan). Read about the cycle change from Kaliyug to Satyug and how to survive the transition."
        keywords="Satyug, Time Change, Yug Cycle Changing, Parivartan, Kaliyug to Satyug, Prophecies 2026, Jai Gurudev Predictions, World War 3 Prophecy"
      />
      <section className="section" style={{ padding: "10px 20px" }}>

        {/* SEO Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#c41e3a', fontSize: '2.5rem', marginBottom: '15px' }}>
            Jai Gurudev Prophecies & Future Predictions (Bhavishyavani)
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#555', maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
            Explore the profound <strong>spiritual warnings</strong> and <strong>future predictions</strong> of Baba Jai Gurudev.
            Understand the upcoming changes (Parivartan) and how to prepare for the <strong>Golden Age (Satya Yuga)</strong> through spiritual awakening and a Satvic lifestyle.
          </p>
        </div>

        {/* GLOBAL PROPHECY TEXT */}
        {/* TEXT PROPHECY GRID - 5 cards per row */}
        {textProphecies.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(5, 1fr)',
            gap: '15px',
            maxWidth: '1600px',
            margin: '0 auto 30px auto',
            padding: '0 10px'
          }}>
            {textProphecies.map(item => {
              const limit = 150;
              const isLong = item.content.length > limit;
              return (
                <div key={item.id} style={{
                  background: '#fff',
                  padding: '20px',
                  borderRadius: '8px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  border: '1px solid #f0f0f0'
                }}>
                  <span style={{
                    background: '#c41e3a',
                    color: 'white',
                    padding: '3px 8px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                    alignSelf: 'flex-start',
                    marginBottom: '10px'
                  }}>
                    {item.year || '2026'}
                  </span>
                  <h3 style={{ margin: '0 0 10px 0', fontSize: '1.2rem', color: '#333', lineHeight: '1.25' }}>
                    {item.title}
                  </h3>
                  <p style={{
                    color: '#555',
                    fontSize: '0.95rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    flex: 1,
                    marginBottom: '15px'
                  }}>
                    {isLong ? item.content.substring(0, limit) + "..." : item.content}
                  </p>
                  {isLong && (
                    <button
                      onClick={() => { setSelectedText(item); setShowModal(true); }}
                      style={{
                        background: '#c41e3a',
                        color: 'white',
                        border: 'none',
                        padding: '6px 14px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        alignSelf: 'flex-start',
                        fontSize: '0.85rem'
                      }}
                    >
                      Read More
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {showModal && selectedText && (
          <ReadingModal
            title={selectedText.title}
            content={selectedText.content}
            onClose={() => setShowModal(false)}
          />
        )}

        {/* JSON BASED PROPHECY CARDS */}
        <div className="card-grid" style={{ marginTop: "0px" }}>
          {items.map((item, index) => (
            <div key={index} className="card" style={{ position: "relative" }}>
              {item.year && (
                <div
                  className="year-badge"
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#c41e3a",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    fontWeight: "bold",
                    zIndex: 1,
                  }}
                >
                  {item.year}
                </div>
              )}
              {item.thumbnail ? (
                <a href={item.link} target="_blank" rel="noreferrer">
                  <img src={item.thumbnail} alt={item.title} className="card-img" />
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(196, 30, 58, 0.8)',
                    borderRadius: '50%',
                    width: '50px',
                    height: '50px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '24px'
                  }}>▶</div>
                </a>
              ) : item.image && (
                <img src={item.image} alt={item.title} className="card-img" />
              )}

              <div className="card-content">
                <h3 className="prophecy-title">{item.title}</h3>
                <div
                  className="prophecy-text"
                  style={{ lineHeight: "1.5", color: "#333", whiteSpace: "pre-wrap" }}
                >
                  {item.transcriptStatus === 'Approved' && item.transcript ? (
                    <>
                      {item.transcript.includes('|||') ? (
                        <>
                          {/* Preview - First 150 chars of each */}
                          <div style={{ marginBottom: '10px' }}>
                            <em style={{ fontSize: '0.8rem', color: '#c41e3a', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>हिंदी:</em>
                            <span style={{ fontSize: '0.9rem', color: '#555' }}>
                              {item.transcript.split('|||')[0].trim().substring(0, 150)}...
                            </span>
                          </div>
                          <div style={{ marginBottom: '12px' }}>
                            <em style={{ fontSize: '0.8rem', color: '#c41e3a', fontWeight: 'bold', display: 'block', marginBottom: '3px' }}>English:</em>
                            <span style={{ fontSize: '0.9rem', color: '#555' }}>
                              {item.transcript.split('|||')[1].trim().substring(0, 150)}...
                            </span>
                          </div>
                          <button
                            onClick={() => setSelectedTranscript({
                              title: item.title,
                              hindi: item.transcript.split('|||')[0].trim(),
                              english: item.transcript.split('|||')[1].trim(),
                              link: item.link
                            })}
                            style={{
                              background: '#c41e3a',
                              color: 'white',
                              border: 'none',
                              padding: '8px 16px',
                              borderRadius: '5px',
                              cursor: 'pointer',
                              fontWeight: 'bold',
                              fontSize: '0.85rem'
                            }}
                          >
                            📖 Read Full Transcript
                          </button>
                        </>
                      ) : (
                        <span style={{ display: 'block', fontSize: '0.9rem' }}>
                          {item.transcript.substring(0, 200)}...
                        </span>
                      )}
                    </>
                  ) : (item.text || item.description?.substring(0, 100) + "...")}
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#c41e3a', fontWeight: 'bold', textDecoration: 'none', display: 'block', marginTop: '10px' }}
                  >
                    Watch Video →
                  </a>
                )}
                <ShareButtons title={item.title} url={item.link ? item.link : `https://www.humantosoul.com/prophecy/${item.id}`} />
              </div>
            </div>
          ))}
        </div>

        {/* Transcript Modal */}
        {selectedTranscript && (
          <TranscriptModal
            title={selectedTranscript.title}
            hindiText={selectedTranscript.hindi}
            englishText={selectedTranscript.english}
            videoLink={selectedTranscript.link}
            onClose={() => setSelectedTranscript(null)}
          />
        )}

      </section>
    </>
  );
}
