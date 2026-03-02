# Master Blueprint: Jai Gurudev Website - How It Works

**Complete Technical Reference for Understanding the Application**

---

## 1. What Is This Application?

A spiritual website platform featuring:
- **Video Prophecies** with automatic Hindi-to-English transcripts
- **Admin CMS** for content management
- **Satvic Recipe System** with 300+ vegetarian recipes
- **Multi-language Support** (Hindi/English/Global)
- **Literature Library** with downloadable PDFs
- **Voice Assistant FAB** for accessibility
- **RAG Infrastructure** (Backend ready for AI Search)

**Technology Stack**: React (Frontend) + Node.js (Backend) + Supabase (Cloud Database)

---

## 2. System Architecture - How Components Connect

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                            │
│  https://humantosoul.onrender.com (React Frontend)          │
└────────────────────┬────────────────────────────────────────┘
                     │ API Requests (axios)
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              EXPRESS SERVER (Backend/Render)                 │
│  Node.js + Express                                           │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ REST API     │  │ YouTube      │  │ Google       │     │
│  │ (Auth/CRUD)  │  │ OAuth API    │  │ Translate    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │ Async Supabase SDK
                     ↓
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE (Cloud Database)                       │
│  PostgreSQL + Row-Level Security                            │
│  - Users, automated_prophecies, settings (tokens)           │
│  - Recipes, content_chunks (AI Search), Gallery, etc.       │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Where Everything Lives - File Structure

```
jai_gurudev_clone/
│
├── .env                          # Configuration (Supabase, YouTube API, OA)
├── package.json                  # Frontend dependencies
├── README.md                     # High-level overview
│
├── server/                       # BACKEND
│   ├── server.js                 # Main server (OAuth endpoints, API routes)
│   ├── database.js               # Supabase Client & DB helpers
│   ├── youtube_oauth.js          # YouTube Data API v3 Auth Logic
│   ├── chatbot.js                # AI RAG Chatbot logic
│   ├── search_engine.js          # Content sync & Search logic
│   ├── satvic_engine.js          # Recipe system logic
│   ├── package.json              # Backend dependencies (@supabase/supabase-js)
│   └── uploads/                  # User-uploaded files
│
├── src/                          # FRONTEND
│   ├── components/               
│   │   ├── AdminDashboard.jsx    # CMS + YouTube Connection Settings
│   │   ├── VoiceAssistant.jsx    # Global FAB TTS Assistant
│   │   ├── GlobalVoiceSearch.jsx # Fullscreen Voice UI
│   │   └── Chatbot.jsx           # AI Chat Interface
│   └── styles/                   
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
// server.js 
app.post('/api/videos/:id/transcript', verifyToken, async (req, res) => {
  const { id } = req.params;
  
  // Fetch transcript using YouTube OAuth API
  const text = await fetchTranscriptText(id);
  
  // Save to Supabase
  await db.updateWhere('automated_prophecies', 'id', id, { 
    transcript: text,
    transcriptStatus: 'Draft'
  });
  
  res.json({ transcript: text });
});
```

---

## 5. How Key Features Work

### A. Automated Prophecy Sync

**What**: Automatically fetches new videos from YouTube channel every 2 days

**How**:
1. **Cron Job** runs every 2 days: `cron.schedule('0 0 */2 * *', ...)`
2. **Fetches RSS Feed**: Official YouTube channel feed.
3. **Filters by Keywords**: ["भविष्यवाणी", "चेतावनी", "prophecy", etc.]
4. **Saves to Supabase**: Uses `upsert` logic to avoid duplicates.

### B. AI Voice Assistant (FAB) 🗣️

**What**: A floating action button that reads page content aloud.
**Technology**: Web Speech API.
**Features**:
- Automatically detects the language (even after Google Translate).
- Finds matching browser voices (Hindi, Spanish, etc.).
- "Stop/Play" control with visual feedback.

---

## 6. How the Database Works

### Database: Supabase (Cloud PostgreSQL)

