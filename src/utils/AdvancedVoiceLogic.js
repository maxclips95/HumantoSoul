/**
 * Advanced Voice Logic for Jai Gurudev Application
 * Maps natural language intents to specific routes and actions.
 */

export const processVoiceCommand = (transcript) => {
    const text = transcript.toLowerCase();

    // 1. Direct Content Mappings (The "Brain")
    // Format: { keywords: ['word1', 'word2'], route: '/path', response: 'Speaking text', param: 'search_query' }

    const intents = [
        // --- CALENDAR / DOWNLOADS ---
        {
            keywords: ['calendar', 'panchang', 'date', 'tithi', 'download', 'pdf', 'wallpaper', 'photo'],
            route: '/downloads',
            response: "Opening the Downloads section for calendars and resources."
        },

        // --- PROPHECIES / VIDEOS ---
        {
            keywords: ['prophecy', 'bhavishya', 'prediction', 'future', 'war', '2026', 'video', 'watch'],
            route: '/prophecies',
            param: 'search', // Will append ?search=transcript
            response: `Searching prophecies for ${transcript}.`
        },

        // --- FOOD / RECIPES ---
        {
            keywords: ['food', 'recipe', 'cook', 'eat', 'kitchen', 'satvic', 'diet', 'breakfast', 'lunch', 'dinner'],
            route: '/satvic-lifestyle',
            response: "opening the Satvic Recipes collection."
        },

        // --- BOOKS / LITERATURE ---
        {
            keywords: ['book', 'read', 'literature', 'sahitya', 'story', 'katha', 'faq', 'question', 'answer'],
            route: '/literature',
            param: 'search',
            response: `Searching books and literature for ${transcript}.`
        },

        // --- ABOUT / GURUJI ---
        {
            keywords: ['who is', 'about', 'parichay', 'history', 'biography', 'umakant', 'jaigurudev', 'baba'],
            route: '/about',
            response: "Here is the information about the Masters."
        },

        // --- CONTACT / ASHRAM / DONATE ---
        {
            keywords: ['contact', 'phone', 'email', 'address', 'location', 'reach', 'visit', 'ashram', 'mathura', 'ujjain', 'donate', 'sewa'],
            route: '/contact',
            response: "Taking you to the Contact and Ashram details page."
        },

        // --- PRAYER / PRARTHANA ---
        {
            keywords: ['prayer', 'prarthana', 'worship', 'god', 'chant', 'meditation'],
            route: '/prarthana',
            response: "Opening the Prayer section."
        },

        // --- GALLERY ---
        {
            keywords: ['gallery', 'image', 'picture', 'photo', 'darshan'],
            route: '/gallery',
            response: "Opening the Photo Gallery."
        },

        // --- ANNOUNCEMENTS ---
        {
            keywords: ['news', 'update', 'announcement', 'latest', 'event', 'program'],
            route: '/announcements',
            response: "Showing the latest announcements and news."
        }
    ];

    // 2. Fuzzy Matching Logic
    for (const intent of intents) {
        if (intent.keywords.some(keyword => text.includes(keyword))) {
            return {
                route: intent.route,
                searchParam: intent.param ? text : null,
                speechReponse: intent.response
            };
        }
    }

    // 3. Fallback (Global Search)
    return {
        route: '/prophecies',
        searchParam: text,
        speechReponse: `Searching everywhere for ${transcript}.`
    };
};
