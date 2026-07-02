import { Stack } from 'expo-router';

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="lounge" />
      <Stack.Screen name="support-needs" />
      <Stack.Screen name="journey" />
      <Stack.Screen name="questions" />
      <Stack.Screen name="feeling" />
      <Stack.Screen name="needs" />
      <Stack.Screen name="guidance" />
      <Stack.Screen name="permission" />
      <Stack.Screen name="first-session" />
    </Stack>
  );
}
