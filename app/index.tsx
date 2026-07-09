import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useAuthStore } from '@/store/authStore';
import { loadProfileFromSupabase } from '@/services/supabaseProfile';
import { INTRO_SEEN_KEY } from './intro';
import { colors } from '@/theme/colors';

export default function Index() {
  const { session, initialized } = useAuthStore();
  const hasCompletedOnboarding = useOnboardingStore((s) => s.hasCompletedOnboarding);
  const restoreProfile = useOnboardingStore((s) => s.restoreProfile);

  const [hydrated, setHydrated] = useState(
    () => useOnboardingStore.persist.hasHydrated()
  );
  const [profileChecked, setProfileChecked] = useState(false);
  const [introChecked, setIntroChecked] = useState(false);
  const [introSeen, setIntroSeen] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(INTRO_SEEN_KEY).then((val) => {
      setIntroSeen(val === 'true');
      setIntroChecked(true);
    });
  }, []);

  useEffect(() => {
    if (hydrated) return;
    const unsub = useOnboardingStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, [hydrated]);

  // When session is available but onboarding not done locally, try to restore from Supabase
  useEffect(() => {
    if (!initialized || !hydrated) return;
    if (!session) { setProfileChecked(true); return; }
    if (hasCompletedOnboarding) { setProfileChecked(true); return; }

    loadProfileFromSupabase(session.user.id)
      .then((data) => {
        if (data) restoreProfile(data.profile, data.hasCompletedOnboarding);
      })
      .catch(() => {})
      .finally(() => setProfileChecked(true));
  }, [initialized, hydrated, session?.user.id]);

  const ready = initialized && hydrated && profileChecked && introChecked;

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  if (!session) return <Redirect href={introSeen ? '/auth' : '/intro'} />;
  if (!hasCompletedOnboarding) return <Redirect href="/onboarding/welcome" />;
  return <Redirect href="/(tabs)" />;
}
