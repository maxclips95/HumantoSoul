import React from 'react';

const ShareButtons = ({ title, url }) => {
    const shareText = `Check out this prophecy: ${title}`;
    const shareUrl = url || window.location.href;

    return (
        <>
            <style>
                {`
                    .share-btn {
                        background-color: #c41e3a;
                        color: white !important;
                        padding: 6px 12px;
                        border-radius: 4px;
                        text-decoration: none;
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        font-weight: bold;
                        transition: background-color 0.3s, transform 0.2s;
                        font-size: 0.8rem;
                        margin-right: 8px;
                        margin-top: 8px;
                    }
                    .share-btn:hover {
                        background-color: #a01830;
                        transform: translateY(-2px);
                        color: #FFD700 !important;
                    }
                    .share-container {
                        display: flex;
                        flex-wrap: wrap;
                        margin-top: 10px;
                    }
                `}
            </style>
            <div className="share-container">
                <a href={`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`} target="_blank" rel="noopener noreferrer" className="share-btn" title="Share on WhatsApp">
                    <i className="fab fa-whatsapp" style={{ fontSize: '1rem' }}></i> WhatsApp
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="share-btn" title="Share on Facebook">
                    <i className="fab fa-facebook" style={{ fontSize: '1rem' }}></i> Facebook
                </a>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`} target="_blank" rel="noopener noreferrer" className="share-btn" title="Share on X">
                    <i className="fa-brands fa-x-twitter" style={{ fontSize: '1rem' }}></i> X
                </a>
                <a href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" className="share-btn" title="Share on Telegram">
                    <i className="fab fa-telegram" style={{ fontSize: '1rem' }}></i> Telegram
                </a>
            </div>
        </>
    );
};

export default ShareButtons;
