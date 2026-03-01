import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    schema,
    author = 'Jai Gurudev Spiritual Mission',
    publishedDate,
    modifiedDate,
    breadcrumbs,
    noIndex = false
}) => {
    const siteTitle = 'Human to Soul | Jai Gurudev Mission';
    const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
    const metaDescription = description || 'Official website of Baba Jaigurudev and Baba Umakant Ji. Discover divine satsang, meditation (dhyan), prophecies, yog sadhna, inner peace, and the path from Human to Soul. बाबा जयगुरुदेव की भविष्यवाणियाँ, सत्संग, और ध्यान।';

    const siteUrl = 'https://www.humantosoul.com';
    const metaImage = image
        ? (image.startsWith('http') ? image : `${siteUrl}${image}`)
        : `${siteUrl}/assets/images/temple-bg.jpg`;
    const metaUrl = url
        ? (url.startsWith('http') ? url : `${siteUrl}${url}`)
        : siteUrl;

    // Build BreadcrumbList schema if breadcrumbs provided
    const breadcrumbSchema = breadcrumbs ? {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": breadcrumbs.map((crumb, index) => ({
            "@type": "ListItem",
            "position": index + 1,
            "name": crumb.name,
            "item": crumb.url
        }))
    } : null;

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />
            <link rel="canonical" href={metaUrl} />
            <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />

            {/* Language Alternates */}
            <link rel="alternate" hreflang="en" href={metaUrl} />
            <link rel="alternate" hreflang="hi" href={metaUrl} />
            <link rel="alternate" hreflang="x-default" href={metaUrl} />

            {/* Geo Tags */}
            <meta name="geo.region" content="IN-UP" />
            <meta name="geo.placename" content="Mathura, Uttar Pradesh, India" />

            {/* Open Graph / Facebook / WhatsApp / LinkedIn */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={metaDescription} />
            <meta property="og:image" content={metaImage} />
            <meta property="og:image:width" content="1200" />
            <meta property="og:image:height" content="630" />
            <meta property="og:image:alt" content={fullTitle} />
            <meta property="og:url" content={metaUrl} />
            <meta property="og:site_name" content="Human to Soul - Jai Gurudev Mission" />
            <meta property="og:locale" content="en_IN" />
            <meta property="og:locale:alternate" content="hi_IN" />
            {publishedDate && <meta property="article:published_time" content={publishedDate} />}
            {modifiedDate && <meta property="article:modified_time" content={modifiedDate} />}
            {type === 'article' && <meta property="article:author" content={author} />}
            {type === 'article' && <meta property="article:section" content="Spirituality" />}

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:site" content="@JaiGurudevM" />
            <meta name="twitter:creator" content="@JaiGurudevM" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={metaDescription} />
            <meta name="twitter:image" content={metaImage} />
            <meta name="twitter:image:alt" content={fullTitle} />

            {/* Structural Data (Schema.org) */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}

            {/* BreadcrumbList Schema */}
            {breadcrumbSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            )}
        </Helmet>
    );
};

export default SEO;
