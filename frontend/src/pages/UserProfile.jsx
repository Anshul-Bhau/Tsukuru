import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { X, Trash2, Plus, Camera } from 'lucide-react';
import '../assets/css/UserProfile.css';

// Default PFP Import
import defaultPfp from '../assets/images/pfp/default-pfp.jpg';
import pfp1 from '../assets/images/pfp/pfp1.jpg';
import pfp2 from '../assets/images/pfp/pfp2.jpg';
import pfp3 from '../assets/images/pfp/pfp3.jpg';
import pfp4 from '../assets/images/pfp/pfp4.jpg';
import pfp5 from '../assets/images/pfp/pfp5.jpg';
import pfp6 from '../assets/images/pfp/pfp6.jpg';
import pfp7 from '../assets/images/pfp/pfp7.jpg';
import pfp8 from '../assets/images/pfp/pfp8.jpg';
import pfp9 from '../assets/images/pfp/pfp9.jpg';
import pfp10 from '../assets/images/pfp/pfp10.jpg';
import pfp11 from '../assets/images/pfp/pfp11.jpg';
import pfp12 from '../assets/images/pfp/pfp12.jpg';
import pfp13 from '../assets/images/pfp/pfp13.jpg';
import pfp14 from '../assets/images/pfp/pfp14.jpg';
import pfp15 from '../assets/images/pfp/pfp15.jpg';
import pfp16 from '../assets/images/pfp/pfp16.jpg';
import pfp17 from '../assets/images/pfp/pfp17.jpg';
import pfp18 from '../assets/images/pfp/pfp18.jpg';
import pfp19 from '../assets/images/pfp/pfp19.jpg';
import pfp20 from '../assets/images/pfp/pfp20.jpg';
import pfp21 from '../assets/images/pfp/pfp21.jpg';
import pfp22 from '../assets/images/pfp/pfp22.jpg';
import pfp23 from '../assets/images/pfp/pfp23.jpg';
import pfp24 from '../assets/images/pfp/pfp24.jpg';

// Add your imported variables to this array. (I'm duplicating defaultPfp temporarily so it doesn't crash)
const pfpOptions = [
    defaultPfp,
    pfp1, pfp2, pfp3, pfp4, pfp5, pfp6, pfp7, pfp8, pfp9, pfp10, pfp11, pfp12, pfp13, pfp14, pfp15, pfp16, pfp17, pfp18, pfp19, pfp20, pfp21, pfp22, pfp23, pfp24
];

// --- COMPONENT: Fetches and displays images for the mosaic ---
function BoardMosaic({ recipeIds }) {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchImages = async () => {
            if (!recipeIds || recipeIds.length === 0) {
                setLoading(false);
                return;
            }

            const idsToFetch = recipeIds.slice(0, 3);
            try {
                const responses = await Promise.all(
                    idsToFetch.map(id => api.get(`recipes/${id}/`))
                );

                const fetchedImages = responses.map(res => {
                    const r = res.data.recipe || res.data;
                    return r.image;
                });

                setImages(fetchedImages);
            } catch (error) {
                console.error("Failed to fetch mosaic images", error);
            } finally {
                setLoading(false);
            }
        };

        fetchImages();
    }, [recipeIds]);

    if (loading) {
        return (
            <>
                <div className="mosaic-slice abstract-block img-idx-0"></div>
                {recipeIds.length > 1 && <div className="mosaic-slice abstract-block img-idx-1"></div>}
                {recipeIds.length > 2 && <div className="mosaic-slice abstract-block img-idx-2"></div>}
            </>
        );
    }

    if (!recipeIds || recipeIds.length === 0) {
        return <div className="mosaic-fallback-blank"></div>;
    }

    return (
        <>
            {images.map((imgSrc, idx) => (
                imgSrc ? (
                    <img
                        key={idx}
                        src={imgSrc}
                        alt="Recipe preview"
                        className={`mosaic-slice img-idx-${idx}`}
                        onError={(e) => { e.target.style.opacity = 0; }}
                    />
                ) : (
                    <div key={idx} className={`mosaic-slice abstract-block img-idx-${idx}`}></div>
                )
            ))}

            {images.length === 1 && (
                <>
                    <div className="mosaic-slice abstract-block img-idx-1"></div>
                    <div className="mosaic-slice abstract-block img-idx-2"></div>
                </>
            )}
            {images.length === 2 && (
                <div className="mosaic-slice abstract-block img-idx-2"></div>
            )}
        </>
    );
}

