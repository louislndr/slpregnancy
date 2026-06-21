import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, Line } from 'react-native-svg';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';

function DandelionIcon({ size = 80 }: { size?: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const len = size * 0.38;
  const angles = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];
  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {angles.map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <React.Fragment key={i}>
            <Line x1={cx} y1={cy} x2={cx + Math.cos(rad) * len} y2={cy + Math.sin(rad) * len}
              stroke={colors.primary} strokeWidth="1" opacity={0.6} />
            <Circle cx={cx + Math.cos(rad) * len} cy={cy + Math.sin(rad) * len} r="3"
              fill={colors.primary} opacity={0.5} />
          </React.Fragment>
        );
      })}
      <Circle cx={cx} cy={cy} r="6" fill={colors.primary} opacity={0.9} />
    </Svg>
  );
}

export default function PermissionScreen() {
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);
  return (
    <LinearGradient colors={[colors.azure, '#EEF4F8', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <AppHeader
          showBack
          rightIcon={hasCompleted ? 'close-outline' : undefined}
          onRightPress={() => router.replace('/(tabs)')}
        />
        <View style={styles.container}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <DandelionIcon size={100} />

            <View style={styles.card}>
              <Text style={styles.eyebrow}>TODAY'S PERMISSION</Text>
              <Text style={styles.quote}>
                "Today, I allow myself{'\n'}to take one day{'\n'}at a time."
              </Text>
            </View>

            <Text style={styles.body}>
              You're here. That already takes courage.{'\n'}
              We're with you every step of the way.
            </Text>
          </View>

          <PillButton label="Continue" onPress={() => router.push('/onboarding/first-session')} />
          <View style={styles.dots}><ProgressDots total={9} current={7} /></View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  container: { flex: 1, paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg },
  card: {
    backgroundColor: colors.sandLight,
    borderRadius: radius.md,
    padding: spacing.xl,
    marginTop: spacing.xl,
    marginBottom: spacing.xl,
    alignItems: 'center',
    ...shadow.card,
  },
  eyebrow: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.textMuted, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: spacing.md },
  quote: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 22, color: colors.coldViolet, textAlign: 'center', lineHeight: 32 },
  body: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, textAlign: 'center', lineHeight: 24 },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
