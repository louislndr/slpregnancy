import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';

interface ProgramProgress {
  programId: string;
  completedSessions: string[];
  currentSessionIndex: number;
}

export interface SessionHistory {
  protocolId: string;
  completedAt: string;
  rating?: number;
  feelingAfter?: string;
  note?: string;
  emotion?: string;
}

interface SessionState {
  favorites: string[];
  history: SessionHistory[];
  programProgress: Record<string, ProgramProgress>;
  currentProgramId: string | null;

  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
  addHistory: (entry: SessionHistory) => void;
  completeSession: (programId: string, sessionId: string) => void;
  setCurrentProgram: (id: string) => void;
  getProgramProgress: (programId: string) => ProgramProgress | undefined;
  resetAll: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set, get) => ({
      favorites: [],
      history: [],
      programProgress: {},
      currentProgramId: 'preparing-for-birth',

      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),

      isFavorite: (id) => get().favorites.includes(id),

      addHistory: (entry) =>
        set((s) => ({ history: [entry, ...s.history].slice(0, 100) })),

      completeSession: (programId, sessionId) =>
        set((s) => {
          const prev = s.programProgress[programId] ?? {
            programId,
            completedSessions: [],
            currentSessionIndex: 0,
          };
          const completedSessions = prev.completedSessions.includes(sessionId)
            ? prev.completedSessions
            : [...prev.completedSessions, sessionId];
          return {
            programProgress: {
              ...s.programProgress,
              [programId]: {
                ...prev,
                completedSessions,
                currentSessionIndex: Math.min(completedSessions.length, 3),
              },
            },
          };
        }),

      setCurrentProgram: (id) => set({ currentProgramId: id }),

      getProgramProgress: (programId) => get().programProgress[programId],

      resetAll: () => set({ favorites: [], history: [], programProgress: {}, currentProgramId: 'preparing-for-birth' }),
    }),
    {
      name: 'session-storage',
      storage: zustandStorage,
    }
  )
);
