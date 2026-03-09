const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const cron = require('node-cron');
const fetch = require('node-fetch');
const xml2js = require('xml2js');
const multer = require('multer');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken'); // Added for secure auth
const bcrypt = require('bcryptjs'); // Pure JS Password hashing
const emailService = require('./email_service'); // Smart Multi-Provider Email System
const axios = require('axios');
const nodemailer = require('nodemailer');
const { db, initializeDatabase } = require('./database');
const youtubeOAuth = require('./youtube_oauth'); // YouTube OAuth Module

// Initialize Database
initializeDatabase();


// JWT Secret - MUST be set in .env for production
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-in-production-xyz789';

// Environment check
const isProduction = process.env.NODE_ENV === 'production';

// Production-safe logger (only logs in development or for warnings/errors)
const logger = {
  info: (...args) => !isProduction && console.log('[INFO]', ...args),
  warn: (...args) => console.warn('[WARN]', ...args),
  error: (...args) => console.error('[ERROR]', ...args),
  debug: (...args) => !isProduction && console.log('[DEBUG]', ...args)
};

// Security Logger Helper
const securityLogPath = path.join(__dirname, 'security.log');
const logSecurityEvent = (ip, event, details = '') => {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] IP: ${ip} | EVENT: ${event} | DETAILS: ${details}\n`;
    // Only attempt to write if we are NOT in production (Render disk is ephemeral/read-only often)
    // OR if we specifically want to log to console in production
    if (isProduction) {
      console.log(`[SECURITY] IP: ${ip} | EVENT: ${event} | DETAILS: ${details}`);
    } else {
      fs.appendFile(securityLogPath, logEntry, (err) => {
        if (err) logger.error('Failed to write to security log:', err.message);
      });
    }
  } catch (err) {
    console.error('Security Logger Failed:', err.message);
  }
};

const app = express();

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const logMsg = `[Global] ${req.method} ${req.url} - Status: ${res.statusCode} - Origin: ${req.get('origin')} - Duration: ${Date.now() - start}ms\n`;
    try { fs.appendFileSync('pledge_debug.log', logMsg); } catch (e) { }
  });
  next();
});

logger.info("-----------------------------------------");
logger.info("   JAI GURUDEV SERVER - MULTI-TEXT V2    ");
logger.info("-----------------------------------------");
logger.info(`Environment: ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);

const PORT = process.env.PORT || 5000;

// Simplified logging to stdout for Render Dashboard
const logToMemory = (type, message, details = '') => {
  // Directly log to console so it appears in Render logs
  console.log(`[${type}] ${message} ${details ? '| ' + details : ''}`);
};



app.set('trust proxy', 1); // Trust first proxy (needed for rate limiting behind proxy)

// HTTPS Redirect in Production (Skip for localhost)
// HTTPS Redirect in Production (Skip for localhost)
// if (process.env.NODE_ENV === 'production') {
//   app.use((req, res, next) => {
//     // Check if running on localhost
//     if (req.headers.host && req.headers.host.includes('localhost')) {
//       return next();
//     }
// 
//     if (req.headers['x-forwarded-proto'] !== 'https') {
//       return res.redirect(301, `https://${req.headers.host}${req.url}`);
//     }
//     next();
//   });
// }

// Security Middleware with Content Security Policy
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "blob:",
        "data:",
        "https://*.google.com",
        "https://*.googleapis.com",
        "https://*.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      connectSrc: [
        "'self'",
        "https://*.google.com",
        "https://*.googleapis.com",
        "https://*.youtube.com",
        "https://*.gstatic.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://*.google.com",
        "https://*.googleapis.com",
        "https://*.gstatic.com",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",
        "http://i.ytimg.com",
        "https://i.ytimg.com",
        "https://*.google.com",
        "https://*.gstatic.com"
      ],
      frameSrc: [
        "'self'",
        "https://*.google.com",
        "https://*.googleapis.com",
        "https://*.youtube.com",
        "https://youtube.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ]
    }
  },
  referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

// Rate Limiting (Prevent Brute Force - General API)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Stricter Rate Limiting for Login (Prevent Password Brute Force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Only 5 login attempts per 15 minutes
  message: 'Too many login attempts. Please try again after 15 minutes.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Track failed login attempts (in-memory, resets on server restart)
const failedLoginAttempts = new Map();

// CORS Configuration (Strict for Production)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'https://www.humantosoul.com',
  'https://humantosoul.com',
  'https://humantosoul.com',
  'https://www.humantosoul.com',
  process.env.PRODUCTION_URL
].filter(Boolean);
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, server-to-server)
    if (!origin) return callback(null, true);

    // Development: Allow any localhost
    if (origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')) {
      return callback(null, true);
    }

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      logger.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(bodyParser.json({ limit: '10mb' })); // Increased to 10MB as requested
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
const CHANNEL_ID = 'UCTP6TFqDUWMxobhpkFjgE0Q';
const RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

// Health check to verify AI summarization system is synced
app.get('/api/health', (req, res) => {
  res.json({ status: 'alive', version: 'summarizer-v4-synced', timestamp: new Date().toISOString() });
});

// Contact Form Rate Limiter
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 contact requests per hour
  message: 'Too many contact requests from this IP, please try again later.'
});

