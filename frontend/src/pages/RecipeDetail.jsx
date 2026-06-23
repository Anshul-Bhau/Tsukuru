import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { Printer, ArrowLeft } from 'lucide-react';
import '../assets/css/RecipeDetailPage.css';
import defaultImg from '../assets/images/default-img.jpg';

export default function RecipeDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                setIsLoading(true);
                const data = await recipeService.getRecipeById(id);
                setRecipe(data.recipe);
            } catch (err) {
                console.error("Failed to load recipe detail:", err);
                setError("Could not load the recipe. It may have been removed.");
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchRecipe();
    }, [id]);

    if (isLoading) {
        return <div className="recipe-page-loading">Loading your recipe...</div>;
    }

    if (error || !recipe) {
        return (
            <div className="recipe-page-error">
                <p>{error}</p>
                <button onClick={() => navigate(-1)} className="back-btn">Go Back</button>
            </div>
        );
    }

    // Safely handle arrays if your backend returns strings or lists
    const ingredientsList = Array.isArray(recipe.ingredients)
        ? recipe.ingredients
        : (recipe.ingredients || '').split(',').filter(Boolean);

    const directionsList = Array.isArray(recipe.directions)
        ? recipe.directions
        : (recipe.directions || '').split('\n').filter(Boolean);

    return (
        <div className="recipe-detail-wrapper">
            {/* Top Navigation */}
            <nav className="recipe-top-nav">
                <button onClick={() => navigate(-1)} className="back-link">
                    <ArrowLeft size={16} />
                    <span>Back to all recipes</span>
                </button>
            </nav>

            {/* Hero Section */}
            <section className="recipe-hero-section">
                <div className="recipe-hero-image">
                    <img
                        src={recipe?.image || defaultImg}
                        alt={recipe.title}
                        onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = defaultImg;
                        }}
                    />
                </div>

                <div className="recipe-hero-content">
                    <span className="recipe-category-tag">RECIPES</span>
                    <h1 className="recipe-title">{recipe.title}</h1>

                    <p className="recipe-description">
                        {recipe.primaryDesc || "A delicious and carefully crafted recipe."}
                    </p>

                    <div className="recipe-meta-strip">
                        <div className="meta-item">
                            <span className="meta-label">PREP TIME</span>
                            <span className="meta-value">{recipe.prep_time || '20 mins'}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">COOK TIME</span>
                            <span className="meta-value">{recipe.cook_time || '10 mins'}</span>
                        </div>
                        <div className="meta-item">
                            <span className="meta-label">SERVES</span>
                            <span className="meta-value">{recipe.servings || '4'}</span>
                        </div>
                        <button className="print-btn" aria-label="Print recipe" onClick={() => window.print()}>
                            <Printer size={20} />
                        </button>
                    </div>
                </div>
            </section>

            <hr className="recipe-divider" />

            {/* Details Section */}
            <section className="recipe-instructions-section">
                <div className="ingredients-column">
                    <h3 className="section-heading">Ingredients</h3>
                    <ul className="ingredients-list">
                        {ingredientsList.map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                        ))}
                    </ul>
                </div>

                <div className="preparation-column">
                    <h3 className="section-heading">Preparation</h3>
                    <ol className="preparation-list">
                        {directionsList.map((step, index) => (
                            <li key={index}>
                                <span className="step-number">{index + 1}</span>
                                <p>{step.trim()}</p>
                            </li>
                        ))}
                    </ol>
                </div>

                <div className="share-column">
                    <h3 className="section-heading share-heading">SHARE</h3>
                    {/* Add your social icons here */}
                    <div className="share-icons">
                        <button className="social-btn">P</button>
                        <button className="social-btn">F</button>
                    </div>
                </div>
            </section>
        </div>
    );
}