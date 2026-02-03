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
const bcrypt = require('bcrypt'); // Password hashing
const emailService = require('./email_service'); // Smart Multi-Provider Email System
const axios = require('axios');
const nodemailer = require('nodemailer');
const { db, initializeDatabase } = require('./database');

// Initialize SQLite Database
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
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] IP: ${ip} | EVENT: ${event} | DETAILS: ${details}\n`;
  fs.appendFile(securityLogPath, logEntry, (err) => {
    if (err) logger.error('Failed to write to security log:', err.message);
  });
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

const PORT = process.env.SERVER_PORT || 5000;

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
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://translate.google.com",
        "https://translate.googleapis.com",
        "https://www.gstatic.com",
        "https://cdnjs.cloudflare.com"
      ],
      connectSrc: [
        "'self'",
        "https://translate.googleapis.com",
        "https://translate.google.com",
        "https://www.youtube.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://translate.googleapis.com",
        "https://fonts.googleapis.com",
        "https://cdnjs.cloudflare.com",
        "https://www.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https:",
        "http://i.ytimg.com",
        "https://i.ytimg.com",
        "https://www.google.com",
        "https://translate.google.com",
        "https://translate.googleapis.com",
        "https://www.gstatic.com"
      ],
      frameSrc: [
        "'self'",
        "https://translate.google.com",
        "https://translate.googleapis.com",
        "https://www.youtube.com",
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
  'https://jaigurudevukm.in',
  'https://www.jaigurudevukm.in',
  'https://jaigurudevukm.com',
  'https://www.jaigurudevukm.com',
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
      console.warn(`CORS blocked origin: ${origin}`);
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

// SQLite database is initialized above. JSON file initialization is no longer needed.


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
    console.warn(`Blocked upload: ${file.mimetype} not allowed`);
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
  console.log('Automating Prophecies (Refined Search)...');
  try {
    const response = await fetch(RSS_URL);
    const result = await (new xml2js.Parser()).parseStringPromise(await response.text());
    const entries = result.feed.entry || [];

    // Load existing items to preserve summaries from SQLite
    const existingItems = db.prepare('SELECT * FROM automated_prophecies').all();

    let items = entries.map(entry => {
      const title = entry.title[0];
      const desc = entry['media:group'][0]['media:description'][0];
      const id = entry['yt:videoId'][0];
      const isShort = title.toLowerCase().includes('short') || desc.toLowerCase().includes('#shorts') || desc.toLowerCase().includes('#short');

      const existing = existingItems.find(ei => ei.id === id);

      return {
        id: id,
        title: title,
        link: isShort ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`,
        published: entry.published[0],
        description: desc,
        thumbnail: entry['media:group'][0]['media:thumbnail'][0].$.url,
        type: isShort ? 'short' : 'video',
        transcript: existing ? existing.transcript : null,
        transcriptStatus: existing ? existing.transcriptStatus : 'Pending'
      };
    });

    items = items.filter(item => {
      const textToSearch = (item.title + item.description).toLowerCase();
      return PROPHECY_KEYWORDS.some(keyword => textToSearch.includes(keyword.toLowerCase()));
    });

    FEATURED_SHORTS.forEach(fs_item => {
      const found = items.find(i => i.id === fs_item.id);
      if (!found) {
        const existing = existingItems.find(ei => ei.id === fs_item.id);
        items.push({
          id: fs_item.id,
          title: fs_item.title,
          link: `https://www.youtube.com/shorts/${fs_item.id}`,
          thumbnail: `https://i.ytimg.com/vi/${fs_item.id}/hqdefault.jpg`,
          type: 'short',
          description: "Featured Prophecy",
          transcript: existing ? existing.transcript : null,
          transcriptStatus: existing ? existing.transcriptStatus : 'Pending'
        });
      }
    });

    // Save to SQLite
    const insert = db.prepare(`
      INSERT OR REPLACE INTO automated_prophecies (id, title, link, published, description, thumbnail, type, transcript, transcriptStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const transaction = db.transaction((prophecies) => {
      for (const p of prophecies) {
        insert.run(p.id, p.title, p.link, p.published || null, p.description, p.thumbnail, p.type, p.transcript, p.transcriptStatus);
      }
    });

    transaction(items);
    console.log(`Updated ${items.length} prophecy items in SQLite.`);
  } catch (error) { console.error('Error fetching YouTube data:', error); }
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

  console.log(`Translating ${text.length} characters in ${chunks.length} chunks (parallel batching)...`);

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
async function fetchTranscriptText(youtubeId) {
  console.log(`[Transcript] Fetching using yt-dlp for ID: ${youtubeId}`);

  try {
    const outputPath = path.join(__dirname, `transcript_${youtubeId}`);
    const command = `yt-dlp --write-auto-subs --sub-lang "hi" --skip-download --output "${outputPath}" "https://www.youtube.com/watch?v=${youtubeId}"`;

    console.log(`[Transcript] Running yt-dlp...`);
    // Use promisified exec to avoid blocking the event loop
    const { exec } = require('child_process');
    const util = require('util');
    const execPromise = util.promisify(exec);

    await execPromise(command, {
      encoding: 'utf-8',
      maxBuffer: 10 * 1024 * 1024,
      timeout: 30000
    });

    const possibleFiles = [
      `${outputPath}.hi.vtt`,
      `${outputPath}.hi-IN.vtt`,
      `${outputPath}.en.vtt`
    ];

    let subtitleContent = null;
    let subtitleFile = null;

    for (const file of possibleFiles) {
      if (fs.existsSync(file)) {
        subtitleContent = fs.readFileSync(file, 'utf-8');
        subtitleFile = file;
        console.log(`[Transcript] Found: ${path.basename(file)}`);
        fs.unlinkSync(file);
        break;
      }
    }

    if (!subtitleContent) {
      throw new Error('No subtitle files generated by yt-dlp');
    }

    const lines = subtitleContent.split('\n');
    const textLines = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed &&
        !trimmed.includes('-->') &&
        !trimmed.match(/^\d+$/) &&
        trimmed !== 'WEBVTT' &&
        !trimmed.startsWith('Kind:') &&
        !trimmed.startsWith('Language:') &&
        !trimmed.includes('align:') &&
        !trimmed.includes('position:')) {
        const cleaned = trimmed.replace(/<\d{2}:\d{2}:\d{2}\.\d{3}>/g, '')
          .replace(/<\/?c>/g, '')
          .trim();
        if (cleaned) {
          textLines.push(cleaned);
        }
      }
    }

    const rawContent = textLines.join(' ').replace(/\s+/g, ' ').trim();
    console.log(`[Transcript] Extracted ${rawContent.length} characters`);
    console.log(`[Transcript] Preview: ${rawContent.substring(0, 150)}...`);

    if (rawContent.length < 50) {
      throw new Error('Transcript too short, likely invalid');
    }

    let fullTranscript = rawContent;
    try {
      console.log('[Transcript] Translating to English...');
      const translated = await translateText(rawContent, 'en');
      if (translated && translated !== rawContent) {
        fullTranscript = `${rawContent} ||| ${translated}`;
      }
    } catch (err) {
      console.error('[Transcript] Translation failed:', err.message);
    }

    return fullTranscript;
  } catch (err) {
    console.error(`[Transcript] yt-dlp error:`, err.message);
    throw err;
  }
}

// Legacy wrapper for Cron (handles saving automatically for automated items)
async function fetchTranscript(id) {
  const item = db.prepare('SELECT * FROM automated_prophecies WHERE id = ?').get(id);
  if (item) {
    try {
      const text = await fetchTranscriptText(id);
      db.prepare('UPDATE automated_prophecies SET transcript = ?, transcriptStatus = ? WHERE id = ?')
        .run(text, 'Draft', id);
      return { ...item, transcript: text, transcriptStatus: 'Draft' };
    } catch (e) {
      console.error(`Failed automated fetch for ${id}: ${e.message}`);
      return null;
    }
  }
  return null;
}


cron.schedule('0 0 */2 * *', () => fetchYouTubeProphecies());
fetchYouTubeProphecies();

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
  const { username, password } = req.body;
  const clientIP = req.ip;

  // Check if IP is locked out
  const attempts = failedLoginAttempts.get(clientIP) || { count: 0, lockedUntil: null };
  if (attempts.lockedUntil && attempts.lockedUntil > Date.now()) {
    const remainingMinutes = Math.ceil((attempts.lockedUntil - Date.now()) / 60000);
    logSecurityEvent(clientIP, 'LOCKOUT_REJECTION', `Attempt while locked. Remaining: ${remainingMinutes}m`);
    return res.status(429).json({
      message: `Account locked. Try again in ${remainingMinutes} minutes.`
    });
  }

  // Credentials MUST be in .env file
  const envUser = process.env.ADMIN_USERNAME;
  const envPassHash = process.env.ADMIN_PASSWORD_HASH;
  const envPassPlain = process.env.ADMIN_PASSWORD; // Fallback for migration

  if (!envUser) {
    console.error('CRITICAL: ADMIN_USERNAME must be set in .env');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  let isPasswordValid = false;

  // Check if password hash exists (preferred)
  if (envPassHash) {
    try {
      isPasswordValid = await bcrypt.compare(password, envPassHash);
    } catch (err) {
      console.error('bcrypt compare error:', err.message);
    }
  } else if (envPassPlain) {
    // Fallback: plain text comparison (for migration)
    isPasswordValid = (password === envPassPlain);
    if (isPasswordValid) {
      console.warn('WARNING: Using plain text password. Run password change to migrate to hash.');
    }
  } else {
    console.error('CRITICAL: ADMIN_PASSWORD or ADMIN_PASSWORD_HASH must be set in .env');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  if (username === envUser && isPasswordValid) {
    // Clear failed attempts on successful login
    failedLoginAttempts.delete(clientIP);

    // Generate secure JWT with 24-hour expiration
    const token = jwt.sign(
      { username: envUser, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    res.json({ token, user: { username: envUser } });
  } else {
    // Track failed attempt
    attempts.count += 1;

    // Lock account after 5 failed attempts for 30 minutes
    if (attempts.count >= 5) {
      attempts.lockedUntil = Date.now() + (30 * 60 * 1000); // 30 minutes
      logger.warn(`IP ${clientIP} locked out after 5 failed login attempts`);
      logSecurityEvent(clientIP, 'ACCOUNT_LOCKOUT', '5 failed attempts reached');
    } else {
      logSecurityEvent(clientIP, 'LOGIN_FAILED', `Attempt ${attempts.count} for user: ${username}`);
    }

    failedLoginAttempts.set(clientIP, attempts);

    // Avoid timing attacks by using generic message
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Admin Password Change - Secure endpoint with bcrypt hashing
app.post('/api/auth/change-password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  // Validate input
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ message: 'Current and new password are required' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters' });
  }

  // Verify current password
  const envPassHash = process.env.ADMIN_PASSWORD_HASH;
  const envPassPlain = process.env.ADMIN_PASSWORD;

  let isCurrentPasswordValid = false;

  if (envPassHash) {
    try {
      isCurrentPasswordValid = await bcrypt.compare(currentPassword, envPassHash);
    } catch (err) {
      console.error('bcrypt compare error:', err.message);
    }
  } else if (envPassPlain) {
    isCurrentPasswordValid = (currentPassword === envPassPlain);
  }

  if (!isCurrentPasswordValid) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  // Hash the new password and update .env file
  try {
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    const envPath = path.join(__dirname, '../.env');
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Replace or add ADMIN_PASSWORD_HASH
    if (envContent.includes('ADMIN_PASSWORD_HASH=')) {
      envContent = envContent.replace(
        /ADMIN_PASSWORD_HASH=.*/,
        `ADMIN_PASSWORD_HASH=${newPasswordHash}`
      );
    } else {
      envContent += `\nADMIN_PASSWORD_HASH=${newPasswordHash}`;
    }

    // Remove plain text password if it exists (migration)
    envContent = envContent.replace(/\nADMIN_PASSWORD=.*/, '');
    envContent = envContent.replace(/^ADMIN_PASSWORD=.*\n?/m, '');

    fs.writeFileSync(envPath, envContent.trim() + '\n');

    // Update in-memory values
    process.env.ADMIN_PASSWORD_HASH = newPasswordHash;
    delete process.env.ADMIN_PASSWORD;

    console.log('Admin password changed and hashed successfully');
    res.json({ message: 'Password changed successfully. Please login again.' });
  } catch (err) {
    console.error('Failed to update password:', err);
    res.status(500).json({ message: 'Failed to update password' });
  }
});

// Helper for CRUD operations using SQLite
const handleSqliteCrud = (tableName, req, res) => {
  console.log(`${req.method} request for ${tableName}`);

  if (req.method === 'GET') {
    const items = db.prepare(`SELECT * FROM ${tableName}`).all();
    res.json(items);
  } else if (req.method === 'POST') {
    const columns = Object.keys(req.body);
    const placeholders = columns.map(() => '?').join(', ');
    const values = columns.map(col => {
      const val = req.body[col];
      return (typeof val === 'object') ? JSON.stringify(val) : val;
    });

    // Add fileUrl if provided
    let finalColumns = [...columns];
    let finalValues = [...values];
    if (req.file) {
      finalColumns.push('src'); // For gallery/etc
      finalValues.push(`/uploads/${req.file.filename}`);
    }

    const sql = `INSERT INTO ${tableName} (${finalColumns.join(', ')}) VALUES (${finalColumns.map(() => '?').join(', ')})`;
    const info = db.prepare(sql).run(...finalValues);

    // Fetch and return the new item
    const newItem = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(info.lastInsertRowid);
    res.json(newItem);
  } else if (req.method === 'PUT') {
    const { id } = req.params;
    const columns = Object.keys(req.body);
    const setClause = columns.map(col => `${col} = ?`).join(', ');
    const values = columns.map(col => {
      const val = req.body[col];
      return (typeof val === 'object') ? JSON.stringify(val) : val;
    });

    if (req.file) {
      // Need specialized handling for different tables src/pdf/image
      // For now, let's assume 'src' or 'image' or 'pdf' based on table
      // Actually, better to explicitly handle these in specific routes or make this helper smarter
    }

    const sql = `UPDATE ${tableName} SET ${setClause} WHERE id = ?`;
    db.prepare(sql).run(...values, id);

    const updatedItem = db.prepare(`SELECT * FROM ${tableName} WHERE id = ?`).get(id);
    res.json(updatedItem);
  } else if (req.method === 'DELETE') {
    const { id } = req.params;
    db.prepare(`DELETE FROM ${tableName} WHERE id = ?`).run(id);
    res.json({ success: true });
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
// 2. Submit Pledge
app.post('/api/satvic/pledge', (req, res) => {
  const { name, email, item } = req.body;

  if (!name || !item) {
    return res.status(400).json({ message: 'Name and pledge item are required.' });
  }

  try {
    const info = db.prepare('INSERT INTO pledges (name, email, item, date) VALUES (?, ?, ?, ?)').run(
      name,
      email || 'Anonymous',
      item,
      new Date().toISOString()
    );
    res.json({ success: true, id: info.lastInsertRowid, message: 'Pledge recorded successfully!' });
  } catch (err) {
    logger.error('Pledge Error:', err);
    res.status(500).json({ message: 'Failed to save pledge.' });
  }
});

// 3. Get Pledge Stats (Social Proof)
app.get('/api/satvic/stats', (req, res) => {
  try {
    const total = db.prepare('SELECT COUNT(*) as count FROM pledges').get().count;

    // Get count for today (local time match)
    const todayStr = new Date().toISOString().split('T')[0];
    const today = db.prepare('SELECT COUNT(*) as count FROM pledges WHERE date LIKE ?').get(`${todayStr}%`).count;

    const recent = db.prepare('SELECT name, item FROM pledges ORDER BY id DESC LIMIT 5').all();
    res.json({ total, today, recent });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
});

// Video Review (Alias for prophecies list but focused on transcript editing)
app.get('/api/videoreview', verifyToken, (req, res) => {
  const manual = db.prepare('SELECT * FROM prophecies').all();
  const automated = db.prepare('SELECT * FROM automated_prophecies').all();
  res.json({ manual, automated });
});


// Prophecies
app.route('/api/prophecies')
  .get((req, res) => {
    const manual = db.prepare('SELECT * FROM prophecies').all();
    const automated = db.prepare('SELECT * FROM automated_prophecies').all();

    const manualYouTubeIds = new Set();
    manual.forEach(item => {
      const yId = getYouTubeId(item.link);
      if (yId) manualYouTubeIds.add(yId);
    });

    const filteredAutomated = automated.filter(item => !manualYouTubeIds.has(item.id));
    res.json({ manual, automated: filteredAutomated });
  })
  .post(verifyToken, upload.single('file'), (req, res) => {
    const { title, link, thumbnail, description, year, type, summary, summaryStatus, transcript, transcriptStatus } = req.body;
    let finalThumbnail = thumbnail;
    if (req.file) finalThumbnail = `/uploads/${req.file.filename}`;

    const info = db.prepare(`
      INSERT INTO prophecies (title, link, thumbnail, description, year, type, summary, summaryStatus, transcript, transcriptStatus)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(title, link, finalThumbnail, description, year, type || 'manual', summary, summaryStatus, transcript, transcriptStatus);

    const newItem = db.prepare('SELECT * FROM prophecies WHERE id = ?').get(info.lastInsertRowid);
    res.json(newItem);
  });

