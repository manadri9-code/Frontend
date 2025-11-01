import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const addReview = async (reviewData, token) => {
    const { producto_id, puntuacion, comentario } = reviewData;
    try {
        const response = await apiClient.post(
            '/reviews',
            { producto_id, puntuacion, comentario },
            { headers: { 'x-auth-token': token } }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const deleteReview = async (reviewId, token) => {
    try {
        const response = await apiClient.delete(
            `/reviews/${reviewId}`,
            { headers: { 'x-auth-token': token } }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};