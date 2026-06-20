import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useOnboardingStore, EmotionalState } from '@/store/onboardingStore';

const STATES: { id: EmotionalState; icon: string; label: string }[] = [
  { id: 'struggling', icon: '🌧', label: "I'm Struggling" },
  { id: 'doing-okay', icon: '🌤', label: 'Doing Okay' },
  { id: 'feeling-good', icon: '☀️', label: 'Feeling Good' },
  { id: 'preparing-tomorrow', icon: '🌙', label: 'Preparing For Tomorrow' },
  { id: 'moment-for-myself', icon: '🌸', label: 'I Just Want A Moment For Myself' },
];

export default function FeelingScreen() {
  const { profile, setEmotionalState } = useOnboardingStore();

  return (
    <LinearGradient colors={[colors.azure, '#EEF4F8', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>How are you{'\n'}feeling today?</Text>
            <Text style={styles.subtitle}>There are no wrong answers here.</Text>
            <View style={styles.options}>
              {STATES.map((s) => (
                <TouchableOpacity
                  key={s.id}
                  style={[styles.option, profile.emotionalState === s.id && styles.optionSelected]}
                  onPress={() => setEmotionalState(s.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.icon}>{s.icon}</Text>
                  <Text style={[styles.label, profile.emotionalState === s.id && styles.labelSelected]}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <PillButton label="Continue" onPress={() => router.push('/onboarding/needs')} disabled={!profile.emotionalState} />
          <View style={styles.dots}><ProgressDots total={9} current={4} /></View>
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
  options: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: 14, padding: spacing.md, gap: spacing.md, borderWidth: 1.5, borderColor: 'transparent' },
  optionSelected: { borderColor: colors.primary, backgroundColor: '#EEF6FA' },
  icon: { fontSize: 22, width: 32, textAlign: 'center' },
  label: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textPrimary, flex: 1 },
  labelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.primary },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
