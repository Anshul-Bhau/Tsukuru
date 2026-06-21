import { Link } from 'react-router-dom';
import defaultImg from '../assets/images/default-img.jpg';
import '../assets/css/RecipeCard.css';

export default function RecipeCard({ recipe, index }) {
    // Fallback data if the API is missing fields
    const title = recipe?.title || "Recipe Title";
    const imageSrc = recipe?.image || defaultImg;
    
    // Using index + 1 for the badge number (e.g., 01, 02, 03). 
    // padStart ensures single digits get a leading zero.
    const badgeNumber = recipe?.badgeNumber || String(index + 1).padStart(2, '0');
    
    // In a real app, you might map 'price' or 'prep time' here
    const highlightValue = recipe?.price || "259K"; 
    
    // Mapping Django's directions/ingredients to the primary and secondary text blocks
    const primaryDesc = recipe?.primaryDesc || "Main description or native language name";
    const secondaryDesc = recipe?.directions 
        ? recipe.directions.substring(0, 60) + "..." 
        : "Secondary description or English translation goes here";

    return (
        <Link to={`/recipe/${recipe?.id}`} className="menu-card-link">
            <div className="menu-card">
                
                {/* Image & Floating Badge */}
                <div className="menu-card-image-wrapper">
                    <div className="menu-card-badge">{badgeNumber}</div>
                    <img src={imageSrc} alt={title} loading="lazy" />
                </div>

                {/* Text Content */}
                <div className="menu-card-content">
                    <div className="menu-card-header">
                        <h3 className="menu-card-title">{title}</h3>
                        <span className="menu-card-price">{highlightValue}</span>
                    </div>
                    
                    <p className="menu-card-primary-desc">{primaryDesc}</p>
                    
                    <div className="menu-card-divider"></div>
                    
                    <p className="menu-card-secondary-desc">{secondaryDesc}</p>
                </div>

            </div>
        </Link>
    );
}