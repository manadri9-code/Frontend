import axios from 'axios';

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Función para hacer login
export const loginUser = async (credentials) => {
    // credentials será un objeto: { correo_electronico, password }
    try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data; // Esto debería devolver { token }
    } catch (error) {
        console.error("Error en el login:", error.response.data);
        throw error.response.data; // Lanza el error para que el componente lo maneje
    }
};

// Función para registrarse
export const registerUser = async (userData) => {
    // userData será { nombre, apellido, correo_electronico, password }
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data; // Esto devuelve { message, user }
    } catch (error) {
        console.error("Error en el registro:", error.response.data);
        throw error.response.data;
    }
};
export const verifyEmail = async (email, code) => {
    try {
        const response = await apiClient.post('/auth/verify-email', {
            correo_electronico: email,
            codigo_verificacion: code
        });
        return response.data; // Devuelve { message: "..." }
    } catch (error) {
        console.error("Error en la verificación:", error.response.data);
        throw error.response.data;
    }
};