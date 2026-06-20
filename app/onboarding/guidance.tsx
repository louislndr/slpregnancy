import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useOnboardingStore, GuidanceVoice, GuidanceMode } from '@/store/onboardingStore';

const VOICES: { id: GuidanceVoice; label: string }[] = [
  { id: 'female', label: 'Female' },
  { id: 'male', label: 'Male' },
  { id: 'charlotte-fr', label: "Charlotte's Voice (FR)" },
];

const MODES: { id: GuidanceMode; label: string; desc: string }[] = [
  { id: 'audio-only', label: 'Audio Only', desc: 'Voice guidance only' },
  { id: 'audio-visual', label: 'Audio + Visual', desc: 'Voice + breathing animations' },
];

export default function GuidanceScreen() {
  const { profile, setGuidanceVoice, setGuidanceMode } = useOnboardingStore();

  return (
    <LinearGradient colors={[colors.azure, '#EEF4F8', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>How would you like{'\n'}to be guided?</Text>

            <Text style={styles.sectionLabel}>VOICE</Text>
            <View style={styles.chipRow}>
              {VOICES.map((v) => (
                <TouchableOpacity
                  key={v.id}
                  style={[styles.chip, profile.guidanceVoice === v.id && styles.chipActive]}
                  onPress={() => setGuidanceVoice(v.id)}
                >
                  <Text style={[styles.chipText, profile.guidanceVoice === v.id && styles.chipTextActive]}>
                    {v.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>EXPERIENCE</Text>
            <View style={styles.options}>
              {MODES.map((m) => (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.option, profile.guidanceMode === m.id && styles.optionSelected]}
                  onPress={() => setGuidanceMode(m.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.optionLabel, profile.guidanceMode === m.id && styles.optionLabelSelected]}>{m.label}</Text>
                    <Text style={styles.optionDesc}>{m.desc}</Text>
                  </View>
                  {profile.guidanceMode === m.id && (
                    <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <PillButton label="Continue" onPress={() => router.push('/onboarding/permission')} />
          <View style={styles.dots}><ProgressDots total={9} current={6} /></View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.lg },
  title: { fontFamily: 'Raleway_700Bold', fontSize: 28, color: colors.coldViolet, lineHeight: 36, marginBottom: spacing.xl },
  sectionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.textMuted, letterSpacing: 1.5, marginBottom: spacing.sm },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  chip: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 9999, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: 'Montserrat_500Medium', fontSize: 14, color: colors.textSecondary },
  chipTextActive: { color: colors.white },
  options: { gap: 12 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, borderWidth: 1.5, borderColor: 'transparent' },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#EEF6FA' },
  optionLabel: { fontFamily: 'Montserrat_500Medium', fontSize: 15, color: colors.textPrimary },
  optionLabelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.primary },
  optionDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginTop: 2 },
  check: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: colors.white, fontSize: 12, fontFamily: 'Montserrat_600SemiBold' },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