app.route('/api/prophecies/:id')
  .get((req, res) => {
    const { id } = req.params;
    let item = db.prepare('SELECT * FROM prophecies WHERE id = ?').get(id);
    if (!item) {
      item = db.prepare('SELECT * FROM automated_prophecies WHERE id = ?').get(id);
    }
    if (item) res.json(item);
    else res.status(404).json({ message: 'Prophecy not found' });
  })
  .put(verifyToken, upload.single('file'), (req, res) => {
    const { id } = req.params;
    const { title, link, thumbnail, description, year, type, summary, summaryStatus, transcript, transcriptStatus } = req.body;

    let finalThumbnail = thumbnail;
    if (req.file) finalThumbnail = `/uploads/${req.file.filename}`;

    db.prepare(`
      UPDATE prophecies 
      SET title = ?, link = ?, thumbnail = ?, description = ?, year = ?, type = ?, summary = ?, summaryStatus = ?, transcript = ?, transcriptStatus = ?
      WHERE id = ?
    `).run(title, link, finalThumbnail, description, year, type, summary, summaryStatus, transcript, transcriptStatus, id);

    const updatedItem = db.prepare('SELECT * FROM prophecies WHERE id = ?').get(id);
    res.json(updatedItem);
  })
  .delete(verifyToken, (req, res) => {
    db.prepare('DELETE FROM prophecies WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });


// Prophecy Highlight (Multiple Text Cards)
app.route('/api/prophecy-highlight')
  .get((req, res) => {
    const data = db.prepare('SELECT * FROM highlights ORDER BY id DESC').all();
    res.json(data);
  })
  .post(verifyToken, (req, res) => {
    const { title, year, content } = req.body;
    const info = db.prepare('INSERT INTO highlights (title, year, content) VALUES (?, ?, ?)').run(title, year || new Date().getFullYear().toString(), content);
    const newItem = db.prepare('SELECT * FROM highlights WHERE id = ?').get(info.lastInsertRowid);
    res.json(newItem);
  });

app.route('/api/prophecy-highlight/:id')
  .put(verifyToken, (req, res) => {
    const { title, year, content } = req.body;
    db.prepare('UPDATE highlights SET title = ?, year = ?, content = ? WHERE id = ?').run(title, year, content, req.params.id);
    const updated = db.prepare('SELECT * FROM highlights WHERE id = ?').get(req.params.id);
    res.json(updated);
  })
  .delete(verifyToken, (req, res) => {
    db.prepare('DELETE FROM highlights WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });



// Unified Video Routes (for Transcripts across both types)
app.post('/api/videos/:id/transcript', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    // 1. Try Automated First
    const autoItem = db.prepare('SELECT * FROM automated_prophecies WHERE id = ?').get(id);
    if (autoItem) {
      const text = await fetchTranscriptText(id);
      db.prepare('UPDATE automated_prophecies SET transcript = ?, transcriptStatus = ? WHERE id = ?')
        .run(text, 'Draft', id);
      return res.json({ ...autoItem, transcript: text, transcriptStatus: 'Draft' });
    }

    // 2. Try Manual
    const manualItem = db.prepare('SELECT * FROM prophecies WHERE id = ?').get(id);
    if (manualItem) {
      const youtubeId = getYouTubeId(manualItem.link);
      if (!youtubeId) return res.status(400).json({ message: 'Invalid YouTube URL' });
      const text = await fetchTranscriptText(youtubeId);
      db.prepare('UPDATE prophecies SET transcript = ?, transcriptStatus = ? WHERE id = ?')
        .run(text, 'Draft', id);
      return res.json({ ...manualItem, transcript: text, transcriptStatus: 'Draft' });
    }

    res.status(404).json({ message: 'Video not found' });
  } catch (error) {
    console.error(`Transcript endpoint error:`, error.message);
    res.status(500).json({ message: `Failed: ${error.message}` });
  }
});

app.put('/api/videos/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { transcript, transcriptStatus } = req.body;

  let table = null;
  const isAuto = db.prepare('SELECT id FROM automated_prophecies WHERE id = ?').get(id);
  if (isAuto) table = 'automated_prophecies';
  else {
    const isManual = db.prepare('SELECT id FROM prophecies WHERE id = ?').get(id);
    if (isManual) table = 'prophecies';
  }

  if (!table) return res.status(404).json({ message: 'Video not found' });

  // Build dynamic SQL for partial update
  let updates = [];
  let params = [];

  if (transcript !== undefined) {
    updates.push('transcript = ?');
    params.push(transcript);
  }
  if (transcriptStatus !== undefined) {
    updates.push('transcriptStatus = ?');
    params.push(transcriptStatus);
  }

  if (updates.length > 0) {
    const sql = `UPDATE ${table} SET ${updates.join(', ')} WHERE id = ?`;
    params.push(id);
    db.prepare(sql).run(...params);
  }

  res.json({ success: true });
});


// Announcements
app.route('/api/announcements')
  .get((req, res) => {
    const items = db.prepare('SELECT * FROM announcements').all();
    res.json(items);
  })
  .post(verifyToken, upload.single('file'), (req, res) => {
    const { title, description, year } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const info = db.prepare('INSERT INTO announcements (title, description, year, fileUrl) VALUES (?, ?, ?, ?)').run(title, description, year, fileUrl);
    res.json(db.prepare('SELECT * FROM announcements WHERE id = ?').get(info.lastInsertRowid));
  });
app.route('/api/announcements/:id')
  .get((req, res) => {
    const item = db.prepare('SELECT * FROM announcements WHERE id = ?').get(req.params.id);
    if (item) res.json(item);
    else res.status(404).json({ message: 'Announcement not found' });
  })
  .put(verifyToken, upload.single('file'), (req, res) => {
    const { id } = req.params;
    const { title, description, year } = req.body;

    let sql = 'UPDATE announcements SET title = ?, description = ?, year = ?';
    let params = [title, description, year];

    if (req.file) {
      sql += ', fileUrl = ?';
      params.push(`/uploads/${req.file.filename}`);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    db.prepare(sql).run(...params);
    res.json(db.prepare('SELECT * FROM announcements WHERE id = ?').get(id));
  })
  .delete(verifyToken, (req, res) => {
    db.prepare('DELETE FROM announcements WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

// YouTube Feed
app.get('/api/youtube', (req, res) => {
  try {
    const allVideos = db.prepare('SELECT * FROM automated_prophecies ORDER BY published DESC LIMIT 50').all();

    // Split into shorts and full videos based on type or title
    const shorts = allVideos.filter(v => v.type === 'short' || v.title.toLowerCase().includes('#shorts'));
    const full = allVideos.filter(v => v.type !== 'short' && !v.title.toLowerCase().includes('#shorts'));

    res.json({ shorts, full });
  } catch (err) {
    console.error('Error fetching YouTube feed:', err);
    res.status(500).json({ error: 'Failed to fetch YouTube feed' });
  }
});

// Gallery
app.route('/api/gallery')
  .get((req, res) => {
    res.json(db.prepare('SELECT * FROM gallery').all());
  })
  .post(verifyToken, upload.single('image'), (req, res) => {
    const { alt } = req.body;
    const src = `/uploads/${req.file.filename}`;
    const info = db.prepare('INSERT INTO gallery (alt, src) VALUES (?, ?)').run(alt, src);
    res.json(db.prepare('SELECT * FROM gallery WHERE id = ?').get(info.lastInsertRowid));
  });
app.route('/api/gallery/:id')
  .put(verifyToken, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { alt } = req.body;
    let sql = 'UPDATE gallery SET alt = ? WHERE id = ?';
    let params = [alt, id];
    if (req.file) {
      sql = 'UPDATE gallery SET alt = ?, src = ? WHERE id = ?';
      params = [alt, `/uploads/${req.file.filename}`, id];
    }
    db.prepare(sql).run(...params);
    res.json(db.prepare('SELECT * FROM gallery WHERE id = ?').get(id));
  })
  .delete(verifyToken, (req, res) => {
    db.prepare('DELETE FROM gallery WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

// Literature
app.route('/api/literature')
  .get((req, res) => {
    const data = db.prepare('SELECT * FROM literature').all().map(item => {
      try { item.type = JSON.parse(item.type); } catch (e) { }
      return item;
    });
    res.json(data);
  })
  .post(verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), (req, res) => {
    const { title, author, description, type } = req.body;
    const image = req.files['image'] ? `/uploads/${req.files['image'][0].filename}` : null;
    const pdf = req.files['pdf'] ? `/uploads/${req.files['pdf'][0].filename}` : null;
    const info = db.prepare('INSERT INTO literature (title, author, description, image, pdf, type) VALUES (?, ?, ?, ?, ?, ?)').run(title, author, description, image, pdf, type);
    res.json(db.prepare('SELECT * FROM literature WHERE id = ?').get(info.lastInsertRowid));
  });
app.route('/api/literature/:id')
  .put(verifyToken, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]), (req, res) => {
    const { id } = req.params;
    const { title, author, description, type } = req.body;

    let sql = 'UPDATE literature SET title = ?, author = ?, description = ?, type = ?';
    let params = [title, author, description, type];

    if (req.files['image']) {
      sql += ', image = ?';
      params.push(`/uploads/${req.files['image'][0].filename}`);
    }
    if (req.files['pdf']) {
      sql += ', pdf = ?';
      params.push(`/uploads/${req.files['pdf'][0].filename}`);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    db.prepare(sql).run(...params);
    res.json(db.prepare('SELECT * FROM literature WHERE id = ?').get(id));
  })
  .delete(verifyToken, (req, res) => {
    db.prepare('DELETE FROM literature WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

// Prarthana
app.route('/api/prarthana')
  .get((req, res) => res.json(db.prepare('SELECT * FROM prarthana').all()))
  .post(verifyToken, (req, res) => {
    console.log('POST /api/prarthana', req.body);
    const { title, content, description } = req.body;
    const info = db.prepare('INSERT INTO prarthana (title, content, description) VALUES (?, ?, ?)').run(title, content, description);
    res.json(db.prepare('SELECT * FROM prarthana WHERE id = ?').get(info.lastInsertRowid));
  });
app.route('/api/prarthana/:id')
  .put(verifyToken, (req, res) => {
    const { id } = req.params;
    console.log(`PUT /api/prarthana/${id}`, req.body);
    const { title, content, description } = req.body;
    db.prepare('UPDATE prarthana SET title = ?, content = ?, description = ? WHERE id = ?')
      .run(title, content, description, id);
    res.json(db.prepare('SELECT * FROM prarthana WHERE id = ?').get(id));
  })
  .delete(verifyToken, (req, res) => {
    db.prepare('DELETE FROM prarthana WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

// Profiles
app.get('/api/profiles', (req, res) => res.json(db.prepare('SELECT * FROM profiles').all()));
app.post('/api/profiles', verifyToken, upload.single('image'), (req, res) => {
  const { id, title, description } = req.body;
  let image = null;
  if (req.file) image = `/uploads/${req.file.filename}`;

  db.prepare('INSERT OR REPLACE INTO profiles (id, title, description, image) VALUES (?, ?, ?, COALESCE(?, (SELECT image FROM profiles WHERE id = ?)))')
    .run(id, title, description, image, id);

  res.json(db.prepare('SELECT * FROM profiles WHERE id = ?').get(id));
});

app.route('/api/profiles/:id')
  .put(verifyToken, upload.single('image'), (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;
    let image = null;
    if (req.file) image = `/uploads/${req.file.filename}`;

    let sql = 'UPDATE profiles SET title = ?, description = ?';
    let params = [title, description];

    if (image) {
      sql += ', image = ?';
      params.push(image);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    db.prepare(sql).run(...params);
    res.json(db.prepare('SELECT * FROM profiles WHERE id = ?').get(id));
  });

// Downloads
app.route('/api/downloads')
  .get((req, res) => res.json(db.prepare('SELECT * FROM downloads').all()))
  .post(verifyToken, upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'cdrFile', maxCount: 1 }]), (req, res) => {
    const { title, description, type, location, year } = req.body;
    const pdf = req.files['pdfFile'] ? `/uploads/${req.files['pdfFile'][0].filename}` : null;
    const cdrFile = req.files['cdrFile'] ? `/uploads/${req.files['cdrFile'][0].filename}` : null;
    const info = db.prepare('INSERT INTO downloads (title, description, pdf, cdrFile, type, location, year) VALUES (?, ?, ?, ?, ?, ?, ?)').run(title, description, pdf, cdrFile, type, location, year);
    res.json(db.prepare('SELECT * FROM downloads WHERE id = ?').get(info.lastInsertRowid));
  });
app.route('/api/downloads/:id')
  .put(verifyToken, upload.fields([{ name: 'pdfFile', maxCount: 1 }, { name: 'cdrFile', maxCount: 1 }]), (req, res) => {
    const { id } = req.params;
    const { title, description, type, location, year } = req.body;

    let sql = 'UPDATE downloads SET title = ?, description = ?, type = ?, location = ?, year = ?';
    let params = [title, description, type, location, year];

    if (req.files['pdfFile']) {
      sql += ', pdf = ?';
      params.push(`/uploads/${req.files['pdfFile'][0].filename}`);
    }
    if (req.files['cdrFile']) {
      sql += ', cdrFile = ?';
      params.push(`/uploads/${req.files['cdrFile'][0].filename}`);
    }

    sql += ' WHERE id = ?';
    params.push(id);

    db.prepare(sql).run(...params);
    res.json(db.prepare('SELECT * FROM downloads WHERE id = ?').get(id));
  })
  .delete(verifyToken, (req, res) => {
    db.prepare('DELETE FROM downloads WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });


// Newsletter Subscription
app.post('/api/newsletter/subscribe', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  try {
    // 1. Save to Database
    const info = db.prepare('INSERT INTO newsletter_subscribers (email, subscribed_at) VALUES (?, ?)').run(
      email,
      new Date().toISOString()
    );

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
    if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(409).json({ message: 'This email is already subscribed.' });
    }
    console.error('Newsletter Error:', err);
    res.status(500).json({ message: 'Failed to subscribe.' });
  }
});

// Newsletter Subscription
app.get('/api/newsletter/subscribers', verifyToken, (req, res) => {
  try {
    const subscribers = db.prepare('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC').all();
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
    const subscribers = db.prepare('SELECT email FROM newsletter_subscribers').all();

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