// Contact Form Endpoint
app.post('/api/contact', contactLimiter, async (req, res) => {
  const { fullName, email, phoneNumber, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required' });
  }

  // Check if email is configured
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    logger.warn('Contact form submitted but email not configured in .env');
    // We still return success to the user so they don't see an error, but we log it
    return res.json({ message: 'Message received (Email not configured, check server logs)' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO || process.env.EMAIL_USER,
      subject: `New Contact Form Submission from ${fullName}`,
      text: `
        Name: ${fullName}
        Email: ${email}
        Phone: ${phoneNumber || 'Not provided'}
        
        Message:
        ${message}
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    logger.error('Email sending failed:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

// Data and Uploads Directories
const UPLOADS_DIR = path.join(__dirname, 'uploads');

// Ensure uploads directory exists
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// Database is initialized above.


// Secure uploads directory - block dangerous file types and add security headers
app.use('/uploads', (req, res, next) => {
  const blockedExtensions = ['.js', '.html', '.htm', '.php', '.exe', '.sh', '.bat', '.cmd', '.ps1'];
  const ext = path.extname(req.path).toLowerCase();

  if (blockedExtensions.includes(ext)) {
    return res.status(403).json({ message: 'Access denied' });
  }

  // Prevent browsers from executing uploaded files as scripts
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', 'inline');

  next();
}, express.static(UPLOADS_DIR)); // Serve uploaded files

// Multer Setup for File Uploads with Type Validation
const ALLOWED_MIME_TYPES = [
  // Standard web images
  'image/jpeg', 'image/png', 'image/gif', 'image/webp',
  // Professional image formats
  'image/tiff', 'image/bmp', 'image/svg+xml',
  // Apple HEIC/HEIF (iPhone, iPad)
  'image/heic', 'image/heif',
  // RAW camera formats (Canon, Nikon, Sony, Fuji, etc.)
  'image/x-canon-cr2', 'image/x-canon-cr3', 'image/x-canon-crw',
  'image/x-nikon-nef', 'image/x-sony-arw', 'image/x-fuji-raf',
  'image/x-olympus-orf', 'image/x-panasonic-rw2', 'image/x-pentax-pef',
  'image/x-adobe-dng', 'image/x-kodak-dcr', 'image/x-kodak-kdc',
  // Documents
  'application/pdf',
  // CorelDRAW
  'application/x-cdr', 'application/cdr', 'image/x-coreldraw'
];
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    // Sanitize filename to prevent path traversal
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, Date.now() + '-' + safeName);
  }
});
const fileFilter = (req, file, cb) => {
  if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    logger.warn(`Blocked upload: ${file.mimetype} not allowed`);
    cb(new Error('File type not allowed. Only images, PDFs, and CDR files are accepted.'), false);
  }
};
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

// --- YOUTUBE AUTOMATION (Updated) ---
const FEATURED_SHORTS = [
  { id: 'ajOPYYrIn4E', title: 'वर्ष 2026 में क्या-क्या तकलीफें आएंगी? #prophecy' },
  { id: 'vWUndyeGTzQ', title: 'कौन से देश बचेंगे और कौन विश्व के नक्शे में नहीं रहेंगे?' },
  { id: 'XQh9YdUeMlw', title: 'भविष्यवाणी: आने वाले समय का संकेत' },
  { id: 'MwSeMMlkFUs', title: 'कुर्सी के लिए लड़ाई और विश्वयुद्ध की चेतावनी' },
  { id: 'AbHnYosItd4', title: 'आने वाले समय की चेतावनी #shorts' },
  { id: '7j8p9qRrSsT', title: 'महाविनाश से कैसे बचें? #babaumakantjimaharaj' }
];

const PROPHECY_KEYWORDS = ["भविष्यवाणी", "चेतावनी", "संदेश", "आगाही", "कलयुग", "सतयुग", "2025", "2026", "बचेंगे", "लड़ाई", "विनाश", "संदेश", "आगाही", "short", "shorts", "prophecy", "prediction"];

async function fetchYouTubeProphecies() {
  logger.info('[YouTube] Fetching prophecies from RSS...');
  try {
    const response = await fetch(RSS_URL);
    const result = await (new xml2js.Parser()).parseStringPromise(await response.text());
    const entries = result.feed.entry || [];

    // Load existing items from Supabase to preserve transcripts
    const existingItems = await db.selectAll('automated_prophecies');

    let items = entries.map(entry => {
      const title = entry.title[0];
      const desc = entry['media:group'][0]['media:description'][0];
      const id = entry['yt:videoId'][0];
      const isShort = title.toLowerCase().includes('short') || desc.toLowerCase().includes('#shorts') || desc.toLowerCase().includes('#short');
      const existing = existingItems.find(ei => ei.id === id);

      return {
        id,
        title,
        link: isShort ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`,
        published: entry.published[0],
        description: desc,
        thumbnail: entry['media:group'][0]['media:thumbnail'][0].$.url,
        type: isShort ? 'short' : 'video',
        transcript: existing ? existing.transcript : null,
        transcriptstatus: existing ? existing.transcriptstatus : 'Pending'
      };
    });

    items = items.filter(item => {
      const textToSearch = (item.title + item.description).toLowerCase();
      return PROPHECY_KEYWORDS.some(keyword => textToSearch.includes(keyword.toLowerCase()));
    });

    FEATURED_SHORTS.forEach(fs_item => {
      if (!items.find(i => i.id === fs_item.id)) {
        const existing = existingItems.find(ei => ei.id === fs_item.id);
        items.push({
          id: fs_item.id,
          title: fs_item.title,
          link: `https://www.youtube.com/shorts/${fs_item.id}`,
          thumbnail: `https://i.ytimg.com/vi/${fs_item.id}/hqdefault.jpg`,
          type: 'short',
          description: 'Featured Prophecy',
          transcript: existing ? existing.transcript : null,
          transcriptstatus: existing ? existing.transcriptstatus : 'Pending'
        });
      }
    });

    // Upsert all items to Supabase (insert or update by primary key 'id')
    await db.upsert('automated_prophecies', items);
    logger.info(`[YouTube] Upserted ${items.length} prophecy items to Supabase.`);
  } catch (error) {
    logger.error('[YouTube] Error fetching YouTube data:', error);
  }
}


// --- Video Transcript Fetcher (Robust Multi-Method) ---
// Helper to extract YouTube ID
const getYouTubeId = (url) => {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
};

