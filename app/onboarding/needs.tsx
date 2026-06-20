import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { useOnboardingStore, Need } from '@/store/onboardingStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const NEEDS: { id: Need; icon: IoniconsName; label: string }[] = [
  { id: 'calm', icon: 'water-outline', label: 'Calm' },
  { id: 'confidence', icon: 'shield-outline', label: 'Confidence' },
  { id: 'reassurance', icon: 'hand-left-outline', label: 'Reassurance' },
  { id: 'rest', icon: 'bed-outline', label: 'Rest' },
  { id: 'connection', icon: 'people-outline', label: 'Connection' },
];

export default function NeedsScreen() {
  const { profile, setNeed } = useOnboardingStore();

  return (
    <LinearGradient colors={['#FFFFFF', '#F5F9FC', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <Text style={styles.title}>What do you{'\n'}need most today?</Text>
            <Text style={styles.subtitle}>We'll find the right support for you.</Text>
            <View style={styles.options}>
              {NEEDS.map((n) => {
                const active = profile.need === n.id;
                return (
                  <TouchableOpacity
                    key={n.id}
                    style={[styles.option, active && styles.optionSelected]}
                    onPress={() => setNeed(n.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                      <Ionicons name={n.icon} size={20} color={active ? colors.white : colors.primary} />
                    </View>
                    <Text style={[styles.label, active && styles.labelSelected]}>{n.label}</Text>
                    {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
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
  label: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textPrimary, flex: 1 },
  labelSelected: { fontFamily: 'Montserrat_600SemiBold', color: colors.coldViolet },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
