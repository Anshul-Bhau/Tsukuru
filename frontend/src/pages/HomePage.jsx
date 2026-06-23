import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';
import { Search } from 'lucide-react';
import RecipeCard from '../components/RecipeCard';
import SaveRecipeModal from '../components/SaveRecipeModal';
import '../assets/css/HomePage.css';

const CATEGORIES = ['All', 'Chicken', 'Vegetables', 'Pasta', 'Seafood', 'Dessert'];

export default function HomePage() {
    const [recipes, setRecipes] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    // FIXED: Corrected the spelling from setSvingRecipeId to setSavingRecipeId
    const [savingRecipeId, setSavingRecipeId] = useState(null);

    useEffect(() => {
        const fetchRecipes = async () => {
            setIsLoading(true);
            try {
                const query = activeCategory !== 'All' ? activeCategory : searchQuery;
                const data = await recipeService.getAllRecipes(query, currentPage);

                setRecipes(data.results || []);
                setTotalPages(data.num_pages || 1);
            } catch (error) {
                console.error('Failed to fetch recipes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRecipes();
    }, [searchQuery, activeCategory, currentPage]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setActiveCategory('All');
        setSearchQuery(searchInput);
        setCurrentPage(1);
    };

    const handleCategoryClick = (category) => {
        setActiveCategory(category);
        setSearchInput('');
        setSearchQuery('');
        setCurrentPage(1);
    };

    // FIXED: Removed the nested function so the state actually updates
    const handleSaveClick = (recipeId) => {
        setSavingRecipeId(recipeId);
        console.log("Opening save modal for recipe:", recipeId);
    };

    return (
        <div className="home-page-wrapper">
            <section className="home-search-section">
                <h1 className="search-heading">Discover Your Craving.</h1>
                <form className="search-bar-wrapper" onSubmit={handleSearchSubmit}>
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search by ingredient..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">Search</button>
                </form>
            </section>

            <section className="categories-bar">
                {CATEGORIES.map(category => (
                    <button
                        key={category}
                        className={`category-pill ${activeCategory === category ? 'active' : ''}`}
                        onClick={() => handleCategoryClick(category)}
                    >
                        {category}
                    </button>
                ))}
            </section>

            <section className="recipe-grid-section">
                {isLoading ? (
                    <div className="recipe-grid">
                        {[1, 2, 3, 4, 5, 6].map(n => <div key={n} className="wireframe-card"></div>)}
                    </div>
                ) : recipes.length > 0 ? (
                    <>
                        <div className="recipe-grid">
                            {recipes.map((recipe, index) => (
                                <RecipeCard
                                    key={recipe.id}
                                    recipe={recipe}
                                    index={index}
                                    onSave={() => handleSaveClick(recipe.id)}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="pagination-controls">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage} of {totalPages}</span>
                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="empty-state">
                        <h3>No recipes found.</h3>
                        <p>Try searching for a different ingredient.</p>
                    </div>
                )}
            </section>

            {savingRecipeId && (
                <SaveRecipeModal
                    recipeId={savingRecipeId}
                    onClose={() => setSavingRecipeId(null)}
                    onSuccess={() => console.log('Recipe saved successfully!')}
                />
            )}
        </div>
    );
}