// --- Video Transcript Fetcher (Text Only) ---
// Custom Translation Helper (using Google Translate API without external dependencies)
// Custom Translation Helper (using Google Translate API without external dependencies)
async function translateText(text, targetLang = 'en') {
  if (!text) return null;

  // Chunking to avoid URL length restrictions (approx 1500 chars per chunk)
  const CHUNK_SIZE = 1500;
  const chunks = [];

  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }

  logger.info(`Translating ${text.length} characters in ${chunks.length} chunks (parallel batching)...`);

  const BATCH_SIZE = 5;
  const chunkResults = new Array(chunks.length).fill('');

  for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
    const batchIndices = [];
    const batchPromises = [];

    for (let j = 0; j < BATCH_SIZE && (i + j) < chunks.length; j++) {
      const idx = i + j;
      batchIndices.push(idx);
      const chunk = chunks[idx];
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(chunk)}`;

      batchPromises.push(
        fetch(url)
          .then(res => res.json())
          .then(data => (data && data[0] ? data[0].map(x => x[0]).join('') : ''))
          .catch(err => {
            console.error(`Chunk ${idx} failed:`, err.message);
            return '';
          })
      );
    }

    const results = await Promise.all(batchPromises);
    results.forEach((res, k) => {
      chunkResults[batchIndices[k]] = res;
    });

    if (i + BATCH_SIZE < chunks.length) {
      await new Promise(r => setTimeout(r, 100));
    }
  }

  return chunkResults.join('') || null;
}

// Direct Captions API Fetcher (Robust: OAuth -> Public Fallback)
async function fetchTranscriptText(youtubeId) {
  logger.info(`[Transcript] Fetching for ID: ${youtubeId}...`);

  // STRATEGY 1: Try OAuth API (Best, authenticated)
  try {
    if (await youtubeOAuth.isConnected()) {
      logger.info('[Transcript] Trying authenticated YouTube Data API...');
      const text = await youtubeOAuth.fetchCaptionsViaAPI(youtubeId);
      if (text) {
        // Translation logic for OAuth result
        try {
          const translated = await translateText(text, 'en');
          return (translated && translated !== text) ? `${text} ||| ${translated}` : text;
        } catch (e) { return text; }
      }
    }
  } catch (err) {
    console.warn(`[Transcript] OAuth fetch failed (${err.message}). Falling back to public API.`);
  }

  // STRATEGY 2: Public TimedText API (Fallback)
  logger.info('[Transcript] Falling back to public timedtext API...');
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Accept-Language': 'hi,en;q=0.9',
    'Referer': 'https://www.youtube.com/'
  };

  try {
    // 1. Get List of available tracks from the timedtext API
    const listUrl = `https://www.youtube.com/api/timedtext?v=${youtubeId}&type=list`;
    const response = await axios.get(listUrl, { headers });
    const xmlList = response.data;

    // 2. Parse the tracks to find Hindi (Manual or Automated)
    const tracksMatch = xmlList.match(/<track[^>]*\/>/g);
    if (!tracksMatch) throw new Error('No caption tracks found for this video.');

    let targetTrack = tracksMatch.find(t => t.includes('lang_code="hi"')) ||
      tracksMatch.find(t => t.includes('vss_id="a.hi"')) ||
      tracksMatch.find(t => t.includes('hi'));

    if (!targetTrack) throw new Error('Hindi captions not available.');

    const langCode = targetTrack.match(/lang_code="([^"]+)"/)?.[1] || 'hi';
    const name = targetTrack.match(/name="([^"]+)"/)?.[1] || '';

    // 3. Fetch the actual transcript
    const fetchUrl = `https://www.youtube.com/api/timedtext?v=${youtubeId}&lang=${langCode}${name ? `&name=${encodeURIComponent(name)}` : ''}&fmt=srv3`;
    const transcriptRes = await axios.get(fetchUrl, { headers });
    const transcript = transcriptRes.data;

    // 4. Extract text from SRV format
    const segments = transcript.match(/<s[^>]*>([\s\S]*?)<\/s>/g) || transcript.match(/<text[^>]*>([\s\S]*?)<\/text>/g);
    if (!segments) throw new Error('Transcript content is empty.');

    const rawContent = segments
      .map(s => s.replace(/<[^>]+>/g, ''))
      .map(s => s.replace(/&#39;/g, "'").replace(/&quot;/g, '"').replace(/&amp;/g, '&'))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    // Side-by-Side English Translation
    let fullTranscript = rawContent;
    try {
      const translated = await translateText(rawContent, 'en');
      if (translated && translated !== rawContent) {
        fullTranscript = `${rawContent} ||| ${translated}`;
      }
    } catch (err) { }

    return fullTranscript;

  } catch (err) {
    console.error(`[Transcript] All fetch methods failed:`, err.message);
    throw new Error(`Failed to fetch Hindi captions.`);
  }
}

// Fetch and save transcript for an automated prophecy
async function fetchTranscript(id) {
  const item = await db.selectById('automated_prophecies', id);
  if (item) {
    try {
      const text = await fetchTranscriptText(id);
      await db.update('automated_prophecies', id, { transcript: text, transcriptstatus: 'Draft' });
      return { ...item, transcript: text, transcriptstatus: 'Draft' };
    } catch (e) {
      console.error(`[Transcript] Failed automated fetch for ${id}: ${e.message}`);
      return null;
    }
  }
  return null;
}

// Background Tasks
cron.schedule('0 0 */2 * *', () => fetchYouTubeProphecies());
// fetchYouTubeProphecies(); // Disable initial fetch to avoid startup overhead on Render if desired

// --- SUPABASE KEEP-ALIVE (Prevent Inactivity Pause) ---
cron.schedule('0 0 * * *', async () => {
  console.log('[Keep-Alive] Running daily ping to Supabase...');
  try {
    const { error } = await db.raw.from('announcements').select('id').limit(1);
    if (error) throw error;
    console.log('[Keep-Alive] Ping successful.');
  } catch (err) {
    console.error('[Keep-Alive] Ping failed:', err.message);
  }
});

