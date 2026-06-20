import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';

export default function FirstSessionScreen() {
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);

  const handleStart = () => {
    completeOnboarding();
    router.replace('/session/safe-in-this-moment');
  };

  return (
    <LinearGradient colors={[colors.azure, '#EEF4F8', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <AppHeader />
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>YOUR FIRST RECOMMENDED SESSION</Text>
            <Text style={styles.title}>We found the{'\n'}perfect start for you</Text>

            <View style={styles.sessionCard}>
              <View style={styles.cardBadge}>
                <Text style={styles.badgeText}>Audio + Visual</Text>
              </View>
              <Text style={styles.sessionTitle}>Safe In This Moment</Text>
              <Text style={styles.sessionMeta}>🎧 10 min  ·  Full Session</Text>
              <Text style={styles.sessionDesc}>
                A gentle grounding session to help you feel safe and present, wherever you are on your journey.
              </Text>
              <View style={styles.tagRow}>
                <View style={styles.tag}><Text style={styles.tagText}>Calm</Text></View>
                <View style={styles.tag}><Text style={styles.tagText}>Reassurance</Text></View>
              </View>
            </View>
          </View>

          <PillButton label="Start Session" onPress={handleStart} />
          <View style={styles.skipArea}>
            <Text style={styles.skip} onPress={() => { completeOnboarding(); router.replace('/(tabs)'); }}>
              Go to Home instead
            </Text>
          </View>
          <View style={styles.dots}><ProgressDots total={9} current={8} /></View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg },
  eyebrow: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.primary, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing.md },
  title: { fontFamily: 'Raleway_700Bold', fontSize: 28, color: colors.coldViolet, lineHeight: 36, marginBottom: spacing.xl },
  sessionCard: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    ...shadow.card,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: colors.azure,
    borderRadius: 9999,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginBottom: spacing.md,
  },
  badgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.primary, letterSpacing: 0.5 },
  sessionTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 24, color: colors.coldViolet, marginBottom: spacing.sm },
  sessionMeta: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  sessionDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, lineHeight: 22, marginBottom: spacing.md },
  tagRow: { flexDirection: 'row', gap: 8 },
  tag: { backgroundColor: colors.sandLight, borderRadius: 9999, paddingVertical: 4, paddingHorizontal: 12 },
  tagText: { fontFamily: 'Montserrat_500Medium', fontSize: 12, color: colors.coldViolet },
  skipArea: { alignItems: 'center', marginTop: spacing.md },
  skip: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textMuted, textDecorationLine: 'underline' },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
