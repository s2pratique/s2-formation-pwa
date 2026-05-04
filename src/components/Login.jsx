import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { useStore } from '../store/useStore';
import './Login.css';

export default function Login() {
  const setUser = useStore((state) => state.setUser);

  const handleLoginSuccess = (credentialResponse) => {
    const decoded = jwtDecode(credentialResponse.credential);
    setUser({
      email: decoded.email,
      name: decoded.name,
      picture: decoded.picture
    });
  };

  const handleLoginError = () => {
    alert('Erreur de connexion. Veuillez réessayer.');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo-container">
          <img src="/logo-s2.png" alt="S2 Formation" className="logo" />
        </div>
        <h1>S2 Formation</h1>
        <h2>Évaluation Pratique</h2>
        <p className="subtitle">Connexion formateurs</p>
        
        <div className="login-button-wrapper">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginError}
            theme="filled_blue"
            size="large"
            text="signin_with"
            shape="rectangular"
          />
        </div>

        <div className="features">
          <div className="feature">
            <span className="icon">📋</span>
            <span>Grilles d'évaluation</span>
          </div>
          <div className="feature">
            <span className="icon">👥</span>
            <span>Mode session</span>
          </div>
          <div className="feature">
            <span className="icon">📄</span>
            <span>Génération PDF</span>
          </div>
          <div className="feature">
            <span className="icon">📊</span>
            <span>Statistiques</span>
          </div>
        </div>
      </div>
    </div>
  );
}