// --- DYNAMIC SITEMAP GENERATOR ---
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://www.humantosoul.com';
    const supportedLangs = ['en', 'hi', 'es', 'fr', 'de', 'zh', 'ja', 'ru', 'ar', 'pt'];

    // Core Static Routes
    const staticRoutes = [
      '/', '/about', '/baba-jaigurudev', '/baba-umakant', '/prophecies',
      '/meditation', '/vegetarian-living', '/liberation', '/peace-and-society',
      '/satvic-lifestyle', '/glossary', '/blog', '/announcements',
      '/prarthana', '/literature', '/gallery', '/downloads', '/contact', '/virtual-tour'
    ];

    // Helper to generate hreflang matrix string
    const generateHreflangBlock = (path) => {
      let block = `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}${path}"/>`;
      supportedLangs.forEach(lang => {
        const langPath = lang === 'en' ? path : `/${lang}${path === '/' ? '' : path}`;
        block += `\n    <xhtml:link rel="alternate" hreflang="${lang}" href="${baseUrl}${langPath}"/>`;
      });
      return block;
    };

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">`;

    // 1. Append Static Routes
    const today = new Date().toISOString().split('T')[0];
    staticRoutes.forEach(route => {
      xml += `\n  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route === '/' || route === '/prophecies' ? 'daily' : 'weekly'}</changefreq>\n    <priority>${route === '/' || route === '/prophecies' ? '1.0' : '0.8'}</priority>${generateHreflangBlock(route)}\n  </url>`;
    });

    // 2. Fetch all Prophecies (Manual + Automated) from DB with Fallback
    let allProphecies = [];
    try {
      const manualProphecies = await db.selectAll('prophecies');
      const automatedProphecies = await db.selectAll('automated_prophecies');
      allProphecies = [...(manualProphecies || []), ...(automatedProphecies || [])];
    } catch (dbErr) {
      console.error('[Sitemap] Database connection failed (possible ISP block). Proceeding with static routes only.', dbErr.message);
    }

    // 3. Append Dynamic Prophecy Routes
    allProphecies.forEach(item => {
      if (!item.id) return;
      const route = `/prophecy/${item.id}`;
      // Automated items usually have publishedAt or published dates
      const modDate = item.publishedAt ? new Date(item.publishedAt).toISOString().split('T')[0] :
        item.published ? new Date(item.published).toISOString().split('T')[0] : today;

      xml += `\n  <url>\n    <loc>${baseUrl}${route}</loc>\n    <lastmod>${modDate}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.9</priority>${generateHreflangBlock(route)}\n  </url>`;
    });

    xml += `\n</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (error) {
    console.error('[Sitemap] Failed to generate sitemap:', error);
    res.status(500).send('Error generating sitemap');
  }
});

// --- API ENDPOINTS ---

// Auth Middleware - Secure JWT verification
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (err) {
    console.warn('Token verification failed:', err.message);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Admin Auth - Secure Login with JWT, bcrypt, and Account Lockout
app.post('/api/auth/login', loginLimiter, async (req, res) => {
  try {
    const { username, password } = req.body;
    const clientIP = req.ip;

    logToMemory('LOGIN_ATTEMPT', `IP: ${clientIP} User: ${username}`);

    // Check if IP is locked out
    const attempts = failedLoginAttempts.get(clientIP) || { count: 0, lockedUntil: null };
    if (attempts.lockedUntil && attempts.lockedUntil > Date.now()) {
      const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
      logSecurityEvent(clientIP, 'LOCKOUT_REJECTION', `Locked. Remaining: ${remainingMinutes}m`);
      return res.status(429).json({ message: `Account locked. Try again in ${remainingMinutes} minutes.` });
    }

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // --- Authenticate against Supabase users table ---
    const user = await db.selectOneWhere('users', 'username', username);

    let isPasswordValid = false;
    if (user && user.password_hash) {
      isPasswordValid = await bcrypt.compare(password, user.password_hash);
    }

    if (isPasswordValid) {
      logToMemory('LOGIN_SUCCESS', `User ${username} logged in.`);
      failedLoginAttempts.delete(clientIP);

      const token = jwt.sign(
        { username: user.username, role: user.role || 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );
      return res.json({ token, user: { username: user.username } });
    } else {
      logToMemory('LOGIN_FAILED', `Invalid credentials for ${username}`);
      attempts.count += 1;

      if (attempts.count >= 5) {
        attempts.lockedUntil = Date.now() + (30 * 60 * 1000);
        logSecurityEvent(clientIP, 'ACCOUNT_LOCKOUT', '5 failed attempts reached');
      } else {
        logSecurityEvent(clientIP, 'LOGIN_FAILED', `Attempt ${attempts.count} for user: ${username}`);
      }

      failedLoginAttempts.set(clientIP, attempts);
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    console.error('[Login] FATAL ERROR:', err.message, err.stack);
    res.status(500).json({ message: 'Internal server error during authentication' });
  }
});

// Admin Password Change — stores hash in Supabase users table (no .env writes)
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const username = req.user.username;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' });
  }

  try {
    // 1. Fetch user from Supabase
    const user = await db.selectOneWhere('users', 'username', username);
    if (!user) {
      return res.status(404).json({ message: 'User not found. Please contact support.' });
    }

    // 2. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // 3. Hash new password (cost factor 12 — production standard)
    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    // 4. Update in Supabase
    await db.updateWhere('users', 'username', username, { password_hash: newPasswordHash });

    logger.info(`[Auth] Password updated for user: ${username}`);
    res.json({ message: 'Password changed successfully. Please login again.' });
  } catch (err) {
    console.error('[Auth] Failed to update password:', err.message);
    res.status(500).json({ message: 'Failed to update password' });
  }
});

// Generic async CRUD handler — Supabase
const handleCrud = async (tableName, req, res) => {
  try {
    if (req.method === 'GET') {
      const items = await db.selectAll(tableName);
      return res.json(items);
    }

    if (req.method === 'POST') {
      const values = { ...req.body };
      if (req.file) values.src = `/uploads/${req.file.filename}`;
      const newItem = await db.insert(tableName, values);
      return res.json(newItem);
    }

    if (req.method === 'PUT') {
      const { id } = req.params;
      const values = { ...req.body };
      if (req.file) values.src = `/uploads/${req.file.filename}`;
      const updatedItem = await db.update(tableName, id, values);
      return res.json(updatedItem);
    }

    if (req.method === 'DELETE') {
      const { id } = req.params;
      await db.deleteById(tableName, id);
      return res.json({ success: true });
    }
  } catch (err) {
    console.error(`[CRUD] ${req.method} ${tableName} error:`, err.message);
    res.status(500).json({ message: `Database error: ${err.message}` });
  }
};



// --- SATVIC LIFESTYLE ENGINE ---
const { getRecipes } = require('./satvic_engine');

// 1. Get Recipes (World Explorer)
app.get('/api/satvic/recipes', (req, res) => {
  try {
    getRecipes(req, res);
  } catch (err) {
    logger.error('Satvic Engine Error:', err);
    res.status(500).json({ message: 'Failed to load recipes' });
  }
});

// 2. Submit Pledge
app.post('/api/satvic/pledge', async (req, res) => {
  const { name, email, item } = req.body;
  logger.info(`[Pledge] Submission attempt: name=${name}, email=${email}, item=${item}`);

  if (!name || !item) {
    logger.warn('[Pledge] Missing required fields');
    return res.status(400).json({ message: 'Name and pledge item are required.' });
  }

  try {
    const newItem = await db.insert('pledges', {
      name,
      email: email || '',
      item,
      date: new Date().toISOString()
    });

    logger.info(`[Pledge] Success! ID: ${newItem.id}`);
    res.json({ success: true, id: newItem.id, message: 'Pledge recorded successfully!' });
  } catch (err) {
    logger.error('[Pledge] Database Error:', err.message);
    res.status(500).json({ message: `Database error: ${err.message}` });
  }
});

// 3. Get Pledge Stats (Social Proof)
app.get('/api/satvic/stats', async (req, res) => {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    const { count: total } = await db.raw.from('pledges').select('*', { count: 'exact', head: true });
    const { count: today } = await db.raw.from('pledges').select('*', { count: 'exact', head: true }).like('date', `${todayStr}%`);
    const { data: recent } = await db.raw.from('pledges').select('name, item').order('id', { ascending: false }).limit(5);

    res.json({ total, today, recent });
  } catch (err) {
    console.error('[Stats] Error fetching pledge stats:', err.message);
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Video Review (Alias for prophecies list but focused on transcript editing)
app.get('/api/videoreview', verifyToken, async (req, res) => {
  try {
    const manual = await db.selectAll('prophecies');
    const automated = await db.selectAll('automated_prophecies');
    res.json({ manual, automated });
  } catch (e) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});


// --- Virtual Tours Management ---
app.get('/api/virtual_tours', async (req, res) => {
  try {
    const tours = await db.selectAll('virtual_tours');
    // Default sorted to newest first if id is sequential
    if (tours) tours.reverse();
    res.json(tours);
  } catch (err) {
    logger.error('Error fetching virtual tours:', err);
    res.status(500).json({ error: 'Failed to fetch virtual tours' });
  }
});

app.post('/api/virtual_tours', verifyToken, async (req, res) => {
  try {
    const { video_id, title } = req.body;
    if (!video_id || !title) {
      return res.status(400).json({ error: 'Video ID and title are required' });
    }
    const newTour = await db.insert('virtual_tours', { video_id, title });
    res.json(newTour);
  } catch (err) {
    logger.error('Error adding virtual tour:', err);
    res.status(500).json({ error: 'Failed to add virtual tour' });
  }
});

app.delete('/api/virtual_tours/:id', verifyToken, async (req, res) => {
  try {
    await db.deleteById('virtual_tours', req.params.id);
    res.json({ success: true });
  } catch (err) {
    logger.error('Error deleting virtual tour:', err);
    res.status(500).json({ error: 'Failed to delete virtual tour' });
  }
});

// Prophecies
app.route('/api/prophecies')
  .get(async (req, res) => {
    try {
      const manual = await db.selectAll('prophecies');
      const automated = await db.selectAll('automated_prophecies');

      const manualYouTubeIds = new Set();
      manual.forEach(item => {
        const yId = getYouTubeId(item.link);
        if (yId) manualYouTubeIds.add(yId);
      });

      const filteredAutomated = automated.filter(item => !manualYouTubeIds.has(item.id));
      res.json({ manual, automated: filteredAutomated });
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch prophecies' });
    }
  })
  .post(verifyToken, upload.single('file'), async (req, res) => {
    const { title, link, thumbnail, description, year, type, summary, summaryStatus, transcript, transcriptStatus } = req.body;
    let finalThumbnail = thumbnail;
    if (req.file) finalThumbnail = `/uploads/${req.file.filename}`;

    try {
      const newItem = await db.insert('prophecies', {
        title,
        link,
        thumbnail: finalThumbnail,
        description,
        year,
        type: type || 'manual',
        summary,
        summaryStatus,
        transcript,
        transcriptStatus
      });
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Failed to add prophecy' });
    }
  });

app.route('/api/prophecies/:id')
  .get(async (req, res) => {
    const { id } = req.params;
    try {
      // Try manual prophecies first (numeric IDs)
      let item = null;
      try {
        item = await db.selectById('prophecies', id);
      } catch (e) {
        // Likely a type mismatch (string ID vs numeric column) — this is expected for automated prophecies
      }

      // If not found in manual, try automated prophecies (YouTube string IDs)
      if (!item) {
        try {
          item = await db.selectById('automated_prophecies', id);
        } catch (e) {
          // Not found in automated either
        }
      }

      if (item) res.json(item);
      else res.status(404).json({ message: 'Prophecy not found' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching prophecy' });
    }
  })
  .put(verifyToken, upload.single('file'), async (req, res) => {
    const { id } = req.params;
    const { title, link, thumbnail, description, year, type, summary, summaryStatus, transcript, transcriptStatus } = req.body;

    let finalThumbnail = thumbnail;
    if (req.file) finalThumbnail = `/uploads/${req.file.filename}`;

    const updates = {
      title, link, thumbnail: finalThumbnail, description, year, type, summary, summaryStatus, transcript, transcriptStatus
    };

    try {
      const updatedItem = await db.update('prophecies', id, updates);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update prophecy' });
    }
  })
  .delete(verifyToken, async (req, res) => {
    try {
      await db.deleteById('prophecies', req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete prophecy' });
    }
  });


// --- RSS FEED EXPORT (For Automation like Make.com) ---
app.get('/api/rss/teachings', async (req, res) => {
  try {
    const manual = await db.selectAll('prophecies') || [];
    const automated = await db.selectAll('automated_prophecies') || [];

    // Combine and Filter exactly like the frontend BlogPage.jsx
    const allProphecies = [...manual, ...automated].filter(p => {
      const hasHindi = /[\u0900-\u097F]/.test(p.title);
      const isSchedule = /satsang/i.test(p.title) && p.title.includes('|');
      return !hasHindi && !isSchedule;
    });

    // Helper to safely escape XML characters
    const escapeXml = (unsafe) => {
      if (!unsafe) return '';
      return String(unsafe).replace(/[<>&'"]/g, (c) => {
        switch (c) {
          case '<': return '&lt;';
          case '>': return '&gt;';
          case '&': return '&amp;';
          case '\'': return '&apos;';
          case '"': return '&quot;';
          default: return c;
        }
      });
    };

    // Sort by Date DESC, then ID DESC
    const sorted = allProphecies.sort((a, b) => {
      if (b.year !== a.year) return (b.year || '').localeCompare(a.year || '');
      return b.id - a.id;
    });

    // Take top 20 latest items for the feed
    const latestItems = sorted.slice(0, 20);

    let itemsXml = latestItems.map(item => {
      const title = escapeXml(item.title);
      // Fallback excerpt hierarchy
      let rawDesc = item.summary || item.description || (item.transcript ? item.transcript.substring(0, 250) + '...' : 'New Spiritual Teaching');
      const desc = escapeXml(rawDesc);

      const link = `https://www.humantosoul.com/prophecy/${item.id}`;
      // RFC-822 formatted date (or fallback)
      const pubDate = item.published ? new Date(item.published).toUTCString() : new Date().toUTCString();

      return `
    <item>
      <title>${title}</title>
      <link>${link}</link>
      <description>${desc}</description>
      <pubDate>${pubDate}</pubDate>
      <guid isPermaLink="true">${link}</guid>
    </item>`;
    }).join('');

    const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Baba Jaigurudev Spiritual Teachings</title>
    <link>https://www.humantosoul.com/blog</link>
    <description>Latest spiritual teachings, prophecies, and wisdom from Baba Jaigurudev Mission.</description>
    <language>en-us</language>
    <atom:link href="https://www.humantosoul.com/api/rss/teachings" rel="self" type="application/rss+xml" />${itemsXml}
  </channel>
