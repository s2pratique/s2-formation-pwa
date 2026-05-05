import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null, currentSession: null }),

      // Session en cours
      currentSession: null,
      setCurrentSession: (session) => set({ currentSession: session }),

      // Sessions sauvegardées
      sessions: [],
      addSession: (session) => set((state) => ({
        sessions: [...state.sessions, session]
      })),
      updateSession: (sessionId, updates) => set((state) => ({
        sessions: state.sessions.map(s =>
          s.id === sessionId ? { ...s, ...updates } : s
        ),
        currentSession: state.currentSession?.id === sessionId
          ? { ...state.currentSession, ...updates }
          : state.currentSession
      })),
      deleteSession: (sessionId) => set((state) => ({
        sessions: state.sessions.filter(s => s.id !== sessionId),
        currentSession: state.currentSession?.id === sessionId ? null : state.currentSession
      })),

      // Stagiaire actif dans la session
      activeStagiaireIndex: 0,
      setActiveStagiaireIndex: (index) => set({ activeStagiaireIndex: index }),

      // Ajout stagiaire à la session courante
      addStagiaire: (nom, prenom) => set((state) => {
        if (!state.currentSession) return state;
        
        const newStagiaire = {
          id: `stagiaire_${Date.now()}`,
          nom,
          prenom,
          evaluations: {},
          scoreTotal: 0,
          admis: null,
          dateEvaluation: null,
          signature: null
        };

        const updatedSession = {
          ...state.currentSession,
          stagiaires: [...state.currentSession.stagiaires, newStagiaire]
        };

        return {
          currentSession: updatedSession,
          sessions: state.sessions.map(s =>
            s.id === updatedSession.id ? updatedSession : s
          )
        };
      }),

      // Mise à jour évaluation stagiaire
      updateStagiaireEvaluation: (stagiaireId, critereId, score) => set((state) => {
        if (!state.currentSession) return state;

        const updatedStagiaires = state.currentSession.stagiaires.map(stag => {
          if (stag.id !== stagiaireId) return stag;

          const newEvaluations = {
            ...stag.evaluations,
            [critereId]: score
          };

          // Recalcul du score total
          const scoreTotal = Object.values(newEvaluations).reduce((sum, s) => sum + s, 0);

          return {
            ...stag,
            evaluations: newEvaluations,
            scoreTotal
          };
        });

        const updatedSession = {
          ...state.currentSession,
          stagiaires: updatedStagiaires
        };

        return {
          currentSession: updatedSession,
          sessions: state.sessions.map(s =>
            s.id === updatedSession.id ? updatedSession : s
          )
        };
      }),

      // Signature stagiaire
      updateStagiaireSignature: (stagiaireId, signatureData) => set((state) => {
        if (!state.currentSession) return state;

        const updatedStagiaires = state.currentSession.stagiaires.map(stag =>
          stag.id === stagiaireId
            ? { ...stag, signature: signatureData, dateEvaluation: new Date().toISOString() }
            : stag
        );

        const updatedSession = {
          ...state.currentSession,
          stagiaires: updatedStagiaires
        };

        return {
          currentSession: updatedSession,
          sessions: state.sessions.map(s =>
            s.id === updatedSession.id ? updatedSession : s
          )
        };
      }),

      // Statistiques
      stats: {
        totalEvaluations: 0,
        tauxReussite: 0,
        formationsStats: {}
      },
      updateStats: () => {
        const sessions = get().sessions;
        const completedSessions = sessions.filter(s => s.statut === 'terminee');
        
        let totalEvals = 0;
        let totalReussis = 0;
        const formationsStats = {};

        completedSessions.forEach(session => {
          session.stagiaires.forEach(stag => {
            if (stag.admis !== null) {
              totalEvals++;
              if (stag.admis) totalReussis++;

              if (!formationsStats[session.formation]) {
                formationsStats[session.formation] = {
                  total: 0,
                  reussis: 0,
                  echecs: 0
                };
              }
              formationsStats[session.formation].total++;
              if (stag.admis) {
                formationsStats[session.formation].reussis++;
              } else {
                formationsStats[session.formation].echecs++;
              }
            }
          });
        });

        set({
          stats: {
            totalEvaluations: totalEvals,
            tauxReussite: totalEvals > 0 ? (totalReussis / totalEvals) * 100 : 0,
            formationsStats
          }
        });
      }
    }),
    {
      name: 's2-formation-storage'
    }
  )
);
