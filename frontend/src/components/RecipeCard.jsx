import { Link } from 'react-router-dom';
import { ArrowRightCircle, Bookmark } from 'lucide-react';
import defaultImg from '../assets/images/default-img.jpg';
import '../assets/css/RecipeCard.css';

export default function RecipeCard({ recipe, index, onSave }) {
    const title = recipe?.title || "Recipe Title";
    const imageSrc = recipe?.image || defaultImg;

    const badgeNumber = String(index + 1).padStart(2, '0');
    const secondaryDesc = recipe?.directions
        ? recipe.directions.substring(0, 80) + "..."
        : "Secondary description or English translation goes here";

    const handleBookmarkClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSave) onSave(recipe?.id);
    };

    return (
        <Link to={`/recipe/${recipe?.id}`} className="menu-card-link">
            <div className="menu-card-wrapper">
                
                <button className="menu-card-bookmark-btn" onClick={handleBookmarkClick} aria-label="Save recipe">
                    <Bookmark size={20} strokeWidth={2.5} />
                </button>

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

                        <p className="menu-card-secondary-desc">{secondaryDesc}</p>
                    </div>
                </div>
            </div>
        </Link>
    );
}