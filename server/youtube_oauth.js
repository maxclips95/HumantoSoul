/**
 * youtube_oauth.js — YouTube Data API v3 OAuth2 Caption Fetching
 * 
 * Flow:
 * 1. Admin clicks "Connect YouTube Channel" → getAuthUrl() → Google consent screen
 * 2. Channel owner approves → Google redirects to /api/youtube/oauth-callback
 * 3. exchangeCodeForTokens() saves refresh token to Supabase settings table
 * 4. fetchCaptionsViaAPI() uses stored token to fetch captions forever
 */

const { google } = require('googleapis');
const { db } = require('./database');

const SETTINGS_KEY_REFRESH = 'youtube_refresh_token';
const SETTINGS_KEY_ACCESS = 'youtube_access_token';
const SETTINGS_KEY_EXPIRY = 'youtube_token_expiry';

// --- OAuth2 Client ---
const getOAuth2Client = () => {
    const clientId = process.env.YOUTUBE_CLIENT_ID;
    const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
    const redirectUri = process.env.YOUTUBE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
        throw new Error('YouTube OAuth env vars not set (YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET, YOUTUBE_REDIRECT_URI)');
    }

    return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
};

// --- Generate Consent URL (send this to channel owner) ---
const getAuthUrl = () => {
    const oauth2Client = getOAuth2Client();
    return oauth2Client.generateAuthUrl({
        access_type: 'offline',       // Gets refresh token (permanent)
        prompt: 'consent',            // Forces refresh token even if already approved
        scope: [
            'https://www.googleapis.com/auth/youtube.force-ssl',
            'https://www.googleapis.com/auth/youtube.readonly'
        ]
    });
};

// --- Exchange auth code for tokens and save to Supabase ---
const exchangeCodeForTokens = async (code) => {
    const oauth2Client = getOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
        throw new Error('No refresh token received. Channel owner must re-approve with prompt=consent.');
    }

    // Save all tokens to Supabase settings table
    await db.upsert('settings', { key: SETTINGS_KEY_REFRESH, value: tokens.refresh_token });
    await db.upsert('settings', { key: SETTINGS_KEY_ACCESS, value: tokens.access_token });
    await db.upsert('settings', { key: SETTINGS_KEY_EXPIRY, value: String(tokens.expiry_date) });

    console.log('[YouTube OAuth] Tokens saved to Supabase successfully.');
    return tokens;
};

// --- Get a valid access token (auto-refresh if expired) ---
const getValidAccessToken = async () => {
    const refreshRow = await db.selectOneWhere('settings', 'key', SETTINGS_KEY_REFRESH);
    if (!refreshRow || !refreshRow.value) {
        throw new Error('YouTube not connected. Channel owner must approve OAuth first.');
    }

    const expiryRow = await db.selectOneWhere('settings', 'key', SETTINGS_KEY_EXPIRY);
    const accessRow = await db.selectOneWhere('settings', 'key', SETTINGS_KEY_ACCESS);

    const expiry = expiryRow ? parseInt(expiryRow.value) : 0;
    const isExpired = !expiry || Date.now() >= expiry - 60000; // refresh 1 min early

    if (!isExpired && accessRow?.value) {
        return accessRow.value; // Still valid
    }

    // Refresh the access token
    const oauth2Client = getOAuth2Client();
    oauth2Client.setCredentials({ refresh_token: refreshRow.value });
    const { credentials } = await oauth2Client.refreshAccessToken();

    await db.upsert('settings', { key: SETTINGS_KEY_ACCESS, value: credentials.access_token });
    await db.upsert('settings', { key: SETTINGS_KEY_EXPIRY, value: String(credentials.expiry_date) });

    console.log('[YouTube OAuth] Access token refreshed.');
    return credentials.access_token;
};

// --- Check if OAuth is connected ---
const isConnected = async () => {
    try {
        const row = await db.selectOneWhere('settings', 'key', SETTINGS_KEY_REFRESH);
        return !!(row && row.value);
    } catch {
        return false;
    }
};

// --- Fetch Hindi captions via YouTube Data API v3 ---
const fetchCaptionsViaAPI = async (videoId) => {
    const accessToken = await getValidAccessToken();

    const youtube = google.youtube({
        version: 'v3',
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    // Step 1: List caption tracks for the video
    const listRes = await youtube.captions.list({
        part: ['snippet'],
        videoId
    });

    const tracks = listRes.data.items || [];
    if (tracks.length === 0) {
        throw new Error('No caption tracks found for this video.');
    }

    // Step 2: Find Hindi track (manual preferred, then auto-generated)
    const hindiTrack =
        tracks.find(t => t.snippet.language === 'hi' && t.snippet.trackKind === 'standard') ||
        tracks.find(t => t.snippet.language === 'hi' && t.snippet.trackKind === 'asr') ||
        tracks.find(t => t.snippet.language === 'hi');

    if (!hindiTrack) {
        const available = tracks.map(t => `${t.snippet.language}(${t.snippet.trackKind})`).join(', ');
        throw new Error(`Hindi captions not available. Available: ${available}`);
    }

    console.log(`[YouTube OAuth] Found caption track: ${hindiTrack.id} (${hindiTrack.snippet.trackKind})`);

    // Step 3: Download the caption content
    const dlRes = await youtube.captions.download({
        id: hindiTrack.id,
        tfmt: 'srt'  // SubRip format — plain text with timestamps
    }, { responseType: 'text' });

    const srtContent = dlRes.data;

    // Step 4: Strip SRT timestamps, keep only text
    const cleanText = srtContent
        .replace(/\d+\r?\n\d{2}:\d{2}:\d{2},\d{3} --> \d{2}:\d{2}:\d{2},\d{3}\r?\n/g, '')
        .replace(/<[^>]+>/g, '')
        .replace(/\r?\n\r?\n/g, ' ')
        .replace(/\r?\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (!cleanText) throw new Error('Caption content is empty after parsing.');

    console.log(`[YouTube OAuth] Fetched ${cleanText.length} chars of Hindi captions for ${videoId}`);
    return cleanText;
};

module.exports = {
    getAuthUrl,
    exchangeCodeForTokens,
    getValidAccessToken,
    isConnected,
    fetchCaptionsViaAPI
};
