import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const BASE_URL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const BookCard = ({ book, onReadMore }) => {
    const limit = 200; // Character limit for snippet
    const text = book.description || "";
    const isLong = text.length > limit;

    return (
        <div className="card" style={{ width: '100%', display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div className="card-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                {/* Optional Badge if we had a year or category */}
                <span className="year-badge" style={{ background: '#c41e3a', color: 'white', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-block', marginBottom: '15px', alignSelf: 'flex-start' }}>
                    Book
                </span>

                {/* Inline Image (Clean Style) */}
                <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'center' }}>
                    <img
                        src={`${BASE_URL}${book.image}`}
                        alt={book.title}
                        style={{ maxHeight: '180px', maxWidth: '100%', objectFit: 'contain', borderRadius: '4px' }}
                        onError={(e) => { e.target.style.display = 'none' }}
                    />
                </div>

                <h3 className="card-title" style={{ marginTop: '0', fontSize: '1.25rem', marginBottom: '10px', fontWeight: 'bold' }}>{book.title}</h3>

                <p className="card-text" style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', flex: 1, color: '#444' }}>
                    {isLong ? text.substring(0, limit) + "..." : text}
                </p>

                <div style={{ marginTop: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => onReadMore(book)}
                        style={{
                            background: '#c41e3a',
                            border: 'none',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Read More
                    </button>

                    {book.pdf && (
                        <a href={`${BASE_URL}${book.pdf}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <button style={{
                                background: 'transparent',
                                border: '1px solid #c41e3a',
                                color: '#c41e3a',
                                padding: '8px 16px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: 'bold'
                            }}>
                                Open PDF
                            </button>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

const BookModal = ({ book, onClose }) => {
    if (!book) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.9)', // Dark background
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

                <div style={{ marginTop: '40px', paddingBottom: '60px', display: 'flex', flexDirection: 'column', gap: '30px' }}>

                    {/* Modal Header */}
                    <div style={{ textAlign: 'center', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: '#fff' }}>
                            {book.title}
                        </h1>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', md: 'row', gap: '30px', alignItems: 'center' }}>
                        {/* Full Image */}
                        <div style={{ maxWidth: '300px', width: '100%', flexShrink: 0 }}>
                            <img
                                src={`${BASE_URL}${book.image}`}
                                alt={book.title}
                                style={{ width: '100%', borderRadius: '10px', boxShadow: '0 0 20px rgba(255,255,255,0.1)' }}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/150x200?text=Book' }}
                            />
                        </div>

                        {/* Full Description & Action */}
                        <div style={{ flex: 1 }}>
                            <div style={{
                                fontSize: '1.2rem',
                                lineHeight: '1.8',
                                whiteSpace: 'pre-wrap',
                                color: '#ddd',
                                marginBottom: '30px'
                            }}>
                                {book.description}
                            </div>

                            {book.pdf ? (
                                <a href={`${BASE_URL}${book.pdf}`} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                                    <button className="btn" style={{
                                        background: '#c41e3a',
                                        border: 'none',
                                        color: 'white',
                                        padding: '15px 40px',
                                        borderRadius: '30px',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        boxShadow: '0 4px 15px rgba(196, 30, 58, 0.4)'
                                    }}>
                                        READ BOOK (PDF) <span style={{ fontSize: '1.5rem' }}>📖</span>
                                    </button>
                                </a>
                            ) : (
                                <p style={{ color: '#888', fontStyle: 'italic' }}>PDF not available for reading online.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

function Literature() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const initialSearch = searchParams.get('search') || "";

    const [activeTab, setActiveTab] = useState('books');
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [searchTerm, setSearchTerm] = useState(initialSearch); // Initialize from URL

    useEffect(() => {
        setSearchTerm(initialSearch);
    }, [initialSearch]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await axios.get('/api/literature');
                if (response.data) {
                    setBooks(response.data);
                }
            } catch (error) {
                console.error('Error fetching literature:', error);
            }
        };
        fetchBooks();
    }, []);

    // Disable body scroll when modal is open
    useEffect(() => {
        if (selectedBook) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedBook]);

    const faqs = [
        {
            question: 'Is the path of saints meant for people of any particular caste or religion?',
            answer: 'Baba Umakant Ji Maharaj explains that God did not create any caste or religion. He only created human beings. Therefore, the path of saints (spiritual path) is for all of humanity, regardless of their caste, religion, sect, or country.'
        },
        {
            question: 'Are there any restrictions to take Naamdaan (initiation)?',
            answer: 'To take Naamdaan, it is essential to completely give up non-vegetarian food (eggs, fish, meat) and intoxicants (alcohol, beedi, cigarettes, tobacco, etc.). One should follow a pure, sattvic vegetarian diet.'
        },
        {
            question: 'Can Naamdaan be given via telephone or online?',
            answer: 'No, Naamdaan cannot be given over the phone or online. The seeker must be physically present or receive it in the presence of authorized saint (Baba Umakant Ji Maharaj ).'
        },
        {
            question: 'Is knowing Hindi mandatory to take Naamdaan?',
            answer: 'No, knowing Hindi is not mandatory. The main requirement is the desire for self-welfare and following the rules. Translations of the Satsang teachings are also available in other languages.'
        },
        {
            question: 'Is there any fee to take Naamdaan?',
            answer: 'Baba Umakant Ji Maharaj does not charge any fee for giving Naamdaan. It is an act of service and is provided completely free of cost.'
        },
        {
            question: 'What is the main objective of Jai Gurudev Dharm Pracharak Sanstha?',
            answer: 'The main objectives of the organization are: To instill good values in humanity, To create a vegetarian and intoxicant-free society, And to connect people with the true path to attaining God (Surat-Shabd Yoga).'
        }
    ];

    // Filter Logic
    const filteredBooks = books.filter(book =>
        book.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <section className="section literatures-section" style={{ padding: '0px' }}>

            {/* SEARCH BAR */}
            <div style={{ maxWidth: '600px', margin: '0 auto 30px', position: 'relative', padding: '0 20px' }}>
                <input
                    type="text"
                    placeholder="Search books by title or author..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '12px 20px',
                        fontSize: '16px',
                        borderRadius: '25px',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        outline: 'none'
                    }}
                />
                <i className="fas fa-search" style={{
                    position: 'absolute',
                    right: '40px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#888'
                }}></i>
            </div>

            {/* TABS */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '0 0 30px 0', gap: '20px' }}>
                <button
                    onClick={() => setActiveTab('books')}
                    className="btn"
                    style={{
                        backgroundColor: activeTab === 'books' ? '#c41e3a' : 'transparent',
                        color: activeTab === 'books' ? 'white' : '#c41e3a',
                        border: '2px solid #c41e3a',
                        fontWeight: 'bold',
                        padding: '10px 30px',
                        fontSize: '1.1rem'
                    }}
                >
                    Books
                </button>
                <button
                    onClick={() => setActiveTab('faqs')}
                    className="btn"
                    style={{
                        backgroundColor: activeTab === 'faqs' ? '#c41e3a' : 'transparent',
                        color: activeTab === 'faqs' ? 'white' : '#c41e3a',
                        border: '2px solid #c41e3a',
                        fontWeight: 'bold',
                        padding: '10px 30px',
                        fontSize: '1.1rem'
                    }}
                >
                    FAQs
                </button>
            </div>

            {/* BOOKS GRID */}
            {activeTab === 'books' && (
                <>
                    {books.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', marginTop: '30px' }}>No books available at the moment.</p>
                    ) : (
                        <div className="card-grid" style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                            gap: '20px',
                            maxWidth: '1300px',
                            margin: '0 auto',
                            padding: '0 20px 40px 20px'
                        }}>
                            {filteredBooks.map((book, index) => (
                                <BookCard
                                    key={book.id || index}
                                    book={book}
                                    onReadMore={setSelectedBook}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* FAQS */}
            {activeTab === 'faqs' && (
                <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px', padding: '0 20px' }}>
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <h2 style={{ color: '#c41e3a' }}>Frequently Asked Questions</h2>
                    </div>
                    {faqs.map((faq, index) => (
                        <div key={index} style={{
                            background: 'white',
                            borderRadius: '10px',
                            padding: '25px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                            borderLeft: '5px solid #c41e3a'
                        }}>
                            <h3 style={{
                                color: '#c41e3a',
                                marginBottom: '10px',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'flex-start'
                            }}>
                                <span style={{ marginRight: '10px', background: '#c41e3a', color: 'white', borderRadius: '50%', width: '25px', height: '25px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>Q</span>
                                {faq.question}
                            </h3>
                            <p style={{
                                color: '#555',
                                lineHeight: '1.6',
                                paddingLeft: '35px'
                            }}>
                                {faq.answer}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal */}
            {selectedBook && (
                <BookModal
                    book={selectedBook}
                    onClose={() => setSelectedBook(null)}
                />
            )}
        </section>
    );
}

export default Literature;