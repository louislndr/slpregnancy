import { create } from 'zustand';
import { protocols as staticProtocols, type Protocol } from '@/data/protocols';
import { programs as staticPrograms, type Program } from '@/data/programs';
import { fetchProtocolsFromSupabase, fetchProgramsFromSupabase } from '@/services/supabaseData';

interface DataState {
  protocols: Protocol[];
  programs: Program[];
  loaded: boolean;
  fetchData: () => Promise<void>;
}

export const useDataStore = create<DataState>((set, get) => ({
  protocols: staticProtocols,
  programs: staticPrograms,
  loaded: false,
  fetchData: async () => {
    if (get().loaded) return;
    try {
      const protocols = await fetchProtocolsFromSupabase();
      if (protocols.length > 0) {
        const programs = await fetchProgramsFromSupabase(protocols);
        set({
          protocols,
          programs: programs.length > 0 ? programs : staticPrograms,
        });
      }
    } catch {
      // keep static fallback silently
    } finally {
      set({ loaded: true });
    }
  },
}));
