import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function PermissionScreen() {
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);

  return (
    <LinearGradient colors={['#FFF8F4', colors.sandLight, colors.peachSoft]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <AppHeader
          showBack
          rightIcon={hasCompleted ? 'close-outline' : undefined}
          onRightPress={() => router.replace('/(tabs)')}
        />
        <View style={styles.container}>

          <View style={styles.topSection}>
            <Ionicons name="leaf-outline" size={28} color={colors.primary} style={styles.icon} />
            <Text style={styles.eyebrow}>Today's permission</Text>
            <Text style={styles.heading}>A gentle reminder{'\n'}for today</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.quoteOpen}>"</Text>
            <Text style={styles.quoteText}>
              Today, I allow myself{'\n'}to take one day at a time.
            </Text>
            <Text style={styles.quoteClose}>"</Text>
          </View>

          <Text style={styles.subtext}>
            Carry this with you as you begin your session.
          </Text>

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
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  topSection: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  icon: {
    marginBottom: spacing.md,
    opacity: 0.8,
  },
  eyebrow: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    color: colors.primary,
    letterSpacing: 0.5,
    marginBottom: spacing.sm,
  },
  heading: {
    fontFamily: 'Raleway_700Bold',
    fontSize: 26,
    color: colors.coldViolet,
    textAlign: 'center',
    lineHeight: 34,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
    alignItems: 'center',
    ...shadow.card,
  },
  quoteOpen: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 48,
    color: colors.primary,
    lineHeight: 52,
    alignSelf: 'flex-start',
    opacity: 0.6,
    marginBottom: -spacing.sm,
  },
  quoteText: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic',
    fontSize: 22,
    color: colors.coldViolet,
    lineHeight: 34,
    textAlign: 'center',
    paddingHorizontal: spacing.sm,
  },
  quoteClose: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 48,
    color: colors.primary,
    lineHeight: 40,
    alignSelf: 'flex-end',
    opacity: 0.6,
    marginTop: spacing.xs,
  },
  subtext: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
  },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
