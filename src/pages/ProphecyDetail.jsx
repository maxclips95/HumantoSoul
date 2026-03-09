import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import axios from 'axios';
import SEO from '../components/common/SEO';
import ReactMarkdown from 'react-markdown';
import ShareButtons from '../components/common/ShareButtons';

// Strip HTML tags from a string for clean text rendering
function stripHtml(html) {
    if (!html) return '';
    return html.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim();
}

// Helper to clean messy YouTube descriptions
function formatCleanDescription(text) {
    if (!text) return '';
    let cleaned = text.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ');

    // Aggressively cut off the boilerplate template text
    // We look for the first occurrence of these common YouTube footer words
    const lowerCleaned = cleaned.toLowerCase();
    const cutoffTriggers = [
        'website /', 'website:', 'subscribe', 'subscribe youtube', 'subscribe:',
        'follow the', 'follow us', 'address of ashram', 'contact:',
        'google map location', 'youtube channel /'
    ];

    let earliestCutoff = cleaned.length;
    for (const trigger of cutoffTriggers) {
        const index = lowerCleaned.indexOf(trigger);
        if (index !== -1 && index < earliestCutoff) {
            earliestCutoff = index;
        }
    }

    // Cut the string at the template text
    cleaned = cleaned.substring(0, earliestCutoff).trim();

    // Final safety filter for any remaining hashtags or URLs in the intro
    cleaned = cleaned.split('\n')
        .map(line => line.trim())
        .filter(line => !line.includes('http://') && !line.includes('https://') && !line.includes('www.'))
        .filter(line => !line.startsWith('#'))
        // Look for purely keyword lines (no spaces, >15 chars)
        .filter(line => !(line.length > 15 && !line.includes(' ')))
        .join('\n')
        .trim();

    // Clean up excessive newlines
    cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
    return cleaned;
}

export default function ProphecyDetail() {
    const { id } = useParams();
    const { i18n } = useTranslation();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProphecy = async () => {
            try {
                const res = await axios.get(`/api/prophecies/${id}`);
                setItem(res.data);
            } catch (err) {
                console.error("Error loading prophecy:", err);
                setError("Prophecy not found or server error.");
            } finally {
                setLoading(false);
            }
        };
        fetchProphecy();
    }, [id]);

    if (loading) return <div style={{ textAlign: "center", padding: "50px" }}>Loading...</div>;
    if (error) return <div style={{ textAlign: "center", padding: "50px", color: "red" }}>{error}</div>;
    if (!item) return null;

    // Helper to split transcript if bilingual (Hindi ||| English)
    const hasTranscript = item.transcript && item.transcript.includes('|||');
    const hindiText = hasTranscript ? item.transcript.split('|||')[0] : item.transcript;
    const englishText = hasTranscript ? item.transcript.split('|||')[1] : null;

    // Clean description for display and SEO
    const seoDescription = stripHtml(item.description || item.summary || '');
    const displayDescription = formatCleanDescription(item.description || item.summary || '');

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', fontFamily: "'Segoe UI', sans-serif" }}>

            <SEO
                title={item.title}
                description={seoDescription.substring(0, 160) || "Spiritual prophecy and warning from Baba Jai Gurudev."}
                keywords={`prophecy, ${item.year || 'future'}, spiritual warning, jai gurudev`}
                image={item.thumbnail || item.image}
                type="article"
                schema={{
                    "@context": "https://schema.org",
                    "@type": "Article",
                    "headline": item.title,
                    "inLanguage": (i18n.language || 'en').split('-')[0],
                    "image": [
                        item.thumbnail ? (item.thumbnail.startsWith('http') ? item.thumbnail : `https://www.humantosoul.com${item.thumbnail}`) : "https://www.humantosoul.com/assets/images/temple-bg.jpg"
                    ],
                    "datePublished": item.year ? `${item.year}-01-01` : undefined,
                    "author": {
                        "@type": "Organization",
                        "name": "Jai Gurudev Spiritual Mission"
                    },
                    "publisher": {
                        "@type": "Organization",
                        "name": "Jai Gurudev Spiritual Mission",
                        "logo": {
                            "@type": "ImageObject",
                            "url": "https://www.humantosoul.com/favicon.ico"
                        }
                    }
                }}
            />

            <Link to="/prophecies" style={{ textDecoration: 'none', color: '#666', marginBottom: '20px', display: 'inline-block' }}>
                &larr; Back to Prophecies
            </Link>

            <article>
                <header style={{ marginBottom: '30px' }}>
                    {item.year && (
                        <span style={{
                            background: '#c41e3a',
                            color: 'white',
                            padding: '4px 8px',
                            borderRadius: '4px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}>
                            {item.year}
                        </span>
                    )}
                    <h1 style={{
                        marginTop: '15px',
                        fontSize: '2rem',
                        color: '#333',
                        lineHeight: '1.3'
                    }}>
                        {item.title}
                    </h1>
                    <ShareButtons title={item.title} />
                </header>

                {/* Watch Video Link */}
                {item.link && (
                    <div style={{ marginBottom: '20px' }}>
                        <a href={item.link} target="_blank" rel="noreferrer"
                            style={{ color: '#c41e3a', fontWeight: 'bold', fontSize: '1rem', textDecoration: 'none' }}>
                            ▶ Watch Video on YouTube →
                        </a>
                    </div>
                )}

                {/* Clean Description */}
                {displayDescription && (
                    <div style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#666', marginBottom: '30px', whiteSpace: 'pre-wrap', fontStyle: 'italic', borderLeft: '3px solid #eee', paddingLeft: '15px' }}>
                        "{displayDescription}"
                    </div>
                )}

                {/* Transcript Section — Visible by default for best UX and SEO! */}
                {item.transcript && (
                    <div style={{ marginTop: '30px' }}>
                        <h2 style={{ color: '#c41e3a', borderBottom: '2px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>
                            Full Transcript
                        </h2>
                        <div style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '8px', borderLeft: '4px solid #c41e3a' }}>
                            {hasTranscript ? (
                                <div style={{ display: 'grid', gridTemplateColumns: 'revert', gap: '30px' }} className="transcript-grid">
                                    <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap' }}>
                                        <div style={{ flex: '1 1 300px' }}>
                                            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#c41e3a' }}>हिंदी</h3>
                                            <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#333' }}>
                                                <ReactMarkdown>{hindiText}</ReactMarkdown>
                                            </div>
                                        </div>
                                        <div style={{ flex: '1 1 300px' }}>
                                            <h3 style={{ borderBottom: '1px solid #ddd', paddingBottom: '10px', color: '#c41e3a' }}>English</h3>
                                            <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#333' }}>
                                                <ReactMarkdown>{englishText}</ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ lineHeight: '1.8', fontSize: '1.05rem', color: '#333' }}>
                                    <ReactMarkdown>{item.transcript}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}
