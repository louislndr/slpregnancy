import { Redirect } from 'expo-router';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function Index() {
  const hasCompletedOnboarding = useOnboardingStore(
    (s) => s.hasCompletedOnboarding
  );

  if (hasCompletedOnboarding) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/onboarding/welcome" />;
}
