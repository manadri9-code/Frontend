import React from 'react';

// Este componente recibe un objeto 'product' con toda su información
const ProductCard = ({ product }) => {
    const cardStyle = {
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '1rem',
        textAlign: 'center',
        backgroundColor: '#1a1a1a',
        color: 'white',
        width: '250px',
    };

    const imageStyle = {
        width: '100%',
        height: '200px',
        objectFit: 'cover',
        borderRadius: '4px',
    };

    const buttonStyle = {
        backgroundColor: 'black',
        color: 'white',
        border: '1px solid white',
        padding: '0.5rem 1rem',
        cursor: 'pointer',
        marginTop: '1rem',
    };

    return (
        <div style={cardStyle}>
            <img 
                src={product.imagen_url || 'https://via.placeholder.com/200'} 
                alt={product.nombre} 
                style={imageStyle} 
            />
            <h3>{product.nombre}</h3>
            <p>${product.precio}</p>
            {/* Mostramos la calificación promedio que nos da el backend */}
            <p>⭐ {product.calificacion_promedio}</p>
            <button style={buttonStyle}>Ver Producto</button>
        </div>
    );
};

export default ProductCard;