import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, CheckCircle, FileText, TrendingUp, LogOut } from 'lucide-react';
import { getAllSessions, updateSession } from '../services/database';
import { signOut } from '../services/auth';
import { useAuthStore } from '../store/authStore';

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [sessions, setSessions] = useState([]);
  const [stats, setStats] = useState({
    inProgress: 0,
    completed: 0,
    totalEvaluations: 0,
    successRate: 0
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const data = await getAllSessions();
      setSessions(data);
      calculateStats(data);
    } catch (error) {
      console.error('Erreur chargement sessions:', error);
    }
  };

  const calculateStats = (sessionsData) => {
    const inProgress = sessionsData.filter(s => !s.completedAt).length;
    const completed = sessionsData.filter(s => s.completedAt).length;
    
    let totalEvaluations = 0;
    let totalSuccess = 0;

    sessionsData.forEach(session => {
      if (session.trainees) {
        totalEvaluations += session.trainees.length;
        // Ici on pourrait calculer le taux de réussite si on avait les résultats
      }
    });

    setStats({
      inProgress,
      completed,
      totalEvaluations,
      successRate: totalEvaluations > 0 ? Math.round((totalSuccess / totalEvaluations) * 100) : 0
    });
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleReopenSession = async (session) => {
    try {
      const updatedSession = {
        ...session,
        completedAt: null
      };
      await updateSession(session.id, updatedSession);
      await loadSessions();
      navigate(`/session/${session.id}`);
    } catch (error) {
      console.error('Erreur réouverture session:', error);
      alert('Erreur lors de la réouverture de la session');
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getProfileDisplay = (session) => {
    if (session.formationType === 'ECHAF-01' && session.profiles) {
      const profileNames = {
        montage: 'Montage/Démontage',
        utilisation: 'Utilisation',
        reception: 'Réception'
      };
      return session.profiles.map(p => profileNames[p] || p).join(', ');
    }
    return session.profile || '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">S2 Formation PWA</h1>
              <p className="text-blue-100 mt-1">Évaluation Pratique CACES</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-sm opacity-90">Formateur</div>
                <div className="font-medium">{user?.displayName || user?.email}</div>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 hover:bg-blue-700 rounded-lg transition"
                title="Déconnexion"
              >
                <LogOut size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-3xl font-bold text-blue-600">{stats.inProgress}</p>
              </div>
              <Clock className="text-blue-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminées</p>
                <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
              </div>
              <CheckCircle className="text-green-600" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Évaluations</p>
                <p className="text-3xl font-bold text-gray-800">{stats.totalEvaluations}</p>
              </div>
              <FileText className="text-gray-800" size={40} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux réussite</p>
                <p className="text-3xl font-bold text-purple-600">{stats.successRate}%</p>
              </div>
              <TrendingUp className="text-purple-600" size={40} />
            </div>
          </div>
        </div>

        {/* Bouton nouvelle session */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Mes Sessions</h2>
          <button
            onClick={() => navigate('/new-session')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 shadow-md transition"
          >
            <Plus size={20} />
            Nouvelle Session
          </button>
        </div>

        {/* Liste des sessions */}
        <div className="space-y-4">
          {sessions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-12 text-center">
              <FileText className="mx-auto text-gray-300 mb-4" size={64} />
              <p className="text-gray-500 text-lg mb-4">Aucune session créée</p>
              <button
                onClick={() => navigate('/new-session')}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus size={20} />
                Créer ma première session
              </button>
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                className="bg-white rounded-lg shadow hover:shadow-md transition p-6"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {session.formationType}
                      </h3>
                      {session.completedAt ? (
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                          ✓ Terminée
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          En cours
                        </span>
                      )}
                    </div>

                    {getProfileDisplay(session) && (
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Profil :</span> {getProfileDisplay(session)}
                      </p>
                    )}

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>
                        <span className="font-medium">{session.trainees?.length || 0}</span> stagiaire{session.trainees?.length > 1 ? 's' : ''}
                      </span>
                      <span>Créée le {formatDate(session.createdAt)}</span>
                      {session.completedAt && (
                        <span>Terminée le {formatDate(session.completedAt)}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {session.completedAt ? (
                      <>
                        <button
                          onClick={() => handleReopenSession(session)}
                          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
                        >
                          🔓 Rouvrir
                        </button>
                        <button
                          onClick={() => navigate(`/session/${session.id}`)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                        >
                          Consulter
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => navigate(`/session/${session.id}`)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                      >
                        Continuer →
                      </button>
                    )}
                  </div>
                </div>

                {/* Liste des stagiaires */}
                {session.trainees && session.trainees.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600 mb-2">Stagiaires :</p>
                    <div className="flex flex-wrap gap-2">
                      {session.trainees.map((trainee, index) => (
                        <span
                          key={trainee.id}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {trainee.firstName} {trainee.lastName}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
