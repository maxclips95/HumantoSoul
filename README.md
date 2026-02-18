# Jai Gurudev Website - Production Ready

## 🚀 Key Features

- **Admin Dashboard (CMS)**: Securely manage announcements, gallery, books, prayers, and prophecies.
- **YouTube API Integration (OAuth 2.0)**: 
    - Reliable Hindi caption fetching using official YouTube Data API v3.
    - Requires one-time approval from the channel owner for perpetual access.
    - Automated parallel translation to English for global audiences.
- **AI Voice Assistant & Voice Search**:
    - **Global FAB**: Floating button that reads page content aloud in multiple languages.
    - **Voice Search**: Full-screen "Hands-Free" navigation—simply speak to go to any page.
    - **Polyglot Design**: Automatically switches voice accents based on the selected language.
- **Supabase Cloud Architecture**: 
    - High-performance, scalable cloud database replacing local SQLite.
    - Secure real-time data management.
- **Newsletter & Broadcast System**: 
    - Automated welcome emails and manual admin broadcasts.
    - Waterfall email logic (Brevo -> SendGrid -> Gmail) for maximum reliability.
- **AI Infrastructure (Backend)**: 
    - RAG-ready search engine using OpenAI embeddings for future indexing.

## 🛠️ Tech Stack

- **Frontend**: React 18, Axios, i18next, Web Speech API
- **Backend**: Node.js, Express, @supabase/supabase-js, googleapis
- **AI/search**: OpenAI API (Embeddings), Supabase Vector logic
- **Security**: JWT tokens, Helmet.js, express-rate-limit, bcryptjs
- **Database**: Supabase (PostgreSQL-based cloud DB)

## 🏁 Quick Start (Production)

To launch the website in production mode:

```powershell
.\start_production.ps1
```
This script builds the React frontend and starts the Node.js server to serve the site on **port 5000**.

## ⚙️ Configuration

1. Create a `.env` file in the root directory.
2. Refer to the [.env.example](file:///c:/Users/Administrator/Desktop/jai_gurudev_clone/.env.example) for required keys:
    - `SUPABASE_URL` & `SUPABASE_KEY`
    - `OPENAI_API_KEY`
    - `YOUTUBE_CLIENT_ID` & `YOUTUBE_CLIENT_SECRET`
    - Email provider credentials (Brevo/SendGrid)

## 📜 Maintenance

- **Backups**: Data is securely managed by Supabase; periodic SQL exports are recommended via the Supabase Dashboard.
- **YouTube Connection**: If captions stop fetching, re-connect the channel via Admin Dashboard > Settings.

---
*Last Updated: February 18, 2026*
