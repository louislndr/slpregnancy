import React from 'react';
import { View, Text, StyleSheet,  TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';
import { router } from 'expo-router';
import AppHeader from '@/components/AppHeader';

export default function ProfileScreen() {
  const { profile, resetProfile } = useOnboardingStore();

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader />
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.sub}>Journey: {profile.journey ?? 'Not set'}</Text>
        <TouchableOpacity
          style={styles.resetBtn}
          onPress={() => { resetProfile(); router.replace('/onboarding/welcome'); }}
        >
          <Text style={styles.resetText}>Reset Onboarding</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  container: { flex: 1, padding: spacing.lg, justifyContent: 'center', alignItems: 'center' },
  title: { fontFamily: 'Raleway_700Bold', fontSize: 24, color: colors.coldViolet, marginBottom: spacing.sm },
  sub: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, marginBottom: spacing.xl },
  resetBtn: { borderWidth: 1, borderColor: colors.error, borderRadius: 9999, paddingVertical: 10, paddingHorizontal: 24 },
  resetText: { fontFamily: 'Montserrat_500Medium', fontSize: 14, color: colors.error },
});
