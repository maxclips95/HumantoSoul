import React, { useState } from 'react';

function Literature() {
    const [activeTab, setActiveTab] = useState('books');
    const [selectedBook, setSelectedBook] = useState(null);

    const books = [
        { id: 1, title: 'स्मारिका हिन्दी', image: 'https://via.placeholder.com/150?text=Book+1' },
        { id: 2, title: 'Smari ka', image: 'https://via.placeholder.com/150?text=Book+2' },
        { id: 3, title: 'सु पथ दर्शिका', image: 'https://via.placeholder.com/150?text=Book+3' },
        { id: 4, title: 'होली - प्रथम संस्करण', image: 'https://via.placeholder.com/150?text=Book+4' },
        { id: 5, title: 'जीव जीवन रक्षक भेदारा - 2024', image: 'https://via.placeholder.com/150?text=Book+5' },
        { id: 6, title: 'पर्वदर्शिका, स्मारिका', image: 'https://via.placeholder.com/150?text=Book+6' },
        { id: 7, title: 'मार्गदर्शक शांतिक भेदारा - 2023', image: 'https://via.placeholder.com/150?text=Book+7' },
        { id: 8, title: 'लोक परलोक निर्माण', image: 'https://via.placeholder.com/150?text=Book+8' }
    ];

    const faqs = [
        { question: 'क्या सन्तमार्ग किसी जाति या धर्म विशेष के मानने वाले लोगों के लिए है?', answer: 'बाबा उमाकान्त जी महाराज बताते हैं कि भगवान ने कोई जाति या धर्म नहीं बनाया, उसने तो केवल ईशान बनाया। सब मनुष्यों के शरीर के अंग, ड्यूरी, खून आदि एक ही जैसे होते हैं। इसी प्रकार सबके अंदर उस परमात्मा की आत्मा जीवात्मा भी एक ही जैसी है। तो जो जीवात्माओं को देखता है वह तो सबके प्रेम करता है। सबके महात्माओं के देवार में जाति-पाति, उच्च-नीच के भेदभाव को कोई स्थान नहीं दिया जाता है और महात्माओं के पास आकर हर जाति धर्म के लोग लाभ उठा सकते हैं। अतः नामदान लेने के लिए आपको अपना जाति धर्म नहीं छोड़ना है।' },
        { question: 'नामदान लेने के लिए क्या परहेज करना पड़ेगा ?', answer: 'परहेज करना पड़ेगा।' },
        { question: 'क्या अभिनवाइन या टेलीफोन से भी नामदान दिया जाता है?', answer: 'नहीं, नामदान टेलीफोन से नहीं दिया जाता है।' },
        { question: 'क्या नामदान लेने के लिए हिंदी भाषा आना जरूरी है ?', answer: 'हिंदी भाषा आना जरूरी नहीं है।' },
        { question: 'क्या नामदान लेने के लिए कोई फीस (रुपया-पैसा) देना पड़ता है?', answer: 'बाबा उमाकान्त जी महाराज नामदान देने की कोई फीस नहीं लेते हैं; यह बिल्कुल निःशुल्क दिया जाता है। महाराज जी कहते हैं कि आप अपनी सुखदायी को ही हमें दे जाओ, नहीं आपकी सबसे बड़ी दक्षिणा होगी। आपकी जरूरत से भी जीव हुआ है, वह अब नहीं होनी चाहिए।' }
    ];

    const openBook = (book) => {
        setSelectedBook(book);
    };

    const closeBook = () => {
        setSelectedBook(null);
    };

    return (
        <section className="section">
            <h2 className="section-title">Literature Published by Baba Jaigurudev Dharm Vikas Sanstha, Ujjain and Baba Jaigurudev Shabd Yog Vikas Sanstha, Lucknow</h2>
            
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                <button 
                    onClick={() => setActiveTab('books')} 
                    className="btn" 
                    style={{ marginRight: '10px', backgroundColor: activeTab === 'books' ? '#a0172e' : '#c41e3a' }}
                >
                    Books
                </button>
                <button 
                    onClick={() => setActiveTab('faqs')} 
                    className="btn" 
                    style={{ backgroundColor: activeTab === 'faqs' ? '#a0172e' : '#c41e3a' }}
                >
                    FAQs
                </button>
            </div>

            {activeTab === 'books' && (
                <div className="card-grid">
                    {books.map((book) => (
                        <div key={book.id} className="card" onClick={() => openBook(book)}>
                            <img src={book.image} alt={book.title} className="card-image" />
                            <div className="card-content">
                                <h3 className="card-title">{book.title}</h3>
                                <p className="card-text">जब न सूरज, न चाँद, न धरती, न आकाश, न हवा, न पानी था, तब सिर्फ एक ही शक्ति थी - परमात्मा। उन्हीं को सनातन धर्म में 'प्रभु', इस्लाम धर्म में 'इक', ईसा मसीह द्वारा 'पिता', और नान...</p>
                                <button className="card-btn">Read</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'faqs' && (
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    <h3 style={{ color: '#c41e3a', marginBottom: '20px' }}>FAQs</h3>
                    {faqs.map((faq, index) => (
                        <div key={index} style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <h4 style={{ color: '#c41e3a', marginBottom: '10px' }}>{faq.question}</h4>
                            <p>{faq.answer}</p>
                        </div>
                    ))}
                </div>
            )}

            {selectedBook && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                            <h3>{selectedBook.title}</h3>
                            <button onClick={closeBook} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}>×</button>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <img src={selectedBook.image} alt={selectedBook.title} style={{ maxWidth: '100%', marginBottom: '20px' }} />
                            <p>Content of {selectedBook.title} goes here...</p>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default Literature;