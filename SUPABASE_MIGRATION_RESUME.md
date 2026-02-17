# Supabase Migration - Resume Guide

## Quick Status

**Date Paused**: 2026-02-06  
**Time Invested**: ~2.5 hours  
**Progress**: ~30% complete  
**Data Status**: ✅ All 104 rows successfully migrated to Supabase cloud  
**Code Status**: ⚠️ Partially converted, then reverted to clean state

---

## What's Already Done ✅

### 1. Supabase Setup
- ✅ Created Supabase project
- ✅ Created all database tables with correct schema
- ✅ Fixed column name case sensitivity issues (`summaryStatus`, `transcriptStatus`, `cdrFile`)
- ✅ Migrated all data (104 rows across 11 tables)

### 2. Code Infrastructure
- ✅ Installed `@supabase/supabase-js` package
- ✅ Created dual-database abstraction layer in `database.js`
- ✅ Implemented feature flag system (`USE_SUPABASE` in `.env`)
- ✅ Tested Supabase connection - **WORKING**

### 3. API Conversion
- ✅ Literature API fully converted and tested
- ✅ Verified works with both SQLite and Supabase

### 4. Credentials
- ✅ `SUPABASE_URL` configured in `.env`
- ✅ `SUPABASE_KEY` (service_role) configured in `.env`

---

## What Remains ⚠️

### APIs Still Using SQLite (Need Conversion)

1. **Announcements** (`/api/announcements`)
2. **Prophecies** (`/api/prophecies`)
3. **Automated Prophecies** (`/api/automated_prophecies`)
4. **Highlights** (`/api/highlights`)
5. **Gallery** (`/api/gallery`)
6. **Prarthana** (`/api/prarthana`)
7. **Downloads** (`/api/downloads`)
8. **Profiles** (`/api/profiles`)
9. **Pledges** (`/api/pledges`)
10. **Newsletter** (`/api/newsletter`)
11. **Video Review** (`/api/videoreview`)
12. **Transcript Endpoints** (`/api/videos/:id`, `/api/transcript/:id`)

### Background Jobs

- YouTube prophecy automation cron job (uses `db.prepare`)
- Transcript fetching functions

---

## How to Resume

### Step 1: Restore Supabase Code

The dual-database system was created but reverted. You'll need to recreate `database.js`:

```javascript
const Database = require('better-sqlite3');
const { createClient } = require('@supabase/supabase-js');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const USE_SUPABASE = process.env.USE_SUPABASE === 'true';

// SQLite setup
const dbPath = path.join(__dirname, 'database.db');
const sqliteDb = new Database(dbPath);

// Supabase setup
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);

// Database abstraction layer
const db = {
    selectAll: async (table) => {
        if (USE_SUPABASE) {
            const { data, error } = await supabase.from(table).select('*');
            if (error) throw error;
            return data || [];
        } else {
            return Promise.resolve(sqliteDb.prepare(\`SELECT * FROM \${table}\`).all());
        }
    },

    selectById: async (table, id) => {
        if (USE_SUPABASE) {
            const { data, error } = await supabase.from(table).select('*').eq('id', id).single();
            if (error) throw error;
            return data;
        } else {
            return Promise.resolve(sqliteDb.prepare(\`SELECT * FROM \${table} WHERE id = ?\`).get(id));
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
            const sql = \`INSERT INTO \${table} (\${columns.join(', ')}) VALUES (\${placeholders})\`;
            const info = sqliteDb.prepare(sql).run(...Object.values(values));
            return Promise.resolve(sqliteDb.prepare(\`SELECT * FROM \${table} WHERE id = ?\`).get(info.lastInsertRowid));
        }
    },

    update: async (table, id, values) => {
        if (USE_SUPABASE) {
            const { data, error } = await supabase.from(table).update(values).eq('id', id).select().single();
            if (error) throw error;
            return data;
        } else {
            const columns = Object.keys(values);
            const setClause = columns.map(col => \`\${col} = ?\`).join(', ');
            const sql = \`UPDATE \${table} SET \${setClause} WHERE id = ?\`;
            sqliteDb.prepare(sql).run(...Object.values(values), id);
            return Promise.resolve(sqliteDb.prepare(\`SELECT * FROM \${table} WHERE id = ?\`).get(id));
        }
    },

    deleteById: async (table, id) => {
        if (USE_SUPABASE) {
            const { error } = await supabase.from(table).delete().eq('id', id);
            if (error) throw error;
            return Promise.resolve({ success: true });
        } else {
            sqliteDb.prepare(\`DELETE FROM \${table} WHERE id = ?\`).run(id);
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
            const sql = \`INSERT OR REPLACE INTO \${table} (\${columns.join(', ')}) VALUES (\${placeholders})\`;
            sqliteDb.prepare(sql).run(...Object.values(values));
            return Promise.resolve(values);
        }
    },

    raw: { sqlite: sqliteDb, supabase: supabase }
};

const initializeDatabase = () => {
    if (!USE_SUPABASE) {
        console.log('Using SQLite database (local file)');
    } else {
        console.log('Using Supabase cloud database');
    }
};

module.exports = { db, supabase, initializeDatabase, USE_SUPABASE };
```

### Step 2: Convert APIs One by One

**Pattern for Simple CRUD APIs:**

**Before (SQLite):**
```javascript
app.get('/api/announcements', (req, res) => {
    const data = db.prepare('SELECT * FROM announcements').all();
    res.json(data);
});
```

**After (Dual-Database):**
```javascript
app.get('/api/announcements', async (req, res) => {
    try {
        const data = await db.selectAll('announcements');
        res.json(data);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Failed to fetch announcements' });
    }
});
```

### Step 3: Test Each API

After converting each API:
1. Set `USE_SUPABASE=false` and test with SQLite
2. Set `USE_SUPABASE=true` and test with Supabase
3. Verify both work before moving to the next API

### Step 4: Handle Complex Cases

Some endpoints have complex SQL queries that don't fit the abstraction:
- Use `db.raw.supabase` or `db.raw.sqlite` for direct access
- Manually write both SQLite and Supabase versions

### Step 5: Deploy to Render

Once all APIs are converted:
1. Add `SUPABASE_URL` and `SUPABASE_KEY` to Render environment variables
2. Set `USE_SUPABASE=true` in Render
3. Push code to GitHub
4. Verify deployment

---

## Estimated Time to Complete

- **APIs Conversion**: 2-3 hours
- **Testing**: 1 hour
- **Deployment & Verification**: 30 minutes
- **Total**: 3.5-4.5 hours

---

## Important Notes

### Supabase Data is Safe
All your data is already in Supabase cloud. You can verify by:
1. Going to Supabase Dashboard
2. Click "Table Editor"
3. View all tables - you'll see the 104 rows

### No Data Loss Risk
Since we're using a dual-database system with a feature flag:
- If Supabase breaks, flip `USE_SUPABASE=false`
- Instant fallback to SQLite
- Zero downtime

### Files to Keep
When resuming, you'll need:
- `.env` with Supabase credentials (already configured)
- The `database.js` code above
- This resume guide

---

## Contact Info

**Supabase Project**: https://barfyvaxotklnehfykdv.supabase.co  
**Dashboard**: https://supabase.com/dashboard

Good luck with the migration! 🚀
