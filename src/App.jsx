import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import FavoritesPage from './pages/FavoritesPage'; // <-- 1. Importa
import ProtectedRoute from './components/ProtectedRoute'; // <-- 2. Importa
import CheckoutPage from './pages/CheckoutPage';
import MyOrdersPage from './pages/MyOrdersPage';
function App() {
  return (

    <div className="app-container">
      <Header />
    
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />

        {/* Rutas Protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          {/* <Route path="/profile" element={...} /> */}
        </Route>
        <Route path="*" element={<h1>404: Página No Encontrada</h1>} />
      </Routes>
    </div>
  );
}

export default App;