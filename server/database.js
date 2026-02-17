const Database = require('better-sqlite3');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const USE_SUPABASE = process.env.USE_SUPABASE === 'true';

// SQLite setup
const dbPath = path.join(__dirname, 'database.db');
const sqliteDb = new Database(dbPath);

// Supabase setup
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder';
const supabase = createClient(supabaseUrl, supabaseKey);

// Database abstraction layer
const db = {
    selectAll: async (table) => {
        if (USE_SUPABASE) {
            const { data, error } = await supabase.from(table).select('*');
            if (error) {
                console.error(`Supabase error (selectAll ${table}):`, error);
                throw error;
            }
            return data || [];
        } else {
            return Promise.resolve(sqliteDb.prepare(`SELECT * FROM ${table}`).all());
        }
    },

    selectById: async (table, id) => {
        if (USE_SUPABASE) {
            const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
            if (error) throw error;
            return data;
        } else {
            return Promise.resolve(sqliteDb.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id));
        }
    },

    insert: async (table, values) => {
        if (USE_SUPABASE) {
            const { data, error } = await supabase.from(table).insert(values).select().single();
            if (error) throw error;
            return data;
        } else {
            const columns = Object.keys(values);
            const placeholders = columns.map(() => '?').join(', ');
            const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
            const info = sqliteDb.prepare(sql).run(...Object.values(values));
            // Fetch the inserted row (assuming 'id' is the primary key)
            // Note: For tables with TEXT primary keys (like automated_prophecies), this might need adjustment if not returning id
            // But lastInsertRowid works for INTEGER PRIMARY KEY. For others, we might return values.
            return Promise.resolve(sqliteDb.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(info.lastInsertRowid) || values);
        }
    },

    update: async (table, id, values) => {
        if (USE_SUPABASE) {
            const { data, error } = await supabase.from(table).update(values).eq('id', id).select().single();
            if (error) throw error;
            return data;
        } else {
            const columns = Object.keys(values);
            const setClause = columns.map(col => `${col} = ?`).join(', ');
            const sql = `UPDATE ${table} SET ${setClause} WHERE id = ?`;
            sqliteDb.prepare(sql).run(...Object.values(values), id);
            return Promise.resolve(sqliteDb.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id));
        }
    },

    deleteById: async (table, id) => {
        if (USE_SUPABASE) {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            return Promise.resolve({ success: true });
        } else {
            sqliteDb.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
            return Promise.resolve({ success: true });
        }
    },

    upsert: async (table, values) => {
        if (USE_SUPABASE) {
            const { data, error } = await supabase.from(table).upsert(values).select();
            if (error) throw error;
            return data;
        } else {
            const columns = Object.keys(values);
            const placeholders = columns.map(() => '?').join(', ');
            const sql = `INSERT OR REPLACE INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
            sqliteDb.prepare(sql).run(...Object.values(values));
            return Promise.resolve(values);
        }
    },

    // Legacy/Raw access
    prepare: (sql) => sqliteDb.prepare(sql), // BACKWARD COMPATIBILITY
    transaction: (fn) => sqliteDb.transaction(fn), // BACKWARD COMPATIBILITY
    raw: { sqlite: sqliteDb, supabase: supabase }
};

// Initialize Database (Create Tables for SQLite)
const initializeDatabase = () => {
    if (USE_SUPABASE) {
        console.log('Using Supabase cloud database');
        // We can still initialize SQLite as specific backup or local mirror if needed,
        // but for now let's just log.
        // However, if we want to support seamless switching, we should probably ensure SQLite is also ready.
    } else {
        console.log('Using SQLite database (local file)');
    }

    // Always initialize SQLite tables to ensure local db, checks, and structure are valid
    // Announcements
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS announcements (
            id INTEGER PRIMARY KEY,
            title TEXT,
            description TEXT,
            year TEXT,
            fileUrl TEXT
        )
    `).run();

    // Prophecies (Manual)
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS prophecies (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            link TEXT,
            thumbnail TEXT,
            description TEXT,
            year TEXT,
            type TEXT,
            summary TEXT,
            summaryStatus TEXT,
            transcript TEXT,
            transcriptStatus TEXT
        )
    `).run();

    // Automated Prophecies
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS automated_prophecies (
            id TEXT PRIMARY KEY,
            title TEXT,
            link TEXT,
            published TEXT,
            description TEXT,
            thumbnail TEXT,
            type TEXT,
            transcript TEXT,
            transcriptStatus TEXT
        )
    `).run();

    // Prophecy Highlights (Text Prophecies)
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS highlights (
            id INTEGER PRIMARY KEY,
            title TEXT,
            year TEXT,
            content TEXT
        )
    `).run();

    // Gallery
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY,
            alt TEXT,
            src TEXT
        )
    `).run();

    // Literature
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS literature (
            id INTEGER PRIMARY KEY,
            title TEXT,
            author TEXT,
            description TEXT,
            image TEXT,
            pdf TEXT,
            type TEXT
        )
    `).run();

    // Prarthana
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS prarthana (
            id INTEGER PRIMARY KEY,
            title TEXT,
            content TEXT,
            description TEXT
        )
    `).run();

    // Downloads
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS downloads (
            id INTEGER PRIMARY KEY,
            title TEXT,
            description TEXT,
            pdf TEXT,
            cdrFile TEXT,
            type TEXT,
            location TEXT,
            year TEXT
        )
    `).run();

    // Profiles (Teachers/Mahatmas)
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            image TEXT
        )
    `).run();

    // Pledges (Satvic Lifestyle)
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS pledges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            item TEXT,
            date TEXT
        )
    `).run();

    // Semantic Search - Content Chunks (V2 - Smart Metadata)
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS content_chunks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_id INTEGER,
            source_table TEXT,
            chunk_text TEXT,
            embedding BLOB,
            chunk_index INTEGER,
            language TEXT DEFAULT 'en',       -- 'en' or 'hi'
            section_type TEXT DEFAULT 'general', -- 'biography', 'prophecy', 'transcript'
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `).run();

    // Newsletter Subscribers
    sqliteDb.prepare(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            subscribed_at TEXT
        )
    `).run();

    console.log('Database tables initialized (SQLite locally).');
};

module.exports = {
    db,
    supabase,
    initializeDatabase,
    USE_SUPABASE
};
