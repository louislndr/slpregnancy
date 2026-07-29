import { supabase } from '@/lib/supabase';
import type { OnboardingProfile } from '@/store/onboardingStore';

export interface RemoteProfileData {
  profile: Partial<OnboardingProfile>;
  hasCompletedOnboarding: boolean;
}

async function detectCountry(): Promise<{ country: string; country_code: string } | null> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.country_code || !data.country_name) return null;
    return { country: data.country_name, country_code: data.country_code };
  } catch {
    return null;
  }
}

export async function syncProfileToSupabase(userId: string, profile: OnboardingProfile): Promise<void> {
  const location = await detectCountry();
  await supabase.from('profiles').upsert({
    id: userId,
    lounge: profile.lounge,
    journey: profile.journey,
    first_name: profile.firstName || null,
    age_range: profile.ageRange || null,
    guidance_voice: profile.guidanceVoice,
    guidance_mode: profile.guidanceMode,
    has_completed_onboarding: true,
    ...(location && { country: location.country, country_code: location.country_code }),
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
