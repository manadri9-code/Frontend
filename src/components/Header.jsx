import React, { useState } from 'react'; // Importamos useState

import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    // Estado para manejar el hover del botón Login
    const [isLoginHovered, setIsLoginHovered] = useState(false);
    const { isLoggedIn, logout, isLoading } = useAuth(); // <-- 2. OBTÉN EL ESTADO Y FUNCIONES
    const navigate = useNavigate();
    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirige al login después de cerrar sesión
    };
    // --- ESTILOS ---

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between', // Separa el grupo izq. del der.
        alignItems: 'center',
        padding: '1.5rem 2rem', // Añadí un padding horizontal
        borderBottom: '1px solid #e0e0e0',
        marginBottom: '2rem',
        flexWrap: 'wrap', // Permite que los elementos bajen en pantallas pequeñas
        gap: '1rem', // Espacio si los elementos "wrappean"
    };

    // Estilo para el contenedor izquierdo (Logo, Home, Contact)
    const leftNavStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem', // Espacio entre logo, home y contact
    };

    // Estilo para el contenedor derecho (Login)
    const rightNavStyle = {
        display: 'flex',
    };

    const logoStyle = {
        height: '40px',
        display: 'block', // Para alinear bien con flex
    };

    // Estilo base para links (Home, Contact)
    const linkStyle = {
        color: '#000000',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '1rem',
    };

    // Estilo específico para el botón/link de LOGIN
    const loginLinkStyle = {
        ...linkStyle, // Hereda estilos de linkStyle
        backgroundColor: '#000000',
        color: '#FFFFFF', // Texto blanco para contraste
        padding: '0.5rem 1.2rem',
        borderRadius: '5px',
        transition: 'background-color 0.3s ease, transform 0.3s ease', // Transición suave
    };

    // Estilo que se aplicará DURANTE el hover
    const loginLinkHoverStyle = {
        backgroundColor: '#333333', // Un gris oscuro al pasar el mouse
        transform: 'scale(1.05)', // Efecto sutil de zoom
    };

    // Combinamos los estilos: si isLoginHovered es true, aplica el hoverStyle
    const dynamicLoginStyle = isLoginHovered
        ? { ...loginLinkStyle, ...loginLinkHoverStyle }
        : loginLinkStyle;

    // --- RENDER ---
    if (isLoading) {
        return null; // O un spinner de carga
    }
    return (
        <header style={headerStyle}>

            {/* GRUPO IZQUIERDO */}
            <div style={leftNavStyle}>
                <Link to="/">
                    <img src="/logo.png" alt="Logo de la Tienda" style={logoStyle} />
                </Link>
                <Link to="/" style={linkStyle}>HOME</Link>
                <Link to="/contact" style={linkStyle}>CONTACT</Link>
            </div>

            {/* GRUPO DERECHO */}
            <div style={rightNavStyle}>
                {isLoggedIn ? (
                    <>
                        <Link to="/my-account" style={linkStyle}>MI CUENTA</Link>
                        <button onClick={handleLogout} style={linkStyle}>LOGOUT</button>
                    </>
                ) : (
                    <Link
                        to="/login"
                        style={dynamicLoginStyle}
                        onMouseEnter={() => setIsLoginHovered(true)} // Activa el hover
                        onMouseLeave={() => setIsLoginHovered(false)} // Desactiva el hover
                    >
                        LOGIN
                    </Link>)}
            </div>

        </header>
    );
};

export default Header;