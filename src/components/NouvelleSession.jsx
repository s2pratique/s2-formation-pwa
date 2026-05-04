import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { FORMATIONS } from '../config/constants';
import { ArrowLeft, Plus, Trash2, Play } from 'lucide-react';
import './NouvelleSession.css';

export default function NouvelleSession({ onNavigate }) {
  const { user, setCurrentSession, addSession } = useStore();
  const [formationSelectionnee, setFormationSelectionnee] = useState('');
  const [profilSelectionne, setProfilSelectionne] = useState('');
  const [stagiaires, setStagiaires] = useState([]);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');

  const handleAjouterStagiaire = (e) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim()) {
      alert('Veuillez saisir le nom et prénom');
      return;
    }

    const newStagiaire = {
      id: `stagiaire_${Date.now()}_${Math.random()}`,
      nom: nom.trim().toUpperCase(),
      prenom: prenom.trim(),
      evaluations: {},
      scoreTotal: 0,
      admis: null,
      dateEvaluation: null,
      signature: null
    };

    setStagiaires([...stagiaires, newStagiaire]);
    setNom('');
    setPrenom('');
  };

  const handleSupprimerStagiaire = (id) => {
    setStagiaires(stagiaires.filter(s => s.id !== id));
  };

  const handleDemarrerSession = () => {
    if (!formationSelectionnee) {
      alert('Veuillez sélectionner une formation');
      return;
    }

    if (formationSelectionnee === 'ECHAF-01' && !profilSelectionne) {
      alert('Veuillez sélectionner un profil pour la formation Échafaudages');
      return;
    }

    if (formationSelectionnee === 'HABELEC-01' && !profilSelectionne) {
      alert('Veuillez sélectionner un profil pour l\'Habilitation Électrique');
      return;
    }

    if (stagiaires.length === 0) {
      alert('Veuillez ajouter au moins un stagiaire');
      return;
    }

    const nouvelleSession = {
      id: `session_${Date.now()}`,
      formateurId: user.email,
      formateurNom: user.name,
      formation: formationSelectionnee,
      profil: profilSelectionne || null,
      dateCreation: new Date().toISOString(),
      stagiaires: stagiaires,
      statut: 'en_cours'
    };

    addSession(nouvelleSession);
    setCurrentSession(nouvelleSession);
    onNavigate('evaluation');
  };

  const formation = formationSelectionnee ? FORMATIONS[formationSelectionnee] : null;

  return (
    <div className="nouvelle-session-container">
      <div className="header-bar">
        <button className="back-btn" onClick={() => onNavigate('home')}>
          <ArrowLeft size={20} />
          Retour
        </button>
        <h1>Nouvelle session</h1>
      </div>

      <div className="session-form">
        {/* Sélection formation */}
        <div className="form-section">
          <h2>1. Formation</h2>
          <div className="formation-grid">
            {Object.values(FORMATIONS).map((form) => (
              <button
                key={form.code}
                className={`formation-card ${formationSelectionnee === form.code ? 'selected' : ''}`}
                onClick={() => {
                  setFormationSelectionnee(form.code);
                  setProfilSelectionne('');
                }}
              >
                <div className="formation-code">{form.code}</div>
                <div className="formation-nom">{form.nom}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Sélection profil (si applicable) */}
        {formation && formation.profils && (
          <div className="form-section">
            <h2>2. Profil</h2>
            <div className="profil-select">
              <select 
                value={profilSelectionne} 
                onChange={(e) => setProfilSelectionne(e.target.value)}
                className="select-input"
              >
                <option value="">-- Sélectionnez un profil --</option>
                {formation.profils.map((profil) => (
                  <option key={profil} value={profil}>
                    {profil}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Liste stagiaires */}
        <div className="form-section">
          <h2>{formation && formation.profils ? '3' : '2'}. Stagiaires ({stagiaires.length})</h2>
          
          <form onSubmit={handleAjouterStagiaire} className="add-stagiaire-form">
            <input
              type="text"
              placeholder="NOM"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              className="input-field"
            />
            <input
              type="text"
              placeholder="Prénom"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              className="input-field"
            />
            <button type="submit" className="btn-add">
              <Plus size={20} />
              Ajouter
            </button>
          </form>

          {stagiaires.length > 0 && (
            <div className="stagiaires-list">
              {stagiaires.map((stag, index) => (
                <div key={stag.id} className="stagiaire-item">
                  <div className="stagiaire-info">
                    <span className="stagiaire-numero">{index + 1}</span>
                    <span className="stagiaire-nom">{stag.nom} {stag.prenom}</span>
                  </div>
                  <button
                    className="btn-delete"
                    onClick={() => handleSupprimerStagiaire(stag.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bouton démarrer */}
        <div className="form-actions">
          <button
            className="btn-start"
            onClick={handleDemarrerSession}
            disabled={!formationSelectionnee || stagiaires.length === 0}
          >
            <Play size={20} />
            Démarrer la session
          </button>
        </div>
      </div>
    </div>
  );
}
