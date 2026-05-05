import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, TrendingUp, Users, CheckCircle, XCircle } from 'lucide-react';
import './Statistiques.css';

export default function Statistiques({ onNavigate }) {
  const { stats, updateStats, sessions } = useStore();

  useEffect(() => {
    updateStats();
  }, [updateStats]);

  const sessionsEnCours = sessions.filter(s => s.statut === 'en_cours').length;
  const sessionsTerminees = sessions.filter(s => s.statut === 'terminee').length;

  return (
    <div className="stats-container">
      <div className="header-bar">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={20} />
          Retour
        </button>
        <h1>Statistiques</h1>
      </div>

      <div className="stats-content">
        {/* Résumé global */}
        <div className="stats-grid">
          <div className="stat-card-large">
            <div className="stat-icon">
              <Users size={32} />
            </div>
            <div className="stat-details">
              <h3>Total évaluations</h3>
              <p className="stat-number">{stats.totalEvaluations}</p>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon success">
              <TrendingUp size={32} />
            </div>
            <div className="stat-details">
              <h3>Taux de réussite</h3>
              <p className="stat-number">{stats.tauxReussite.toFixed(1)}%</p>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon warning">
              <CheckCircle size={32} />
            </div>
            <div className="stat-details">
              <h3>Sessions en cours</h3>
              <p className="stat-number">{sessionsEnCours}</p>
            </div>
          </div>

          <div className="stat-card-large">
            <div className="stat-icon">
              <XCircle size={32} />
            </div>
            <div className="stat-details">
              <h3>Sessions terminées</h3>
              <p className="stat-number">{sessionsTerminees}</p>
            </div>
          </div>
        </div>

        {/* Stats par formation */}
        {Object.keys(stats.formationsStats).length > 0 && (
          <div className="formations-stats-section">
            <h2>Par formation</h2>
            <div className="formations-stats-grid">
              {Object.entries(stats.formationsStats).map(([formation, data]) => (
                <div key={formation} className="formation-stat-card">
                  <h3>{formation}</h3>
                  <div className="formation-numbers">
                    <div className="formation-stat">
                      <span className="label">Total</span>
                      <span className="value">{data.total}</span>
                    </div>
                    <div className="formation-stat success">
                      <span className="label">Réussis</span>
                      <span className="value">{data.reussis}</span>
                    </div>
                    <div className="formation-stat danger">
                      <span className="label">Échecs</span>
                      <span className="value">{data.echecs}</span>
                    </div>
                  </div>
                  <div className="formation-progress">
                    <div 
                      className="formation-progress-bar"
                      style={{ 
                        width: `${data.total > 0 ? (data.reussis / data.total) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <p className="formation-percentage">
                    {data.total > 0 ? ((data.reussis / data.total) * 100).toFixed(1) : 0}% de réussite
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* État vide */}
        {stats.totalEvaluations === 0 && (
          <div className="empty-stats">
            <p>Aucune statistique disponible</p>
            <p className="empty-subtitle">Complétez des évaluations pour voir vos statistiques</p>
          </div>
        )}
      </div>
    </div>
  );
}
