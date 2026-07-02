import { create } from 'zustand';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthState {
  session: Session | null;
  initialized: boolean;
  setSession: (session: Session | null) => void;
  setInitialized: () => void;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  initialized: false,
  setSession: (session) => set({ session }),
  setInitialized: () => set({ initialized: true }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));
