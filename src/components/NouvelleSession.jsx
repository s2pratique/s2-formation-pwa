import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { createSession } from '../services/database';
import { v4 as uuidv4 } from 'uuid';

const FORMATION_TYPES = [
  { id: 'TH-01', name: 'Travail en Hauteur', hasProfiles: false },
  { id: 'ECHAF-01', name: 'Échafaudages', hasProfiles: true },
  { id: 'HABELEC-01', name: 'Habilitation Électrique', hasProfiles: true }
];

const HABELEC_PROFILES = [
  'B0/H0(V)/BF/HF',
  'BE/HE MANŒUVRE',
  'BS/BP',
  'B1/B2/H1/H2',
  'BR',
  'BC/HC',
  'BE/HE MESURE'
];

const NouvelleSession = () => {
  const navigate = useNavigate();
  
  const [formationType, setFormationType] = useState('');
  const [profile, setProfile] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState([]);
  const [trainees, setTrainees] = useState([{ id: uuidv4(), firstName: '', lastName: '' }]);

  const toggleProfile = (profileKey) => {
    setSelectedProfiles(prev => 
      prev.includes(profileKey) 
        ? prev.filter(p => p !== profileKey)
        : [...prev, profileKey]
    );
  };

  const addTrainee = () => {
    setTrainees([...trainees, { id: uuidv4(), firstName: '', lastName: '' }]);
  };

  const removeTrainee = (id) => {
    if (trainees.length > 1) {
      setTrainees(trainees.filter(t => t.id !== id));
    }
  };

  const updateTrainee = (id, field, value) => {
    setTrainees(trainees.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formationType) {
      alert('Sélectionnez un type de formation');
      return;
    }

    if (formationType === 'ECHAF-01' && selectedProfiles.length === 0) {
      alert('Sélectionnez au moins une évaluation');
      return;
    }

    if (formationType === 'HABELEC-01' && !profile) {
      alert('Sélectionnez un profil');
      return;
    }

    const validTrainees = trainees.filter(t => t.firstName && t.lastName);
    if (validTrainees.length === 0) {
      alert('Ajoutez au moins un stagiaire avec nom et prénom');
      return;
    }

    // Création de la session
    const session = {
      id: uuidv4(),
      formationType,
      profile: formationType === 'HABELEC-01' ? profile : undefined,
      profiles: formationType === 'ECHAF-01' ? selectedProfiles : undefined,
      trainees: validTrainees.map(t => ({
        id: t.id,
        firstName: t.firstName,
        lastName: t.lastName,
        scores: {},
        signature: null
      })),
      createdAt: new Date().toISOString(),
      completedAt: null
    };

    try {
      await createSession(session);
      navigate(`/session/${session.id}`);
    } catch (error) {
      console.error('Erreur création session:', error);
      alert('Erreur lors de la création de la session');
    }
  };

  const selectedFormation = FORMATION_TYPES.find(f => f.id === formationType);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Retour au tableau de bord
          </button>
          <h1 className="text-3xl font-bold text-gray-800">Nouvelle Session d'Évaluation</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type de formation */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <label className="block text-lg font-medium text-gray-700 mb-3">
              Type de Formation
            </label>
            <div className="space-y-2">
              {FORMATION_TYPES.map(formation => (
                <label
                  key={formation.id}
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition ${
                    formationType === formation.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="formationType"
                    value={formation.id}
                    checked={formationType === formation.id}
                    onChange={(e) => {
                      setFormationType(e.target.value);
                      setProfile('');
                      setSelectedProfiles([]);
                    }}
                    className="w-5 h-5 text-blue-600"
                  />
                  <span className="ml-3 text-lg font-medium">{formation.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Profils ECHAF-01 - Cases à cocher */}
          {formationType === 'ECHAF-01' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Sélectionnez les évaluations (une ou plusieurs) :
              </label>
              
              <div className="space-y-2">
                <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition ${
                  selectedProfiles.includes('montage') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <input
                    type="checkbox"
                    checked={selectedProfiles.includes('montage')}
                    onChange={() => toggleProfile('montage')}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-lg">Montage/Démontage</div>
                    <div className="text-sm text-gray-500">Évaluation sur 55 points</div>
                  </div>
                </label>

                <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition ${
                  selectedProfiles.includes('utilisation') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <input
                    type="checkbox"
                    checked={selectedProfiles.includes('utilisation')}
                    onChange={() => toggleProfile('utilisation')}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-lg">Utilisation</div>
                    <div className="text-sm text-gray-500">Évaluation sur 20 points</div>
                  </div>
                </label>

                <label className={`flex items-center space-x-3 p-4 border-2 rounded-lg hover:bg-gray-50 cursor-pointer transition ${
                  selectedProfiles.includes('reception') ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}>
                  <input
                    type="checkbox"
                    checked={selectedProfiles.includes('reception')}
                    onChange={() => toggleProfile('reception')}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-lg">Réception</div>
                    <div className="text-sm text-gray-500">Évaluation sur 30 points</div>
                  </div>
                </label>
              </div>

              {selectedProfiles.length > 0 && (
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  ✓ {selectedProfiles.length} évaluation{selectedProfiles.length > 1 ? 's' : ''} sélectionnée{selectedProfiles.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}

          {/* Profils HABELEC-01 - Liste déroulante */}
          {formationType === 'HABELEC-01' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Profil d'Habilitation
              </label>
              <select
                value={profile}
                onChange={(e) => setProfile(e.target.value)}
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200 text-lg"
              >
                <option value="">-- Sélectionnez un profil --</option>
                {HABELEC_PROFILES.map(prof => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>
            </div>
          )}

          {/* Liste des stagiaires */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <label className="text-lg font-medium text-gray-700">
                Stagiaires
              </label>
              <button
                type="button"
                onClick={addTrainee}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center gap-2 transition"
              >
                <Plus size={20} />
                Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {trainees.map((trainee, index) => (
                <div key={trainee.id} className="flex gap-3 items-center">
                  <span className="text-gray-500 font-medium w-8">{index + 1}.</span>
                  <input
                    type="text"
                    placeholder="Prénom"
                    value={trainee.firstName}
                    onChange={(e) => updateTrainee(trainee.id, 'firstName', e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                  <input
                    type="text"
                    placeholder="Nom"
                    value={trainee.lastName}
                    onChange={(e) => updateTrainee(trainee.id, 'lastName', e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring focus:ring-blue-200"
                  />
                  {trainees.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTrainee(trainee.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                    >
                      <X size={20} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 text-sm text-gray-500">
              💡 Ajoutez tous les stagiaires qui participeront à cette session
            </div>
          </div>

          {/* Bouton de validation */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
            >
              Démarrer la Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NouvelleSession;
