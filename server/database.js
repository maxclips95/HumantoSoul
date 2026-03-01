/**
 * database.js — Pure Supabase Client
 * Production-grade Supabase Client.
 */
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('[DB] CRITICAL: SUPABASE_URL or SUPABASE_KEY is missing from environment variables.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false }
});

/**
 * Generic database abstraction layer.
 * All methods are async and throw on error.
 */
const db = {
    /**
     * Select all rows from a table.
     */
    selectAll: async (table) => {
        const { data, error } = await supabase.from(table).select('*');
        if (error) throw new Error(`[DB] selectAll(${table}): ${error.message}`);
        return data || [];
    },

    /**
     * Select a single row by its primary key 'id'.
     * Returns null if not found (no throw).
     */
    selectById: async (table, id) => {
        const { data, error } = await supabase.from(table).select('*').eq('id', id).maybeSingle();
        if (error) throw new Error(`[DB] selectById(${table}, ${id}): ${error.message}`);
        return data; // null if not found
    },

    /**
     * Select rows matching a specific column value.
     */
    selectWhere: async (table, column, value) => {
        const { data, error } = await supabase.from(table).select('*').eq(column, value);
        if (error) throw new Error(`[DB] selectWhere(${table}, ${column}): ${error.message}`);
        return data || [];
    },

    /**
     * Select a single row matching a specific column value.
     * Returns null if not found.
     */
    selectOneWhere: async (table, column, value) => {
        const { data, error } = await supabase.from(table).select('*').eq(column, value).maybeSingle();
        if (error) throw new Error(`[DB] selectOneWhere(${table}, ${column}): ${error.message}`);
        return data;
    },

    /**
     * Insert a new row. Returns the inserted row.
     */
    insert: async (table, values) => {
        const { data, error } = await supabase.from(table).insert(values).select().single();
        if (error) throw new Error(`[DB] insert(${table}): ${error.message}`);
        return data;
    },

    /**
     * Update a row by its primary key 'id'. Returns the updated row.
     */
    update: async (table, id, values) => {
        const { data, error } = await supabase.from(table).update(values).eq('id', id).select().single();
        if (error) throw new Error(`[DB] update(${table}, ${id}): ${error.message}`);
        return data;
    },

    /**
     * Update rows matching a specific column value.
     */
    updateWhere: async (table, column, value, values) => {
        const { data, error } = await supabase.from(table).update(values).eq(column, value).select();
        if (error) throw new Error(`[DB] updateWhere(${table}, ${column}): ${error.message}`);
        return data;
    },

    /**
     * Delete a row by its primary key 'id'.
     */
    deleteById: async (table, id) => {
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw new Error(`[DB] deleteById(${table}, ${id}): ${error.message}`);
        return { success: true };
    },

    /**
     * Upsert (insert or update) one or more rows.
     */
    upsert: async (table, values) => {
        const { data, error } = await supabase.from(table).upsert(values).select();
        if (error) throw new Error(`[DB] upsert(${table}): ${error.message}`);
        return data;
    },

    /**
     * Raw Supabase client for complex queries.
     */
    raw: supabase
};

/**
 * Called on server startup. Just validates the connection.
 */
const initializeDatabase = async () => {
    try {
        // Lightweight ping to verify connectivity
        const { error } = await supabase.from('announcements').select('id').limit(1);
        if (error) throw error;
        console.log('[DB] Supabase connected successfully.');
    } catch (err) {
        console.error('[DB] Supabase connection failed:', err.message);
        // Don't exit — let the server start and fail gracefully per-request
    }
};

module.exports = { db, supabase, initializeDatabase };
