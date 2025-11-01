import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './UserMenu.css';

// Le pasamos la función de logout y una función para cerrar el menú
const UserMenu = ({ handleLogout, closeMenu }) => {
  const menuRef = useRef(null);

  // Efecto para cerrar el menú si se hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [closeMenu]);

  return (
    <div className="user-menu" ref={menuRef}>
      <Link to="/favorites" className="user-menu-item" onClick={closeMenu}>
        Mis Favoritos ❤️
      </Link>
      <Link to="/my-orders" className="user-menu-item" onClick={closeMenu}>
        Mis Órdenes
      </Link>
      <Link to="/profile" className="user-menu-item" onClick={closeMenu}>
        Mi Perfil
      </Link>
      <button className="user-menu-item logout" onClick={handleLogout}>
        LOGOUT
      </button>
    </div>
  );
};

export default UserMenu;