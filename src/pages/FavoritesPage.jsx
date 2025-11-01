import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAllFavorites, removeFavorite } from '../api/favorites';
import { useAuth } from '../context/AuthContext';
import './FavoritesPage.css'; // Importamos los estilos

const FavoritesPage = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token } = useAuth();
    const navigate = useNavigate();

    const fetchFavorites = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getAllFavorites(token);
            setFavorites(data);
        } catch (error) {
            console.error("Error al cargar favoritos:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) {
            fetchFavorites();
        }
    }, [fetchFavorites, token]);

    const handleRemove = async (productId) => {
        if (!window.confirm("¿Seguro que quieres eliminar este producto de tus favoritos?")) return;
        
        try {
            await removeFavorite(productId, token);
            // Actualiza la lista en el frontend al instante
            setFavorites(currentFavorites => 
                currentFavorites.filter(item => item.id !== productId)
            );
        } catch (error) {
            alert("No se pudo eliminar el favorito.");
        }
    };

    if (loading) {
        return <p>Cargando favoritos...</p>;
    }

    return (
        <div className="favorites-container">
            <h1 className="favorites-title">Mis Favoritos ❤️</h1>

            {favorites.length === 0 ? (
                <p>Aún no tienes productos favoritos.</p>
            ) : (
                <table className="fav-table">
                    <thead>
                        <tr>
                            <th>PRODUCTO</th>
                            <th>PRECIO</th>
                            <th>ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {favorites.map(item => (
                            <tr key={item.id}>
                                <td>
                                    <div className="fav-item-product">
                                        <img src={item.imagen_url || '/placeholder.png'} alt={item.nombre} className="fav-item-image" />
                                        <span className="fav-item-name">{item.nombre}</span>
                                    </div>
                                </td>
                                <td>${item.precio}</td>
                                <td className="fav-item-actions">
                                    <button 
                                        className="btn-danger" 
                                        onClick={() => handleRemove(item.id)}
                                    >
                                        Eliminar
                                    </button>
                                    <Link 
                                        to={`/product/${item.id}`} 
                                        className="btn-secondary"
                                    >
                                        Ver Producto
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default FavoritesPage;