import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Simula el envío de un pago y la creación de una orden
export const placeOrder = async (paymentData, token) => {
    try {
        // En una app real, paymentData sería un token de Stripe, etc.
        // Aquí solo lo pasamos para simular.
        const response = await apiClient.post(
            '/orders',
            { paymentData }, // Enviamos el body
            { headers: { 'x-auth-token': token } }
        );
        return response.data; // Devuelve { message, order, details }
    } catch (error) {
        console.error("Error al finalizar la compra:", error.response.data);
        throw error.response.data;
    }
};
export const getOrderById = async (orderId, token) => {
    try {
        const response = await apiClient.get(`/orders/${orderId}`, {
            headers: { 'x-auth-token': token }
        });
        return response.data; // { order, details }
    } catch (error) {
        throw error.response.data;
    }
};

// --- NUEVA ---
// OBTENER TODAS MIS ÓRDENES
export const getMyOrders = async (token) => {
    try {
        const response = await apiClient.get('/orders/my-orders', {
            headers: { 'x-auth-token': token }
        });
        return response.data; // Array de órdenes
    } catch (error) {
        throw error.response.data;
    }
};

// --- NUEVA ---
// CANCELAR UNA ORDEN
export const cancelOrder = async (orderId, token) => {
    try {
        const response = await apiClient.put(
            `/orders/${orderId}/cancel`, 
            null, 
            { headers: { 'x-auth-token': token } }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

// --- NUEVA ---
// INICIAR UNA DEVOLUCIÓN
export const requestReturn = async (orderId, token) => {
    try {
        const response = await apiClient.put(
            `/orders/${orderId}/return`, 
            null, 
            { headers: { 'x-auth-token': token } }
        );
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};