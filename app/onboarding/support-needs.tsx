import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const OPTIONS = [
  { id: 'emotional', icon: '💛', label: 'Daily emotional support' },
  { id: 'sessions', icon: '🎧', label: 'Guided sophrology sessions' },
  { id: 'recommendations', icon: '✨', label: 'Personalized recommendations' },
  { id: 'unexpected', icon: '🤝', label: "Support for life's unexpected moments" },
];

export default function SupportNeedsScreen() {
  const [selected, setSelected] = React.useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <LinearGradient colors={[colors.azure, '#EEF4F8', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>How can we{'\n'}support you?</Text>
            <Text style={styles.subtitle}>Select everything that applies.</Text>

            <View style={styles.options}>
              {OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt.id}
                  style={[styles.option, selected.includes(opt.id) && styles.optionSelected]}
                  onPress={() => toggle(opt.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.optionIcon}>{opt.icon}</Text>
                  <Text style={[styles.optionLabel, selected.includes(opt.id) && styles.optionLabelSelected]}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <PillButton
            label="Continue"
            onPress={() => router.push('/onboarding/journey')}
            disabled={selected.length === 0}
          />
          <View style={styles.dots}>
            <ProgressDots total={9} current={1} />
          </View>
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
  optionSelected: { borderColor: colors.primary, backgroundColor: colors.azure },
  optionIcon: { fontSize: 22 },
  optionLabel: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textPrimary, flex: 1 },
  optionLabelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.primary },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
