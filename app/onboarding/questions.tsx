import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';

function TogglePair({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean | null;
  onChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <Text style={styles.toggleLabel}>{label}</Text>
      <View style={styles.toggleGroup}>
        <TouchableOpacity
          style={[styles.toggleBtn, value === true && styles.toggleActive]}
          onPress={() => onChange(true)}
        >
          <Text style={[styles.toggleText, value === true && styles.toggleTextActive]}>Yes</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleBtn, value === false && styles.toggleActive]}
          onPress={() => onChange(false)}
        >
          <Text style={[styles.toggleText, value === false && styles.toggleTextActive]}>No</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function QuestionsScreen() {
  const { profile, setFirstPregnancy, setPregnancyLoss, setFertilityTreatment } = useOnboardingStore();
  const allAnswered = profile.firstPregnancy !== null && profile.pregnancyLoss !== null && profile.fertilityTreatment !== null;

  return (
    <LinearGradient colors={[colors.azure, '#EEF4F8', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <AppHeader />
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>A few questions{'\n'}to personalize</Text>
            <Text style={styles.subtitle}>Your answers help us tailor your experience.</Text>
            <View style={styles.questions}>
              <TogglePair label="Is this your first pregnancy?" value={profile.firstPregnancy} onChange={setFirstPregnancy} />
              <TogglePair label="Have you experienced a pregnancy loss?" value={profile.pregnancyLoss} onChange={setPregnancyLoss} />
              <TogglePair label="Going through fertility treatment (IVF/IUI)?" value={profile.fertilityTreatment} onChange={setFertilityTreatment} />
            </View>
          </View>
          <PillButton label="Continue" onPress={() => router.push('/onboarding/feeling')} disabled={!allAnswered} />
          <View style={styles.dots}><ProgressDots total={9} current={3} /></View>
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
  questions: { gap: 20 },
  toggleRow: { backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, gap: spacing.sm },
  toggleLabel: { fontFamily: 'Montserrat_500Medium', fontSize: 15, color: colors.textPrimary },
  toggleGroup: { flexDirection: 'row', gap: 10, marginTop: 4 },
  toggleBtn: { flex: 1, paddingVertical: 10, borderRadius: 9999, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center' },
  toggleActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  toggleText: { fontFamily: 'Montserrat_500Medium', fontSize: 14, color: colors.textSecondary },
  toggleTextActive: { color: colors.white },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