// --- MAIN PAGE COMPONENT ---
export default function UserAccountPage() {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('saved');

    // Local PFP State (Persists across refreshes using localStorage)
    const [localPfp, setLocalPfp] = useState(localStorage.getItem('tsukuru_local_pfp') || null);
    const [showPfpModal, setShowPfpModal] = useState(false);

    // Modal States
    const [selectedBoard, setSelectedBoard] = useState(null);
    const [boardRecipes, setBoardRecipes] = useState([]);
    const [isLoadingBoard, setIsLoadingBoard] = useState(false);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [recipeForm, setRecipeForm] = useState({ title: '', directions: '', ingredients: '', image: null });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePfpSelect = (selectedImage) => {
        setLocalPfp(selectedImage);
        localStorage.setItem('tsukuru_local_pfp', selectedImage);
        setShowPfpModal(false);

        window.dispatchEvent(new Event('pfpChanged'));
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setIsLoading(true);
                const [userResponse, boardsResponse] = await Promise.all([
                    api.get('auth/me/'),
                    api.get('account/')
                ]);

                setProfileData({
                    user: userResponse.data,
                    boards: Array.isArray(boardsResponse.data) ? boardsResponse.data : (boardsResponse.data.boards || [])
                });
            } catch (error) {
                console.error("Error collecting user account dataset:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleOpenBoard = async (board) => {
        setSelectedBoard(board);
        setIsLoadingBoard(true);
        try {
            const requests = board.recipes.map(id => api.get(`recipes/${id}/`));
            const responses = await Promise.all(requests);
            const fullRecipes = responses.map(res => res.data.recipe || res.data);
            setBoardRecipes(fullRecipes);
        } catch (error) {
            console.error("Failed to load recipes for board", error);
        } finally {
            setIsLoadingBoard(false);
        }
    };

    const handleUnsaveRecipe = async (recipeId) => {
        try {
            await api.delete(`unsave_recipe/${recipeId}/${selectedBoard.id}/`);
            setBoardRecipes(prev => prev.filter(r => r.id !== recipeId));
            setProfileData(prev => ({
                ...prev,
                boards: prev.boards.map(b =>
                    b.id === selectedBoard.id
                        ? { ...b, recipes: b.recipes.filter(id => id !== recipeId) }
                        : b
                )
            }));
        } catch (error) {
            console.error("Failed to unsave recipe", error);
            alert("Could not unsave recipe.");
        }
    };

    const handleCreateRecipe = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append('title', recipeForm.title);
        formData.append('directions', recipeForm.directions);
        formData.append('ingredients', recipeForm.ingredients);
        if (recipeForm.image) {
            formData.append('image', recipeForm.image);
        }

        try {
            await api.post('submit_recipe/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setShowCreateModal(false);
            setRecipeForm({ title: '', directions: '', ingredients: '', image: null });
            alert("Recipe created successfully!");
        } catch (error) {
            console.error("Failed to submit recipe", error);
            alert("Failed to submit recipe. Please check inputs.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="account-loading-container">Loading profile...</div>;
    if (!profileData) return <div className="account-error-container">Unable to load profile information.</div>;

    const { user = {}, boards = [] } = profileData;

    // Determine which PFP to display: Local Override -> Backend -> Default
    const displayPfp = localPfp || user.profile_picture || defaultPfp;

    return (
        <div className="user-profile-wrapper">
            {/* Header Portrait Section */}
            <header className="profile-header-block">
                <div className="profile-avatar-wrapper" onClick={() => setShowPfpModal(true)}>
                    <img
                        src={displayPfp}
                        alt={user.username || 'User'}
                        className="profile-large-avatar"
                    />
                    <div className="avatar-edit-overlay">
                        <Camera size={28} color="#FFFFFF" />
                    </div>
                </div>

                <h1 className="profile-display-name">{user.username || 'Tsukuru Chef'}</h1>
                <span className="profile-handle">@{user.username?.toLowerCase() || 'chef'}</span>
            </header>

            {/* Navigation Tabs */}
            <div className="profile-tab-navbar">
                <button
                    className={`profile-tab-item ${activeTab === 'created' ? 'active' : ''}`}
                    onClick={() => setActiveTab('created')}
                >
                    Created
                </button>
                <button
                    className={`profile-tab-item ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    Saved
                </button>
            </div>

            {/* Content Section */}
            <main className="profile-content-grid-area">
                {activeTab === 'saved' ? (
                    boards.length === 0 ? (
                        <div className="empty-state-card">No boards saved yet. Explore recipes to build collections.</div>
                    ) : (
                        <div className="boards-grid">
                            {boards.map((board) => (
                                <div key={board.id} className="board-card-wrapper" onClick={() => handleOpenBoard(board)}>
                                    <div className="board-preview-mosaic">
                                        <BoardMosaic recipeIds={board.recipes} />
                                    </div>
                                    <h3 className="board-title-text">{board.title || 'Unnamed Collection'}</h3>
                                    <span className="board-counter-label">{board.recipes?.length || 0} recipes</span>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    <div className="empty-state-card">
                        <p style={{ marginBottom: '1rem' }}>Share your culinary masterpiece with the world.</p>
                        <button className="btn-primary-cta submit-recipe-btn" onClick={() => setShowCreateModal(true)}>
                            <Plus size={18} style={{ marginRight: '8px' }} /> Create Recipe
                        </button>
                    </div>
                )}
            </main>

            {/* --- MODAL: Choose Profile Picture --- */}
            {showPfpModal && (
                <div className="modal-overlay" onClick={() => setShowPfpModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setShowPfpModal(false)}>
                            <X size={24} />
                        </button>
                        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Choose Profile Picture</h2>

                        <div className="pfp-options-grid">
                            {pfpOptions.map((pfpImg, index) => (
                                <img
                                    key={index}
                                    src={pfpImg}
                                    alt={`PFP Option ${index + 1}`}
                                    className={`pfp-option-img ${displayPfp === pfpImg ? 'selected' : ''}`}
                                    onClick={() => handlePfpSelect(pfpImg)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* --- MODAL: Board Detail --- */}
            {selectedBoard && (
                <div className="modal-overlay" onClick={() => setSelectedBoard(null)}>
                    <div className="modal-content large-modal" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setSelectedBoard(null)}>
                            <X size={24} />
                        </button>
                        <h2>{selectedBoard.title}</h2>

                        {isLoadingBoard ? (
                            <p>Loading recipes...</p>
                        ) : boardRecipes.length === 0 ? (
                            <p>No recipes in this board.</p>
                        ) : (
                            <div className="board-recipes-grid">
                                {boardRecipes.map(recipe => (
                                    <div key={recipe.id} className="board-recipe-card">
                                        <img
                                            src={recipe.image || '/placeholder-food.jpg'}
                                            alt={recipe.title}
                                            className="board-recipe-img"
                                            onClick={() => navigate(`/recipes/${recipe.id}`)}
                                        />
                                        <div className="board-recipe-info">
                                            <h4>{recipe.title}</h4>
                                            <button
                                                className="unsave-btn"
                                                onClick={() => handleUnsaveRecipe(recipe.id)}
                                                title="Remove from board"
                                            >
                                                <Trash2 size={16} /> Unsave
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* --- MODAL: Create New Recipe --- */}
            {showCreateModal && (
                <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <button className="modal-close-btn" onClick={() => setShowCreateModal(false)}>
                            <X size={24} />
                        </button>
                        <h2>Create New Recipe</h2>
                        <form className="recipe-form" onSubmit={handleCreateRecipe}>
                            <div className="form-group">
                                <label>Recipe Title</label>
                                <input
                                    type="text"
                                    required
                                    value={recipeForm.title}
                                    onChange={e => setRecipeForm({ ...recipeForm, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Ingredients (comma separated)</label>
                                <textarea
                                    required
                                    rows="3"
                                    placeholder="e.g. 2 eggs, 1 cup flour, salt to taste"
                                    value={recipeForm.ingredients}
                                    onChange={e => setRecipeForm({ ...recipeForm, ingredients: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Directions</label>
                                <textarea
                                    required
                                    rows="5"
                                    value={recipeForm.directions}
                                    onChange={e => setRecipeForm({ ...recipeForm, directions: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Recipe Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={e => setRecipeForm({ ...recipeForm, image: e.target.files[0] })}
                                />
                            </div>
                            <button type="submit" className="submit-recipe-btn" disabled={isSubmitting}>
                                {isSubmitting ? 'Publishing...' : 'Publish Recipe'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}