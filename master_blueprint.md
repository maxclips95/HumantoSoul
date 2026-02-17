# Master Blueprint: Jai Gurudev Website - How It Works

**Complete Technical Reference for Understanding the Application**

---

## 1. What Is This Application?

A spiritual website platform featuring:
- **Video Prophecies** with automatic Hindi-to-English transcripts
- **Admin CMS** for content management
- **Satvic Recipe System** with 300+ vegetarian recipes
- **Multi-language Support** (Hindi/English)
- **Literature Library** with downloadable PDFs
- **Contact Forms** and email integration

**Technology Stack**: React (Frontend) + Node.js/Express (Backend) + SQLite (Database)

---

## 2. System Architecture - How Components Connect

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                            │
│  http://localhost:3000 (React Frontend)                     │
└────────────────────┬────────────────────────────────────────┘
                     │ API Requests (axios)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              EXPRESS SERVER (Backend)                        │
│  http://localhost:5000 (Node.js + Express)                  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ REST API     │  │ Captions API │  │ Google       │     │
│  │ Endpoints    │  │ (Direct)     │  │ Translate    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │ SQL Queries
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              SQLite DATABASE                                 │
│  server/database.db (11 tables)                             │
│  - prophecies, automated_prophecies, highlights             │
│  - recipes, pledges, literature, gallery, etc.              │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Where Everything Lives - File Structure

```
jai_gurudev_clone/
│
├── .env                          # Configuration (ports, passwords, API keys)
├── package.json                  # Frontend dependencies (React, axios)
├── start_dev.ps1                 # Quick start script
│
├── server/                       # BACKEND
│   ├── server.js                 # Main server (1,244 lines)
│   ├── database.js               # Database initialization
│   ├── database.db               # SQLite data storage
│   ├── satvic_engine.js          # Recipe system logic
│   ├── package.json              # Backend dependencies (Express, yt-dlp)
│   └── uploads/                  # User-uploaded files (images, PDFs)
│
├── src/                          # FRONTEND
│   ├── App.js                    # Main React app with routing
│   ├── components/               # React components
│   │   ├── AdminDashboard.jsx    # CMS interface
│   │   ├── SatvicExplorer.jsx    # Recipe browser
│   │   ├── Prophecies.jsx        # Video grid
│   │   └── ...
│   └── styles/                   # CSS files
│
└── public/                       # Static assets
    └── images/                   # Local images
```

---

## 4. How Data Flows - Complete Request Lifecycle

### Example: User Clicks "Get Transcript" Button

**Step 1: Frontend (Browser)**
```javascript
// User clicks button in AdminDashboard.jsx
const response = await axios.post(`/api/videos/${videoId}/transcript`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});
```

**Step 2: Backend Receives Request**
```javascript
// server.js line ~1000
app.post('/api/videos/:id/transcript', verifyToken, async (req, res) => {
  const { id } = req.params;
  
  // Fetch transcript using yt-dlp
  const text = await fetchTranscriptText(id);
  
  // Save to database
  db.prepare('UPDATE automated_prophecies SET transcript = ? WHERE id = ?')
    .run(text, id);
  
  res.json({ transcript: text });
});
```

**Step 3: yt-dlp Extracts Captions**
```javascript
// server.js line ~500
async function fetchTranscriptText(youtubeId) {
  // 1. Fetch available tracks from YouTube's timedtext API
  const listUrl = `https://www.youtube.com/api/timedtext?v=${youtubeId}&type=list`;
  const tracks = await axios.get(listUrl);
  
  // 2. Locate Hindi (Manual or Automated)
  const targetTrack = tracks.find(t => t.lang === 'hi' || t.vssId === 'a.hi');
  
  // 3. Fetch actual timed text XML
  const transcriptXml = await axios.get(targetTrack.baseUrl);
  
  // 4. Parse text segments and clean XML tags
  const hindiText = cleanFormat(transcriptXml);
  
  // 5. Translate to English
  const englishText = await translateText(hindiText, 'en');
  
  // 6. Return bilingual format
  return `${hindiText} ||| ${englishText}`;
}
```

**Step 4: Database Stores Result**
```sql
UPDATE automated_prophecies 
SET transcript = 'Hindi text ||| English text', 
    transcriptStatus = 'Draft'
