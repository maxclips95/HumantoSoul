const { pipeline } = require('@xenova/transformers');
const { db } = require('./database');
const fs = require('fs');
const path = require('path');

// Singleton to hold the model
let extractor = null;

// Clean text helper (reused from chatbot logic logic but tailored for indexing)
const cleanTextForIndex = (text) => {
    if (!text) return "";
    let cleaned = text.replace(/\r\n/g, '\n');

    // Remove heavy footer noise before indexing
    const stopMarkers = ['website /', 'subscribe', 'address of', 'follow the', 'contact:'];
    const lines = cleaned.split('\n');
    const goodLines = [];

    for (let line of lines) {
        const lower = line.toLowerCase();
        if (stopMarkers.some(m => lower.includes(m))) break; // Stop at footer
        if (!lower.startsWith('#') && line.trim().length > 0) {
            goodLines.push(line.trim());
        }
    }
    return goodLines.join('\n');
};

const chunkText = (text, maxLength = 600) => {
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const chunks = [];
    let currentChunk = "";

    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxLength) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += " " + sentence;
        }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks;
};

const SearchEngine = {
    initialize: async () => {
        if (!extractor) {
            console.log('[SearchEngine] Loading Feature Extraction Model (MiniLM)...');
            // Use quantized model for speed
            extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log('[SearchEngine] Model Loaded.');
        }
    },

    // Sync content from Source Table -> Vector Table
    syncContent: async () => {
        console.log("---------------- FORCING SYNC START (V2 - SMART) ----------------");
        await SearchEngine.initialize();

        // 1. Fetch Source Data
        const announcements = db.prepare('SELECT id, title, description FROM announcements').all();
        const prophecies = db.prepare('SELECT id, title, description FROM prophecies').all();
        const automated = db.prepare('SELECT id, title, description FROM automated_prophecies').all();
        const profiles = db.prepare('SELECT id, title, description FROM profiles').all();
        const literature = db.prepare('SELECT id, title, description, author FROM literature').all();
        const prarthana = db.prepare('SELECT id, title, content, description FROM prarthana').all(); // Prayers (Hindi mostly)
        const highlights = db.prepare('SELECT id, title, content FROM highlights').all(); // Text Prophecies

        // Static Content (Tagged as 'general' or 'biography')
        const staticDocs = [
            {
                id: 1001,
                title: 'Core Mission & About Us',
                type: 'general',
                description: `This website represents Baba Jai Gurudev and Baba Umakant Ji Maharaj (referred to as "Maalik"). They teach Sant Mat—the spiritual path to Satlok (True Home) to escape the cycle of 8.4 million (84 lakh) life forms. 
                Key teachings include chanting "Jaigurudev" for divine protection, receiving Naamdan (initiation) in person, and leading a satvic vegetarian lifestyle. This is NOT about Lord Krishna or general Hinduism - this is a specific Sant Mat lineage.`
            },
            {
                id: 1002,
                title: 'Ashram Locations & Contact',
                type: 'general',
                description: `The main ashram locations are:
                1. Ujjain Ashram (Madhya Pradesh): Opposite Pingleshwar Railway Station, Maksi Road, Ujjain. PIN: 456661. Phone: 9754700200, 9575600700.
                2. Bawal Ashram (Haryana): Phone: 8801092023, 9671307438.
                3. Thikariya Ashram (Rajasthan): Phone: 7023704540.
                Email: info@jaigurudevukm.com
                Website: www.jaigurudevukm.com`
            },
            {
                id: 1003,
                title: 'Rules & Initiation (Naamdan)',
                type: 'general',
                description: `Naamdan (Spiritual Initiation) must be received IN PERSON at the ashram or during Baba Ji's programs. There is NO online initiation. Followers must be strictly vegetarian (satvic diet) and abstain from alcohol, tobacco, and all intoxicants. Programs are held across India and abroad, predominantly in India each month.`
            },
            {
                id: 1004,
                title: 'Satvic Lifestyle & Pledge',
                type: 'general',
                description: `The Satvic Lifestyle section promotes a pure vegetarian diet (no meat, eggs, alcohol). Followers can take a pledge to give up specific non-vegetarian items. The website includes vegetarian recipes from around the world and educational content about the spiritual benefits of a plant-based diet.`
            },
            {
                id: 1005,
                title: 'Programs & Events',
                type: 'general',
                description: `Baba Umakant Ji Maharaj conducts regular spiritual programs called Satsangs across India. There are also special programs like Dukh Nivaran Kafila (Pain Relief Caravan), Sadhna Shivir (Spiritual Camps), and Sankat Mochan Ruhani Kafila (Liberation programs). Check the Announcements section for the latest program schedules.`
            },
            {
                id: 1006,
                title: 'Prophecies & Spiritual Warnings',
                type: 'general',
                description: `The Prophecies section contains spiritual warnings and predictions about future events, geopolitical changes, natural disasters, and the path to spiritual protection. These are delivered through Baba Umakant Ji Maharaj's satsangs and are available as video transcripts. Topics include warnings about 2025-2026 challenges, war predictions, disease outbreaks, and guidance on spiritual protection.`
            },
            {
                id: 1007,
                title: 'Spiritual Literature & Books',
                type: 'general',
                description: `The Literature section provides access to spiritual books, teachings, and written materials. These include works by Sant Mat teachers, spiritual guidance texts, and downloadable PDFs. Books cover topics like the path to Satlok, the nature of the soul, karma, and liberation.`
            },
            {
                id: 1008,
                title: 'Gallery & Media',
                type: 'general',
                description: `The Gallery section contains photos from satsangs, ashram events, spiritual programs, and images of Baba Jai Gurudev and Baba Umakant Ji Maharaj. It also includes images of ashram locations, devotees, and special ceremonies.`
            },
            {
                id: 1009,
                title: 'Downloads & Resources',
                type: 'general',
                description: `The Downloads section provides PDFs, posters, banners, and other materials for devotees. These include program schedules, spiritual texts, promotional materials for satsangs, and resources organized by location and year.`
            },
            {
                id: 1010,
                title: 'Admin & CMS System',
                type: 'general',
                description: `The website includes a secure admin panel for managing content. Admins can add/edit announcements, prophecies, literature, gallery images, prayers, downloads, and profiles. The admin system is protected with JWT authentication and bcrypt password hashing.`
            }
        ];

        const sources = [
            { name: 'announcements', type: 'announcement', data: announcements },
            { name: 'prophecies', type: 'prophecy', data: prophecies },
            { name: 'automated_prophecies', type: 'prophecy', data: automated },
            { name: 'profiles', type: 'biography', data: profiles },
            { name: 'literature', type: 'literature', data: literature.map(l => ({ ...l, description: `${l.title} by ${l.author}. ${l.description}` })) },
            { name: 'prarthana', type: 'ritual', data: prarthana.map(p => ({ ...p, description: `${p.content}\n${p.description}` })) },
            { name: 'highlights', type: 'prophecy', data: highlights.map(h => ({ ...h, description: h.content })) },
            { name: 'static_content', type: 'general', data: staticDocs }
        ];

        // Helper: Detect Language
        const detectLanguage = (text) => {
            const hindiChars = /[\u0900-\u097F]/;
            return hindiChars.test(text) ? 'hi' : 'en';
        };

        let totalChunks = 0;

        // Reset Index
        db.prepare('DELETE FROM content_chunks').run();

        const insertStmt = db.prepare(`
            INSERT INTO content_chunks (document_id, source_table, chunk_text, embedding, chunk_index, language, section_type)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        for (const source of sources) {
            console.log(`[SearchEngine] Indexing ${source.name} (${source.data.length} items)...`);
            for (const item of source.data) {
                // Determine Text & Language
                const desc = item.description || "";
                const fullText = `Title: ${item.title}\n${cleanTextForIndex(desc)}`;
                if (fullText.length < 30) continue;

                const lang = detectLanguage(fullText);
                const chunks = chunkText(fullText);

                for (let i = 0; i < chunks.length; i++) {
                    const chunk = chunks[i];
                    try {
                        const output = await extractor(chunk, { pooling: 'mean', normalize: true });
                        const embedding = Buffer.from(output.data.buffer);

                        let docId = 0;
                        if (typeof item.id === 'number') docId = item.id;
                        // For static docs, use their assigned numeric ID
                        else if (typeof item.id === 'string' && item.id.startsWith('static_')) {
                            docId = parseInt(item.id.replace('static_', '')); // Attempt to parse if it's a static ID string
                            if (isNaN(docId)) docId = 0; // Fallback if parsing fails
                        }

                        insertStmt.run(docId, source.name, chunk, embedding, i, lang, source.type || 'general');
                        totalChunks++;
                    } catch (e) {
                        console.error(`Error embedding chunk (${source.name}): ${e.message}`);
                    }
                }
            }
        }
        console.log(`[SearchEngine] Smart Sync Complete. Total Chunks: ${totalChunks}`);
    },

    search: async (query, limit = 3) => {
        await SearchEngine.initialize();

        // 1. Detect Query Language
        const hindiChars = /[\u0900-\u097F]/;
        const queryLang = hindiChars.test(query) ? 'hi' : 'en';
        console.log(`[SearchEngine] Searching in language: ${queryLang}`);

        // 2. Embed Query
        const output = await extractor(query, { pooling: 'mean', normalize: true });
        const queryVector = output.data;

        // 3. Fetch Candidate Chunks (Filter by Language)
        const candidates = db.prepare('SELECT chunk_text, embedding, section_type FROM content_chunks WHERE language = ?')
            .all(queryLang);

        if (candidates.length === 0) {
            // Fallback: If no hindi, try english (or vice versa) if it was short query
            // But for "Smartest Bot", strictness is better.
            return [];
        }

        // 4. Cosine Similarity & Rank
        let results = candidates.map(chunk => {
            const vec = new Float32Array(chunk.embedding.buffer, chunk.embedding.byteOffset, chunk.embedding.byteLength / 4);
            let dot = 0.0;
            for (let i = 0; i < vec.length; i++) dot += vec[i] * queryVector[i];

            // Boost certain sections based on logic if needed (e.g. 1.2x for exact titles)
            return { score: dot, text: chunk.chunk_text, type: chunk.section_type };
        });

        results = results.filter(r => r.score > 0.35); // Threshold

        // 5. Keyword Fallback (Critical for Hindi)
        if (results.length === 0 && query.length > 2) {
            console.log('[SearchEngine] No semantic matches. Trying keyword fallback.');
            const keywordMatches = db.prepare('SELECT chunk_text, section_type FROM content_chunks WHERE language = ? AND chunk_text LIKE ? LIMIT 5')
                .all(queryLang, `%${query}%`);

            results = keywordMatches.map(m => ({
                score: 0.9, // Artificial high score for exact keyword matches
                text: m.chunk_text,
                type: m.section_type
            }));
        }

        return results
            .sort((a, b) => b.score - a.score)
            .slice(0, limit);
    }
};

module.exports = SearchEngine;
