import React from 'react';
import Gallery from '../components/Gallery';
import SEO from '../components/common/SEO';

export default function GalleryPage() {
    const gallerySchema = {
        "@context": "https://schema.org",
        "@type": "ImageGallery",
        "url": "https://www.humantosoul.com/gallery",
        "name": "Baba Jaigurudev Photo Gallery - Satsang, Ashram & Spiritual Events",
        "description": "Divine photo gallery of Baba Jaigurudev and Baba Umakant Ji — satsang events, ashram, spiritual gatherings, and devotional moments.",
        "author": { "@id": "https://www.humantosoul.com/#organization" },
        "publisher": { "@id": "https://www.humantosoul.com/#organization" }
    };
    return (
        <>
            <SEO
                title="Gallery - Baba Jaigurudev & Baba Umakant Satsang Photos & Spiritual Events"
                description="View the divine photo gallery of Baba Jaigurudev and Baba Umakant Ji — satsang events, Mathura ashram, spiritual gatherings, devotees, prayer ceremonies, and sacred moments. बाबा जयगुरुदेव की तस्वीरें और सत्संग गैलरी।"
                keywords="baba jaigurudev gallery, baba umakant gallery, satsang photos, ashram gallery, spiritual events, mathura ashram, jai gurudev photos, devotee photos, satsang events, spiritual gathering, prayer ceremony, baba ji photos, baba jaigurudev images, sant mat gallery, बाबा जयगुरुदेव गैलरी, सत्संग तस्वीरें"
                url="https://www.humantosoul.com/gallery"
                schema={gallerySchema}
                breadcrumbs={[
                    { name: "Home", url: "https://www.humantosoul.com/" },
                    { name: "Gallery", url: "https://www.humantosoul.com/gallery" }
                ]}
            />
            <Gallery />
        </>
    );
}