import React, { useState, useEffect } from 'react';
import { getAllProducts } from '../api/products'; // Importamos nuestra función de la API
import ProductCard from '../components/ProductCard'; // Importamos el componente de la tarjeta

const HomePage = () => {
    // 1. Creamos un estado para guardar la lista de productos
    const [products, setProducts] = useState([]);

    // 2. Usamos useEffect para ejecutar código cuando el componente se carga por primera vez
    useEffect(() => {
        // Definimos una función interna para poder usar async/await
        const fetchProducts = async () => {
            const data = await getAllProducts(); // Llamamos a la API
            setProducts(data); // Guardamos los datos en el estado
        };

        fetchProducts();
    }, []); // El array vacío [] asegura que esto se ejecute solo una vez

    // Estilos para el contenedor de la cuadrícula de productos
    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1.5rem',
        padding: '2rem',
    };

    return (
        <div>
            <h1>Nuestros Vinilos</h1>
            <div style={gridStyle}>
                {/* 3. Hacemos un "map" sobre la lista de productos.
                    Por cada producto en el array, renderizamos un componente ProductCard */}
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default HomePage;