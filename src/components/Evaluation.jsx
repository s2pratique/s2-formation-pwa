import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { getSession, updateSession } from '../services/database';
import { getGridByType } from '../data/grids';
import SignatureCanvas from './SignatureCanvas';
import { generatePDF } from '../utils/pdfGenerator';

const Evaluation = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  const [session, setSession] = useState(null);
  const [currentTraineeIndex, setCurrentTraineeIndex] = useState(0);
  const [scores, setScores] = useState({});
  const [signature, setSignature] = useState(null);
  const [showSignature, setShowSignature] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSession();
  }, [sessionId]);

  const loadSession = async () => {
    try {
      const data = await getSession(sessionId);
      if (data) {
        setSession(data);
        // Charger les scores existants
        if (data.trainees[currentTraineeIndex]?.scores) {
          setScores(data.trainees[currentTraineeIndex].scores);
        }
        if (data.trainees[currentTraineeIndex]?.signature) {
          setSignature(data.trainees[currentTraineeIndex].signature);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur chargement session:', error);
      setLoading(false);
    }
  };

  const handlePenalty = (criterionId, points) => {
    setScores(prev => {
      const current = prev[criterionId] || 0;
      const newScore = current + points;
      return {
        ...prev,
        [criterionId]: newScore
      };
    });
  };

  const handleReset = (criterionId) => {
    setScores(prev => {
      const newScores = { ...prev };
      delete newScores[criterionId];
      return newScores;
    });
  };

  const saveCurrentTrainee = async () => {
    if (!session) return;

    const updatedTrainees = [...session.trainees];
    updatedTrainees[currentTraineeIndex] = {
      ...updatedTrainees[currentTraineeIndex],
      scores,
      signature,
      lastUpdated: new Date().toISOString()
    };

    const updatedSession = {
      ...session,
      trainees: updatedTrainees
    };

    await updateSession(sessionId, updatedSession);
    setSession(updatedSession);
  };

  const handlePreviousTrainee = async () => {
    await saveCurrentTrainee();
    const newIndex = currentTraineeIndex - 1;
    setCurrentTraineeIndex(newIndex);
    setScores(session.trainees[newIndex]?.scores || {});
    setSignature(session.trainees[newIndex]?.signature || null);
  };

  const handleNextTrainee = async () => {
    await saveCurrentTrainee();
    const newIndex = currentTraineeIndex + 1;
    setCurrentTraineeIndex(newIndex);
    setScores(session.trainees[newIndex]?.scores || {});
    setSignature(session.trainees[newIndex]?.signature || null);
  };

  const handleSignatureSave = async (signatureData) => {
    setSignature(signatureData);
    setShowSignature(false);
    await saveCurrentTrainee();
  };

  const handleGeneratePDF = async () => {
    await saveCurrentTrainee();
    const currentTrainee = session.trainees[currentTraineeIndex];
    
    try {
      await generatePDF({
        session,
        trainee: currentTrainee,
        scores,
        signature,
        grid: getGridByType(session.formationType, session.profile)
      });
    } catch (error) {
      console.error('Erreur génération PDF:', error);
      alert('Erreur lors de la génération du PDF');
    }
  };

  const calculateScore = () => {
    const grid = getGridByType(session.formationType, session.profile);
    if (!grid) return { total: 0, max: 0, percentage: 0 };

    let totalPenalty = 0;
    grid.sections.forEach(section => {
      section.criteria.forEach(criterion => {
        const penalty = scores[criterion.id] || 0;
        totalPenalty += penalty;
      });
    });

    const maxPoints = grid.maxPoints;
    const finalScore = Math.max(0, maxPoints + totalPenalty);
    const percentage = (finalScore / maxPoints) * 100;

    return {
      total: finalScore,
      max: maxPoints,
      percentage: Math.round(percentage)
    };
  };

  const isAdmis = () => {
    const grid = getGridByType(session.formationType, session.profile);
    if (!grid) return false;

    const { total, max } = calculateScore();
    const percentage = (total / max) * 100;

    // Vérification selon le seuil de la grille
    if (grid.threshold) {
      return percentage >= grid.threshold;
    }

    return percentage >= 70; // Seuil par défaut
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-red-600">Session introuvable</div>
      </div>
    );
  }

  const currentTrainee = session.trainees[currentTraineeIndex];
  const grid = getGridByType(session.formationType, session.profile);
  const score = calculateScore();
  const admis = isAdmis();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 sticky top-0 z-10 shadow-lg">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
            >
              ← Revenir (sans clôturer)
            </button>
            <div className="text-center">
              <div className="text-2xl font-bold">{session.formationType}</div>
              {session.profile && (
                <div className="text-sm opacity-90">{session.profile}</div>
              )}
            </div>
            <div className="w-32"></div>
          </div>

          {/* Navigation stagiaires */}
          <div className="flex items-center justify-between bg-blue-700 rounded-lg p-3">
            <button
              onClick={handlePreviousTrainee}
              disabled={currentTraineeIndex === 0}
              className="p-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft size={24} />
            </button>

            <div className="text-center">
              <div className="text-lg font-bold">
                {currentTrainee.firstName} {currentTrainee.lastName}
              </div>
              <div className="text-sm opacity-75">
                Stagiaire {currentTraineeIndex + 1} / {session.trainees.length}
              </div>
            </div>

            <button
              onClick={handleNextTrainee}
              disabled={currentTraineeIndex === session.trainees.length - 1}
              className="p-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Score */}
          <div className="mt-4 bg-white text-gray-800 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-gray-600">Score</div>
                <div className="text-3xl font-bold">
                  {score.total} / {score.max}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-gray-600">Réussite</div>
                <div className="text-3xl font-bold">{score.percentage}%</div>
              </div>
              <div>
                <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
                  admis ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {admis ? '✓ ADMIS' : '✗ REFUSÉ'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grille d'évaluation */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {grid.sections.map(section => (
          <div key={section.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-blue-100 px-4 py-3 border-b border-blue-200">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800">{section.title}</h3>
                <span className="text-sm text-gray-600">/{section.maxPoints} pts</span>
              </div>
            </div>

            <div className="divide-y">
              {section.criteria.map(criterion => {
                const currentPenalty = scores[criterion.id] || 0;
                const timesClicked = Math.abs(Math.floor(currentPenalty / criterion.penalty));

                return (
                  <div key={criterion.id} className="p-4 hover:bg-gray-50 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="font-medium text-gray-800">{criterion.description}</div>
                        {timesClicked > 0 && (
                          <div className="text-sm text-red-600 mt-1">
                            {timesClicked} oubli{timesClicked > 1 ? 's' : ''} ({currentPenalty} pts)
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => handlePenalty(criterion.id, -criterion.penalty)}
                          className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition font-medium"
                          title="Retirer des points"
                        >
                          -{criterion.penalty} pts
                        </button>
                        <button
                          onClick={() => handlePenalty(criterion.id, criterion.penalty)}
                          className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 transition font-medium"
                          title="Rajouter des points"
                        >
                          +{criterion.penalty} pts
                        </button>
                        {currentPenalty !== 0 && (
                          <button
                            onClick={() => handleReset(criterion.id)}
                            className="px-3 py-1 bg-gray-400 text-white rounded text-sm hover:bg-gray-500 transition"
                            title="Réinitialiser"
                          >
                            Reset
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {/* Signature et PDF */}
        <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Finalisation</h3>

          {!signature ? (
            <button
              onClick={() => setShowSignature(true)}
              className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
            >
              📝 Signer l'évaluation
            </button>
          ) : (
            <div className="space-y-2">
              <div className="text-sm text-green-600 font-medium">✓ Signature enregistrée</div>
              <img src={signature} alt="Signature" className="border rounded h-20" />
              <button
                onClick={() => setShowSignature(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Modifier la signature
              </button>
            </div>
          )}

          {signature && (
            <button
              onClick={handleGeneratePDF}
              className="w-full px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2"
            >
              <Download size={20} />
              Générer le PDF
            </button>
          )}
        </div>
      </div>

      {/* Modal Signature */}
      {showSignature && (
        <SignatureCanvas
          onSave={handleSignatureSave}
          onClose={() => setShowSignature(false)}
        />
      )}
    </div>
  );
};

export default Evaluation;
