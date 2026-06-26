import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function PermissionScreen() {
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);

  return (
    <LinearGradient colors={[colors.accent, colors.sandLight, '#FFF5EE']} locations={[0, 0.45, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <AppHeader
          showBack
          rightIcon={hasCompleted ? 'close-outline' : undefined}
          onRightPress={() => router.replace('/(tabs)')}
        />
        <View style={styles.container}>
          <Text style={styles.label}>Today's Permission</Text>

          <View style={styles.quoteCard}>
            <Text style={styles.openMark}>"</Text>
            <Text style={styles.quoteText}>
              Today, I allow myself to take one day at a time.
            </Text>
            <Text style={styles.closeMark}>"</Text>
          </View>

          <View style={{ flex: 1 }} />
          <PillButton label="Continue" onPress={() => router.push('/onboarding/first-session')} />
          <View style={styles.dots}><ProgressDots total={9} current={7} /></View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },
  label: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 12,
    color: colors.coldViolet,
    letterSpacing: 2,
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: spacing.xxl,
  },
  quoteCard: {
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },
  openMark: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 80,
    color: colors.coldViolet,
    lineHeight: 70,
    alignSelf: 'flex-start',
    opacity: 0.5,
  },
  quoteText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 26,
    color: colors.coldViolet,
    lineHeight: 40,
    textAlign: 'center',
    marginVertical: spacing.md,
  },
  closeMark: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 80,
    color: colors.coldViolet,
    lineHeight: 70,
    alignSelf: 'flex-end',
    opacity: 0.5,
  },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
