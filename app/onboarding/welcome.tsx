import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, Path, Ellipse, Line } from 'react-native-svg';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import { colors } from '@/theme/colors';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

const { width, height } = Dimensions.get('window');

const TOTAL_STEPS = 9;

// Inline dandelion + woman illustration using SVG
function WelcomeIllustration() {
  return (
    <Svg width={width * 0.8} height={220} viewBox="0 0 320 220">
      {/* Soft horizon / ground */}
      <Ellipse cx="160" cy="200" rx="140" ry="18" fill={colors.sandLight} />

      {/* Woman silhouette — seated, calm */}
      {/* Body */}
      <Ellipse cx="160" cy="170" rx="38" ry="26" fill={colors.lavender} />
      {/* Head */}
      <Circle cx="160" cy="130" r="22" fill={colors.peachSoft} />
      {/* Hair */}
      <Path
        d="M140 122 Q148 104 160 108 Q172 104 180 122 Q174 114 160 116 Q146 114 140 122Z"
        fill={colors.coldViolet}
      />
      {/* Bump / belly */}
      <Ellipse cx="163" cy="176" rx="28" ry="20" fill={colors.peachSoft} />
      {/* Arms crossed */}
      <Path
        d="M135 165 Q148 172 163 176 Q148 180 135 175Z"
        fill={colors.lavender}
        opacity={0.7}
      />

      {/* Dandelion stem */}
      <Line x1="260" y1="200" x2="260" y2="100" stroke={colors.primary} strokeWidth="1.5" />
      {/* Dandelion seeds radiating */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const len = 22;
        const x2 = 260 + Math.cos(rad) * len;
        const y2 = 100 + Math.sin(rad) * len;
        return (
          <React.Fragment key={i}>
            <Line
              x1="260"
              y1="100"
              x2={x2}
              y2={y2}
              stroke={colors.primary}
              strokeWidth="0.8"
              opacity={0.6}
            />
            <Circle cx={x2} cy={y2} r="2.5" fill={colors.primary} opacity={0.5} />
          </React.Fragment>
        );
      })}
      {/* Center circle */}
      <Circle cx="260" cy="100" r="5" fill={colors.primary} opacity={0.8} />

      {/* Floating seed 1 */}
      <Line x1="80" y1="60" x2="84" y2="80" stroke={colors.primary} strokeWidth="0.8" opacity={0.4} />
      <Circle cx="84" cy="80" r="2" fill={colors.primary} opacity={0.3} />

      {/* Floating seed 2 */}
      <Line x1="100" y1="40" x2="105" y2="58" stroke={colors.primary} strokeWidth="0.8" opacity={0.4} />
      <Circle cx="105" cy="58" r="2" fill={colors.primary} opacity={0.3} />

      {/* Floating seed 3 */}
      <Line x1="220" y1="50" x2="217" y2="70" stroke={colors.primary} strokeWidth="0.8" opacity={0.35} />
      <Circle cx="217" cy="70" r="2" fill={colors.primary} opacity={0.3} />

      {/* Soft ground flowers */}
      <Circle cx="115" cy="195" r="4" fill={colors.accent} opacity={0.5} />
      <Circle cx="205" cy="197" r="3" fill={colors.lavender} opacity={0.6} />
      <Circle cx="135" cy="198" r="2.5" fill={colors.peachSoft} opacity={0.7} />
    </Svg>
  );
}

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={[colors.azure, '#EEF4F8', colors.sandLight]}
      locations={[0, 0.5, 1]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.container}>

          {/* Logo / wordmark */}
          <View style={styles.logoArea}>
            <Text style={styles.wordmark}>SL Pregnancy</Text>
            <Text style={styles.byLine}>by SophroLounge</Text>
          </View>

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
              onPress={() => router.push('/onboarding/support-needs')}
            />
          </View>

          {/* Progress dots */}
          <View style={styles.dotsArea}>
            <ProgressDots total={TOTAL_STEPS} current={0} />
          </View>

        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
  },

  logoArea: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  wordmark: {
    fontFamily: 'Raleway_700Bold',
    fontSize: 20,
    color: colors.primary,
    letterSpacing: 1,
  },
  byLine: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 12,
    color: colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: 2,
  },

  illustrationArea: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    marginVertical: spacing.md,
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
    letterSpacing: 0.3,
    marginBottom: spacing.md,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },

  ctaArea: {
    marginBottom: spacing.lg,
  },

  dotsArea: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
});
