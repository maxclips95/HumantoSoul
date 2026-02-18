/**
 * chatbot.js — AI Chatbot using Supabase data
 * All DB queries use async Supabase methods.
 */
const express = require('express');
const router = express.Router();
const { db } = require('./database');
const { NlpManager } = require('node-nlp');
const SearchEngine = require('./search_engine');

const manager = new NlpManager({ languages: ['en'], forceNER: true, nlu: { useNoneFeature: true } });

// --- MANUAL HINDI INTENT MAPPER ---
const detectHindiIntent = (query) => {
    const q = query.toLowerCase();
    if (q.includes('नमस्ते') || q.includes('जयगुरुदेव') || q.includes('हेलो')) return 'greetings';
    if (q.includes('भविष्यवाणी') || q.includes('चेतावनी') || q.includes('आने वाला समय') || q.includes('भविष्य')) return 'prophecy.latest';
    if (q.includes('समाचार') || q.includes('सूचना') || q.includes('अपडेट') || q.includes('नई खबर')) return 'news.latest';
    if (q.includes('मालिक') || q.includes('गुरुदेव') || q.includes('बाबा')) return 'profile.guru';
    if (q.includes('प्रोग्राम') || q.includes('सत्संग') || q.includes('शिविर')) return 'programs.list';
    return null;
};

