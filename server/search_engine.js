/**
 * search_engine.js — Semantic Search using Supabase
 * Uses Xenova/all-MiniLM-L6-v2 (384-dim embeddings) stored in Supabase content_chunks table.
 */
const { pipeline } = require('@xenova/transformers');
const { db } = require('./database');

let extractor = null;

const cleanTextForIndex = (text) => {
    if (!text) return '';
    const stopMarkers = ['website /', 'subscribe', 'address of', 'follow the', 'contact:'];
    const lines = text.replace(/\r\n/g, '\n').split('\n');
    const goodLines = [];
    for (const line of lines) {
        const lower = line.toLowerCase();
        if (stopMarkers.some(m => lower.includes(m))) break;
        if (!lower.startsWith('#') && line.trim().length > 0) goodLines.push(line.trim());
    }
    return goodLines.join('\n');
};

const chunkText = (text, maxLength = 600) => {
    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
    const chunks = [];
    let currentChunk = '';
    for (const sentence of sentences) {
        if ((currentChunk + sentence).length > maxLength) {
            chunks.push(currentChunk.trim());
            currentChunk = sentence;
        } else {
            currentChunk += ' ' + sentence;
        }
    }
    if (currentChunk.trim()) chunks.push(currentChunk.trim());
    return chunks;
};

const detectLanguage = (text) => /[\u0900-\u097F]/.test(text) ? 'hi' : 'en';

