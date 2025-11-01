import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById } from '../api/products';
import { addFavorite, removeFavorite, getAllFavorites } from '../api/favorites';
import { getCart, updateCartItem} from '../api/cart';
import { addReview, deleteReview } from '../api/reviews'; // <-- NUEVO
import { useAuth } from '../context/AuthContext';
import './ProductDetailPage.css'; // Crearemos este archivo para el estilo
import { useCallback } from 'react';
const ProductDetailPage = () => {
    const { id } = useParams(); // Obtiene el "id" de la URL
    const navigate = useNavigate();
    const { isLoggedIn, token, user } = useAuth(); // Obtenemos el estado de login y el token

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFavorite, setIsFavorite] = useState(false);
    const [isFavLoading, setIsFavLoading] = useState(false);
    const [quantity, setQuantity] = useState(1); // Estado para el selector
    const [isCartLoading, setIsCartLoading] = useState(false);
    // Ya no necesitamos 'isInCart', la cantidad lo define.

    // --- NUEVOS ESTADOS PARA RESEÑAS ---
    const [reviewPuntuacion, setReviewPuntuacion] = useState(5);
    const [reviewComentario, setReviewComentario] = useState('');
    const [userHasReviewed, setUserHasReviewed] = useState(false);
    const [userReviewId, setUserReviewId] = useState(null);
    const [reviews, setReviews] = useState([]); // Para poder actualizarlas dinámicamente
    // 
    const fetchProduct = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getProductById(id);
            setProduct(data);
            setReviews(data.resenas || []);
            setError('');
            if (isLoggedIn && token && user) {
                const favoritesData = await getAllFavorites(token);
                const isProductFavorite = favoritesData.some(fav => fav.id === Number(id));
                setIsFavorite(isProductFavorite);

                const cartData = await getCart(token);
                const itemInCart = cartData.find(item => item.id === data.id);
                setQuantity(itemInCart ? itemInCart.cantidad : 1); // Pone la cantidad del carrito o 1

                // Cargar estado de reseñas
                const userReview = data.resenas.find(r => r.usuario_id === user.id);
                if (userReview) {
                    setUserHasReviewed(true);
                    setUserReviewId(userReview.id); // Guardamos el ID de nuestra reseña
                } else {
                    setUserHasReviewed(false);
                    setUserReviewId(null);
                }

            }
        } catch (err) {
            setError('Error al cargar el producto.');
        } finally {
            setLoading(false);
        }
    },[id, isLoggedIn, token,user]);
    useEffect(() => {
        fetchProduct();
    },[fetchProduct]); // Se ejecuta cada vez que el 'id' de la URL cambia

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

// --- MANEJADOR DEL CARRITO ACTUALIZADO ---
    const handleCartSubmit = async () => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        setIsCartLoading(true);
        try {
            // Llama a la nueva API con la cantidad del estado
            await updateCartItem(product.id, quantity, token);
            alert('Carrito actualizado correctamente');
        } catch (err) {
            alert(err.message); // Mostrará el error de stock si ocurre
        } finally {
            setIsCartLoading(false);
        }
    };

// --- NUEVOS MANEJADORES DE RESEÑAS ---}
    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            await addReview({
                producto_id: product.id,
                puntuacion: reviewPuntuacion,
                comentario: reviewComentario
            }, token);

            // Limpiar formulario y recargar datos
            setReviewComentario('');
            setReviewPuntuacion(5);
            fetchProduct(); // Recargamos todo para mostrar la nueva reseña
        } catch (err) {
            alert(err.message);
        }
    };

    const handleReviewDelete = async (reviewId) => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar tu reseña?')) return;
        try {
            await deleteReview(reviewId, token);
            fetchProduct(); // Recargamos para quitar la reseña
        } catch (err) {
            alert(err.message);
        }
    };

    // --- Generador del Selector de Cantidad ---
    const renderQuantitySelector = () => {
        if (!product || product.stock === 0) {
            return <p>Producto no disponible</p>;
        }
        const options = [];
        // Solo permite seleccionar hasta el stock disponible
        for (let i = 1; i <= product.stock; i++) {
            options.push(<option key={i} value={i}>{i}</option>);
        }
        return (
            <select 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))}
                style={{ width: '100%', padding: '0.5rem', margin: '0.5rem 0' }}
            >
                {options}
            </select>
        );
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
                {/* --- STOCK Y CANTIDAD --- */}
                <p><strong>Disponibles:</strong> {product.stock}</p>
                {renderQuantitySelector()}
                {/* --- BOTONES DE ACCIÓN --- */}
                <button 
                    className="btn-primary" 
                    onClick={handleCartSubmit}
                    disabled={isCartLoading || product.stock === 0}
                >
                    {isCartLoading ? 'Actualizando...' : 'ADD TO CART'}
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

                {/* --- SECCIÓN DE RESEÑAS --- */}
                <div className="reviews-section">
                    <h3>REVIEWS</h3>
                    {/* Generamos 5 estrellas basadas en el promedio */}
                    <div className="stars">
                        {'★'.repeat(Math.round(product.calificacion_promedio))}
                        {'☆'.repeat(5 - Math.round(product.calificacion_promedio))}
                    </div>

                    {/* Formulario para NUEVA reseña */}
                    {isLoggedIn && !userHasReviewed && (
                        <form onSubmit={handleReviewSubmit} style={{ margin: '1rem 0' }}>
                            <h4>Escribe tu reseña:</h4>
                            <div>
                                <label>Puntuación: </label>
                                <select value={reviewPuntuacion} onChange={(e) => setReviewPuntuacion(Number(e.target.value))}>
                                    <option value={5}>5 ★</option>
                                    <option value={4}>4 ★</option>
                                    <option value={3}>3 ★</option>
                                    <option value={2}>2 ★</option>
                                    <option value={1}>1 ★</option>
                                </select>
                            </div>
                            <textarea
                                value={reviewComentario}
                                onChange={(e) => setReviewComentario(e.target.value)}
                                placeholder="Tu opinión..."
                                required
                                style={{ width: '100%', minHeight: '80px', margin: '0.5rem 0' }}
                            />
                            <button type="submit" className="btn-secondary">Publicar Reseña</button>
                        </form>
                    )}

                    {/* Lista de reseñas existentes */}
                    {reviews.length > 0 ? (
                        reviews.map((review) => (
                            <div key={review.id} className="review-text" style={{ borderBottom: '1px solid #eee', padding: '0.5rem 0' }}>
                                <p><strong>{review.nombre}</strong> - {'★'.repeat(review.puntuacion)}</p>
                                <p>"{review.comentario}"</p>
                                {/* Botón de borrar si es nuestra reseña */}
                                {isLoggedIn && userReviewId === review.id && (
                                    <button 
                                        onClick={() => handleReviewDelete(review.id)}
                                        style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer', padding: 0 }}
                                    >
                                        Eliminar mi reseña
                                    </button>
                                )}
                            </div>
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