const cleanText = (text, displayMode = false) => {
    if (!text) return '';
    const stopMarkers = ['website /', 'subscribe', 'address of', 'follow the', 'contact:', 'google map', 'watch more'];
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const goodLines = [];
    for (const line of lines) {
        const lower = line.toLowerCase().trim();
        if (stopMarkers.some(m => lower.includes(m)) && lower.length < 100) {
            if (lower.includes('website /') || lower.includes('subscribe') || lower.includes('address')) break;
        }
        if (!lower.startsWith('#') && line.trim().length > 0) goodLines.push(line.trim());
    }
    let cleaned = goodLines.join('\n').replace(/#[a-zA-Z0-9_]+/g, '').replace(/\n{3,}/g, '\n\n').trim();
    if (!displayMode && cleaned.length > 350) cleaned = cleaned.substring(0, 350) + '...';
    return cleaned || 'Content available in video/document.';
};

// --- ASYNC DATA HELPERS (Supabase) ---

const getLatestProphecies = async () => {
    try {
        const { data: manual } = await db.raw.from('prophecies').select('title, description').order('id', { ascending: false }).limit(3);
        const { data: auto } = await db.raw.from('automated_prophecies').select('title, description').order('published', { ascending: false }).limit(3);
        const all = [...(manual || []), ...(auto || [])].slice(0, 4);
        if (all.length === 0) return 'No recent prophecies found in the database.';
        const warnings = all.map((p, i) => `### ${i + 1}. ${p.title}\n${cleanText(p.description, true)}`).join('\n\n');
        return `**Latest Spiritual Warnings & Prophecies:**\n\n${warnings}`;
    } catch (e) {
        console.error('[Chatbot] getLatestProphecies error:', e.message);
        return 'Error fetching prophecies.';
    }
};

const getLatestAnnouncements = async () => {
    try {
        const { data: rows } = await db.raw.from('announcements').select('title, description, year').order('id', { ascending: false }).limit(3);
        if (!rows || rows.length === 0) return 'No announcements available at this time.';
        const updates = rows.map((a, i) => `### ${i + 1}. ${a.title} (${a.year})\n${cleanText(a.description, true)}`).join('\n\n');
        return `**Latest Announcements:**\n\n${updates}`;
    } catch (e) {
        console.error('[Chatbot] getLatestAnnouncements error:', e.message);
        return 'Error fetching announcements.';
    }
};

const getGuruProfile = () => `### About Baba Jai Gurudev & Baba Umakant Ji Maharaj (Maalik)

**Baba Jai Gurudev** (1973-2012) was a Sant Mat master who taught the path to Satlok (True Home) and liberation from the cycle of 84 lakh life forms. He emphasized Naamdan (spiritual initiation), chanting "Jaigurudev," and living a satvic vegetarian lifestyle.

**Baba Umakant Ji Maharaj** (lovingly referred to as "Maalik") is the current spiritual guide continuing the Sant Mat lineage. He conducts regular Satsangs across India.

**Core Teachings:**
- **Naamdan**: Spiritual initiation MUST be received in person.
- **Satvic Lifestyle**: Strict vegetarian diet (no meat, eggs, alcohol/intoxicants).
- **Naam Simran**: Constant remembrance and chanting of "Jaigurudev".

**Contact:**
- Main Ashram: Ujjain, Madhya Pradesh (9754700200)
- Email: info@jaigurudevukm.com`;

const getPrograms = async () => {
    try {
        const { data: programs } = await db.raw
            .from('announcements')
            .select('title, description')
            .or('title.ilike.%program%,description.ilike.%satsang%')
            .order('id', { ascending: false })
            .limit(3);

        if (programs && programs.length > 0) {
            const list = programs.map((p, i) => `### ${i + 1}. ${p.title}\n${cleanText(p.description, true)}`).join('\n\n');
            return `**Upcoming Programs & Events:**\n\n${list}`;
        }
        return `**Regular Programs:**\n\nBaba Umakant Ji Maharaj conducts regular Satsangs across India. Special programs include: Dukh Nivaran Kafila, Sadhna Shivir, and Naamdhwani Akhand events.`;
    } catch (e) {
        console.error('[Chatbot] getPrograms error:', e.message);
        return 'Error fetching programs.';
    }
};

// Startup: Train NLP and Sync Vector Index
const initializeSystem = async () => {
    manager.addDocument('en', 'hello', 'greetings');
    manager.addDocument('en', 'hi', 'greetings');
    manager.addDocument('en', 'jai gurudev', 'greetings');
    manager.addDocument('en', 'prophecies', 'prophecy.latest');
    manager.addDocument('en', 'latest prophecies', 'prophecy.latest');
    manager.addDocument('en', 'prophecy', 'prophecy.latest');
    manager.addDocument('en', 'announcements', 'news.latest');
    manager.addDocument('en', 'news', 'news.latest');
    manager.addDocument('en', 'updates', 'news.latest');
    manager.addDocument('en', 'who is maalik', 'profile.guru');
    manager.addDocument('en', 'who is baba ji', 'profile.guru');
    manager.addDocument('en', 'who is umakant', 'profile.guru');
    manager.addDocument('en', 'about us', 'profile.guru');
    manager.addDocument('en', 'programs', 'programs.list');
    manager.addDocument('en', 'events', 'programs.list');
    manager.addDocument('en', 'satsang', 'programs.list');
    manager.addAnswer('en', 'greetings', 'Jai Gurudev! I can help you find prophecies, announcements, and teachings.');

    await manager.train();
    manager.save();
    console.log('[NLP] Model ready.');

    // Sync content for vector search
    await SearchEngine.syncContent();
};

initializeSystem();

// --- API ENDPOINT ---
router.post('/ask', async (req, res) => {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'Question required' });

    try {
        let manualIntent = detectHindiIntent(question);
        let result;

        if (manualIntent) {
            result = { intent: manualIntent, score: 1.0 };
        } else {
            result = await manager.process('en', question.toLowerCase());
        }

        console.log(`[Chatbot] Intent: ${result.intent} (Score: ${result.score})`);

        if (result.score > 0.7) {
            if (result.intent === 'greetings') return res.json({ answer: result.answer || 'Jai Gurudev! How can I help you today?' });
            if (result.intent === 'prophecy.latest') return res.json({ answer: await getLatestProphecies() });
            if (result.intent === 'news.latest') return res.json({ answer: await getLatestAnnouncements() });
            if (result.intent === 'profile.guru') return res.json({ answer: getGuruProfile() });
            if (result.intent === 'programs.list') return res.json({ answer: await getPrograms() });
        }

        // Vector Search
        console.log('[Chatbot] Routing to Vector Search...');
        const matches = await SearchEngine.search(question);

        if (matches.length > 0) {
            const cleanedMatches = matches.filter(m => !m.text.includes('Gallery image:') && m.score > 0.35).slice(0, 2);
            if (cleanedMatches.length > 0) {
                const answer = '**Here\'s what I found:**\n\n' +
                    cleanedMatches.map(m => {
                        const lines = m.text.split('\n');
                        const title = lines[0].replace('Title: ', '');
                        const body = lines.slice(1).join('\n').trim();
                        return `### ${title}\n${body}`;
                    }).join('\n\n---\n\n');
                return res.json({ answer });
            }
        }

        // Fallback
        res.json({ answer: 'I couldn\'t find a specific answer. Here are the **Latest Announcements** instead:\n\n' + await getLatestAnnouncements() });

    } catch (error) {
        console.error('[Chatbot] Error:', error.message);
        res.status(500).json({ answer: 'I apologize, I encountered an internal error.' });
    }
});

module.exports = router;
