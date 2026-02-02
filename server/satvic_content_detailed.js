module.exports = [
    {
        country: "India",
        flag: "🇮🇳",
        region: "Asia",
        staples: ["Lentils", "Rice", "Spices", "Ghee"],
        recipes: [
            {
                id: "ind_1",
                title: "Classic Dal Tadka",
                type: "Lunch",
                description: "Yellow lentils tempered with ghee and spices.",
                image: "/assets/images/dal.jpg",
                ingredients: ["Toor Dal", "Turmeric", "Cumin Seeds", "Ghee"],
                steps: ["Boil dal", "Temper spices", "Mix"]
            },
            {
                id: "ind_2",
                title: "Aloo Gobi",
                type: "Dinner",
                description: "Potatoes and cauliflower cooked with turmeric.",
                image: "/assets/images/aloo_gobi.jpg",
                ingredients: ["Potato", "Cauliflower", "Ginger", "Turmeric"],
                steps: ["Fry veggies", "Add spices", "Simmer"]
            }
        ]
    },
    {
        country: "Italy",
        flag: "🇮🇹",
        region: "Europe",
        staples: ["Pasta", "Tomato", "Basil", "Olive Oil"],
        recipes: [
            {
                id: "ita_1",
                title: "Satvic Pasta Arrabbiata",
                type: "Dinner",
                description: "Spicy tomato sauce pasta without garlic/onion.",
                image: "/assets/images/pasta.jpg",
                ingredients: ["Pasta", "Tomatoes", "Red Chilies", "Basil"],
                steps: ["Boil pasta", "Make sauce", "Combine"]
            }
        ]
    },
    {
        country: "Mexico",
        flag: "🇲🇽",
        region: "North America",
        staples: ["Beans", "Corn", "Avocado", "Chilies"],
        recipes: [
            {
                id: "mex_1",
                title: "Bean Burrito Bowl",
                type: "Lunch",
                description: "Rice, beans, and fresh salsa bowl.",
                image: "/assets/images/burrito.jpg",
                ingredients: ["Rice", "Black Beans", "Avocado", "Lime"],
                steps: ["Cook rice", "Warm beans", "Assemble"]
            }
        ]
    }
];
