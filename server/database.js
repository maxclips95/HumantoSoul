const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'database.db');
const db = new Database(dbPath);

// Create tables if they don't exist
const initializeDatabase = () => {
    // Announcements
    db.prepare(`
        CREATE TABLE IF NOT EXISTS announcements (
            id INTEGER PRIMARY KEY,
            title TEXT,
            description TEXT,
            year TEXT,
            fileUrl TEXT
        )
    `).run();

    // Prophecies (Manual)
    db.prepare(`
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
    db.prepare(`
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
    db.prepare(`
        CREATE TABLE IF NOT EXISTS highlights (
            id INTEGER PRIMARY KEY,
            title TEXT,
            year TEXT,
            content TEXT
        )
    `).run();

    // Gallery
    db.prepare(`
        CREATE TABLE IF NOT EXISTS gallery (
            id INTEGER PRIMARY KEY,
            alt TEXT,
            src TEXT
        )
    `).run();

    // Literature
    db.prepare(`
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
    db.prepare(`
        CREATE TABLE IF NOT EXISTS prarthana (
            id INTEGER PRIMARY KEY,
            title TEXT,
            content TEXT,
            description TEXT
        )
    `).run();

    // Downloads
    db.prepare(`
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
    db.prepare(`
        CREATE TABLE IF NOT EXISTS profiles (
            id TEXT PRIMARY KEY,
            title TEXT,
            description TEXT,
            image TEXT
        )
    `).run();

    // Pledges (Satvic Lifestyle)
    db.prepare(`
        CREATE TABLE IF NOT EXISTS pledges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            item TEXT,
            date TEXT
        )
    `).run();

    // Semantic Search - Content Chunks (V2 - Smart Metadata)
    db.prepare(`
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
    db.prepare(`
        CREATE TABLE IF NOT EXISTS newsletter_subscribers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            subscribed_at TEXT
        )
    `).run();

    console.log('Database initialized successfully.');
};

module.exports = {
    db,
    initializeDatabase
};
