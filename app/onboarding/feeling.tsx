import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing, radius } from '@/theme/spacing';
import { useOnboardingStore, EmotionalState } from '@/store/onboardingStore';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const STATES: { id: EmotionalState; icon: IoniconsName; label: string }[] = [
  { id: 'struggling', icon: 'rainy-outline', label: "I'm Struggling" },
  { id: 'doing-okay', icon: 'partly-sunny-outline', label: 'Doing Okay' },
  { id: 'feeling-good', icon: 'sunny-outline', label: 'Feeling Good' },
  { id: 'preparing-tomorrow', icon: 'moon-outline', label: 'Preparing For Tomorrow' },
  { id: 'moment-for-myself', icon: 'flower-outline', label: 'I Just Want A Moment For Myself' },
];

export default function FeelingScreen() {
  const { profile, setEmotionalState, hasCompletedOnboarding } = useOnboardingStore();

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
            <Text style={styles.title}>How are you{'\n'}feeling today?</Text>
            <Text style={styles.subtitle}>There are no wrong answers here.</Text>
            <View style={styles.options}>
              {STATES.map((s) => {
                const active = profile.emotionalState === s.id;
                return (
                  <TouchableOpacity
                    key={s.id}
                    style={[styles.option, active && styles.optionSelected]}
                    onPress={() => setEmotionalState(s.id)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                      <Ionicons name={s.icon} size={20} color={active ? colors.white : colors.primary} />
                    </View>
                    <Text style={[styles.label, active && styles.labelSelected]}>{s.label}</Text>
                    {active && <Ionicons name="checkmark-circle" size={20} color={colors.primary} />}
                  </TouchableOpacity>
                );
              })}
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
  subtitle: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, marginBottom: spacing.lg },
  options: { gap: 8 },
  option: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white,
    borderRadius: radius.md, paddingHorizontal: spacing.md, paddingVertical: 12, gap: spacing.md,
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
