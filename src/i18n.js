import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation Resources for Major Global Languages
const resources = {
    en: {
        translation: {
            "nav_home": "Home",
            "nav_about": "About Us",
            "nav_santmat": "Santmat",
            "nav_baba_umakant": "Baba Umakant Ji Maharaj",
            "nav_baba_jaigurudev": "Baba Jaigurudev Ji Maharaj",
            "nav_announcements": "Announcements",
            "nav_gallery": "Gallery",
            "nav_literature": "Literature/FAQs",
            "nav_prarthana": "Prarthana",
            "nav_prophecies": "Prophecies",
            "nav_downloads": "Downloads",
            "nav_contact": "Contact",
            "common_read": "Read",
            "common_download": "Download"
        }
    },
    hi: {
        translation: {
            "nav_home": "होम",
            "nav_about": "हमारे बारे में",
            "nav_santmat": "संतमत",
            "nav_baba_umakant": "बाबा उमाकान्त जी महाराज",
            "nav_baba_jaigurudev": "बाबा जयगुरुदेव जी महाराज",
            "nav_announcements": "घोषणाएँ",
            "nav_gallery": "गैलरी",
            "nav_literature": "साहित्य/प्रश्न-उत्तर",
            "nav_prarthana": "प्रार्थना",
            "nav_prophecies": "भविष्यवाणियां",
            "nav_downloads": "डाउनलोड",
            "nav_contact": "संपर्क",
            "common_read": "पढ़ें",
            "common_download": "डाउनलोड करें"
        }
    },
    es: {
        translation: {
            "nav_home": "Inicio",
            "nav_about": "Sobre Nosotros",
            "nav_santmat": "Santmat",
            "nav_baba_umakant": "Baba Umakant Ji Maharaj",
            "nav_baba_jaigurudev": "Baba Jaigurudev Ji Maharaj",
            "nav_announcements": "Anuncios",
            "nav_gallery": "Galería",
            "nav_literature": "Literatura/FAQs",
            "nav_prarthana": "Oración",
            "nav_prophecies": "Profecías",
            "nav_downloads": "Descargas",
            "nav_contact": "Contacto",
            "common_read": "Leer",
            "common_download": "Descargar"
        }
    },
    fr: {
        translation: {
            "nav_home": "Accueil",
            "nav_about": "À Propos",
            "nav_santmat": "Santmat",
            "nav_baba_umakant": "Baba Umakant Ji Maharaj",
            "nav_baba_jaigurudev": "Baba Jaigurudev Ji Maharaj",
            "nav_announcements": "Annonces",
            "nav_gallery": "Galerie",
            "nav_literature": "Littérature/FAQs",
            "nav_prarthana": "Prière",
            "nav_prophecies": "Prophéties",
            "nav_downloads": "Téléchargements",
            "nav_contact": "Contact",
            "common_read": "Lire",
            "common_download": "Télécharger"
        }
    },
    de: {
        translation: {
            "nav_home": "Startseite",
            "nav_about": "Über Uns",
            "nav_santmat": "Santmat",
            "nav_baba_umakant": "Baba Umakant Ji Maharaj",
            "nav_baba_jaigurudev": "Baba Jaigurudev Ji Maharaj",
            "nav_announcements": "Ankündigungen",
            "nav_gallery": "Galerie",
            "nav_literature": "Literatur/FAQs",
            "nav_prarthana": "Gebet",
            "nav_prophecies": "Prophezeiungen",
            "nav_downloads": "Downloads",
            "nav_contact": "Kontakt",
            "common_read": "Lesen",
            "common_download": "Herunterladen"
        }
    },
    zh: {
        translation: {
            "nav_home": "首页",
            "nav_about": "关于我们",
            "nav_santmat": "圣人之路",
            "nav_baba_umakant": "Baba Umakant Ji Maharaj",
            "nav_baba_jaigurudev": "Baba Jaigurudev Ji Maharaj",
            "nav_announcements": "公告",
            "nav_gallery": "图库",
            "nav_literature": "文学/常见问题",
            "nav_prarthana": "祈祷",
            "nav_prophecies": "预言",
            "nav_downloads": "下载",
            "nav_contact": "联系我们",
            "common_read": "阅读",
            "common_download": "下载"
        }
    },
    ja: {
        translation: {
            "nav_home": "ホーム",
            "nav_about": "私たちについて",
            "nav_santmat": "サントマット",
            "nav_baba_umakant": "Baba Umakant Ji Maharaj",
            "nav_baba_jaigurudev": "Baba Jaigurudev Ji Maharaj",
            "nav_announcements": "お知らせ",
            "nav_gallery": "ギャラリー",
            "nav_literature": "文学/よくある質問",
            "nav_prarthana": "祈り",
            "nav_prophecies": "予言",
            "nav_downloads": "ダウンロード",
            "nav_contact": "お問い合わせ",
            "common_read": "読む",
            "common_download": "ダウンロード"
        }
    },
    ru: {
        translation: {
            "nav_home": "Главная",
            "nav_about": "О нас",
            "nav_santmat": "Сантмат",
            "nav_baba_umakant": "Баба Умакант Джи Махарадж",
            "nav_baba_jaigurudev": "Баба Джайгурудев Джи Махарадж",
            "nav_announcements": "Объявления",
            "nav_gallery": "Галерея",
            "nav_literature": "Литература/FAQ",
            "nav_prarthana": "Молитва",
            "nav_prophecies": "Пророчества",
            "nav_downloads": "Загрузки",
            "nav_contact": "Контакты",
            "common_read": "Читать",
            "common_download": "Скачать"
        }
    },
    ar: {
        translation: {
            "nav_home": "الرئيسية",
            "nav_about": "من نحن",
            "nav_santmat": "سانتمات",
            "nav_baba_umakant": "بابا أوماكانت جي مهراج",
            "nav_baba_jaigurudev": "بابا جايجوروديف جي مهراج",
            "nav_announcements": "إعلانات",
            "nav_gallery": "معرض الصور",
            "nav_literature": "الأدب / أسئلة وأجوبة",
            "nav_prarthana": "صلاة",
            "nav_prophecies": "النبوءات",
            "nav_downloads": "تنزيلات",
            "nav_contact": "اتصل بنا",
            "common_read": "اقرأ",
            "common_download": "تحميل"
        }
    },
    pt: {
        translation: {
            "nav_home": "Início",
            "nav_about": "Sobre Nós",
            "nav_santmat": "Santmat",
            "nav_baba_umakant": "Baba Umakant Ji Maharaj",
            "nav_baba_jaigurudev": "Baba Jaigurudev Ji Maharaj",
            "nav_announcements": "Anúncios",
            "nav_gallery": "Galeria",
            "nav_literature": "Literatura/FAQs",
            "nav_prarthana": "Oração",
            "nav_prophecies": "Profecias",
            "nav_downloads": "Downloads",
            "nav_contact": "Contato",
            "common_read": "Ler",
            "common_download": "Baixar"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
