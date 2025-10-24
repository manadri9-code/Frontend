import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// OBTENER TODOS los items del carrito
export const getCart = async (token) => {
    try {
        const response = await apiClient.get('/cart', {
            headers: { 'x-auth-token': token }
        });
        return response.data; // Devuelve un array de productos
    } catch (error) {
        console.error("Error al obtener el carrito:", error.response.data);
        throw error.response.data;
    }
};

// AÑADIR un item al carrito
export const addToCart = async (productId, token) => {
    try {
        const response = await apiClient.post(
            `/cart/${productId}`,
            null,
            { headers: { 'x-auth-token': token } }
        );
        return response.data;
    } catch (error) {
        console.error("Error al añadir al carrito:", error.response.data);
        throw error.response.data;
    }
};

// QUITAR un item del carrito
export const removeFromCart = async (productId, token) => {
    try {
        const response = await apiClient.delete(
            `/cart/${productId}`,
            { headers: { 'x-auth-token': token } }
        );
        return response.data;
    } catch (error) {
        console.error("Error al quitar del carrito:", error.response.data);
        throw error.response.data;
    }
};