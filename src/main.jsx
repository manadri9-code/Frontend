import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom' // <-- IMPORTA ESTO
import { AuthProvider } from './context/AuthContext'
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- ENVUELVE TU APP */}
      <AuthProvider> {/* <-- ENVUELVE TU APP CON EL PROVEEDOR DE AUTENTICACIÓN */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)