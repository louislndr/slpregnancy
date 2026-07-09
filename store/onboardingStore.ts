import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { zustandStorage } from './storage';

export type Lounge = 'womens' | 'partner' | 'couple' | 'kids' | 'family';
export type Journey =
  | 'trying-to-conceive'
  | 'fertility-treatment'
  | 'pregnancy'
  | 'difficult-pregnancy'
  | 'waiting'
  | 'birth-preparation'
  | 'birth'
  | 'pregnancy-recovery'
  | 'postpartum'
  | 'perinatal-grief'
  | 'feeling-well'
  | 'partner-support';
export type EmotionalState = 'struggling' | 'doing-okay' | 'feeling-good' | 'preparing-tomorrow' | 'moment-for-myself';
export type Need =
  | 'calm'
  | 'confidence'
  | 'reassurance'
  | 'rest'
  | 'connection'
  | 'welcome-emotions'
  | 'prepare'
  | 'face-challenge'
  | 'reconnect-self'
  | 'develop-resources';
export type GuidanceVoice = 'female' | 'male' | 'charlotte-fr';
export type GuidanceMode = 'audio-only' | 'audio-visual';

export interface OnboardingProfile {
  lounge: Lounge | null;
  firstName: string;
  ageRange: string;
  journey: Journey | null;
  firstPregnancy: boolean | null;
  pregnancyLoss: boolean | null;
  fertilityTreatment: boolean | null;
  emotionalState: EmotionalState | null;
  need: Need | null;
  guidanceVoice: GuidanceVoice;
  guidanceMode: GuidanceMode;
}

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  profile: OnboardingProfile;

  setLounge: (lounge: Lounge) => void;
  setFirstName: (name: string) => void;
  setAgeRange: (range: string) => void;
  setJourney: (journey: Journey) => void;
  setFirstPregnancy: (value: boolean) => void;
  setPregnancyLoss: (value: boolean) => void;
  setFertilityTreatment: (value: boolean) => void;
  setEmotionalState: (state: EmotionalState) => void;
  setNeed: (need: Need) => void;
  setGuidanceVoice: (voice: GuidanceVoice) => void;
  setGuidanceMode: (mode: GuidanceMode) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
  resetProfile: () => void;
  restoreProfile: (profile: Partial<OnboardingProfile>, completed: boolean) => void;
}

const defaultProfile: OnboardingProfile = {
  lounge: null,
  firstName: '',
  ageRange: '',
  journey: null,
  firstPregnancy: null,
  pregnancyLoss: null,
  fertilityTreatment: null,
  emotionalState: null,
  need: null,
  guidanceVoice: 'female',
  guidanceMode: 'audio-visual',
};

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      profile: defaultProfile,

      setLounge: (lounge) =>
        set((s) => ({ profile: { ...s.profile, lounge } })),
      setFirstName: (name) =>
        set((s) => ({ profile: { ...s.profile, firstName: name } })),
      setAgeRange: (range) =>
        set((s) => ({ profile: { ...s.profile, ageRange: range } })),
      setJourney: (journey) =>
        set((s) => ({ profile: { ...s.profile, journey } })),
      setFirstPregnancy: (value) =>
        set((s) => ({ profile: { ...s.profile, firstPregnancy: value } })),
      setPregnancyLoss: (value) =>
        set((s) => ({ profile: { ...s.profile, pregnancyLoss: value } })),
      setFertilityTreatment: (value) =>
        set((s) => ({ profile: { ...s.profile, fertilityTreatment: value } })),
      setEmotionalState: (state) =>
        set((s) => ({ profile: { ...s.profile, emotionalState: state } })),
      setNeed: (need) =>
        set((s) => ({ profile: { ...s.profile, need } })),
      setGuidanceVoice: (voice) =>
        set((s) => ({ profile: { ...s.profile, guidanceVoice: voice } })),
      setGuidanceMode: (mode) =>
        set((s) => ({ profile: { ...s.profile, guidanceMode: mode } })),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      resetOnboarding: () =>
        set({ hasCompletedOnboarding: false, profile: defaultProfile }),
      resetProfile: () => set({ profile: defaultProfile }),
      restoreProfile: (profile, completed) =>
        set((s) => ({
          hasCompletedOnboarding: completed,
          profile: { ...s.profile, ...profile },
        })),
    }),
    {
      name: 'onboarding-storage',
      storage: zustandStorage,
    }
  )
);
