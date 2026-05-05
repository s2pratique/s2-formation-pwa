import React from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, Play, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import './Sessions.css';

export default function Sessions({ onNavigate }) {
  const { sessions, setCurrentSession, deleteSession, setActiveStagiaireIndex } = useStore();

  const handleReprendreSession = (session) => {
    setCurrentSession(session);
    setActiveStagiaireIndex(0);
    onNavigate('evaluation');
  };

  const handleSupprimerSession = (sessionId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette session ?')) {
      deleteSession(sessionId);
    }
  };

  const sessionsEnCours = sessions.filter(s => s.statut === 'en_cours');
  const sessionsTerminees = sessions.filter(s => s.statut === 'terminee');

  return (
    <div className="sessions-container">
      <div className="header-bar">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={20} />
          Retour
        </button>
        <h1>Mes sessions</h1>
      </div>

      <div className="sessions-content">
        {/* Sessions en cours */}
        {sessionsEnCours.length > 0 && (
          <div className="sessions-section">
            <h2>En cours ({sessionsEnCours.length})</h2>
            <div className="sessions-list">
              {sessionsEnCours.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <div className="session-info">
                      <h3>{session.formation} {session.profil && `- ${session.profil}`}</h3>
                      <p className="session-date">
                        {format(new Date(session.dateCreation), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                    <span className="session-badge en-cours">En cours</span>
                  </div>
                  
                  <div className="session-stagiaires">
                    <p>{session.stagiaires.length} stagiaire{session.stagiaires.length > 1 ? 's' : ''}</p>
                    <div className="stagiaires-preview">
                      {session.stagiaires.map((stag, idx) => (
                        <span key={stag.id} className="stagiaire-tag">
                          {stag.nom} {stag.prenom}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="session-actions">
                    <button 
                      className="btn-action primary"
                      onClick={() => handleReprendreSession(session)}
                    >
                      <Play size={18} />
                      Reprendre
                    </button>
                    <button 
                      className="btn-action danger"
                      onClick={() => handleSupprimerSession(session.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sessions terminées */}
        {sessionsTerminees.length > 0 && (
          <div className="sessions-section">
            <h2>Terminées ({sessionsTerminees.length})</h2>
            <div className="sessions-list">
              {sessionsTerminees.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <div className="session-info">
                      <h3>{session.formation} {session.profil && `- ${session.profil}`}</h3>
                      <p className="session-date">
                        {format(new Date(session.dateCreation), 'dd MMMM yyyy à HH:mm', { locale: fr })}
                      </p>
                    </div>
                    <span className="session-badge terminee">Terminée</span>
                  </div>
                  
                  <div className="session-stagiaires">
                    {session.stagiaires.map((stag) => (
                      <div key={stag.id} className="stagiaire-result">
                        <span>{stag.nom} {stag.prenom}</span>
                        {stag.admis !== null && (
                          <span className={`result-badge ${stag.admis ? 'admis' : 'refuse'}`}>
                            {stag.admis ? <CheckCircle size={16} /> : <XCircle size={16} />}
                            {stag.scoreTotal} pts - {stag.admis ? 'ADMIS' : 'REFUSÉ'}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="session-actions">
                    <button 
                      className="btn-action danger"
                      onClick={() => handleSupprimerSession(session.id)}
                    >
                      <Trash2 size={18} />
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Aucune session */}
        {sessions.length === 0 && (
          <div className="empty-state">
            <p>Aucune session enregistrée</p>
            <button 
              className="btn-action primary"
              onClick={() => onNavigate('nouvelle-session')}
            >
              Créer une session
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
