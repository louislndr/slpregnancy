import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useOnboardingStore, Need } from '@/store/onboardingStore';

const NEEDS: { id: Need; icon: string; label: string }[] = [
  { id: 'calm', icon: '🌊', label: 'Calm' },
  { id: 'confidence', icon: '💪', label: 'Confidence' },
  { id: 'reassurance', icon: '🤗', label: 'Reassurance' },
  { id: 'rest', icon: '😴', label: 'Rest' },
  { id: 'connection', icon: '💞', label: 'Connection' },
];

export default function NeedsScreen() {
  const { profile, setNeed } = useOnboardingStore();

  return (
    <LinearGradient colors={[colors.azure, '#EEF4F8', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>What do you{'\n'}need most today?</Text>
            <Text style={styles.subtitle}>We'll find the right support for you.</Text>
            <View style={styles.options}>
              {NEEDS.map((n) => (
                <TouchableOpacity
                  key={n.id}
                  style={[styles.option, profile.need === n.id && styles.optionSelected]}
                  onPress={() => setNeed(n.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.icon}>{n.icon}</Text>
                  <Text style={[styles.label, profile.need === n.id && styles.labelSelected]}>{n.label}</Text>
                  {profile.need === n.id && (
                    <View style={styles.check}><Text style={styles.checkText}>✓</Text></View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <PillButton label="Continue" onPress={() => router.push('/onboarding/guidance')} disabled={!profile.need} />
          <View style={styles.dots}><ProgressDots total={9} current={5} /></View>
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
  icon: { fontSize: 26, width: 36, textAlign: 'center' },
  label: { fontFamily: 'Montserrat_400Regular', fontSize: 16, color: colors.textPrimary, flex: 1 },
  labelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.primary },
  check: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  checkText: { color: colors.white, fontSize: 12, fontFamily: 'Montserrat_600SemiBold' },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
