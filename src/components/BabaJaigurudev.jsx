// src/components/BabaJaigurudev.jsx
import React from 'react';

function BabaJaigurudev() {
    return (
        <section className="section">
            <h2 className="section-title">Baba Jaigurudev Ji Maharaj</h2>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <img 
                    src={`${process.env.PUBLIC_URL}/assets/images/baba-jaigurudev.jpg`} 
                    alt="Baba Jaigurudev Ji Maharaj" 
                    style={{ 
                        borderRadius: '50%', 
                        width: '200px', 
                        height: '200px', 
                        objectFit: 'cover',
                        marginBottom: '20px'
                    }} 
                />
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    "मनुष्य शरीर को साँसों की पूँजी दी गई है। जो गिनती की है, साँस ख़त्म होते ही शरीर गिर जायेगा और मनुष्य मर जायेगा"
                </p>
            </div>
            <div style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.6' }}>
                <p>
                    विश्व विख्यात परम सन्त बाबा जयगुरुदेव जी महाराज का जन्म भारत देश के उत्तर प्रदेश की पावन भूमि के एक छोटे से गाँव में हुआ। वर्ष के प्रति आश्चर्य व परमात्मा प्राप्ति का मार्ग जानने की इच्छा बाल्यावस्था से ही रही। बाल्यावस्था में ही इनके पिता का देहांत हो गया। भाताजी ने शरीर छोड़ने से पूर्व इनको अपनी अंतिम इच्छा के रूप में आदेश दिया कि प्रभु प्राप्ति का मार्ग अपने इंद्र को आरम्भ कर लेना।
                </p>
            </div>
        </section>
    );
}

export default BabaJaigurudev;