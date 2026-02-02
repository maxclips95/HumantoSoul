import React, { useState, useEffect } from 'react';
import '../styles/SatvicExplorer.css';

function SatvicExplorer() {
    const [recipes, setRecipes] = useState([]);
    const [meta, setMeta] = useState({ countries: [], total: 0 });
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const LIMIT = 12;

    const [selectedRecipe, setSelectedRecipe] = useState(null);

    // Fetch Initial Meta & First Page
    useEffect(() => {
        setLoading(true);
        // Get Metadata (Countries and Total count)
        fetch('/api/satvic/recipes?metadata=true')
            .then(res => res.json())
            .then(data => setMeta(data));

        // Get Initial Recipes
        fetchRecipes(0, true);
    }, []);

    const fetchRecipes = (newOffset, isInitial = false) => {
        let url = `/api/satvic/recipes?limit=${LIMIT}&offset=${newOffset}`;
        if (selectedType !== 'All') url += `&type=${selectedType}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (isInitial) {
                    setRecipes(data.recipes);
                } else {
                    setRecipes(prev => [...prev, ...data.recipes]);
                }
                setLoading(false);
            });
    };

    const handleLoadMore = () => {
        const nextOffset = offset + LIMIT;
        setOffset(nextOffset);
        fetchRecipes(nextOffset);
    };

    const handleFilterChange = (filterType, value) => {
        setLoading(true);
        setRecipes([]);
        setOffset(0);

        setSelectedType(value);

        let url = `/api/satvic/recipes?limit=${LIMIT}&offset=0`;
        if (value !== 'All') url += `&type=${value}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setRecipes(data.recipes);
                setLoading(false);
            });
    };

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="satvic-explorer">
            {/* Modal for Master Recipe Details */}
            {selectedRecipe && (
                <div className="recipe-modal-overlay" onClick={() => setSelectedRecipe(null)}>
                    <div className="recipe-modal" onClick={e => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setSelectedRecipe(null)}>×</button>

                        <div className="modal-header-no-image">
                            <div className="modal-header-content">
                                <span className="modal-badge">{selectedRecipe.flag} {selectedRecipe.country}</span>
                                <h2>{selectedRecipe.title}</h2>
                                <div className="modal-meta">
                                    <span>⏱ {selectedRecipe.time}</span>
                                    <span>👤 {selectedRecipe.servings} Servings</span>
                                    <span>🔥 {selectedRecipe.difficulty}</span>
                                </div>
                            </div>
                        </div>

                        <div className="modal-content">
                            <div className="modal-section ingredients">
                                <h3>🥬 Ingredients</h3>
                                <ul>
                                    {selectedRecipe.ingredients?.map((ing, i) => (
                                        <li key={i}>{ing}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="modal-section method">
                                <h3>👩‍🍳 Method</h3>
                                <div className="modal-steps">
                                    {selectedRecipe.steps?.map((step, i) => (
                                        <div key={i} className="modal-step-row">
                                            <span className="step-count">{i + 1}</span>
                                            <p>{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {selectedRecipe.tips && (
                            <div className="modal-tip">
                                <strong>💡 Satvic Secret:</strong> {selectedRecipe.tips}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="explorer-header">
                <h2>Satvic Indian Kitchen</h2>
                <p className="subtitle">Discover {meta.total}+ Authentic Indian Vegetarian Recipes</p>

                <div className="filter-bar">
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        className="recipe-search"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select value={selectedType} onChange={(e) => handleFilterChange('type', e.target.value)}>
                        <option value="All">All Meals</option>
                        <option value="Breakfast">Breakfast</option>
                        <option value="Lunch">Lunch</option>
                        <option value="Dinner">Dinner</option>
                        <option value="Snack">Snack</option>
                        <option value="Dessert">Dessert</option>
                    </select>
                </div>
            </div>

            <div className="recipe-feed">
                {filteredRecipes.map((recipe, idx) => (
                    <div key={`${recipe.id}-${idx}`} className="satvic-recipe-card" onClick={() => setSelectedRecipe(recipe)}>
                        <div className="recipe-image-container">
                            <div className="country-badge">{recipe.flag} {recipe.country}</div>
                            <div className="type-badge">{recipe.type}</div>
                        </div>
                        <div className="recipe-info">
                            <h3>{recipe.title}</h3>
                            <div className="meta-stats">
                                <span>⏱ {recipe.time || '30m'}</span>
                                <span>👤 {recipe.servings || '2'}</span>
                                <span className={`diff ${recipe.difficulty?.toLowerCase()}`}>{recipe.difficulty}</span>
                            </div>
                            <p className="recipe-brief">{recipe.desc}</p>
                            <button
                                className="view-details-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedRecipe(recipe);
                                }}
                            >
                                View Master Recipe
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {recipes.length < meta.total && !loading && (
                <button className="more-results-btn" onClick={handleLoadMore}>
                    More Results
                </button>
            )}

            {loading && <div className="satvic-loader">Brewing fresh recipes...</div>}
        </div>
    );
}

export default SatvicExplorer;
