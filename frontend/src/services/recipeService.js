import api from './api';

export const recipeService = {
    getAllRecipes: async (searchQuery = '', page = 1) => {
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('q', searchQuery);
            if (page > 1) params.append('page', page);

            const response = await api.get(`recipes/?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching recipes:", error);
            throw error;
        }
    },

    /**
     * GET: Fetch user boards to select where to save
     * Endpoint: /api/account/
     */
    getUserBoards: async () => {
        try {
            const response = await api.get('account/');
            return response.data;
        } catch (error) {
            console.error("Error fetching boards:", error);
            throw error;
        }
    },

    /**
     * POST: Save recipe to board or create new board
     * Endpoint: /api/boards/
     */

    saveRecipeToBoard: async (recipeId, boardId = null, newBoardTitle = '') => {
        try {
            // Force the recipeId to be a clean integer
            const payload = { recipe_id: parseInt(recipeId, 10) };

            if (boardId) {
                payload.board_id = parseInt(boardId, 10);
            } else if (newBoardTitle) {
                payload.new_board_title = newBoardTitle.trim();
            }

            // Verify in your browser console that this object is full before it sends
            console.log("Sending POST payload to Django:", payload);

            // The trailing slash HERE is absolutely mandatory
            const response = await api.post('recipes/save/', payload);
            return response.data;
        } catch (error) {
            console.error(`Error saving recipe ${recipeId}:`, error);
            throw error;
        }
    },

    /**
     * GET: Fetch recipes specifically flagged as trending
     * Endpoint: /api/recipes/trending/
     */
    getTrendingRecipes: async () => {
        try {
            const response = await api.get('recipes/trending/');
            return response.data;
        } catch (error) {
            console.error("Error fetching trending recipes:", error);
            throw error;
        }
    },

    /**
     * GET: Fetch a single recipe by its ID
     * Endpoint: /api/recipes/{id}/
     */
    getRecipeById: async (id) => {
        try {
            const response = await api.get(`recipes/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching recipe ${id}:`, error);
            throw error;
        }
    },

    /**
     * POST: Create a new recipe
     * Endpoint: /api/recipes/
     */
    createRecipe: async (recipeData) => {
        try {
            // If recipeData contains an image file, we MUST use FormData, not standard JSON.
            // DRF requires multipart/form-data to parse uploaded files correctly.
            const config = recipeData instanceof FormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : {};

            const response = await api.post('recipes/', recipeData, config);
            return response.data;
        } catch (error) {
            console.error("Error creating recipe:", error);
            throw error;
        }
    },

    /**
     * PUT/PATCH: Update an existing recipe
     * Endpoint: /api/recipes/{id}/
     */
    updateRecipe: async (id, recipeData) => {
        try {
            const config = recipeData instanceof FormData
                ? { headers: { 'Content-Type': 'multipart/form-data' } }
                : {};

            // Use PATCH for partial updates, PUT if you are replacing the whole object
            const response = await api.patch(`recipes/${id}/`, recipeData, config);
            return response.data;
        } catch (error) {
            console.error(`Error updating recipe ${id}:`, error);
            throw error;
        }
    },

    /**
     * DELETE: Remove a recipe
     * Endpoint: /api/recipes/{id}/
     */
    deleteRecipe: async (id) => {
        try {
            const response = await api.delete(`recipes/${id}/`);
            return response.data;
        } catch (error) {
            console.error(`Error deleting recipe ${id}:`, error);
            throw error;
        }
    },

    /**
     * POST: Save/Bookmark a recipe to the user's profile
     * Endpoint: /api/recipes/{id}/save/
     */
};