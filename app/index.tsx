import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/store/onboardingStore';
import { colors } from '@/theme/colors';

export default function Index() {
  const hasCompletedOnboarding = useOnboardingStore((s) => s.hasCompletedOnboarding);
  const [hydrated, setHydrated] = useState(
    () => useOnboardingStore.persist.hasHydrated()
  );

  useEffect(() => {
    if (hydrated) return;
    const unsub = useOnboardingStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, [hydrated]);

  if (!hydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.white }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return hasCompletedOnboarding
    ? <Redirect href="/(tabs)" />
    : <Redirect href="/onboarding/welcome" />;
}
