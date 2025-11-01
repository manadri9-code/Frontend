import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCart } from '../api/cart';
import { placeOrder } from '../api/orders';
import { useAuth } from '../context/AuthContext';
import OrderModal from '../components/OrderModal';
import './CheckoutPage.css';

const CheckoutPage = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState(''); // 'card' o 'paypal'
    const [cardInfo, setCardInfo] = useState({ number: '', name: '', expiry: '', cvv: '' });
    const [paypalInfo, setPaypalInfo] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [completedOrderData, setCompletedOrderData] = useState(null);
    const { token } = useAuth();
    const navigate = useNavigate();

    // 1. Cargar el carrito
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const data = await getCart(token);
                if (data.length === 0) {
                    // Si el carrito está vacío, no deberías estar aquí
                    navigate('/cart');
                }
                setCartItems(data);
                setLoading(false);
            } catch (error) {
                console.error("Error al cargar carrito:", error);
                setLoading(false);
            }
        };
        fetchCartData();
    }, [token, navigate]);

    // 2. Calcular el total
    const total = cartItems.reduce((acc, item) => acc + (parseFloat(item.precio) * item.cantidad), 0);

    // 3. Manejadores de formularios y validación
    const handleCardChange = (e) => {
        let { name, value } = e.target;
        let errorMsg = '';

        if (name === 'number') {
            value = value.replace(/\D/g, '').slice(0, 16);
        } else if (name === 'name') {
            value = value.replace(/[^a-zA-Z\s]/g, '').toUpperCase();
        } else if (name === 'expiry') {
            value = value.replace(/[^0-9/]/g, '').slice(0, 5);
            if (value.length === 2 && !value.includes('/')) {
                value += '/';
            }
        } else if (name === 'cvv') {
            value = value.replace(/\D/g, '').slice(0, 3);
        }

        setCardInfo(prev => ({ ...prev, [name]: value }));
        if (value.trim() === '') {
            errorMsg = 'Este campo es requerido';
        }
        setErrors(prev => ({ ...prev, [name]: errorMsg }));
    };

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (paymentMethod === 'card') {
            const { number, name, expiry, cvv } = cardInfo;
            if (number.length < 16) {
                newErrors.number = 'Debe tener 16 dígitos';
                isValid = false;
            }
            if (!name) { newErrors.name = 'El nombre es requerido'; isValid = false; }
            if (cvv.length < 3) { newErrors.cvv = 'Debe tener 3 dígitos'; isValid = false; }

            // Validación de fecha
            if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
                newErrors.expiry = 'Formato debe ser MM/AA';
                isValid = false;
            } else {
                const [month, year] = expiry.split('/');
                const expiryDate = new Date(2000 + parseInt(year), parseInt(month) - 1);
                const now = new Date();
                if (expiryDate < now) {
                    newErrors.expiry = 'La tarjeta ha expirado';
                    isValid = false;
                }
            }
        } else if (paymentMethod === 'paypal') {
            // Validación simple de PayPal
            if (!paypalInfo.email.includes('@')) {
                newErrors.paypalEmail = 'Correo de PayPal inválido';
                isValid = false;
            }
            if (paypalInfo.password.length < 6) {
                newErrors.paypalPass = 'Contraseña requerida';
                isValid = false;
            }
        } else {
            newErrors.paymentMethod = 'Debes seleccionar un método de pago';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // 4. Finalizar compra
    const handleFinalizePurchase = async () => {
        if (!validateForm()) {
            return;
        }

        setIsPlacingOrder(true);
        try {
            // Simulamos que enviamos el pago
            const paymentData = paymentMethod === 'card' ? { type: 'card', ...cardInfo } : { type: 'paypal', email: paypalInfo.email };

            const data = await placeOrder(paymentData, token);

            // --- 3. LÓGICA DE ÉXITO ACTUALIZADA ---
            setCompletedOrderData(data); // data es { order, details }
            setShowModal(true); // Abre el modal

        } catch (error) {
            alert(`Error al finalizar la compra: ${error.message}`);
        } finally {
            setIsPlacingOrder(false);
        }
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setCompletedOrderData(null);
        navigate('/'); // Redirige al inicio DESPUÉS de cerrar el modal
    };



    if (loading) return <p>Cargando checkout...</p>;

    return (
        <>
            <div className="checkout-grid">
                {/* --- COLUMNA IZQUIERDA: RESUMEN --- */}
                <div className="checkout-summary">
                    <h2>Resumen de tu Compra</h2>
                    {cartItems.map(item => (
                        <div key={item.cart_item_id} className="summary-item">
                            <img src={item.imagen_url || '/placeholder.png'} alt={item.nombre} className="summary-item-img" />
                            <div className="summary-item-info">
                                <h4>{item.nombre}</h4>
                                <span className="summary-item-price">${item.precio} x {item.cantidad}</span>
                            </div>
                            <span className="summary-item-total">${(item.precio * item.cantidad).toFixed(2)}</span>
                        </div>
                    ))}
                </div>

                {/* --- COLUMNA DERECHA: PAGO --- */}
                <div className="checkout-payment">
                    <h2>Forma de Pago</h2>

                    {/* Opción Tarjeta */}
                    <div className="payment-option">
                        <label className="payment-header" onClick={() => setPaymentMethod('card')}>
                            <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} readOnly />
                            <span className="custom-checkbox"></span>
                            Tarjeta de Crédito / Débito
                            <img src="/credit-card-logos.png" alt="Visa/MC" className="payment-logo" />
                        </label>

                        {paymentMethod === 'card' && (
                            <div className="payment-form">
                                <input type="text" name="number" placeholder="Número de Tarjeta" value={cardInfo.number} onChange={handleCardChange} maxLength="16" />
                                {errors.number && <p className="error-message">{errors.number}</p>}
                                <input type="text" name="name" placeholder="Nombre del Titular" value={cardInfo.name} onChange={handleCardChange} />
                                {errors.name && <p className="error-message">{errors.name}</p>}
                                <div className="form-row">
                                    <div>
                                        <input type="text" name="expiry" placeholder="MM/AA" value={cardInfo.expiry} onChange={handleCardChange} maxLength="5" />
                                        {errors.expiry && <p className="error-message">{errors.expiry}</p>}
                                    </div>
                                    <div>
                                        <input type="text" name="cvv" placeholder="CVV" value={cardInfo.cvv} onChange={handleCardChange} maxLength="3" />
                                        {errors.cvv && <p className="error-message">{errors.cvv}</p>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Opción PayPal */}
                    <div className="payment-option">
                        <label className="payment-header" onClick={() => setPaymentMethod('paypal')}>
                            <input type="radio" name="paymentMethod" value="paypal" checked={paymentMethod === 'paypal'} readOnly />
                            <span className="custom-checkbox"></span>
                            PayPal
                            <img src="/paypal-logo.png" alt="PayPal" className="payment-logo" />
                        </label>

                        {paymentMethod === 'paypal' && (
                            <div className="payment-form">
                                <input type="email" placeholder="Correo de PayPal" value={paypalInfo.email} onChange={e => setPaypalInfo(p => ({ ...p, email: e.target.value }))} />
                                {errors.paypalEmail && <p className="error-message">{errors.paypalEmail}</p>}
                                <input type="password" placeholder="Contraseña de PayPal" value={paypalInfo.password} onChange={e => setPaypalInfo(p => ({ ...p, password: e.target.value }))} />
                                {errors.paypalPass && <p className="error-message">{errors.paypalPass}</p>}
                            </div>
                        )}
                    </div>

                    {errors.paymentMethod && <p className="error-message">{errors.paymentMethod}</p>}

                    {/* Total y Botón Final */}
                    <div className="payment-total">
                        TOTAL A PAGAR: ${total.toFixed(2)}
                    </div>
                    <button className="btn-primary" onClick={handleFinalizePurchase} disabled={isPlacingOrder}>
                        {isPlacingOrder ? 'Procesando...' : 'Finalizar Compra'}
                    </button>
                </div>
            </div>
            {showModal && (
                <OrderModal
                    orderData={completedOrderData}
                    onClose={handleCloseModal}
                />
            )
            }
        </>
    );
};

export default CheckoutPage;