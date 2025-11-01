import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, removeFromCart, updateCartItem } from '../api/cart';
import { useAuth } from '../context/AuthContext';
import './CartPage.css'; // Importamos los estilos

const CartPage = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const { token, isLoggedIn } = useAuth();
    const navigate = useNavigate();

    // Usamos useCallback para evitar que la función se cree en cada render
    const fetchCart = useCallback(async () => {
        if (!isLoggedIn) {
            navigate('/login'); // Si no está logueado, fuera de aquí
            return;
        }
        try {
            setLoading(true);
            const cartData = await getCart(token);
            setItems(cartData);
        } catch (error) {
            console.error("Error al cargar el carrito:", error);
        } finally {
            setLoading(false);
        }
    }, [isLoggedIn, token, navigate]);

    // Cargar el carrito cuando la página se monta
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const handleRemove = async (productId) => {
        try {
            // Usamos el 'productId' porque nuestra API de "toggle" funciona con ese
            await removeFromCart(productId, token);
            // Refrescamos el carrito para mostrar el cambio
            fetchCart();
        } catch (error) {
            console.error("Error al eliminar del carrito:", error);
            alert(error.message || "No se pudo eliminar el producto.");
        }
    };
    const handleQuantityChange = async (productId, newQuantity, stock) => {
        if (newQuantity <= 0) {
            handleRemove(productId); // Si baja a 0, eliminar
            return;
        }
        if (newQuantity > stock) {
            alert(`Solo quedan ${stock} unidades disponibles.`);
            return;
        }
        try {
            await updateCartItem(productId, newQuantity, token);
            fetchCart(); // Recargar el carrito
        } catch (error) {
            alert(error.message);
        }
    };
    // Calculamos el subtotal
    const subtotal = items.reduce((acc, item) => acc + parseFloat(item.precio), 0);

    if (loading) {
        return <p>Cargando carrito...</p>;
    }

    return (
        <div className="cart-container">
            <h1 className="cart-title">YOUR SHOPPING CART</h1>
            <Link to="/shop" className="cart-shop-now">SHOP NOW</Link>

            <table className="cart-table">
                <thead>
                    <tr className="cart-table-header">
                        <th className="col-product">PRODUCT</th>
                        <th className="col-quantity">QUANTITY</th>
                        <th className="col-total">TOTAL</th>
                        <th className="col-remove"></th>
                    </tr>
                </thead>

                <tbody>
                    {items.length === 0 ? (
                        <tr>
                            <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>
                                Tu carrito está vacío.
                            </td>
                        </tr>
                    ) : (
                        items.map(item => (
                            <tr key={item.cart_item_id} className="cart-item-row">
                                <td className="cart-item-product">
                                    <img src={item.imagen_url || '/placeholder.png'} alt={item.nombre} className="cart-item-image" />
                                    <span className="cart-item-name">{item.nombre}</span>
                                </td>
                                <td className="cart-item-quantity">
                                    {/* --- SELECTOR DE CANTIDAD --- */}
                                    <select
                                        value={item.cantidad}
                                        onChange={(e) => handleQuantityChange(item.id, Number(e.target.value), item.stock)}
                                        style={{ padding: '0.25rem' }}
                                    >
                                        {/* Genera opciones hasta el stock */}
                                        {Array.from({ length: item.stock }, (_, i) => i + 1).map(q => (
                                            <option key={q} value={q}>{q}</option>
                                        ))}
                                    </select>                                </td>
                                <td className="cart-item-total">
                                    {/* --- PRECIO TOTAL (PRECIO * CANTIDAD) --- */}
                                    ${(parseFloat(item.precio) * item.cantidad).toFixed(2)}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <a
                                        href="#"
                                        className="cart-item-remove"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleRemove(item.id); // 'item.id' es el producto_id
                                        }}
                                    >
                                        REMOVE
                                    </a>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {items.length > 0 && (
                <div className="cart-footer">
                    <span className="cart-subtotal">SUBTOTAL: ${subtotal.toFixed(2)}</span>
                    <Link to="/checkout" className="btn-primary" style={{ textDecoration: 'none', padding: '0.75rem 1.5rem' }}>
                        PROCEED TO CHECKOUT
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CartPage;