WHERE id = 'videoId';
```

**Step 5: Frontend Displays**
```javascript
// AdminDashboard.jsx updates state
setTranscript(response.data.transcript);
// User sees Hindi and English text side-by-side
```

---

## 5. How Key Features Work

### A. Automated Prophecy Sync

**What**: Automatically fetches new videos from YouTube channel every 2 days

**Where**: `server.js` lines 350-420

**How**:
1. **Cron Job** runs every 2 days: `cron.schedule('0 0 */2 * *', ...)`
2. **Fetches RSS Feed**: `https://www.youtube.com/feeds/videos.xml?channel_id=UCTP6TFqDUWMxobhpkFjgE0Q`
3. **Filters by Keywords**: ["भविष्यवाणी", "चेतावनी", "2025", "2026", "prophecy", etc.]
4. **Saves to Database**: `INSERT OR REPLACE INTO automated_prophecies ...`
5. **Preserves Existing Transcripts**: Doesn't overwrite manually edited content

### B. Translation System

**What**: Translates Hindi text to English using Google Translate API

**Where**: `server.js` lines 420-455

**How**:
1. **Chunks Text**: Splits into 1,500-character segments (URL length limit)
2. **Parallel Batching**: Processes 5 chunks simultaneously
3. **API Call**: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=...`
4. **Reassembles**: Joins translated chunks back together
5. **Returns**: Complete English translation

### C. Satvic Recipe System

**What**: 300+ vegetarian recipes with pledge tracking

**Where**: `server/satvic_engine.js` + `database.db` (recipes table)

**How**:
1. **Recipes Stored**: SQLite table with title, ingredients, steps, type
2. **API Endpoint**: `GET /api/satvic/recipes?type=breakfast`
3. **Filtering**: Server-side filtering by meal type
4. **Pledge System**: 
   - User submits pledge: `POST /api/satvic/pledge`
   - Stored in `pledges` table
   - Stats displayed: `GET /api/satvic/stats`

### D. Admin Authentication

**What**: Secure JWT-based login with bcrypt password hashing

**Where**: `server.js` lines 700-800

**How**:
1. **Login Request**: `POST /api/auth/login` with username/password
2. **Password Verification**: `bcrypt.compare(password, ADMIN_PASSWORD_HASH)`
3. **JWT Generation**: `jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' })`
4. **Token Storage**: Frontend stores in localStorage
5. **Protected Routes**: `verifyToken` middleware checks JWT on every request

---

## 6. How the Database Works

### Database: `server/database.db` (SQLite)

**11 Tables**:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `automated_prophecies` | YouTube videos (auto-synced) | id, title, link, transcript, transcriptStatus |
| `prophecies` | Manual video entries | id, title, link, transcript, summary |
| `highlights` | Prophecy text cards | id, title, year, content |
| `recipes` | Satvic recipes | id, title, ingredients, steps, type |
| `pledges` | User pledges | id, name, email, item, date |
| `announcements` | Site announcements | id, title, description, fileUrl |
| `gallery` | Image gallery | id, alt, src |
| `literature` | Books/PDFs | id, title, author, pdf, image |
| `prarthana` | Prayers | id, title, content |
| `profiles` | Master profiles | id, title, description, image |
| `downloads` | Downloadable resources | id, title, pdf, cdrFile, type |
| `newsletter_subscribers` | Email subscriptions | id, email, subscribed_at |

**How Queries Work**:
```javascript
// Example: Get all prophecies
const manual = db.prepare('SELECT * FROM prophecies').all();
const automated = db.prepare('SELECT * FROM automated_prophecies').all();

// Example: Add new recipe
db.prepare('INSERT INTO recipes (title, ingredients, steps, type) VALUES (?, ?, ?, ?)')
  .run(title, ingredients, steps, type);
```

---

## 7. How Transcript System Works (Current Implementation)

### Technology: Direct YouTube Captions API (Axios + Node.js)

**Why This Approach?**
- **Library-Free**: Removes dependency on third-party scrapers that often break.
- **Dependency-Free**: No need for Python or `yt-dlp` on the server (critical for Render Free Tier).
- **Fast & Reliable**: Fetches XML metadata directly from YouTube's internal `timedtext` service.
- **Hindi-First**: Specifically configured to find Manual Hindi and Automated Hindi tracks.

**Process Flow**:

