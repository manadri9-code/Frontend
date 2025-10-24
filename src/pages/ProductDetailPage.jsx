import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../api/products';
import { addFavorite, removeFavorite, getAllFavorites } from '../api/favorites';
import { getCart, addToCart, removeFromCart } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css'; // Crearemos este archivo para el estilo

const ProductDetailPage = () => {
    const { id } = useParams(); // Obtiene el "id" de la URL
    const navigate = useNavigate();
    const { isLoggedIn, token } = useAuth(); // Obtenemos el estado de login y el token

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFavLoading, setIsFavLoading] = useState(false);
    const [isInCart, setIsInCart] = useState(false);
    const [isCartLoading, setIsCartLoading] = useState(false);
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(id);
                setProduct(data);
                setError('');
                if (isLoggedIn && token) {
                    const favoritesData = await getAllFavorites(token);
                    const isProductFavorite = favoritesData.some(fav => fav.id === Number(id));
                    setIsFavorite(isProductFavorite);
                    const cartData = await getCart(token);
                    const isProductInCart = cartData.some(item => item.id === data.id);
                    setIsInCart(isProductInCart);
                }
            } catch (err) {
                setError('Error al cargar el producto.');
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id, isLoggedIn, token]); // Se ejecuta cada vez que el 'id' de la URL cambia

    const handleFavoriteClick = async () => {
        // 1. VALIDACIÓN: Si no está logueado, lo mandamos al login
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }
        setIsFavLoading(true);
        // 2. Si está logueado, llamamos a la API
        try {
            if (isFavorite) {
                // Si ya es favorito, lo quitamos
                await removeFavorite(product.id, token);
                setIsFavorite(false);
                alert('Producto eliminado de favoritos');
            } else {
                // Si no es favorito, lo añadimos
                await addFavorite(product.id, token);
                setIsFavorite(true);
                alert('Producto añadido a favoritos');
            }
        } catch (err) {
            alert(err.message); // "Este producto ya está en tus favoritos"
        }
        finally {
            setIsFavLoading(false); // Volver a habilitar el botón
        }
    };

    const handleCartClick = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        setIsCartLoading(true);
        try {
            if (isInCart) {
                // Si ya está, lo quitamos
                await removeFromCart(product.id, token);
                setIsInCart(false);
                alert('Producto eliminado del carrito');
            } else {
                // Si no está, lo añadimos
                await addToCart(product.id, token);
                setIsInCart(true);
                alert('Producto agregado al carrito correctamente');
            }
        } catch (err) {
            alert(err.message);
        } finally {
            setIsCartLoading(false);
        }
    };

    if (loading) return <p>Cargando producto...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!product) return <p>Producto no encontrado.</p>;

    return (
        <div className="product-detail-grid">
            {/* --- Columna Izquierda: Imagen --- */}
            <div className="product-image-container">
                <img src={product.imagen_url || '/placeholder.png'} alt={product.nombre} className="product-image" />
                <div className="price-tag">${product.precio}</div>
            </div>

            {/* --- Columna Derecha: Info --- */}
            <div className="product-info-container">
                <h1 className="product-title">{product.nombre}</h1>
                <p className="product-artist">{product.descripcion.split(' ').slice(0, 2).join(' ')}</p> {/* Simula el artista */}

                <h2 className="product-price">${product.precio}</h2>

                <button
                    className={isInCart ? 'btn-danger' : 'btn-primary'}
                    onClick={handleCartClick}
                    disabled={isCartLoading}
                >
                    {isInCart ? 'DELETE TO CART' : 'ADD TO CART'}
                </button>
                <button
                    className={isFavorite ? 'btn-favorited' : 'btn-secondary'}
                    onClick={handleFavoriteClick}
                    disabled={isFavLoading} // Deshabilitar mientras se procesa
                >
                    {isFavorite ? 'Quitar de Favoritos' : 'Agregar a Favoritos'} ♡
                </button>

                <div className="product-meta">
                    <p><strong>FORMAT:</strong> Viny LP</p>
                    <p><strong>RELEASE DATE:</strong> 2023</p>
                </div>

                <p className="product-description">{product.descripcion}</p>

                <div className="reviews-section">
                    <h3>REVIEWS</h3>
                    {/* Generamos 5 estrellas basadas en el promedio */}
                    <div className="stars">
                        {'★'.repeat(Math.round(product.calificacion_promedio))}
                        {'☆'.repeat(5 - Math.round(product.calificacion_promedio))}
                    </div>
                    {product.resenas && product.resenas.length > 0 ? (
                        product.resenas.map((review, index) => (
                            <p key={index} className="review-text">"{review.comentario}" - <strong>{review.nombre}</strong></p>
                        ))
                    ) : (
                        <p className="review-text">No hay reseñas para este producto aún.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;