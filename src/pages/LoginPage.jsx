import React, { useState } from 'react';
import { loginUser } from '../api/auth';
import { useNavigate, Link } from 'react-router-dom'; // Importa useNavigate y Link
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Hook para la redirección
    const { login } = useAuth();


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await loginUser({ 
                correo_electronico: email, 
                password: password 
            });

            // ¡ÉXITO! Guardamos el token en el LocalStorage
            login(data.token);
            console.log("Login exitoso! Token guardado:", data.token);
            // Redirigir al usuario a la página principal después del login
            navigate('/'); 

        } catch (err) {
            setError(err.message || 'Error al iniciar sesión');
        }
    };

    const formContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)', // Resta el espacio del header/footer si existen
        padding: '2rem',
        textAlign: 'center',
    };

    const formStyle = {
        width: '100%',
        maxWidth: '350px', // Ancho máximo del formulario como en tu diseño
        padding: '2rem',
        // No hay border ni background-color explícito si el fondo de la página es blanco
    };

    const logoTopStyle = {
        height: '150px', // Tamaño del logo en el formulario
        marginBottom: '2rem', // Espacio debajo del logo
    };

    const linkStyle = {
        color: '#000000', // Enlaces negros
        textDecoration: 'none',
        marginTop: '0.5rem', // Espacio entre enlaces
        display: 'block', // Para que cada enlace ocupe su propia línea
        fontSize: '0.9rem',
    };

    return (
        <div style={formContainerStyle}>
            <img src="/logo.png" alt="Logo" style={logoTopStyle} /> 
            <h2>LOG IN TO YOUR ACCOUNT</h2>

            <form onSubmit={handleSubmit} style={formStyle}>
                <input 
                    type="email" 
                    placeholder="Email Address" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input 
                    type="password" 
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn-primary">LOG IN</button>
            </form>

            {error && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}

            <Link to="/forgot-password" style={linkStyle}>Forgot your password?</Link>
            <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                Don't have an account? <Link to="/register" style={linkStyle}>Sign up</Link>
            </p>
        </div>
    );
};

export default LoginPage;