</rss>`;

    res.set('Content-Type', 'application/xml');
    res.send(rssXml);

  } catch (error) {
    console.error('[RSS Feed] Error generating feed:', error);
    res.status(500).send('Error generating RSS feed');
  }
});


// Prophecy Highlight (Multiple Text Cards)
app.route('/api/prophecy-highlight')
  .get(async (req, res) => {
    try {
      let data = await db.selectAll('highlights');
      // Sort by ID DESC in JS since SelectAll doesn't support ordering yet
      data.sort((a, b) => b.id - a.id);
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching highlights' });
    }
  })
  .post(verifyToken, async (req, res) => {
    const { title, year, content } = req.body;
    try {
      const newItem = await db.insert('highlights', {
        title,
        year: year || new Date().getFullYear().toString(),
        content
      });
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create highlight' });
    }
  });

app.route('/api/prophecy-highlight/:id')
  .put(verifyToken, async (req, res) => {
    const { title, year, content } = req.body;
    try {
      const updated = await db.update('highlights', req.params.id, { title, year, content });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update highlight' });
    }
  })
  .delete(verifyToken, async (req, res) => {
    try {
      await db.deleteById('highlights', req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete highlight' });
    }
  });



// Unified Video Routes (for Transcripts across both types)
app.post('/api/videos/:id/transcript', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Try Automated First
    const autoItem = await db.selectById('automated_prophecies', id);
    if (autoItem) {
      const text = await fetchTranscriptText(id);
      await db.update('automated_prophecies', id, { transcript: text, transcriptStatus: 'Draft' });
      return res.json({ ...autoItem, transcript: text, transcriptStatus: 'Draft' });
    }

    // 2. Try Manual
    const manualItem = await db.selectById('prophecies', id);
    if (manualItem) {
      const youtubeId = getYouTubeId(manualItem.link);
      if (!youtubeId) return res.status(400).json({ message: 'Invalid YouTube URL' });
      const text = await fetchTranscriptText(youtubeId);
      await db.update('prophecies', id, { transcript: text, transcriptStatus: 'Draft' });
      return res.json({ ...manualItem, transcript: text, transcriptStatus: 'Draft' });
    }

    res.status(404).json({ message: 'Video not found' });
  } catch (error) {
    console.error(`Transcript endpoint error:`, error.message);
    res.status(500).json({ message: `Failed: ${error.message}` });
  }
});

app.put('/api/videos/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { transcript, transcriptStatus } = req.body;

  try {
    let table = null;
    const isAuto = await db.selectById('automated_prophecies', id);
    if (isAuto) table = 'automated_prophecies';
    else {
      const isManual = await db.selectById('prophecies', id);
      if (isManual) table = 'prophecies';
    }

    if (!table) return res.status(404).json({ message: 'Video not found' });

    // Build dynamic update object
    let updates = {};
    if (transcript !== undefined) updates.transcript = transcript;
    if (transcriptStatus !== undefined) updates.transcriptStatus = transcriptStatus;

    if (Object.keys(updates).length > 0) {
      await db.update(table, id, updates);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ message: 'Failed to update video' });
  }
});


// Announcements
app.route('/api/announcements')
  .get(async (req, res) => {
    try {
      const items = await db.selectAll('announcements');
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch announcements' });
    }
  })
  .post(verifyToken, upload.single('file'), async (req, res) => {
    const { title, description, year } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
      const newItem = await db.insert('announcements', { title, description, year, fileUrl });
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Failed to create announcement' });
    }
  });

app.route('/api/announcements/:id')
  .get(async (req, res) => {
    try {
      const item = await db.selectById('announcements', req.params.id);
      if (item) res.json(item);
      else res.status(404).json({ message: 'Announcement not found' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching announcement' });
    }
  })
  .put(verifyToken, upload.single('file'), async (req, res) => {
    const { id } = req.params;
    const { title, description, year } = req.body;

    const updates = { title, description, year };
    if (req.file) {
      updates.fileUrl = `/uploads/${req.file.filename}`;
    }

    try {
      const updatedItem = await db.update('announcements', id, updates);
      res.json(updatedItem);
    } catch (error) {
      res.status(500).json({ message: 'Failed to update announcement' });
    }
  })
  .delete(verifyToken, async (req, res) => {
    try {
      await db.deleteById('announcements', req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete announcement' });
    }
  });

// YouTube Feed
app.get('/api/youtube', async (req, res) => {
  try {
    const { data: allVideos, error } = await db.raw
      .from('automated_prophecies')
      .select('*')
      .order('published', { ascending: false })
      .limit(50);

    if (error) throw error;

    const shorts = (allVideos || []).filter(v => v.type === 'short' || v.title.toLowerCase().includes('#shorts'));
    const full = (allVideos || []).filter(v => v.type !== 'short' && !v.title.toLowerCase().includes('#shorts'));

    res.json({ shorts, full });
  } catch (err) {
    console.error('[YouTube] Error fetching feed:', err.message);
    res.status(500).json({ error: 'Failed to fetch YouTube feed' });
  }
});

// --- YOUTUBE AUTH ROUTES ---
app.get('/api/youtube/auth-url', verifyToken, (req, res) => {
  try {
    const url = youtubeOAuth.getAuthUrl();
    res.json({ url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/youtube/oauth-callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('No code provided');

  try {
    await youtubeOAuth.exchangeCodeForTokens(code);
    res.send(`
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 50px;">
          <h1 style="color: green;">✅ Connection Successful!</h1>
          <p>YouTube channel connected successfully. You can close this window.</p>
          <script>setTimeout(() => window.close(), 3000);</script>
        </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`<h1>❌ Connection Failed</h1><p>${err.message}</p>`);
  }
});

