import { create } from 'zustand';
import { protocols as staticProtocols, type Protocol } from '@/data/protocols';
import { programs as staticPrograms, type Program } from '@/data/programs';
import { fetchProtocolsFromSupabase, fetchProgramsFromSupabase } from '@/services/supabaseData';

interface DataState {
  protocols: Protocol[];
  programs: Program[];
  loaded: boolean;
  fetchData: (force?: boolean) => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  protocols: staticProtocols,
  programs: staticPrograms,
  loaded: false,
  fetchData: async (force = false) => {
    if (get().loaded && !force) return;
    try {
      const protocols = await fetchProtocolsFromSupabase();
      if (protocols.length > 0) {
        const programs = await fetchProgramsFromSupabase(protocols);
        set({
          protocols,
          programs: programs.length > 0 ? programs : staticPrograms,
          loaded: true,
        });
      } else {
        set({ loaded: true });
      }
    } catch (e) {
      if (__DEV__) console.warn('[dataStore] fetch failed:', e);
      set({ loaded: true });
    }
  },
}));
