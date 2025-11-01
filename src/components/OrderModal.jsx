import React, { useRef, useEffect } from 'react';
import './OrderModal.css';

const OrderModal = ({ orderData, onClose }) => {
  const modalRef = useRef();
  
  // Lógica para cerrar al hacer clic afuera
  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!orderData) return null;

  const { order, details } = orderData;

  return (
    <div className="modal-overlay">
      <div className="modal-content" ref={modalRef}>
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        
        <div className="modal-header">
          <img src="/logo-placeholder.png" alt="Logo Tienda" className="modal-logo" />
          <h2>Nota de Compra</h2>
        </div>

        <div className="order-info">
          <p><strong>Orden ID:</strong> {order.id}</p>
          <p><strong>Fecha:</strong> {new Date(order.fecha_orden).toLocaleString('es-MX')}</p>
        </div>

        <table className="modal-note-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cantidad</th>
              <th>P. Unitario</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {details.map(item => (
              <tr key={item.producto_id}>
                <td>
                  <img src={item.imagen_url || '/placeholder.png'} alt={item.nombre} className="modal-item-img" />
                  {item.nombre}
                </td>
                <td style={{textAlign: 'center'}}>{item.cantidad}</td>
                <td style={{textAlign: 'right'}}>${item.precio_unitario}</td>
                <td style={{textAlign: 'right'}}>${(item.precio_unitario * item.cantidad).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="modal-total">
          TOTAL: ${order.total_orden}
        </div>

        <button className="btn-primary" style={{width: 'auto', marginTop: '1rem'}} onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default OrderModal;