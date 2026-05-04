import React, { useState, useRef } from 'react';
import { useStore } from '../store/useStore';
import { FORMATIONS } from '../config/constants';
import { ArrowLeft, ChevronLeft, ChevronRight, FileText, CheckCircle, XCircle } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { generatePDF } from '../utils/pdfGenerator';
import './Evaluation.css';

export default function Evaluation({ onNavigate }) {
  const {
    currentSession,
    activeStagiaireIndex,
    setActiveStagiaireIndex,
    updateStagiaireEvaluation,
    updateStagiaireSignature,
    updateSession
  } = useStore();

  const [signatureMode, setSignatureMode] = useState(false);
  const signaturePad = useRef(null);

  if (!currentSession) {
    onNavigate('home');
    return null;
  }

  const formation = FORMATIONS[currentSession.formation];
  const stagiaire = currentSession.stagiaires[activeStagiaireIndex];
  
  // Pour ECHAF et HABELEC, récupérer la section selon le profil
  let sections = [];
  if (formation.sections) {
    // TH-01
    sections = formation.sections;
  } else if (formation.profils && currentSession.profil) {
    // ECHAF-01 ou HABELEC-01
    const profilData = formation.sections[currentSession.profil];
    if (profilData) {
      sections = [{
        id: profilData.id,
        nom: profilData.nom || currentSession.profil,
        criteres: profilData.criteres
      }];
    }
  }

  const handleCritereClick = (critereId, bareme, penalite) => {
    const currentScore = stagiaire.evaluations[critereId] || bareme;
    let newScore = currentScore + penalite;
    
    // Ne pas descendre en dessous de 0
    if (newScore < 0) newScore = 0;
    
    updateStagiaireEvaluation(stagiaire.id, critereId, newScore);
  };

  const handleResetCritere = (critereId, bareme) => {
    updateStagiaireEvaluation(stagiaire.id, critereId, bareme);
  };

  const calculerScore = () => {
    let total = 0;
    sections.forEach(section => {
      section.criteres.forEach(critere => {
        const score = stagiaire.evaluations[critere.id];
        if (score !== undefined) {
          total += score;
        } else {
          total += critere.bareme; // Score max par défaut
        }
      });
    });
    return total;
  };

  const calculerTotal = () => {
    if (formation.code === 'TH-01') {
      return formation.total;
    } else if (currentSession.profil && formation.sections[currentSession.profil]) {
      return formation.sections[currentSession.profil].total;
    }
    return 0;
  };

  const verifierAdmission = () => {
    const score = calculerScore();
    const total = calculerTotal();
    
    if (formation.code === 'TH-01') {
      // TH-01: 35/50 minimum + moyenne dans chaque thème
      if (score < formation.seuil) return false;
      
      // Vérifier moyenne par thème
      const scoreVerification = stagiaire.evaluations['epi'] !== undefined 
        ? stagiaire.evaluations['epi'] 
        : 5;
      const maxVerification = 5;
      
      if (scoreVerification < maxVerification / 2) return false;
      
      // Score pratique
      const scorePratique = score - scoreVerification;
      const maxPratique = 45;
      
      if (scorePratique < maxPratique / 2) return false;
      
      return true;
    } else {
      // ECHAF et HABELEC: au moins la moyenne
      return score >= total / 2;
    }
  };

  const handleSauvegarderSignature = () => {
    if (signaturePad.current.isEmpty()) {
      alert('Veuillez signer avant de sauvegarder');
      return;
    }

    const signatureData = signaturePad.current.toDataURL();
    const score = calculerScore();
    const admis = verifierAdmission();

    updateStagiaireSignature(stagiaire.id, signatureData);
    
    // Mettre à jour le score et l'admission
    const updatedStagiaire = {
      ...stagiaire,
      scoreTotal: score,
      admis: admis,
      signature: signatureData,
      dateEvaluation: new Date().toISOString()
    };

    setSignatureMode(false);
    alert(`Évaluation enregistrée : ${score}/${calculerTotal()} - ${admis ? 'ADMIS' : 'REFUSÉ'}`);
  };

  const handleGenererPDF = async () => {
    try {
      await generatePDF(stagiaire, formation, currentSession);
      alert('PDF généré avec succès !');
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const handleStagiaireSuivant = () => {
    if (activeStagiaireIndex < currentSession.stagiaires.length - 1) {
      setActiveStagiaireIndex(activeStagiaireIndex + 1);
    }
  };

  const handleStagiairePrecedent = () => {
    if (activeStagiaireIndex > 0) {
      setActiveStagiaireIndex(activeStagiaireIndex - 1);
    }
  };

  const handleTerminerSession = () => {
    if (window.confirm('Voulez-vous terminer cette session ?')) {
      updateSession(currentSession.id, { statut: 'terminee' });
      onNavigate('home');
    }
  };

  const scoreActuel = calculerScore();
  const scoreTotal = calculerTotal();
  const pourcentage = ((scoreActuel / scoreTotal) * 100).toFixed(1);
  const seuil = formation.seuil || scoreTotal / 2;
  const estAdmis = verifierAdmission();

  return (
    <div className="evaluation-container">
      <div className="eval-header">
        <button className="back-btn" onClick={handleTerminerSession}>
          <ArrowLeft size={20} />
          Terminer
        </button>
        <div className="eval-title">
          <h1>{formation.nom}</h1>
          <p className="eval-code">{formation.code} {currentSession.profil && `- ${currentSession.profil}`}</p>
        </div>
      </div>

      {/* Navigation stagiaires */}
      <div className="stagiaire-nav">
        <button 
          className="nav-btn"
          onClick={handleStagiairePrecedent}
          disabled={activeStagiaireIndex === 0}
        >
          <ChevronLeft size={24} />
        </button>
        
        <div className="stagiaire-info-card">
          <div className="stagiaire-numero-badge">
            {activeStagiaireIndex + 1}/{currentSession.stagiaires.length}
          </div>
          <h2>{stagiaire.nom} {stagiaire.prenom}</h2>
          <div className={`score-display ${estAdmis ? 'admis' : 'refuse'}`}>
            <span className="score-value">{scoreActuel}/{scoreTotal}</span>
            <span className="score-percentage">({pourcentage}%)</span>
            {stagiaire.dateEvaluation && (
              <span className="score-badge">
                {estAdmis ? <CheckCircle size={20} /> : <XCircle size={20} />}
                {estAdmis ? 'ADMIS' : 'REFUSÉ'}
              </span>
            )}
          </div>
          <div className="score-seuil">
            Seuil d'admission : {seuil}/{scoreTotal}
          </div>
        </div>

        <button 
          className="nav-btn"
          onClick={handleStagiaireSuivant}
          disabled={activeStagiaireIndex === currentSession.stagiaires.length - 1}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Grilles d'évaluation */}
      <div className="grilles-container">
        {sections.map((section) => (
          <div key={section.id} className="section-card">
            <h3 className="section-title">{section.nom}</h3>
            {section.detail && <p className="section-detail">{section.detail}</p>}
            
            <div className="criteres-list">
              {section.criteres.map((critere) => {
                const scoreActuel = stagiaire.evaluations[critere.id] !== undefined
                  ? stagiaire.evaluations[critere.id]
                  : critere.bareme;
                const nbClics = Math.floor((critere.bareme - scoreActuel) / Math.abs(critere.penalite));

                return (
                  <div key={critere.id} className="critere-item">
                    <div className="critere-header">
                      <div className="critere-libelle">
                        <p className="critere-text">{critere.libelle}</p>
                        {critere.detail && (
                          <p className="critere-detail">{critere.detail}</p>
                        )}
                      </div>
                      <div className="critere-score">
                        <span className={`score ${scoreActuel < critere.bareme ? 'penalized' : ''}`}>
                          {scoreActuel}/{critere.bareme}
                        </span>
                      </div>
                    </div>
                    
                    <div className="critere-actions">
                      <button
                        className="btn-penalite"
                        onClick={() => handleCritereClick(critere.id, critere.bareme, critere.penalite)}
                        disabled={scoreActuel === 0}
                      >
                        {critere.penalite} pt
                      </button>
                      <div className="clics-indicator">
                        {nbClics > 0 && `${nbClics} oubli${nbClics > 1 ? 's' : ''}`}
                      </div>
                      <button
                        className="btn-reset"
                        onClick={() => handleResetCritere(critere.id, critere.bareme)}
                        disabled={scoreActuel === critere.bareme}
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="eval-actions">
        {!signatureMode ? (
          <>
            <button className="btn-action secondary" onClick={() => setSignatureMode(true)}>
              Signature formateur
            </button>
            {stagiaire.signature && (
              <button className="btn-action primary" onClick={handleGenererPDF}>
                <FileText size={20} />
                Générer PDF
              </button>
            )}
          </>
        ) : (
          <div className="signature-section">
            <h3>Signature formateur</h3>
            <div className="signature-canvas-wrapper">
              <SignatureCanvas
                ref={signaturePad}
                canvasProps={{
                  className: 'signature-canvas'
                }}
              />
            </div>
            <div className="signature-actions">
              <button 
                className="btn-action secondary"
                onClick={() => signaturePad.current.clear()}
              >
                Effacer
              </button>
              <button 
                className="btn-action secondary"
                onClick={() => setSignatureMode(false)}
              >
                Annuler
              </button>
              <button 
                className="btn-action primary"
                onClick={handleSauvegarderSignature}
              >
                Sauvegarder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
