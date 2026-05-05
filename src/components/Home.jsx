import React from 'react';
import { useStore } from '../store/useStore';
import { Plus, List, BarChart3, LogOut } from 'lucide-react';
import './Home.css';

export default function Home({ onNavigate }) {
  const { user, logout, sessions, stats } = useStore();

  const handleLogout = () => {
    if (window.confirm('Voulez-vous vraiment vous déconnecter ?')) {
      logout();
    }
  };

  const sessionsEnCours = sessions.filter(s => s.statut === 'en_cours').length;
  const sessionsTerminees = sessions.filter(s => s.statut === 'terminee').length;

  return (
    <div className="home-container">
      <div className="header">
        <div className="header-logo">
          <img src="/s2-formation-pwa/logo-s2.png" alt="S2 Formation" className="logo-small" />
          <h1>S2 Formation</h1>
        </div>
        <div className="user-info">
          <img src={user.picture} alt={user.name} className="avatar" />
          <div className="user-details">
            <p className="user-name">{user.name}</p>
            <button onClick={handleLogout} className="logout-btn">
              <LogOut size={16} />
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="stats-summary">
        <div className="stat-card">
          <div className="stat-value">{sessionsEnCours}</div>
          <div className="stat-label">Sessions en cours</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{sessionsTerminees}</div>
          <div className="stat-label">Sessions terminées</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.totalEvaluations}</div>
          <div className="stat-label">Évaluations totales</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.tauxReussite.toFixed(0)}%</div>
          <div className="stat-label">Taux de réussite</div>
        </div>
      </div>

      <div className="actions-grid">
        <button 
          className="action-card primary" 
          onClick={() => onNavigate('nouvelle-session')}
        >
          <div className="action-icon">
            <Plus size={32} />
          </div>
          <h3>Nouvelle session</h3>
          <p>Créer une session d'évaluation</p>
        </button>

        <button 
          className="action-card" 
          onClick={() => onNavigate('sessions')}
          disabled={sessions.length === 0}
        >
          <div className="action-icon">
            <List size={32} />
          </div>
          <h3>Mes sessions</h3>
          <p>Reprendre ou consulter</p>
          {sessions.length === 0 && <span className="badge">Aucune session</span>}
        </button>

        <button 
          className="action-card" 
          onClick={() => onNavigate('statistiques')}
        >
          <div className="action-icon">
            <BarChart3 size={32} />
          </div>
          <h3>Statistiques</h3>
          <p>Dashboard et export Excel</p>
        </button>
      </div>

      <footer className="home-footer">
        <p>S2 Formation - Évaluation Pratique v1.0</p>
      </footer>
    </div>
  );
}
