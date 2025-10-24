import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';

function App() {
  return (
    // Usamos la clase del CSS que creamos
    <div className="app-container">
      <Header />

      {/* Routes define el área donde cambiarán las páginas */}
      <Routes>
        {/* Route define una página específica */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Ruta comodín para páginas no encontradas */}
        <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default App;