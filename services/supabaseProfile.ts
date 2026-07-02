import { supabase } from '@/lib/supabase';
import type { OnboardingProfile } from '@/store/onboardingStore';

export interface RemoteProfileData {
  profile: Partial<OnboardingProfile>;
  hasCompletedOnboarding: boolean;
}

export async function syncProfileToSupabase(userId: string, profile: OnboardingProfile): Promise<void> {
  await supabase.from('profiles').upsert({
    id: userId,
    lounge: profile.lounge,
    journey: profile.journey,
    first_name: profile.firstName || null,
    age_range: profile.ageRange || null,
    guidance_voice: profile.guidanceVoice,
    guidance_mode: profile.guidanceMode,
    has_completed_onboarding: true,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'id' });
}

export async function loadProfileFromSupabase(userId: string): Promise<RemoteProfileData | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error || !data) return null;

  return {
    profile: {
      lounge: data.lounge ?? null,
      journey: data.journey ?? null,
      firstName: data.first_name ?? '',
      ageRange: data.age_range ?? '',
      guidanceVoice: data.guidance_voice ?? 'female',
      guidanceMode: data.guidance_mode ?? 'audio-visual',
    },
    hasCompletedOnboarding: data.has_completed_onboarding ?? false,
  };
}
