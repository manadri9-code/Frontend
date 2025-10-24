import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// OBTENER TODOS los favoritos de un usuario
export const getAllFavorites = async (token) => {
    try {
        const response = await apiClient.get('/favorites', {
            headers: { 'x-auth-token': token }
        });
        return response.data; // Devuelve un array de productos favoritos
    } catch (error) {
        console.error("Error al obtener favoritos:", error.response.data);
        throw error.response.data;
    }
};

// AÑADIR un favorito
export const addFavorite = async (productId, token) => {
    try {
        const response = await apiClient.post(
            `/favorites/${productId}`,
            null,
            { headers: { 'x-auth-token': token } }
        );
        return response.data;
    } catch (error) {
        console.error("Error al añadir a favoritos:", error.response.data);
        throw error.response.data;
    }
};

// QUITAR un favorito
export const removeFavorite = async (productId, token) => {
    try {
        const response = await apiClient.delete(
            `/favorites/${productId}`,
            { headers: { 'x-auth-token': token } }
        );
        return response.data;
    } catch (error) {
        console.error("Error al quitar de favoritos:", error.response.data);
        throw error.response.data;
    }
};