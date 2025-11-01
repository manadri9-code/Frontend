import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyOrders, getOrderById, cancelOrder, requestReturn } from '../api/orders';
import OrderModal from '../components/OrderModal'; // Reutilizamos el modal
import './MyOrdersPage.css'; // Importamos estilos

const MyOrdersPage = () => {
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('compras'); // 'compras', 'canceladas', 'devoluciones'
    const { token } = useAuth();

    // Estados para el modal
    const [showNote, setShowNote] = useState(false);
    const [selectedOrderData, setSelectedOrderData] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMyOrders(token);
            setAllOrders(data);
        } catch (error) {
            console.error("Error al cargar órdenes:", error);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (token) fetchOrders();
    }, [fetchOrders, token]);

    // --- Manejadores de Acciones ---
    const handleCancel = async (orderId) => {
        if (!window.confirm('¿Estás seguro de que quieres cancelar esta compra? Esta acción es irreversible.')) return;
        try {
            await cancelOrder(orderId, token);
            fetchOrders(); // Recargar la lista de órdenes
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleReturn = async (orderId) => {
        if (!window.confirm('¿Estás seguro de que quieres iniciar una devolución para esta compra?')) return;
        try {
            await requestReturn(orderId, token);
            fetchOrders(); // Recargar la lista
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    const handleViewNote = async (orderId) => {
        try {
            const data = await getOrderById(orderId, token); // { order, details }
            setSelectedOrderData(data);
            setShowNote(true);
        } catch (error) {
            alert('No se pudo cargar la nota de compra.');
        }
    };

    // --- Lógica de Filtrado ---
    const filterOrders = (estado) => {
        const compras = allOrders.filter(o => o.estado === 'Procesando' || o.estado === 'Entregado');
        const canceladas = allOrders.filter(o => o.estado === 'Cancelada');
        const devoluciones = allOrders.filter(o => o.estado === 'Devolución en proceso' || o.estado === 'Devuelto');
        
        if (estado === 'compras') return compras;
        if (estado === 'canceladas') return canceladas;
        if (estado === 'devoluciones') return devoluciones;
        return [];
    };

    const renderTable = (orders) => {
        if (loading) return <p>Cargando...</p>;
        if (orders.length === 0) return <p>No hay órdenes en esta sección.</p>;

        return (
            <table className="orders-table">
                <thead>
                    <tr>
                        <th>Orden ID</th>
                        <th>Fecha Compra</th>
                        <th>Fecha Recibido</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} className={order.estado === 'Cancelada' ? 'order-row disabled' : ''}>
                            <td>#{order.id}</td>
                            <td>{new Date(order.fecha_orden).toLocaleDateString('es-MX')}</td>
                            <td>{order.fecha_recibido ? new Date(order.fecha_recibido).toLocaleDateString('es-MX') : (order.estado === 'Procesando' ? 'Sin entregar' : '-')}</td>
                            <td>${order.total_orden}</td>
                            <td>{renderStatus(order.estado)}</td>
                            <td className="order-actions">
                                {order.estado === 'Procesando' && <button className="btn-danger" onClick={() => handleCancel(order.id)}>Cancelar Compra</button>}
                                {order.estado === 'Entregado' && <button className="btn-secondary" onClick={() => handleReturn(order.id)}>Devolver Compra</button>}
                                {order.estado !== 'Procesando' && <button className="btn-secondary" onClick={() => handleViewNote(order.id)}>Ver Nota</button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderStatus = (status) => {
        if (status === 'Cancelada') return <span className="status-message status-Cancelada">Compra Cancelada</span>;
        if (status === 'Devolución en proceso') return <span className="status-message status-Devolución">Devolución en proceso</span>;
        if (status === 'Devuelto') return <span className="status-message status-Devuelto">Producto Devuelto</span>;
        return status; // 'Procesando' o 'Entregado'
    };

    return (
        <div className="my-orders-container">
            <h1>Mis Compras</h1>
            
            <div className="tabs-container">
                <button className={`tab-button ${tab === 'compras' ? 'active' : ''}`} onClick={() => setTab('compras')}>
                    Compras
                </button>
                <button className={`tab-button ${tab === 'canceladas' ? 'active' : ''}`} onClick={() => setTab('canceladas')}>
                    Canceladas
                </button>
                <button className={`tab-button ${tab === 'devoluciones' ? 'active' : ''}`} onClick={() => setTab('devoluciones')}>
                    Devoluciones
                </button>
            </div>
            
            {/* Renderiza la tabla que corresponde al tab activo */}
            {renderTable(filterOrders(tab))}

            {/* El modal de la nota de compra (reutilizado) */}
            {showNote && (
                <OrderModal 
                    orderData={selectedOrderData}
                    onClose={() => setShowNote(false)}
                />
            )}
        </div>
    );
};

export default MyOrdersPage;