```
1. User clicks "Get Transcript"
   ↓
2. Backend queries YouTube API for available language tracks:
   GET https://www.youtube.com/api/timedtext?v=ID&type=list
   ↓
3. Filter tracks for Manual Hindi ("hi") or Automated Hindi ("a.hi")
   ↓
4. Fetch full transcript XML in SRV3 format:
   GET https://www.youtube.com/api/timedtext?v=ID&lang=hi&fmt=srv3
   ↓
5. Parse XML segments and strip HTML/XML tags
   ↓
6. Translate to English using Google Translate API (Side-by-side view)
   ↓
7. Combine: "Hindi text ||| English text"
   ↓
8. Save to database & Return to frontend
```

**Critical: Non-Blocking Execution**
```javascript
// Uses async exec to prevent server freeze
```

---

## 8. How API Endpoints Work

### Public Endpoints (No Authentication)

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/api/health` | GET | Server status | `{ status: 'alive' }` |
| `/api/prophecies` | GET | All prophecies | `{ manual: [...], automated: [...] }` |
| `/api/satvic/recipes` | GET | Recipes (filterable) | `[{ title, ingredients, steps }]` |
| `/api/satvic/pledge` | POST | Submit pledge | `{ success: true }` |
| `/api/contact` | POST | Contact form | `{ message: 'sent' }` |
| `/api/newsletter/subscribe` | POST | Subscribe email | `{ success: true }` |
| `/api/newsletter/subscribers` | GET | List subscribers/count | `{ count, subscribers }` |
| `/api/newsletter/broadcast` | POST | Send manual broadcast | `{ successStatus: true }` |

### Protected Endpoints (Require JWT)

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/auth/login` | POST | Admin login | None (generates token) |
| `/api/videos/:id/transcript` | POST | Fetch transcript | JWT |
| `/api/prophecies` | POST | Create prophecy | JWT |
| `/api/prophecies/:id` | PUT | Update prophecy | JWT |
| `/api/prophecies/:id` | DELETE | Delete prophecy | JWT |

**How Authentication Works**:
```javascript
// 1. Login
POST /api/auth/login
Body: { username: 'admin', password: 'secret' }
Response: { token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }

// 2. Use token in subsequent requests
GET /api/videoreview
Headers: { Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' }

// 3. Server verifies token
const decoded = jwt.verify(token, JWT_SECRET);
// If valid, allow request. If invalid/expired, return 401
```

---

## 9. How the Frontend Works

### React Router Structure

```javascript
// src/App.js
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/prophecies" element={<Prophecies />} />
  <Route path="/literature" element={<Literature />} />
  <Route path="/satvic-lifestyle" element={<SatvicLifestyle />} />
  <Route path="/admin" element={<AdminDashboard />} />
  <Route path="/contact" element={<Contact />} />
</Routes>
```

**How Pages Load Data**:
```javascript
// Example: Prophecies.jsx
useEffect(() => {
  axios.get('/api/prophecies')
    .then(response => {
      setProphecies(response.data.manual);
      setAutomated(response.data.automated);
    });
}, []);
```

**How Admin Dashboard Works**:
1. User navigates to `/admin`
2. Login form appears if no token
3. After login, token stored in localStorage
4. Dashboard loads with tabs: Prophecies, Announcements, Gallery, etc.
5. Each tab makes authenticated API calls
6. CRUD operations update database via API

---

## 10. How to Run the Application

### Quick Start
```powershell
.\start_dev.ps1
```

**What This Does**:
1. Starts backend on port 5000
2. Starts frontend on port 3000
3. Opens browser to http://localhost:3000

### Manual Start

**Backend**:
```bash
cd server
npm install
npm start
```

**Frontend**:
```bash
npm install
npm start
```

### Required Environment Variables (.env)

