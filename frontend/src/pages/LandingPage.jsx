import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { recipeService } from '../services/recipeService';
import { ArrowRightCircle, ChevronDown } from 'lucide-react';
import heroImg from '../assets/images/hero-img.png';
import defaultImg from '../assets/images/default-img.jpg';
import '../assets/css/LandingPage.css';
import promoImg from '../assets/images/promo-img.png';

export default function LandingPage() {
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                const data = await recipeService.getTrendingRecipes();
                setTrendingRecipes(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTrending();
    }, []);

    const displayRecipes = trendingRecipes.slice(0, 3);

    return (
        <div className="landing-page">
            <section className="hero-section">
                <img src={heroImg} alt="Feast Background" className="hero-bg-img" />

                <div className="hero-overlay-content">
                    <h1 className="hero-title">
                        Crafting Cravings.<br />
                        One Click Away.
                    </h1>
                    <Link to="/home" className="hero-btn-pill">Start Cooking</Link>
                </div>

                <div className="hero-scroll-indicator">
                    <ChevronDown size={28} />
                </div>
            </section>

            <section className="trending-section">
                <div className="trending-container">
                    <div className="section-header">
                        <h2>Featured Recipes</h2>
                        <Link to="/home" className="all-recipes-link">All Recipes &rarr;</Link>
                    </div>

                    <div className="trending-flex-container">
                        {!isLoading && Array.isArray(displayRecipes) && displayRecipes.map((recipe, index) => (
                            <div key={recipe.id || index} className="trending-flex-item">
                                <Link to={`/recipe/${recipe.id}`} className="landing-mini-card">
                                    <div className="landing-mini-img">
                                        <img src={recipe.image || defaultImg} alt={recipe.title} loading="lazy" />
                                    </div>
                                    <div className="landing-mini-info">
                                        <h3>{recipe.title}</h3>
                                    </div>
                                    <div className="landing-mini-viewbtn">
                                        <Link to="/home" className="view-btn">
                                            view more
                                        </Link>
                                    </div>
                                </Link>
                            </div>
                        ))}

                        {(isLoading || !Array.isArray(displayRecipes) || displayRecipes.length === 0) && (
                            <>
                                <div className="trending-flex-item"><div className="wireframe-box"></div></div>
                                <div className="trending-flex-item"><div className="wireframe-box"></div></div>
                                <div className="trending-flex-item"><div className="wireframe-box"></div></div>
                            </>
                        )}
                    </div>
                </div>
            </section>

            <section className="app-promo-section">
                <div className="app-promo-container">
                    <div className="promo-content">
                        <span className="promo-subtitle">ELEVATE EVERYDAY COOKING</span>
                        <h2>Ditch the doomscroll. Start cooking.</h2>
                        <p>Stop staring blankly into your fridge. Whether you have thirty minutes or three hours, Tsukuru instantly generates beautiful, restaurant-quality meal plans based exactly on what you already have.
                        </p>
                        <ul className="promo-features">
                            <li>Smart ingredient matching</li>
                            <li>Curated seasonal collections</li>
                            <li>Step-by-step guided cooking</li>
                        </ul>
                    </div>
                    <div className="promo-image-wrapper">
                        <img src={promoImg} alt="Tsukuru app" className="promo-img" />
                    </div>
                </div>
            </section>
        </div>
    );
}