const SearchEngine = {
    initialize: async () => {
        if (!extractor) {
            console.log('[SearchEngine] Loading MiniLM model...');
            extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
            console.log('[SearchEngine] Model loaded.');
        }
    },

    syncContent: async () => {
        console.log('[SearchEngine] Starting content sync to Supabase...');
        await SearchEngine.initialize();

        // Fetch all source data from Supabase
        const [announcements, prophecies, automated, profiles, literature, prarthana, highlights] = await Promise.all([
            db.selectAll('announcements'),
            db.selectAll('prophecies'),
            db.selectAll('automated_prophecies'),
            db.selectAll('profiles'),
            db.selectAll('literature'),
            db.selectAll('prarthana'),
            db.selectAll('highlights'),
        ]);

        const staticDocs = [
            { id: 1001, title: 'Core Mission & About Us', description: `This website represents Baba Jai Gurudev and Baba Umakant Ji Maharaj (referred to as "Maalik"). They teach Sant Mat—the spiritual path to Satlok (True Home) to escape the cycle of 8.4 million (84 lakh) life forms. Key teachings include chanting "Jaigurudev" for divine protection, receiving Naamdan (initiation) in person, and leading a satvic vegetarian lifestyle.` },
            { id: 1002, title: 'Ashram Locations & Contact', description: `Main ashram locations: 1. Ujjain Ashram (MP): Opposite Pingleshwar Railway Station, Maksi Road, Ujjain. PIN: 456661. Phone: 9754700200. 2. Bawal Ashram (Haryana): 8801092023. 3. Thikariya Ashram (Rajasthan): 7023704540. Email: info@jaigurudevukm.com` },
            { id: 1003, title: 'Rules & Initiation (Naamdan)', description: `Naamdan must be received IN PERSON at the ashram. No online initiation. Followers must be strictly vegetarian and abstain from alcohol, tobacco, and all intoxicants.` },
            { id: 1004, title: 'Satvic Lifestyle & Pledge', description: `The Satvic Lifestyle section promotes a pure vegetarian diet (no meat, eggs, alcohol). Followers can take a pledge to give up specific non-vegetarian items.` },
            { id: 1005, title: 'Programs & Events', description: `Baba Umakant Ji Maharaj conducts regular Satsangs across India. Special programs include Dukh Nivaran Kafila, Sadhna Shivir, and Sankat Mochan Ruhani Kafila.` },
            { id: 1006, title: 'Prophecies & Spiritual Warnings', description: `The Prophecies section contains spiritual warnings and predictions about future events, geopolitical changes, natural disasters, and the path to spiritual protection.` },
            { id: 1007, title: 'Spiritual Literature & Books', description: `The Literature section provides access to spiritual books, teachings, and written materials including works by Sant Mat teachers.` },
            { id: 1008, title: 'Gallery & Media', description: `The Gallery section contains photos from satsangs, ashram events, and images of Baba Jai Gurudev and Baba Umakant Ji Maharaj.` },
            { id: 1009, title: 'Downloads & Resources', description: `The Downloads section provides PDFs, posters, banners, and other materials for devotees including program schedules and spiritual texts.` },
            { id: 1010, title: 'Admin & CMS System', description: `The website includes a secure admin panel for managing content with JWT authentication and bcrypt password hashing.` },
        ];

        const sources = [
            { name: 'announcements', type: 'announcement', data: announcements },
            { name: 'prophecies', type: 'prophecy', data: prophecies },
            { name: 'automated_prophecies', type: 'prophecy', data: automated },
            { name: 'profiles', type: 'biography', data: profiles },
            { name: 'literature', type: 'literature', data: literature.map(l => ({ ...l, description: `${l.title} by ${l.author}. ${l.description}` })) },
            { name: 'prarthana', type: 'ritual', data: prarthana.map(p => ({ ...p, description: `${p.content}\n${p.description}` })) },
            { name: 'highlights', type: 'prophecy', data: highlights.map(h => ({ ...h, description: h.content })) },
            { name: 'static_content', type: 'general', data: staticDocs },
        ];

        // Clear existing chunks in Supabase
        const { error: deleteError } = await db.raw.from('content_chunks').delete().neq('id', 0);
        if (deleteError) {
            console.error('[SearchEngine] Failed to clear content_chunks:', deleteError.message);
            return;
        }

        let totalChunks = 0;
        const chunkBatch = [];

        for (const source of sources) {
            console.log(`[SearchEngine] Indexing ${source.name} (${source.data.length} items)...`);
            for (const item of source.data) {
                const desc = item.description || '';
                const fullText = `Title: ${item.title}\n${cleanTextForIndex(desc)}`;
                if (fullText.length < 30) continue;

                const lang = detectLanguage(fullText);
                const chunks = chunkText(fullText);

                for (let i = 0; i < chunks.length; i++) {
                    try {
                        const output = await extractor(chunks[i], { pooling: 'mean', normalize: true });
                        // Store as base64 string since Supabase doesn't support BLOB directly
                        const embeddingArray = Array.from(output.data);

                        chunkBatch.push({
                            document_id: typeof item.id === 'number' ? item.id : 0,
                            source_table: source.name,
                            chunk_text: chunks[i],
                            embedding: JSON.stringify(embeddingArray), // stored as JSON text
                            chunk_index: i,
                            language: lang,
                            section_type: source.type || 'general'
                        });
                        totalChunks++;
                    } catch (e) {
                        console.error(`[SearchEngine] Embed error (${source.name}): ${e.message}`);
                    }
                }
            }
        }

        // Batch insert in chunks of 100
        const BATCH_SIZE = 100;
        for (let i = 0; i < chunkBatch.length; i += BATCH_SIZE) {
            const batch = chunkBatch.slice(i, i + BATCH_SIZE);
            const { error } = await db.raw.from('content_chunks').insert(batch);
            if (error) console.error(`[SearchEngine] Batch insert error:`, error.message);
        }

        console.log(`[SearchEngine] Sync complete. Total chunks: ${totalChunks}`);
    },

    search: async (query, limit = 3) => {
        await SearchEngine.initialize();

        const queryLang = detectLanguage(query);
        const output = await extractor(query, { pooling: 'mean', normalize: true });
        const queryVector = output.data;

        // Fetch candidates from Supabase filtered by language
        const { data: candidates, error } = await db.raw
            .from('content_chunks')
            .select('chunk_text, embedding, section_type')
            .eq('language', queryLang);

        if (error) throw new Error(`[SearchEngine] Search query failed: ${error.message}`);
        if (!candidates || candidates.length === 0) return [];

        // Cosine similarity ranking
        let results = candidates.map(chunk => {
            const vec = JSON.parse(chunk.embedding);
            let dot = 0.0;
            for (let i = 0; i < vec.length; i++) dot += vec[i] * queryVector[i];
            return { score: dot, text: chunk.chunk_text, type: chunk.section_type };
        });

        results = results.filter(r => r.score > 0.35);

        // Keyword fallback for short/Hindi queries
        if (results.length === 0 && query.length > 2) {
            console.log('[SearchEngine] No semantic matches. Trying keyword fallback.');
            const { data: keywordMatches } = await db.raw
                .from('content_chunks')
                .select('chunk_text, section_type')
                .eq('language', queryLang)
                .ilike('chunk_text', `%${query}%`)
                .limit(5);

            results = (keywordMatches || []).map(m => ({
                score: 0.9,
                text: m.chunk_text,
                type: m.section_type
            }));
        }

        return results.sort((a, b) => b.score - a.score).slice(0, limit);
    }
};

module.exports = SearchEngine;
