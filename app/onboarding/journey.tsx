import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { useOnboardingStore, Journey } from '@/store/onboardingStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const JOURNEYS: { id: Journey; icon: IoniconsName; label: string; desc: string }[] = [
  { id: 'trying-to-conceive', icon: 'leaf-outline', label: 'Trying to Conceive', desc: 'Fertility & hoping' },
  { id: 'pregnancy', icon: 'body-outline', label: 'Pregnancy', desc: 'Expecting a baby' },
  { id: 'pregnancy-recovery', icon: 'flower-outline', label: 'Pregnancy Recovery', desc: 'After loss or complications' },
  { id: 'postpartum', icon: 'happy-outline', label: 'Postpartum', desc: 'Life with a new baby' },
];

export default function JourneyScreen() {
  const { profile, setJourney, hasCompletedOnboarding } = useOnboardingStore();

  return (
    <LinearGradient colors={['#FFFFFF', '#F5F9FC', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <AppHeader
          rightIcon={hasCompletedOnboarding ? 'close-outline' : undefined}
          onRightPress={() => router.replace('/(tabs)')}
        />
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>Tell us about{'\n'}your journey</Text>
            <Text style={styles.subtitle}>Where are you right now?</Text>
            <View style={styles.options}>
              {JOURNEYS.map((j) => {
                const active = profile.journey === j.id;
                return (
                  <TouchableOpacity
                    key={j.id}
                    style={[styles.option, active && styles.optionSelected]}
                    onPress={() => setJourney(j.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                      <Ionicons name={j.icon} size={20} color={active ? colors.white : colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.label, active && styles.labelSelected]}>{j.label}</Text>
                      <Text style={styles.desc}>{j.desc}</Text>
                    </View>
                    {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
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
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.md, padding: spacing.md, gap: spacing.md,
    borderWidth: 1.5, borderColor: colors.border,
  },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#F0F7FA' },
  iconWrap: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: colors.azure, alignItems: 'center', justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.primary },
  label: { fontFamily: 'Montserrat_500Medium', fontSize: 15, color: colors.textPrimary },
  labelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.coldViolet },
  desc: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 2 },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
