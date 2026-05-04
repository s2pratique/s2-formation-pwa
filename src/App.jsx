import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useStore } from './store/useStore';
import { GOOGLE_CLIENT_ID } from './config/constants';
import Login from './components/Login';
import Home from './components/Home';
import NouvelleSession from './components/NouvelleSession';
import Evaluation from './components/Evaluation';
import './App.css';

function App() {
  const user = useStore((state) => state.user);
  const [currentView, setCurrentView] = useState('home');

  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  // Si pas connecté, afficher Login
  if (!user) {
    return (
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Login />
      </GoogleOAuthProvider>
    );
  }

  // Routing simple
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="app">
        {currentView === 'home' && <Home onNavigate={handleNavigate} />}
        {currentView === 'nouvelle-session' && <NouvelleSession onNavigate={handleNavigate} />}
        {currentView === 'evaluation' && <Evaluation onNavigate={handleNavigate} />}
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
