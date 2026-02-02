# Jai Gurudev Website - Production Ready

## 🚀 Key Features

- **Admin Dashboard (CMS)**: Securely manage announcements, gallery, books, prayers, and prophecies.
- **Dual-Language Video Transcripts**: 
    - Hindi auto-captions fetched directly from YouTube.
    - Automated parallel translation to English for global audiences.
    - Side-by-side Hindi ||| English display for approved videos.
- **Multilingual Support**: Integrated Google Translate widget for instant access in 100+ languages.
- **Robust Security**: 
    - JWT (JSON Web Token) authentication with 24-hour expiry.
    - Stricter Rate Limiting on login (5 attempts / 15 mins).
    - **Persistent Security Logging**: All failed attempts and lockouts recorded to `server/security.log`.
    - Bcrypt password hashing (12 salt rounds).
- **Data Architecture**: High-performance **SQLite Database** (`database.db`) replacing legacy JSON storage.
- **Newsletter & Broadcast System**: 
    - Automated welcome emails for new subscribers.
    - **Manual Admin Broadcasts**: Send custom updates to all subscribers via the Admin Dashboard.
    - **Subscriber Management**: View total counts and full email list in a secure modal/popup.
    - Robust email delivery using prioritized "waterfall" logic (Brevo -> SendGrid -> Gmail).

## 🛠️ Tech Stack

- **Frontend**: React 18, Axios, i18next
- **Backend**: Node.js, Express, better-sqlite3
- **Security**: Helmet.js, express-rate-limit, jsonwebtoken, bcrypt
- **Database**: SQLite (SQL query-based)

## 🏁 Quick Start (Production)

To launch the website in production mode for the first time or after updates:

```powershell
.\start_production.ps1
```
This script will:
1. Build and optimize the React frontend.
2. Start the Node.js server to serve the site on **port 5000**.
3. Handle process cleanup automatically.

## ⚙️ Configuration

1. Create a `.env` file in the root directory.
2. Refer to the [.env.example](file:///c:/Users/Administrator/Desktop/jai_gurudev_clone/.env.example) file for the required variables.
3. Replace the placeholder values with your actual configuration.

## 📜 Maintenance

- **Backups**: Periodically copy `server/database.db` to a safe location.
- **Security Audit**: Check `server/security.log` to monitor failed login attempts and suspected hacking activity.

---
*Last Updated: January 20, 2026*