app.get('/api/youtube/auth-status', verifyToken, async (req, res) => {
  const connected = await youtubeOAuth.isConnected();
  res.json({ connected });
});

// Gallery
app.route('/api/gallery')
  .get(async (req, res) => {
    try {
      const items = await db.selectAll('gallery');
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching gallery' });
    }
  })
  .post(verifyToken, upload.single('image'), async (req, res) => {
    const { alt } = req.body;
    const src = `/uploads/${req.file.filename}`;
    try {
      const newItem = await db.insert('gallery', { alt, src });
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error uploading image' });
    }
  });

app.route('/api/gallery/:id')
  .put(verifyToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { alt } = req.body;

    const updates = { alt };
    if (req.file) {
      updates.src = `/uploads/${req.file.filename}`;
    }

    try {
      const updated = await db.update('gallery', id, updates);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Error updating image' });
    }
  })
  .delete(verifyToken, async (req, res) => {
    try {
      await db.deleteById('gallery', req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting image' });
    }
  });

// Literature
app.route('/api/literature')
  .get(async (req, res) => {
    try {
      const data = await db.selectAll('literature');
      const processed = data.map(item => {
        try { item.type = JSON.parse(item.type); } catch (e) { }
        return item;
      });
      res.json(processed);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching literature' });
    }
  })
  .post(verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
    const { title, author, description, type } = req.body;
    const image = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : null;
    const pdf = req.files['pdf'] ? `/uploads/${req.files['pdf'][0].filename}` : null;

    try {
      const newItem = await db.insert('literature', { title, author, description, image, pdf, type });
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error creating literature' });
    }
  });

