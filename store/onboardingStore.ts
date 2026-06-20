import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Journey = 'trying-to-conceive' | 'pregnancy' | 'pregnancy-recovery' | 'postpartum';
export type EmotionalState = 'struggling' | 'doing-okay' | 'feeling-good' | 'preparing-tomorrow' | 'moment-for-myself';
export type Need = 'calm' | 'confidence' | 'reassurance' | 'rest' | 'connection';
export type GuidanceVoice = 'female' | 'male' | 'charlotte-fr';
export type GuidanceMode = 'audio-only' | 'audio-visual';

interface OnboardingProfile {
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
}

const defaultProfile: OnboardingProfile = {
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
    }),
    {
      name: 'onboarding-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
