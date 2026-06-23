import api from "./api";

export const authService = {
    /**
     * POST: Authenticate a user and receive a token
     * Endpoint: /api/login/
     */
    login: async (email, password) => {
        try {
            const response = await api.post("auth/login/", { email, password });
            return response.data;
        } catch (error) {
            console.error("Error during login:", error);
            throw error;
        }
    },
    /**
     * POST: Register a new user
     * Endpoint: /api/signup/
     */
    signup: async (name, email, password) => {
        try {
            const response = await api.post('auth/signup/', { name, email, password });
            return response.data;
        } catch (error) {
            console.error("Error during signup:", error);
            throw error;
        }
    },
    logout: async () => {
        try {
            const response = await api.post('auth/logout/');
            return response.data;
        } catch (error) {
            console.error("Error during logout:", error);
            throw error;
        }
    }
}