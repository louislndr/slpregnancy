import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useOnboardingStore, Journey } from '@/store/onboardingStore';

const JOURNEYS: { id: Journey; label: string; icon: string; desc: string }[] = [
  { id: 'trying-to-conceive', label: 'Trying to Conceive', icon: '🌱', desc: 'Fertility & hoping' },
  { id: 'pregnancy', label: 'Pregnancy', icon: '🤰', desc: 'Expecting a baby' },
  { id: 'pregnancy-recovery', label: 'Pregnancy Recovery', icon: '🌸', desc: 'After loss or complications' },
  { id: 'postpartum', label: 'Postpartum', icon: '👶', desc: 'Life with a new baby' },
];

export default function JourneyScreen() {
  const { profile, setJourney } = useOnboardingStore();

  return (
    <LinearGradient colors={[colors.azure, '#EEF4F8', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Tell us about{'\n'}your journey</Text>
            <Text style={styles.subtitle}>Where are you right now?</Text>
            <View style={styles.options}>
              {JOURNEYS.map((j) => (
                <TouchableOpacity
                  key={j.id}
                  style={[styles.option, profile.journey === j.id && styles.optionSelected]}
                  onPress={() => setJourney(j.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.icon}>{j.icon}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.label, profile.journey === j.id && styles.labelSelected]}>{j.label}</Text>
                    <Text style={styles.desc}>{j.desc}</Text>
                  </View>
                  {profile.journey === j.id && (
                    <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <PillButton label="Continue" onPress={() => router.push('/onboarding/questions')} disabled={!profile.journey} />
          <View style={styles.dots}><ProgressDots total={9} current={2} /></View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  title: { fontFamily: 'Raleway_700Bold', fontSize: 28, color: colors.coldViolet, lineHeight: 36, marginBottom: spacing.sm },
  subtitle: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, marginBottom: spacing.xl },
  options: { gap: 12 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, gap: spacing.md, borderWidth: 1.5, borderColor: 'transparent' },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#EEF6FA' },
  icon: { fontSize: 26 },
  label: { fontFamily: 'Montserrat_500Medium', fontSize: 15, color: colors.textPrimary },
  labelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.primary },
  desc: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginTop: 2 },
  check: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: colors.white, fontSize: 12, fontFamily: 'Montserrat_600SemiBold' },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
