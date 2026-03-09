import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const SUPPORTED_LANGUAGES = ['en', 'hi', 'es', 'fr', 'de', 'zh', 'ja', 'ru', 'ar', 'pt'];

const LOCALE_MAP = {
    en: 'en_IN', hi: 'hi_IN', es: 'es_ES', fr: 'fr_FR', de: 'de_DE',
    zh: 'zh_CN', ja: 'ja_JP', ru: 'ru_RU', ar: 'ar_AE', pt: 'pt_BR'
};

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
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const currentLang = (i18n.language || 'en').split('-')[0].toLowerCase();

    // Normalize path to get the clean base path (strip existing language param)
    let cleanPath = location.pathname;
    const pathSegments = cleanPath.split('/').filter(Boolean);
    if (pathSegments.length > 0 && SUPPORTED_LANGUAGES.includes(pathSegments[0])) {
        cleanPath = '/' + pathSegments.slice(1).join('/');
    }
    if (cleanPath === '' || cleanPath === '//') cleanPath = '/';

    const siteTitle = 'Human to Soul | Jai Gurudev Mission';
    const fullTitle = title || siteTitle;
    const metaDescription = description || t('meta_description', 'Official website of Baba Jaigurudev and Baba Umakant Ji. Discover divine satsang, meditation (dhyan), prophecies, yog sadhna, inner peace, and the path from Human to Soul.');

    const siteUrl = 'https://www.humantosoul.com';
    const metaImage = image
        ? (image.startsWith('http') ? image : `${siteUrl}${image}`)
        : `${siteUrl}/assets/images/temple-bg.jpg`;

    // Determine the true URL of the current localized page
    const currentLangPath = currentLang === 'en' ? cleanPath : `/${currentLang}${cleanPath === '/' ? '' : cleanPath}`;
    const metaUrl = url
        ? (url.startsWith('http') ? url : `${siteUrl}${url}`)
        : `${siteUrl}${currentLangPath}`;

    const currentLocale = LOCALE_MAP[currentLang] || 'en_IN';

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

    // Inject active language into schema if provided
    let dynamicSchema = schema;
    if (dynamicSchema) {
        dynamicSchema = { ...dynamicSchema, inLanguage: currentLang };
    }

    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{fullTitle}</title>
            <meta name="description" content={metaDescription} />
            {keywords && <meta name="keywords" content={keywords} />}
            <meta name="author" content={author} />
            <link rel="canonical" href={metaUrl} />
            <meta name="robots" content={noIndex ? "noindex, nofollow" : "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"} />

            {/* Comprehensive International Hreflang Matrix */}
            {SUPPORTED_LANGUAGES.map(lang => {
                const langPath = lang === 'en' ? cleanPath : `/${lang}${cleanPath === '/' ? '' : cleanPath}`;
                return <link key={lang} rel="alternate" hreflang={lang} href={`${siteUrl}${langPath}`} />;
            })}
            <link rel="alternate" hreflang="x-default" href={`${siteUrl}${cleanPath}`} />

            {/* Geo Tags */}
            <meta name="geo.region" content="IN-MP" />
            <meta name="geo.placename" content="Ujjain, Madhya Pradesh, India" />

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
            <meta property="og:locale" content={currentLocale} />
            {/* Generate alternate locales */}
            {SUPPORTED_LANGUAGES.filter(l => l !== currentLang).map(lang => (
                <meta key={lang} property="og:locale:alternate" content={LOCALE_MAP[lang]} />
            ))}

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
            {dynamicSchema && (
                <script type="application/ld+json">
                    {JSON.stringify(dynamicSchema)}
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