app.route('/api/literature/:id')
  .put(verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), async (req, res) => {
    const { id } = req.params;
    const { title, author, description, type } = req.body;

    const updates = { title, author, description, type };
    if (req.files['image']) {
      updates.image = `/uploads/${req.files['image'][0].filename}`;
    }
    if (req.files['pdf']) {
      updates.pdf = `/uploads/${req.files['pdf'][0].filename}`;
    }

    try {
      const updated = await db.update('literature', id, updates);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Error updating literature' });
    }
  })
  .delete(verifyToken, async (req, res) => {
    try {
      await db.deleteById('literature', req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting literature' });
    }
  });

// Prarthana
app.route('/api/prarthana')
  .get(async (req, res) => {
    try {
      const items = await db.selectAll('prarthana');
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching prarthana' });
    }
  })
  .post(verifyToken, async (req, res) => {
    const { title, content, description } = req.body;
    try {
      const newItem = await db.insert('prarthana', { title, content, description });
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error creating prarthana' });
    }
  });

app.route('/api/prarthana/:id')
  .put(verifyToken, async (req, res) => {
    const { id } = req.params;
    const { title, content, description } = req.body;
    try {
      const updated = await db.update('prarthana', id, { title, content, description });
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Error updating prarthana' });
    }
  })
  .delete(verifyToken, async (req, res) => {
    try {
      await db.deleteById('prarthana', req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting prarthana' });
    }
  });

// Profiles
app.get('/api/profiles', async (req, res) => {
  try {
    const items = await db.selectAll('profiles');
    res.json(items);
  } catch (e) {
    res.status(500).json({ message: 'Error fetching profiles' });
  }
});

app.post('/api/profiles', verifyToken, upload.single('image'), async (req, res) => {
  const { id, title, description } = req.body;
  let image = null;
  if (req.file) image = `/uploads/${req.file.filename}`;

  try {
    // Upsert Logic: Check existence to preserve image if not provided
    let existing = await db.selectById('profiles', id);
    if (existing && !image) {
      image = existing.image;
    }

    const newItem = await db.upsert('profiles', { id, title, description, image });
    res.json(newItem);
  } catch (e) {
    res.status(500).json({ message: 'Error saving profile' });
  }
});

app.route('/api/profiles/:id')
  .put(verifyToken, upload.single('image'), async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const updates = { title, description };
    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    try {
      const updated = await db.update('profiles', id, updates);
      res.json(updated);
    } catch (e) {
      res.status(500).json({ message: 'Error updating profile' });
    }
  });

// Downloads
app.route('/api/downloads')
  .get(async (req, res) => {
    try {
      const items = await db.selectAll('downloads');
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching downloads' });
    }
  })
  .post(verifyToken, upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'cdrFile', maxCount: 1 }]), async (req, res) => {
    const { title, description, type, location, year } = req.body;
    const pdf = req.files['pdfFile'] ? `/uploads/${req.files['pdfFile'][0].filename}` : null;
    const cdrFile = req.files['cdrFile'] ? `/uploads/${req.files['cdrFile'][0].filename}` : null;

    try {
      const newItem = await db.insert('downloads', { title, description, pdf, cdrFile, type, location, year });
      res.json(newItem);
    } catch (error) {
      res.status(500).json({ message: 'Error creating download' });
    }
  });

app.route('/api/downloads/:id')
  .put(verifyToken, upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'cdrFile', maxCount: 1 }]), async (req, res) => {
    const { id } = req.params;
    const { title, description, type, location, year } = req.body;

    const updates = { title, description, type, location, year };
    if (req.files['pdfFile']) {
      updates.pdf = `/uploads/${req.files['pdfFile'][0].filename}`;
    }
    if (req.files['cdrFile']) {
      updates.cdrFile = `/uploads/${req.files['cdrFile'][0].filename}`;
    }

    try {
      const updated = await db.update('downloads', id, updates);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ message: 'Error updating download' });
    }
  })
  .delete(verifyToken, async (req, res) => {
    try {
      await db.deleteById('downloads', req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting download' });
    }
  });


// Newsletter Subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    // 1. Save to Database
    await db.insert('newsletter_subscribers', {
      email,
      subscribed_at: new Date().toISOString()
    });

    // 2. Send Welcome Email (Simulated OTP/Notification style)
    const subject = 'Welcome to the Jai Gurudev Community! 🙏';

    // Read the email template from file
    const templatePath = path.join(__dirname, 'templates', 'welcome_email.html');
    let html = '';

    try {
      html = fs.readFileSync(templatePath, 'utf8');
    } catch (readErr) {
      console.error('Error reading email template:', readErr);
      // Fallback if file is missing
      html = '<p>Thank you for subscribing to Jai Gurudev Newsletter.</p>';
    }

    // Uses the "Waterfall" logic: Brevo -> SendGrid -> Gmail
    await emailService.sendEmail(email, subject, html);

    res.json({ success: true, message: 'Subscribed successfully!' });
  } catch (err) {
    // Check for unique constraint error (Supabase)
    if (err.code === '23505') {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }
    console.error('Newsletter Error:', err);
    res.status(500).json({ message: 'Failed to subscribe.' });
  }
});

// Newsletter Subscription
app.get('/api/newsletter/subscribers', verifyToken, async (req, res) => {
  try {
    let subscribers = await db.selectAll('newsletter_subscribers');
    // Sort in JS
    subscribers.sort((a, b) => new Date(b.subscribed_at) - new Date(a.subscribed_at));
    const count = subscribers.length;
    res.json({ count, subscribers });
  } catch (err) {
    console.error('Error fetching subscribers:', err);
    res.status(500).json({ message: 'Failed to fetch subscribers' });
  }
});