```
SERVER_PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=bcrypt-hashed-password
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

---

## 11. How Dependencies Work

### Backend Dependencies (server/package.json)

| Package | Purpose | How It's Used |
|---------|---------|---------------|
| `express` | Web server | Handles HTTP requests/responses |
| `better-sqlite3` | Database | Stores all application data |
| `bcrypt` | Password hashing | Secures admin password |
| `jsonwebtoken` | Authentication | Generates/verifies JWT tokens |
| `multer` | File uploads | Handles image/PDF uploads |
| `node-cron` | Scheduling | Runs automated prophecy sync |
| `axios` | HTTP client | Makes external API calls |
| `nodemailer` | Email | Sends contact form emails |

### Python Dependencies

| Package | Purpose | How It's Used |
|---------|---------|---------------|
| `yt-dlp` | YouTube captions | Extracts video transcripts |

**Installation**: `pip install yt-dlp`

---

## 12. How Security Works

### 1. Password Security
- Passwords hashed with bcrypt (12 salt rounds)
- Never stored in plain text
- Compared using `bcrypt.compare()`

### 2. JWT Authentication
- 24-hour token expiration
- Signed with secret key
- Verified on every protected request

### 3. Rate Limiting
- General API: 100 requests per 15 minutes
- Login: 5 attempts per 15 minutes
- Contact form: 10 requests per hour

### 4. Account Lockout
- 5 failed login attempts = 30-minute lockout
- Tracked by IP address
- Logged to `security.log`

### 5. File Upload Security
- Blocked extensions: .js, .html, .php, .exe, .sh
- MIME type validation
- 10MB file size limit
- Filename sanitization

### 6. CORS Protection
- Only allows requests from localhost:3000 (dev) and production domains
- Credentials required for cross-origin requests

---

## 13. Current Status (January 28, 2026)

✅ **Fully Operational**

- **Transcript System**: Working via **Direct Captions API** (Axios-based, zero-library).
- **Hindi Priority**: Successfully fetching both Manual and Automated Hindi captions.
- **Server**: Non-blocking (async exec prevents freezing)
- **Frontend**: All pages loading correctly
- **Database**: 11 tables with 300+ recipes, 21 prophecies
- **Authentication**: JWT + bcrypt working
- **Email**: Contact form functional

**Version**: 2.0.0

---

## 14. Major Updates (Phase 2-4) - January 28, 2026

### A. Mobile App Experience (PWA) 📱
**What**: The website is now a Progressive Web App.
**Config**:
- `manifest.json`: Defines app name "JaiGurudev", icons, and standalone mode.
- `index.html`: Includes `<meta name="theme-color" content="#c41e3a">` for native feel.
**Benefit**: Users can "Install" the site on Android/iOS for offline access and fullscreen usage.

### B. Ultimate SEO Domination 🚀
**Goal**: Rank #1 for "Prophecies" and "Spiritual" keywords.
**Implementation**:
1.  **Sitemap.xml**: Automatically generated list of all routes for Google Bots.
2.  **Robots.txt**: Guides search engines to the sitemap.
3.  **JSON-LD Schema**: Structured data establishing "Organization" and "WebSite" authority.
4.  **Keyword Injection**: `Prophecies.jsx` now features a keyword-rich H1 and intro text targeting "Bhavishyavani" and "Satya Yuga".

### C. Literature Search Bar 🔍
**Feature**: Real-time filtering of books.
**Logic**:
- **State**: `searchTerm` tracks user input.
- **Filtering**: `books.filter()` checks both Title and Author.
- **UI**: Rounded search input with icon, located above tabs.

### D. Social Media Integration
**Where**: Footer
**Links**: WhatsApp Channel, YouTube, Facebook, Twitter, Instagram.

---

### E. UI/UX Polish & Refinements ✨
**Hero Section**:
- **Transparency**: Reduced content card opacity to `0.4` with `blur(20px)` to reveal the temple background.
- **Consistent Styling**: Unified "Visit the Ashram" text style to match "Naamdan" heading (Purple `#ad33ffff`, underlined).

**Footer Updates**:
- **Contact Info**: Updated phone numbers (+91 9754700200, 9575600700) and full ashram address.
- **Social Links**: Placeholder structure ready for official URLs.

---

### F. Infrastructure & Scaling Strategy 📈
**Email System Growth**:
- **Current (Dev)**: Uses Gmail SMTP (Limit: ~500 emails/day). Best for testing.
- **Stage 1 (Launch)**: **Brevo (formerly Sendinblue)**.
    - *Pros*: Free tier allows **300 emails/day** forever.
    - *Setup*: Simple SMTP credentials change in `.env`.
- **Stage 2 (Growth)**: **Amazon SES (Simple Email Service)**.
    - *Pros*: Extremely cheap (~$0.10 for 1,000 emails). Near "unlimited" scaling.
    - *Cons*: Requires domain verification and "production access" approval.
