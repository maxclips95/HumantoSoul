const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const tables = [
    'users',
    'announcements',
    'prophecies',
    'automated_prophecies',
    'highlights',
    'gallery',
    'literature',
    'prarthana',
    'downloads',
    'profiles',
    'pledges',
    'newsletter_subscribers',
    'content_chunks' // Optional
];

async function verifyTables() {
    console.log(`Verifying schema for: ${supabaseUrl}`);
    console.log('---------------------------------------------------');

    for (const table of tables) {
        try {
            // Try to select 1 row (limit 1) to check if table exists and is accessible
            const { data, error } = await supabase.from(table).select('*').limit(1);

            if (error) {
                if (error.code === '42P01') { // PostgreSQL: undefined_table
                    console.log(`❌ Table '${table}' DOES NOT EXIST.`);
                } else {
                    console.log(`❌ Table '${table}' ERROR: [${error.code}] ${error.message}`);
                }
            } else {
                console.log(`✅ Table '${table}' exists. Rows: ${data.length > 0 ? '(Has Data)' : '(Empty)'}`);
            }
        } catch (err) {
            console.log(`❌ Table '${table}' EXCEPTION:`, err.message);
        }
    }
    console.log('---------------------------------------------------');
    console.log('Verification Complete.');
}

verifyTables();
