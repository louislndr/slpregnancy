import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Svg, Circle, Path, Ellipse, Line, Rect, G } from 'react-native-svg';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import AppHeader from '@/components/AppHeader';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';

const { width } = Dimensions.get('window');
const TOTAL_STEPS = 9;

function WelcomeIllustration() {
  const w = width - spacing.lg * 2;
  const h = 220;
  return (
    <Svg width={w} height={h} viewBox="0 0 340 220">
      {/* Sky background */}
      <Rect x="0" y="0" width="340" height="160" fill="#EEF6F9" rx="16" />

      {/* Mountains far */}
      <Path d="M0 130 L60 70 L120 110 L180 55 L240 95 L300 60 L340 90 L340 160 L0 160Z" fill="#C8DDE6" />
      {/* Mountains near */}
      <Path d="M0 145 L80 90 L140 125 L200 80 L260 115 L320 85 L340 100 L340 160 L0 160Z" fill="#A8C8D4" />

      {/* Ground / water */}
      <Ellipse cx="170" cy="165" rx="160" ry="18" fill="#B8D8E4" opacity={0.5} />
      <Rect x="0" y="155" width="340" height="65" fill="#D4EBF2" />
      {/* Water reflection ripples */}
      <Ellipse cx="120" cy="175" rx="40" ry="4" fill="#B8D4E0" opacity={0.4} />
      <Ellipse cx="230" cy="182" rx="30" ry="3" fill="#B8D4E0" opacity={0.3} />

      {/* Sitting mat / cushion */}
      <Ellipse cx="170" cy="185" rx="55" ry="10" fill={colors.sandLight} />
      <Ellipse cx="170" cy="183" rx="50" ry="8" fill={colors.peachSoft} opacity={0.7} />

      {/* Woman body — sitting cross-legged */}
      {/* Dress/skirt spread */}
      <Ellipse cx="170" cy="175" rx="38" ry="14" fill="#A8C4DA" />
      {/* Torso */}
      <Path d="M152 175 Q155 145 170 140 Q185 145 188 175Z" fill="#C4DAEC" />
      {/* Head */}
      <Circle cx="170" cy="128" r="20" fill="#F4C4A0" />
      {/* Hair bun */}
      <Path d="M152 122 Q155 105 170 108 Q185 105 188 122 Q182 112 170 114 Q158 112 152 122Z" fill="#8B6355" />
      <Circle cx="170" cy="107" r="7" fill="#8B6355" />
      {/* Baby bump */}
      <Ellipse cx="172" cy="162" rx="22" ry="16" fill="#D4E8F4" opacity={0.9} />
      {/* Arms resting */}
      <Path d="M152 155 Q145 165 148 172 Q155 168 158 162Z" fill="#C4DAEC" />
      <Path d="M188 155 Q195 165 192 172 Q185 168 182 162Z" fill="#C4DAEC" />
      {/* Hands on belly */}
      <Ellipse cx="158" cy="168" rx="8" ry="5" fill="#F4C4A0" />
      <Ellipse cx="182" cy="168" rx="8" ry="5" fill="#F4C4A0" />

      {/* Plants left */}
      <Path d="M30 160 Q25 130 35 120 Q40 130 38 160Z" fill="#7BA89C" opacity={0.7} />
      <Path d="M22 160 Q15 140 28 128 Q30 138 27 160Z" fill="#8DB8AC" opacity={0.6} />
      <Circle cx="34" cy="118" r="8" fill="#6A9A8C" opacity={0.5} />

      {/* Plants right */}
      <Path d="M310 160 Q315 130 305 120 Q300 130 302 160Z" fill="#7BA89C" opacity={0.7} />
      <Path d="M318 160 Q325 140 312 128 Q310 138 313 160Z" fill="#8DB8AC" opacity={0.6} />
      <Circle cx="306" cy="118" r="8" fill="#6A9A8C" opacity={0.5} />

      {/* Dandelion top right */}
      <Line x1="295" y1="75" x2="295" y2="30" stroke={colors.primary} strokeWidth="1.2" />
      {[0, 36, 72, 108, 144, 180, 216, 252, 288, 324].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const len = 16;
        const x2 = 295 + Math.cos(rad) * len;
        const y2 = 30 + Math.sin(rad) * len;
        return (
          <G key={i}>
            <Line x1="295" y1="30" x2={x2} y2={y2} stroke={colors.primary} strokeWidth="0.7" opacity={0.55} />
            <Circle cx={x2} cy={y2} r="2" fill={colors.primary} opacity={0.45} />
          </G>
        );
      })}
      <Circle cx="295" cy="30" r="4" fill={colors.primary} opacity={0.8} />

      {/* Floating seeds */}
      {[{x:60,y:25},{x:80,y:45},{x:50,y:55},{x:260,y:20},{x:240,y:42}].map((s, i) => (
        <G key={i}>
          <Line x1={s.x} y1={s.y} x2={s.x+2} y2={s.y+12} stroke={colors.primary} strokeWidth="0.7" opacity={0.35} />
          <Circle cx={s.x+2} cy={s.y+12} r="1.8" fill={colors.primary} opacity={0.3} />
        </G>
      ))}
    </Svg>
  );
}

export default function WelcomeScreen() {
  const hasCompleted = useOnboardingStore((s) => s.hasCompletedOnboarding);
  return (
    <SafeAreaView style={styles.safe}>
      <AppHeader
        rightIcon={hasCompleted ? 'close-outline' : undefined}
        onRightPress={() => router.replace('/(tabs)')}
      />
      <View style={styles.container}>

        {/* Illustration */}
        <View style={styles.illustrationArea}>
          <WelcomeIllustration />
        </View>

        {/* Text */}
        <View style={styles.textArea}>
          <Text style={styles.title}>Welcome to{'\n'}SL Pregnancy</Text>
          <Text style={styles.subtitle}>
            A safe space for every step{'\n'}of your journey.
          </Text>
        </View>

        {/* CTA */}
        <View style={styles.ctaArea}>
          <PillButton
            label="Get Started"
            onPress={() => router.push('/onboarding/lounge')}
          />
        </View>

        {/* Dots */}
        <View style={styles.dotsArea}>
          <ProgressDots total={TOTAL_STEPS} current={0} />
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
  },
  illustrationArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  textArea: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: 'Raleway_700Bold',
    fontSize: 30,
    color: colors.coldViolet,
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: 0.2,
    marginBottom: spacing.md,
  },
  subtitle: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  ctaArea: {
    marginBottom: spacing.lg,
  },
  dotsArea: {
    alignItems: 'center',
  },
});
