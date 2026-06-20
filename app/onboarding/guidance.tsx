import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { useOnboardingStore, GuidanceVoice, GuidanceMode } from '@/store/onboardingStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const VOICES: { id: GuidanceVoice; icon: IoniconsName; label: string }[] = [
  { id: 'female', icon: 'person-outline', label: 'Female' },
  { id: 'male', icon: 'person-outline', label: 'Male' },
  { id: 'charlotte-fr', icon: 'mic-outline', label: "Charlotte's Voice (FR)" },
];

const MODES: { id: GuidanceMode; icon: IoniconsName; label: string; desc: string }[] = [
  { id: 'audio-only', icon: 'headset-outline', label: 'Audio Only', desc: 'Voice guidance only' },
  { id: 'audio-visual', icon: 'eye-outline', label: 'Audio + Visual', desc: 'Voice + breathing animations' },
];

export default function GuidanceScreen() {
  const { profile, setGuidanceVoice, setGuidanceMode } = useOnboardingStore();

  return (
    <LinearGradient colors={['#FFFFFF', '#F5F9FC', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>How would you like{'\n'}to be guided?</Text>

            <Text style={styles.sectionLabel}>VOICE</Text>
            <View style={styles.chipRow}>
              {VOICES.map((v) => {
                const active = profile.guidanceVoice === v.id;
                return (
                  <TouchableOpacity
                    key={v.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setGuidanceVoice(v.id)}
                  >
                    <Ionicons name={v.icon} size={14} color={active ? colors.white : colors.textSecondary} />
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{v.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={[styles.sectionLabel, { marginTop: spacing.xl }]}>EXPERIENCE</Text>
            <View style={styles.options}>
              {MODES.map((m) => {
                const active = profile.guidanceMode === m.id;
                return (
                  <TouchableOpacity
                    key={m.id}
                    style={[styles.option, active && styles.optionSelected]}
                    onPress={() => setGuidanceMode(m.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                      <Ionicons name={m.icon} size={20} color={active ? colors.white : colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.optionLabel, active && styles.optionLabelSelected]}>{m.label}</Text>
                      <Text style={styles.optionDesc}>{m.desc}</Text>
                    </View>
                    {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
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
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 10, paddingHorizontal: 16, borderRadius: 9999,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.white,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.textSecondary },
  chipTextActive: { color: colors.white },
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
  optionLabel: { fontFamily: 'Montserrat_500Medium', fontSize: 15, color: colors.textPrimary },
  optionLabelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.coldViolet },
  optionDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 2 },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