**Key Tables**:

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | Admin credentials | username, password_hash, role |
| `settings` | System config/tokens | key, value (OAuth refresh tokens) |
| `automated_prophecies` | YouTube videos (auto-synced) | id, title, link, transcript, status |
| `content_chunks` | AI Search embeddings | id, content, embedding (JSON) |
| `recipes` | Satvic recipes | id, title, ingredients, steps, type |
| `pledges` | User pledges | id, name, email, item, date |

**How Queries Work (Async Supabase SDK)**:
```javascript
// Example: Get all prophecies
const { data: automated } = await db.raw.from('automated_prophecies').select('*');

// Example: Add new recipe
const newItem = await db.insert('recipes', { title, ingredients, steps, type });
```

---

## 7. How Transcript System Works (OAuth Integration)

### Technology: YouTube Data API v3 (OAuth 2.0)

**Why This Approach?**
- **Official & Authorized**: Complies with YouTube's Terms of Service.
- **Reliable**: Uses authenticated tokens to bypass rate limits.
- **Hindi-First**: Specifically scans for Hindi tracks.

**Process Flow**:

```
1. User clicks "Get Transcript"
   ↓
2. Backend checks Supabase 'settings' for refresh token
   ↓
3. Refreshes Access Token via Google OAuth2 client
   ↓
4. Calls Official YouTube API (captions.list)
   ↓
5. Downloads binary caption file and converts to text
   ↓
6. Translates to English using Google Translate API
   ↓
7. Save to Supabase (automated_prophecies table)
```

---

---

## 13. Current Status (v3.1.0)

✅ **Fully Operational (Cloud Native)**

- **Database**: 100% Migrated to **Supabase** (PostgreSQL).
- **Transcript System**: Working via **YouTube OAuth 2.0**.
- **Voice Assistant**: Global FAB + Voice Navigation implemented.
- **RAG Engine (Storage)**: Content is indexed in Supabase (OpenAI Embeddings).

---

## 14. Recent Enhancements (Premium UI & Technical SEO)

✅ **Landing Page Redesign & Doctrine Accuracy**
- Implemented a premium, cinematic Hero Section focused on "Inner Transformation" and "Purpose of Life".
- Restructured doctrinal messaging strictly highlighting Baba Jaigurudev Ji as Anami Purush and Baba Umakant Ji as the living Successor.
- Updated global mission statistics dynamically to `500M+ Naamdaan Initiated` across `600+ Years of Mission` (tracing back to Saint Kabir Das Ji).

✅ **Lineage of Sants (About Us Integration)**
- Integrated high-fidelity, user-provided images forming a continuous, stacked visual hierarchy representing the spiritual lineage leading to the Present Spiritual Master.

✅ **Navigation UX & Menu Restructure**
- Renamed "Downloads" to **"Programmes"** to better reflect ashram activities and events.
- Replaced "Prayer & Meditation" with **"Announcements"** on the main navigation bar.
- Removed "Announcements" from the "Mission" dropdown to prevent duplication.
- Repurposed the old "Blog" section entirely into **"Teachings"** (Spiritual Teachings & Prophecies).
- Completely decoupled Announcements from Teachings; they now function as standalone sections pulling from separate `/api/announcements` and `/api/prophecies` backend routes.
- Updated the Global Voice Search icon with an explicit **"AI Guide"** text label for clarity.
- Stripped inline emojis from top-level desktop navigation to create a cleaner, more professional header presentation.
- Deployed pure CSS hover combined with React State for dropdown interactions ("Mission" tab). Ensures absolute stability across both desktop pointers and mobile touch interfaces without requiring tab-key fallbacks.

✅ **Landing Page Polishing**
- Removed redundant CTA buttons ("Begin Meditation", "Explore the Path") from the top Cinematic Hero.
- Updated the bottom Cinematic CTA "Start Now" button to direct users explicitly to the `/contact` page.

✅ **Full-Scale Technical SEO Matrix**
- Injected strict JSON-LD Schema (WebSite, FAQPage, Organization, Person, ImageGallery).
- Configured dynamic meta tags, Hreflang alternates for global (en/hi) indexing, Geographic coordinates (geo.position), and automated `robots.txt`/`sitemap.xml` management.
- Hardened crawler fallbacks with `<noscript>` architecture to ensure pure HTML link-graphs remain visible to Googlebot.