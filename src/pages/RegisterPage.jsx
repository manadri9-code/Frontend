import React, { useState } from 'react';
// CORRECCIÓN 1: Añadir verifyEmail
import { registerUser, verifyEmail } from '../api/auth';
// CORRECCIÓN 2: Añadir useNavigate
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [step, setStep] = useState(1); // 1 = Registro, 2 = Verificación
    const [showPassword, setShowPassword] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        apellido: '',
        correo_electronico: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // CORRECCIÓN 2: Instanciar useNavigate
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const data = await registerUser(formData);
            setSuccess(data.message); // "Registro exitoso. Te hemos enviado un código..."
            setStep(2); // <-- Cambiamos al paso de verificación

        } catch (err) {
            if (err.errors) {
                const errorMsg = err.errors.map(e => e.msg).join(', ');
                setError(errorMsg);
            } else {
                setError(err.message || 'Error al registrarse');
            }
        }
    };

    // Esta función ahora encontrará `verifyEmail` y `Maps`
    const handleVerifySubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const data = await verifyEmail(formData.correo_electronico, verificationCode);
            setSuccess(data.message + " Redirigiendo al login...");

            // Esperar 2 segundos y redirigir al login
            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (err) {
            setError(err.message || 'Error al verificar el código');
        }
    };
    
    // ... (Todos tus estilos están bien, no los pego para abreviar) ...
    const formContainerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 120px)',
        padding: '2rem',
        textAlign: 'center',
    };

    const formStyle = {
        width: '100%',
        maxWidth: '350px',
        padding: '2rem',
    };

    const linkStyle = {
        color: '#000000',
        textDecoration: 'none',
        marginTop: '0.5rem',
        display: 'block',
        fontSize: '0.9rem',
    };
    const logoTopStyle = {
        height: '150px', // Tamaño del logo en el formulario
        marginBottom: '2rem', // Espacio debajo del logo
    };
    const passwordContainerStyle = {
        position: 'relative',
        width: '100%',
    };

    const passwordToggleStyle = {
        position: 'absolute',
        right: '10px',
        top: '13px', // Ajustar verticalmente
        cursor: 'pointer',
        fontSize: '0.9rem',
        color: '#555',
        userSelect: 'none', // Evita que el texto se seleccione
    };

    return (
        <div style={formContainerStyle}>

            {/* === PASO 1: FORMULARIO DE REGISTRO === */}
            {step === 1 && (
                <>
                    <img src="/logo.png" alt="Logo" style={logoTopStyle} />
                    <h2>CREATE YOUR ACCOUNT</h2>
                    <form onSubmit={handleRegisterSubmit} style={formStyle}>
                        <input type="text" name="nombre" placeholder="First Name" value={formData.nombre} onChange={handleChange} required />
                        <input type="text" name="apellido" placeholder="Last Name" value={formData.apellido} onChange={handleChange} required />
                        <input type="email" name="correo_electronico" placeholder="Email Address" value={formData.correo_electronico} onChange={handleChange} required />

                        {/* --- CAMPO DE CONTRASEÑA MODIFICADO --- */}
                        <div style={passwordContainerStyle}>
                            <input
                                type={showPassword ? 'text' : 'password'} // Tipo dinámico
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                style={passwordToggleStyle}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? 'Ocultar' : 'Mostrar'}
                            </span>
                        </div>
                        {/* --- FIN CAMPO DE CONTRASEÑA --- */}

                        <button type="submit" className="btn-primary">SIGN UP</button>
                    </form>

                    {error && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}

                    <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                        Already have an account? <Link to="/login" style={linkStyle}>Log in</Link>
                    </p>
                </>
            )}

            {/* === PASO 2: FORMULARIO DE VERIFICACIÓN === */}
            {step === 2 && (
                <>
                    <h2>VERIFICA TU CORREO</h2>
                    <p style={{ fontSize: '0.9rem', color: 'green', marginBottom: '1rem' }}>{success}</p>

                    <form onSubmit={handleVerifySubmit} style={formStyle}>
                        <input
                            type="text"
                            name="verificationCode"
                            placeholder="Código de 6 dígitos"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            maxLength="6"
                            required
                        />
                        <button type="submit" className="btn-primary">VERIFICAR CÓDIGO</button>
                    </form>

                    {error && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}
                </>
            )}
        </div>
    );
};

export default RegisterPage;