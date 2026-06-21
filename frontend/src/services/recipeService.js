import api from './api';

export const recipeService = {
    /**
     * GET: Fetch all recipes (supports search and filtering)
     * Endpoint: /api/recipes/ or /api/recipes/?search=pasta
     */
    getAllRecipes: async (searchQuery = '', filters = {}) => {
        try {
            // Build query string dynamically
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            
            // Add any extra filters (e.g., category=dessert, time=30)
            Object.keys(filters).forEach(key => params.append(key, filters[key]));

            const response = await api.get(`recipes/?${params.toString()}`);
            return response.data; // Remember: DRF might return response.data.results if paginated
        } catch (error) {
            console.error("Error fetching recipes:", error);
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
    saveRecipeToBoard: async (id) => {
        try {
            const response = await api.post(`recipes/${id}/save/`);
            return response.data;
        } catch (error) {
            console.error(`Error saving recipe ${id}:`, error);
            throw error;
        }
    }
};