- **Why not "Unlimited Free"?**: True unlimited free email doesn't exist due to anti-spam costs. AWS SES is the industry standard for high-volume "OTP-style" delivery at minimal cost.

---

### G. Smart Email Architecture (Failover System) 🛡️
**Logic**: "Waterfall" Routing
**Implementation**: `server/email_service.js`
**Flow**:
1.  **Attempt 1**: Try **Brevo** (Free 300/day).
2.  **If Error**: Catch error, automatically switch to **SendGrid** (Free 100/day).
3.  **If Error**: Catch error, switch to **Gmail** (Backup).
4.  **Result**: Maximizes free quotas before failing.

---

**Provider Strategy ("The Switches")**:

| Priority | Provider Name | Free Limit | Why Use It? | Credential Key |
| :--- | :--- | :--- | :--- | :--- |
| **1. Primary** | **Brevo** | 300 / day | Best free daily limit. Reliable delivery. | `BREVO_USER`, `BREVO_PASS` |
| **2. Secondary** | **SendGrid** | 100 / day | Industry standard backup. | `SENDGRID_USER`, `SENDGRID_PASS` |
| **3. Backup** | **Gmail** | ~500 / day | Good for dev/testing, but risky for bulk. | `EMAIL_USER`, `EMAIL_PASS` |

*Note: The system automatically "switches" down this list if one fails.*

### H. Newsletter & Broadcast System 📧
**Architecture**:
- **Templates**: `server/templates/welcome_email.html` (Auto-reply) and `server/templates/broadcast_email.html` (Manual).
- **Manual Broadcast**:
    - **Admin UI**: New "Newsletter" tab in Admin Dashboard.
    - **Features**: Real-time subscriber count, "View All Subscribers" modal to prevent scrolling, and custom Subject/Message form.
    - **Greeting**: Clean "Dear," greeting (no generic "seeker" word).
- **Failover Logic**: Uses the Waterfall system (Brevo -> SendGrid -> Gmail) to ensure delivery even to large lists.

---

### I. Maintenance & Debugging 🛠️
**Stale Process Management**:
- The application uses `npm run dev` to start both servers.
- **Port Conflicts**: If port 5000 (Backend) or 3000 (Frontend) is blocked, use `taskkill /F /IM node.exe /T` to clear all stale processes before restarting.

---

*This document explains HOW the application works, WHERE each component lives, and WHAT each system does.*
*last update: February 17, 2026*

---

## 15. Major Updates (Phase 5) - February 17, 2026

### A. Accessibility: Universal Voice Assistant 🗣️
**What**: A global floating action button (FAB) that reads page content aloud.
**Technology**: **Web Speech API** (Zero-cost, browser-native).
**Key Features**:
1. **Global Integration**: Available on every page (`App.js`).
2. **Smart Language Detection**:
   - Detects if user translates page via Google Translate.
   - Automatically switches voice (e.g., Hindi text -> Hindi Voice, French -> French Voice).
   - **Fallback Logic**: If exact voice is missing, fuzzy-matches (e.g., "Google Hindi").
3. **Robustness**:
   - **Aggressive Loading**: "Force checks" voices every 500ms on load to prevent silence.
   - **Queue Management**: Clears speech queue before speaking to prevent "stuck" audio.
   - **User Feedback**: Alerts user if voice is legally unavailable on their device.

### B. Social Sharing System 🔗
**What**: Reusable `ShareButtons` component.
**Design**: Matches site navigation (Red background, white text, hover effects).
**Placement**:
- **Prophecy Detail Page**: Below the header.
- **Prophecies List Page**: On every card (allows sharing without opening).
**Platforms**: WhatsApp, Facebook, X (Twitter), Telegram.

### C. Content Formatting (Markdown) 📝
**What**: Implemented `react-markdown` for articles.
**Why**: Allows rich text (Bold `**`, Headings `##`) in Supabase articles to render correctly instead of showing raw symbols.

### D. Security Audit & Hardening 🛡️
**Status**: **100% Clean**.
**Actions Taken**:
1. **Vulnerability Fix**: Removed unused `node-nlp` usage which caused high-severity build warnings.
2. **Server Audit**: Verified 0 vulnerabilities in backend code.
3. **Build Tools**: Remaining warnings are strictly dev-dependencies (webpack/react-scripts) and do NOT affect production security.

