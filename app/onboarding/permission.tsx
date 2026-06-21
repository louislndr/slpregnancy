import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Line, Path, G } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';

function DandelionIllustration() {
  const w = 210;
  const h = 330;
  const cx = 105;
  const cy = 115;

  const numSeeds = 28;
  const seeds = Array.from({ length: numSeeds }, (_, i) => {
    const angle = (i * 360 / numSeeds) * Math.PI / 180;
    const len = 46 + (i % 5) * 3;
    return { x2: cx + Math.cos(angle) * len, y2: cy + Math.sin(angle) * len };
  });

  const floatingSeeds = [
    { x: 172, y: 38, ang: -70, len: 15 },
    { x: 192, y: 62, ang: -38, len: 13 },
    { x: 185, y: 18, ang: -82, len: 12 },
    { x: 178, y: 80, ang: -52, len: 11 },
    { x: 165, y: 8,  ang: -88, len: 10 },
  ];

  return (
    <Svg width={w} height={h} viewBox={`0 0 ${w} ${h}`}>
      {/* Curved stem */}
      <Path
        d={`M ${cx} ${cy + 30} C ${cx - 8} ${cy + 95} ${cx - 32} ${cy + 180} ${cx - 68} ${h}`}
        stroke={colors.primary}
        strokeWidth="2.5"
        fill="none"
        opacity={0.38}
      />

      {/* Seed stalks */}
      {seeds.map((s, i) => (
        <G key={i}>
          <Line
            x1={cx} y1={cy} x2={s.x2} y2={s.y2}
            stroke={colors.primary} strokeWidth="0.9" opacity={0.35}
          />
          <Circle cx={s.x2} cy={s.y2} r="3.4" fill={colors.primary} opacity={0.3} />
        </G>
      ))}

      {/* Center */}
      <Circle cx={cx} cy={cy} r="7" fill={colors.primary} opacity={0.48} />

      {/* Floating seeds drifting upper-right */}
      {floatingSeeds.map((s, i) => {
        const rad = s.ang * Math.PI / 180;
        return (
          <G key={i}>
            <Line
              x1={s.x} y1={s.y}
              x2={s.x + Math.cos(rad) * s.len}
              y2={s.y + Math.sin(rad) * s.len}
              stroke={colors.primary} strokeWidth="0.8" opacity={0.26}
            />
            <Circle cx={s.x} cy={s.y} r="2.4" fill={colors.primary} opacity={0.2} />
          </G>
        );
      })}
    </Svg>
  );
}

export default function PermissionScreen() {
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);

  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader
        showBack
        rightIcon={hasCompleted ? 'close-outline' : undefined}
        onRightPress={() => router.replace('/(tabs)')}
      />
      <View style={styles.container}>

        {/* Hero: title left, dandelion right */}
        <View style={styles.heroArea}>
          <View style={styles.dandelionAbsolute} pointerEvents="none">
            <DandelionIllustration />
          </View>
          <Text style={styles.title}>Today's{'\n'}Permission</Text>
        </View>

        {/* Quote */}
        <View style={styles.quoteArea}>
          <Text style={styles.quoteMark}>"</Text>
          <Text style={styles.quoteText}>
            Today, I allow{'\n'}myself to take{'\n'}one day at a time.
          </Text>
          <Ionicons name="heart" size={22} color={colors.accent} style={{ marginTop: spacing.xl }} />
        </View>

        <View style={{ flex: 1 }} />

        <PillButton label="Continue" onPress={() => router.push('/onboarding/first-session')} />
        <View style={styles.dots}><ProgressDots total={9} current={7} /></View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF3EB' },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },
  heroArea: {
    minHeight: 170,
    marginBottom: spacing.lg,
  },
  dandelionAbsolute: {
    position: 'absolute',
    right: -spacing.lg,
    top: -10,
  },
  title: {
    fontFamily: 'Raleway_700Bold',
    fontSize: 34,
    color: colors.coldViolet,
    lineHeight: 43,
    marginTop: spacing.lg,
    width: '52%',
  },
  quoteArea: {
    paddingRight: spacing.xl,
  },
  quoteMark: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 56,
    color: colors.primary,
    lineHeight: 52,
    marginBottom: spacing.sm,
  },
  quoteText: {
    fontFamily: 'Raleway_700Bold',
    fontSize: 28,
    color: colors.coldViolet,
    lineHeight: 40,
  },
  dots: { alignItems: 'center', marginTop: spacing.lg },
});
