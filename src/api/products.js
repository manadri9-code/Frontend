import axios from 'axios';

// Creamos una instancia de axios que apunta a nuestra API
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Función para obtener todos los productos
export const getAllProducts = async () => {
    try {
        const response = await apiClient.get('/products');
        return response.data;
    } catch (error) {
        // Manejar el error (podríamos mostrar un mensaje al usuario)
        console.error("Error al obtener los productos:", error);
        // Devolvemos un array vacío en caso de error para no romper la app
        return [];
    }
};
export const getProductById = async (id) => {
    try {
        // Llama al endpoint que nos da un producto y sus reseñas
        const response = await apiClient.get(`/products/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error al obtener el producto:", error);
        throw error.response.data;
    }
};