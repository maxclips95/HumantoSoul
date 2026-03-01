import React from 'react';
import Literature from '../components/Literature';
import SEO from '../components/common/SEO';

export default function LiteraturePage() {
    const literatureSchema = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "url": "https://www.humantosoul.com/literature",
        "name": "Spiritual Literature - Baba Jaigurudev Books, Sant Mat & Santmat Readings",
        "description": "Read and download spiritual literature, books, and satsang readings from Baba Jaigurudev Mission — covering Sant Mat, soul, God, meditation, inner peace, power, and prosperity.",
        "author": { "@id": "https://www.humantosoul.com/#organization" },
        "publisher": { "@id": "https://www.humantosoul.com/#organization" },
        "inLanguage": ["en", "hi"]
    };
    return (
        <>
            <SEO
                title="Spiritual Literature - Baba Jaigurudev Books, Sant Mat & Satsang Readings"
                description="Access the divine spiritual literature of Baba Jaigurudev Mission — books, satsang readings, Sant Mat scriptures, and teachings on soul (atma), God (parmatma), meditation (dhyan), inner peace, power, and prosperity. आध्यात्मिक साहित्य, बाबा जयगुरुदेव।"
                keywords="spiritual literature, spiritual books, sant mat books, santmat literature, baba jaigurudev books, satsang readings, dhyan, meditation, soul, atma, God, parmatma, inner peace, power, prosperity, yog sadhna, spiritual texts, Hindu scriptures, hindi spiritual books, spiritual knowledge, आध्यात्मिक साहित्य, संतमत, ज्ञान, पुस्तकें"
                url="https://www.humantosoul.com/literature"
                schema={literatureSchema}
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Literature", url: "https://www.humantosoul.com/literature" }
                ]}
            />
            <Literature />
        </>
    );
}