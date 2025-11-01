import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Necesitaremos esta librería

// 1. Crear el Contexto
const AuthContext = createContext();

// 2. Crear el "Proveedor" del Contexto
// Este componente envolverá nuestra aplicación y proveerá el estado.
export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Para saber si estamos verificando el token inicial

    useEffect(() => {
        // Al cargar la app, revisa si ya existe un token en localStorage
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            try {
                const decodedUser = jwtDecode(storedToken);
                if (decodedUser.exp * 1000 < Date.now()) {
                    // Si el token expiró, bórralo
                    localStorage.removeItem('token');
                    throw new Error('Token expirado');
                }
                setUser(decodedUser.user); // Extrae el { user: { id: ... } } del payload
                setToken(storedToken);
            } catch (error) {
                // Si el token está expirado o malformado, lo borramos
                localStorage.removeItem('token');
                setUser(null);
                setToken(null);
            }
        }
        setIsLoading(false); // Terminamos de cargar
    }, []);

    // Función para manejar el Login
    const login = (newToken) => {
        try {
            const decodedUser = jwtDecode(newToken);
            localStorage.setItem('token', newToken); // Guarda en localStorage
            setToken(newToken);
            setUser(decodedUser.user);
        } catch (error) {
            console.error("Error al decodificar el token en login:", error);
        }
    };

    // Función para manejar el Logout
    const logout = () => {
        localStorage.removeItem('token'); // Borra de localStorage
        setToken(null);
        setUser(null);
    };

    // 3. Devolvemos el Proveedor con los valores que queremos compartir
    return (
        <AuthContext.Provider value={{
            token,
            user,
            isLoggedIn: !!user, // !!user convierte el objeto user en un booleano (true si existe, false si es null)
            isLoading,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

// 4. Crear un "Hook" personalizado
// Esto nos da un atajo fácil (useAuth()) para usar el contexto en cualquier componente
export const useAuth = () => {
    return useContext(AuthContext);
};