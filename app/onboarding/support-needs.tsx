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
import { useOnboardingStore } from '@/store/onboardingStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const OPTIONS: { id: string; icon: IoniconsName; label: string }[] = [
  { id: 'emotional', icon: 'heart-outline', label: 'Daily emotional support' },
  { id: 'sessions', icon: 'headset-outline', label: 'Guided sophrology sessions' },
  { id: 'recommendations', icon: 'sparkles-outline', label: 'Personalized recommendations' },
  { id: 'unexpected', icon: 'shield-checkmark-outline', label: "Support for life's unexpected moments" },
];

export default function SupportNeedsScreen() {
  const hasCompletedOnboarding = useOnboardingStore((s) => s.hasCompletedOnboarding);
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggle = (id: string) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );

  return (
    <LinearGradient colors={['#FFFFFF', '#F5F9FC', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <AppHeader
          showBack
          rightIcon={hasCompletedOnboarding ? 'close-outline' : undefined}
          onRightPress={() => router.replace('/(tabs)')}
        />
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>How can we{'\n'}support you?</Text>
            <Text style={styles.subtitle}>Select everything that applies.</Text>
            <View style={styles.options}>
              {OPTIONS.map((opt) => {
                const active = selected.includes(opt.id);
                return (
                  <TouchableOpacity
                    key={opt.id}
                    style={[styles.option, active && styles.optionSelected]}
                    onPress={() => toggle(opt.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                      <Ionicons name={opt.icon} size={20} color={active ? colors.white : colors.primary} />
                    </View>
                    <Text style={[styles.optionLabel, active && styles.optionLabelSelected]}>
                      {opt.label}
                    </Text>
                    {active && (
                      <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <PillButton label="Continue" onPress={() => router.push('/onboarding/journey')} disabled={selected.length === 0} />
          <View style={styles.dots}><ProgressDots total={9} current={1} /></View>
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
  optionLabel: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textPrimary, flex: 1 },
  optionLabelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.coldViolet },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
