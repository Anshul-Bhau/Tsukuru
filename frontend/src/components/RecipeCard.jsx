import { Link } from 'react-router-dom';
import { ArrowRightCircle } from 'lucide-react'; 
import defaultImg from '../assets/images/default-img.jpg';
import '../assets/css/RecipeCard.css';

export default function RecipeCard({ recipe, index }) {
    const title = recipe?.title || "Recipe Title";
    const imageSrc = recipe?.image || defaultImg;
    
    const badgeNumber = String(index + 1).padStart(2, '0');
    
    const primaryDesc = recipe?.primaryDesc || "Main description or native language name";
    const secondaryDesc = recipe?.directions 
        ? recipe.directions.substring(0, 60) + "..." 
        : "Secondary description or English translation goes here";

    return (
        <Link to={`/recipe/${recipe?.id}`} className="menu-card-link">
            <div className="menu-card">
                
                <div className="menu-card-image-wrapper">
                    <div className="menu-card-badge">{badgeNumber}</div>
                    <img src={imageSrc} alt={title} loading="lazy" />
                </div>

                <div className="menu-card-content">
                    <div className="menu-card-header">
                        <h3 className="menu-card-title">{title}</h3>
                        
                        <div className="menu-card-action-icon">
                            <ArrowRightCircle size={28} strokeWidth={1.5} />
                        </div>
                    </div>
                    
                    <p className="menu-card-primary-desc">{primaryDesc}</p>
                    
                    <div className="menu-card-divider"></div>
                    
                    <p className="menu-card-secondary-desc">{secondaryDesc}</p>
                </div>

            </div>
        </Link>
    );
}