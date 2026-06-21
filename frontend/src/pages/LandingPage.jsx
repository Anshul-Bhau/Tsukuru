import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RecipeCard from '../components/RecipeCard';
import { recipeService } from '../services/recipeService'; // Import your API service
import heroImg from '../assets/images/hero-img.png';
import '../assets/css/LandingPage.css';

// Remove the prop, we will fetch the data internally now
export default function LandingPage() {
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch data when the page loads
    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Adjust this if you have a specific endpoint for trending recipes
                const data = await recipeService.getAllRecipes();
                setTrendingRecipes(data.results || data);
            } catch (error) {
                console.error("Failed to fetch trending recipes", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrending();
    }, []);

    const displayRecipes = trendingRecipes.slice(0, 3);

    return (
        <div className="landing-page-wrapper">

            {/* ... HERO SECTION STAYS THE SAME ... */}
            {/* SECTION 1: HERO */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Crafting Cravings,<br />
                        One Click Away.
                    </h1>
                    <div className="hero-actions">
                        <Link to="/home" className="btn-action solid">Start Cooking</Link>
                    </div>
                </div>
                <div className="hero-image-wrapper">
                    <img src={heroImg} alt="Tsukuru Hero" className="wireframe-placeholder" />
                </div>
            </section>

            <section className="trending-section">
                <div className="section-header">
                    <h2>Trending Recipes</h2>
                    <Link to="/home" className="all-recipes-link">All recipes &rarr;</Link>
                </div>

                <div className="trending-grid">
                    {/* Only show recipes if we have them and are done loading */}
                    {!isLoading && displayRecipes.map((recipe, index) => (
                        <div key={recipe.id || index} className="trending-grid-item">
                            <RecipeCard recipe={recipe} index={index} />
                        </div>
                    ))}

                    {/* Show wireframes ONLY if loading, or if no recipes exist at all */}
                    {(isLoading || displayRecipes.length === 0) && (
                        <>
                            <div className="wireframe-box wide-box"></div>
                            <div className="wireframe-box"></div>
                            <div className="wireframe-box"></div>
                        </>
                    )}
                </div>
            </section>

            {/* SECTION 3: APP PROMO */}
            <section className="app-promo-section">
                <div className="promo-content">
                    <span className="promo-subtitle">inside our app</span>
                    <h2>Our new Tsukuru App</h2>
                    <p>Discover a world of flavors tailored specifically to your taste buds and dietary goals.</p>
                    <ul className="promo-features">
                        <li>Personalized meal plans</li>
                        <li>Smart grocery lists</li>
                        <li>Step-by-step guided cooking</li>
                    </ul>
                </div>
                <div className="promo-image-wrapper">
                    {/* <img src={appPromoImg} alt="App Interface" className="wireframe-placeholder" /> */}
                </div>
            </section>
        </div>
    )
}