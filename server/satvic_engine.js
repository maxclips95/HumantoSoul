const worldCuisines = require('./satvic_content_detailed');

// Helper to find country data
const getCountryData = (countryName) => {
    return worldCuisines.find(c => c.country.toLowerCase() === countryName.toLowerCase());
};

// Algorithmic Recipe Mixer
// This creates "New" recipes by combining base ingredients with cooking styles
class SatvicMixer {
    constructor() {
        this.cookingStyles = ["Spicy", "Creamy", "Grilled", "Homestyle", "Royal"];
        this.vegBases = ["Paneer", "Tofu", "Potato", "Mixed Veg", "Chickpea", "Mushroom", "Lentil"];
    }

    generateVariation(baseRecipe, style) {
        // Create a new title
        const newTitle = `${style} ${baseRecipe.title.replace('Classic', '').replace('Traditional', '').replace('Satvic', '').trim()}`;

        // Modify ingredients and steps based on style
        let newIngredients = [...(baseRecipe.ingredients || [])];
        let newSteps = [...(baseRecipe.steps || [])];

        if (style === "Spicy") {
            newIngredients.push("2 Green Chilies, slit", "1/2 tsp Kashmiri Red Chili Powder");
            newSteps.push(`At the final tempering stage, add the green chilies and chili powder for that signature ${style} kick.`);
        }
        if (style === "Creamy") {
            newIngredients.push("2 tbsp Fresh Malai (Cream)", "5-6 Cashews, soaked and ground");
            newSteps.splice(newSteps.length - 1, 0, `Stir in the cashew paste and fresh cream slowly to achieve a rich, ${style} texture.`);
        }
        if (style === "Royal") {
            newIngredients.push("Pinch of Saffron (Kesar)", "Toasted Almond slivers");
            newSteps.push(`Finish the dish with a ${style} garnish of saffron and toasted almonds to elevate the prana.`);
        }

        return {
            ...baseRecipe,
            id: `${baseRecipe.id}_${style.toLowerCase()}`,
            title: newTitle,
            isGenerated: true,
            desc: `A luxurious ${style} interpretation of ${baseRecipe.title}, crafted for deep nourishment.`,
            ingredients: newIngredients,
            steps: newSteps
        };
    }
}

const mixer = new SatvicMixer();

// Main API Handler to get recipes
const getRecipes = (req, res) => {
    const { country, type, limit = 24, offset = 0 } = req.query;

    let allRecipes = [];

    // Flatten all recipes from all countries
    worldCuisines.forEach(c => {
        const recipes = (c.recipes || []).map(r => ({
            ...r,
            country: c.country,
            flag: c.flag
        }));
        allRecipes = [...allRecipes, ...recipes];
    });

    let results = [];

    // 1. Filter by Country if specified
    if (country) {
        const countryData = getCountryData(country);
        if (countryData) {
            results = (countryData.recipes || []).map(r => ({
                ...r,
                country: countryData.country,
                flag: countryData.flag
            }));
        }
    } else {
        results = allRecipes;
    }

    // 2. Filter by Type (Breakfast/Lunch/Dinner)
    if (type) {
        results = results.filter(r => r.type?.toLowerCase() === type.toLowerCase());
    }

    // GENERATE VARIATIONS (Infinite Feel)
    // For every base recipe, we generate variations to hit the 1000+ feel
    const expandedResults = [];
    results.forEach(r => {
        expandedResults.push(r);
        expandedResults.push(mixer.generateVariation(r, "Spicy"));
        expandedResults.push(mixer.generateVariation(r, "Creamy"));
        expandedResults.push(mixer.generateVariation(r, "Royal"));
    });

    const total = expandedResults.length;
    const paginatedResults = expandedResults.slice(parseInt(offset), parseInt(offset) + parseInt(limit));

    // If requesting metadata for the grid
    if (req.query.metadata === 'true') {
        return res.json({
            countries: worldCuisines.map(c => ({
                name: c.country,
                flag: c.flag,
                region: c.region,
                staples: c.staples,
                recipeCount: (c.recipes?.length || 0) * 4
            })),
            total
        });
    }

    res.json({
        recipes: paginatedResults,
        total,
        limit: parseInt(limit),
        offset: parseInt(offset)
    });
};

module.exports = {
    getRecipes
};
