const fs = require('fs');
const path = require('path');
const xml2js = require('xml2js');

const SITEMAP_URL = 'http://localhost:5000/sitemap.xml';
const PACKAGE_JSON_PATH = path.join(__dirname, 'package.json');
const BASE_WEBSITE_URL = 'https://www.humantosoul.com'; // Matches base url in server.js

async function syncReactSnapUrls() {
    console.log('Fetching dynamic sitemap from local backend...');

    try {
        const axios = require('axios');
        const response = await axios.get(SITEMAP_URL);

        if (response.status !== 200) {
            throw new Error(`Failed to fetch sitemap: ${response.statusText}`);
        }

        const xml = response.data;
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(xml);

        if (!result.urlset || !result.urlset.url) {
            throw new Error('Invalid sitemap format: no <url> tags found.');
        }

        const rawUrls = result.urlset.url.map(item => item.loc[0]);

        // We only need the relative paths for React Snap
        // Ex: "https://www.humantosoul.com/hi/prophecy/123" -> "/hi/prophecy/123"
        const relativePaths = rawUrls.map(url => {
            let relativeUrl = url.replace(BASE_WEBSITE_URL, '');
            if (relativeUrl === '') relativeUrl = '/';
            return relativeUrl;
        });

        console.log(`Extracted ${relativePaths.length} routes from sitemap.`);

        // Read and update package.json
        const packageData = fs.readFileSync(PACKAGE_JSON_PATH, 'utf8');
        const packageJson = JSON.parse(packageData);

        // Safety check - make sure reactSnap object exists
        if (!packageJson.reactSnap) packageJson.reactSnap = {};

        // Wipe out the 'source' attribute that broke it, and inject the actual array
        delete packageJson.reactSnap.source;
        delete packageJson.reactSnap.crawl; // Let it rely purely on the array so it doesn't wander off
        packageJson.reactSnap.include = relativePaths;

        fs.writeFileSync(PACKAGE_JSON_PATH, JSON.stringify(packageJson, null, 2));

        console.log('package.json successfully updated with dynamic URLs for react-snap.');
        process.exit(0);

    } catch (error) {
        console.error('CRITICAL ERROR syncing sitemap to react-snap:', error.message);
        // Exit cleanly without throwing so the build doesn't hard-fail if backend is unreachable
        process.exit(0);
    }
}

syncReactSnapUrls();
