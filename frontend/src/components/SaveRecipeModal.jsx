import { useState, useEffect } from 'react';
import { recipeService } from '../services/recipeService';
import { Plus } from 'lucide-react';
import '../assets/css/SaveRecipeModal.css';

export default function SaveRecipeModal({ recipeId, onClose, onSuccess }) {
    const [boards, setBoards] = useState([]);
    const [selectedOption, setSelectedOption] = useState('');
    const [newBoardName, setNewBoardName] = useState('');

    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const fetchBoards = async () => {
            try {
                const data = await recipeService.getUserBoards();
                setBoards(data);
                setSelectedOption(data.length > 0 ? data[0].id : 'new');
            } catch (err) {
                console.error("API Error fetching boards:", err);
                setErrorMsg('Failed to load your boards.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBoards();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (selectedOption === 'new' && !newBoardName.trim()) {
            setErrorMsg('Please enter a name for your new board.');
            return;
        }

        setIsSaving(true);
        try {
            const boardId = selectedOption !== 'new' ? selectedOption : null;
            const newBoardTitle = selectedOption === 'new' ? newBoardName : '';

            await recipeService.saveRecipeToBoard(recipeId, boardId, newBoardTitle);

            if (onSuccess) onSuccess();
            onClose();
        } catch (err) {
            setErrorMsg(err.response?.data?.error || 'Failed to save recipe. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleModalClick = (e) => e.stopPropagation();

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={handleModalClick}>

                {/* Mobile swipe indicator pill */}
                <div className="mobile-drag-handle"></div>

                <h2 className="modal-title">Save to board</h2>

                {isLoading ? (
                    <div className="modal-loading">Loading boards...</div>
                ) : (
                    <form onSubmit={handleSubmit} className="modal-form">
                        <div className="board-options">
                            {/* Empty State Message */}
                            {boards.length === 0 ? (
                                <div className="no-boards-msg">
                                    You don't have any boards yet. Create one below!
                                </div>
                            ) : (
                                /* Map existing boards */
                                boards.map(board => {
                                    const coverImage = board.image || (board.recipes && board.recipes.length > 0 ? board.recipes[0].image : null);
                                    const firstLetter = board.title ? board.title.charAt(0).toUpperCase() : '?';

                                    return (
                                        <label
                                            key={board.id}
                                            className={`board-option ${selectedOption === board.id ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="boardSelection"
                                                value={board.id}
                                                checked={selectedOption === board.id}
                                                onChange={() => setSelectedOption(board.id)}
                                            />

                                            <div className="board-info-wrapper">
                                                <div className="board-thumbnail">
                                                    {coverImage ? (
                                                        <img src={coverImage} alt={board.title} loading="lazy" />
                                                    ) : (
                                                        <span className="board-letter">{firstLetter}</span>
                                                    )}
                                                </div>
                                                <span className="board-name">{board.title}</span>
                                            </div>
                                        </label>
                                    );
                                })
                            )}

                            {/* Create New Board Option */}
                            <label className={`board-option action-option ${selectedOption === 'new' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="boardSelection"
                                    value="new"
                                    checked={selectedOption === 'new'}
                                    onChange={() => setSelectedOption('new')}
                                />
                                <div className="board-info-wrapper">
                                    <div className="plus-icon-wrapper">
                                        <Plus size={20} strokeWidth={3} />
                                    </div>
                                    <span className="board-name">Create board</span>
                                </div>
                            </label>
                        </div>

                        {/* Slide-down input for new board */}
                        {selectedOption === 'new' && (
                            <div className="new-board-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="Name your board (e.g., Weeknight Dinners)"
                                    value={newBoardName}
                                    onChange={(e) => setNewBoardName(e.target.value)}
                                    className="new-board-input"
                                    maxLength={50}
                                    pattern="^[a-zA-Z0-9\s\-_]+$"
                                    title="Letters, numbers, spaces, hyphens, and underscores only"
                                    autoFocus
                                />
                            </div>
                        )}

                        {errorMsg && <div className="modal-error">{errorMsg}</div>}

                        <div className="modal-actions">
                            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSaving}>
                                Cancel
                            </button>
                            <button type="submit" className="btn-submit" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Save'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}