app.post('/api/newsletter/broadcast', verifyToken, async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ message: 'Subject and message are required' });
  }

  try {
    // 1. Fetch all subscribers
    const subscribers = await db.selectAll('newsletter_subscribers');

    if (subscribers.length === 0) {
      return res.status(400).json({ message: 'No subscribers found.' });
    }

    // 2. Read Broadcast Template
    const templatePath = path.join(__dirname, 'templates', 'broadcast_email.html');
    let templateHtml = '';

    try {
      templateHtml = fs.readFileSync(templatePath, 'utf8');
    } catch (readErr) {
      console.error('Error reading broadcast template:', readErr);
      return res.status(500).json({ message: 'Broadcast template missing.' });
    }

    // 3. Prepare Email Content
    // Replace newlines with <br> for HTML email
    const formattedMessage = message.replace(/\n/g, '<br>');
    const htmlInfo = templateHtml
      .replaceAll('{{subject}}', subject)
      .replaceAll('{{message}}', formattedMessage);

    // 4. Send Emails (Iterate)
    // In production, use a bulk sending API or queue. For now, we loop.
    let successCount = 0;
    for (const sub of subscribers) {
      const sent = await emailService.sendEmail(sub.email, subject, htmlInfo);
      if (sent) successCount++;
    }

    res.json({
      success: true,
      message: `Broadcast sent to ${successCount} out of ${subscribers.length} subscribers.`
    });

  } catch (err) {
    console.error('Broadcast Error:', err);
    res.status(500).json({ message: 'Failed to send broadcast.' });
  }
});

// --- Dynamic Sitemap & SEO ---
app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://www.humantosoul.com';
    const routes = [
      '/', '/about', '/baba-jaigurudev', '/baba-umakant',
      '/contact', '/gallery', '/literature', '/prarthana',
      '/downloads', '/prophecies', '/satvic-lifestyle',
      '/announcements', '/blog'
    ];

    const sitemap = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'];

    // 1. Static Routes
    routes.forEach(route => {
      sitemap.push(`
        <url>
          <loc>${baseUrl}${route}</loc>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>`);
    });

    // 2. Prophecies (Dynamic)
    const prophecies = await db.selectAll('prophecies');
    prophecies.forEach(p => {
      sitemap.push(`
        <url>
          <loc>${baseUrl}/prophecy/${p.id}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.7</priority>
        </url>`);
    });

    // 3. Announcements (Dynamic) - if you have detailed pages
    const announcements = await db.selectAll('announcements');
    announcements.forEach(a => {
      sitemap.push(`
        <url>
          <loc>${baseUrl}/announcement/${a.id}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>`);
    });

    // 4. Automated Prophecies (Dynamic)
    const automated = await db.selectAll('automated_prophecies');
    automated.forEach(p => {
      sitemap.push(`
        <url>
          <loc>${baseUrl}/prophecy/${p.id}</loc>
          <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>`);
    });

    sitemap.push('</urlset>');

    res.header('Content-Type', 'application/xml');
    res.send(sitemap.join(''));

  } catch (err) {
    logger.error('Sitemap Generation Error:', err);
    res.status(500).send('Error generating sitemap');
  }
});

// Production Serve
if (isProduction) {
  app.use(express.static(path.join(__dirname, '../build')));
  app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../build', 'index.html')));
}

// Global Error Handler
app.use((err, req, res, next) => {
  logger.error('Unhandled error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});

// Start Server
const server = app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Graceful Shutdown Handler
const gracefulShutdown = (signal) => {
  logger.warn(`${signal} received. Shutting down gracefully...`);
  server.close(() => {
    logger.info('Server closed. Process terminated.');
    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Uncaught Exception Handler
process.on('uncaughtException', (err) => {
  logger.error('Uncaught Exception:', err.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// ─────────────────────────────────────────────
// VOICE NOTE CONTACT ENDPOINT
// POST /api/contact/voice
// Accepts: multipart/form-data with voiceNote (audio/webm), name, phone
// ─────────────────────────────────────────────
const voiceUploadDir = path.join(__dirname, 'uploads', 'voice-notes');
if (!fs.existsSync(voiceUploadDir)) fs.mkdirSync(voiceUploadDir, { recursive: true });

const voiceStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, voiceUploadDir),
  filename: (req, file, cb) => {
    const ts = Date.now();
    cb(null, `voice-${ts}.webm`);
  }
});
const voiceUpload = multer({
  storage: voiceStorage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) cb(null, true);
    else cb(new Error('Only audio files allowed'), false);
  }
});

app.post('/api/contact/voice', voiceUpload.single('voiceNote'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No audio file received' });

    const { name = 'Unknown', phone = 'Not provided' } = req.body;
    const filePath = req.file.path;
    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    logger.info(`[VoiceNote] Received from: ${name} | Phone: ${phone} | File: ${req.file.filename}`);

    // Try to send email notification with attachment
    try {
      const orgEmail = process.env.ORG_EMAIL || process.env.EMAIL_USER || 'info@jaigurudevukm.com';
      const transporter = nodemailer.createTransporter({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"Human to Soul Website" <${process.env.EMAIL_USER}>`,
        to: orgEmail,
        subject: `🎙️ New Voice Message from ${name} — HumantoSoul.com`,
        html: `
          <h2>New Voice Message Received</h2>
          <p><strong>Received on:</strong> ${timestamp} (IST)</p>
          <p><strong>Sender Name:</strong> ${name}</p>
          <p><strong>Phone Number:</strong> ${phone}</p>
          <p><em>The audio file is attached. Please listen and respond to the sender.</em></p>
          <p style="color:#888;font-size:12px;">Sent via humantosoul.com contact form voice recorder</p>
        `,
        attachments: [{
          filename: `voice-message-${name.replace(/\s+/g, '-')}.webm`,
          path: filePath
        }]
      });

      logger.info(`[VoiceNote] Email sent to ${orgEmail}`);
    } catch (emailErr) {
      // Email failed but file is saved — non-fatal
      logger.warn(`[VoiceNote] Email failed (file saved): ${emailErr.message}`);
    }

    res.json({
      success: true,
      message: 'Voice message received. Our team will contact you soon. Jai Gurudev!',
      savedAs: req.file.filename
    });
  } catch (err) {
    logger.error('[VoiceNote] Error:', err.message);
    res.status(500).json({ error: 'Failed to save voice message. Please try again.' });
  }
});


