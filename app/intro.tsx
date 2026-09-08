import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Svg, Circle, Path, Ellipse, Line, G, Rect } from 'react-native-svg';
import PillButton from '@/components/PillButton';
import ProgressDots from '@/components/ProgressDots';
import { colors } from '@/theme/colors';
import { spacing } from '@/theme/spacing';

const { width } = Dimensions.get('window');

// ─── Illustrations ────────────────────────────────────────────────────────────

function IllustrationWelcome() {
  const w = width - spacing.lg * 2;
  const h = 220;
  return (
    <Svg width={w} height={h} viewBox="0 0 340 220">
      <Rect x="0" y="0" width="340" height="160" fill={colors.azure} rx="16" />
      <Path d="M0 130 L60 70 L120 110 L180 55 L240 95 L300 60 L340 90 L340 160 L0 160Z" fill="#BACED9" />
      <Path d="M0 145 L80 90 L140 125 L200 80 L260 115 L320 85 L340 100 L340 160 L0 160Z" fill={colors.primary} opacity={0.45} />
      <Ellipse cx="170" cy="163" rx="160" ry="16" fill={colors.primary} opacity={0.15} />
      <Rect x="0" y="155" width="340" height="65" fill={colors.peachSoft} opacity={0.5} />
      <Ellipse cx="120" cy="175" rx="38" ry="4" fill={colors.primary} opacity={0.15} />
      <Ellipse cx="230" cy="182" rx="28" ry="3" fill={colors.primary} opacity={0.12} />
      <Ellipse cx="170" cy="185" rx="55" ry="10" fill={colors.sandLight} />
      <Ellipse cx="170" cy="183" rx="50" ry="8" fill={colors.peachSoft} opacity={0.8} />
      <Ellipse cx="170" cy="175" rx="38" ry="14" fill={colors.primary} opacity={0.4} />
      <Path d="M152 175 Q155 145 170 140 Q185 145 188 175Z" fill={colors.azure} />
      <Circle cx="170" cy="128" r="20" fill="#F4C4A0" />
      <Path d="M152 122 Q155 105 170 108 Q185 105 188 122 Q182 112 170 114 Q158 112 152 122Z" fill="#8B6355" />
      <Circle cx="170" cy="107" r="7" fill="#8B6355" />
      <Ellipse cx="172" cy="162" rx="22" ry="16" fill={colors.lavender} opacity={0.6} />
      <Path d="M152 155 Q145 165 148 172 Q155 168 158 162Z" fill={colors.lavender} opacity={0.7} />
      <Path d="M188 155 Q195 165 192 172 Q185 168 182 162Z" fill={colors.lavender} opacity={0.7} />
      <Ellipse cx="158" cy="168" rx="8" ry="5" fill="#F4C4A0" />
      <Ellipse cx="182" cy="168" rx="8" ry="5" fill="#F4C4A0" />
      <Path d="M30 160 Q25 130 35 120 Q40 130 38 160Z" fill={colors.success} opacity={0.6} />
      <Path d="M22 160 Q15 140 28 128 Q30 138 27 160Z" fill={colors.success} opacity={0.45} />
      <Path d="M310 160 Q315 130 305 120 Q300 130 302 160Z" fill={colors.success} opacity={0.6} />
      <Path d="M318 160 Q325 140 312 128 Q310 138 313 160Z" fill={colors.success} opacity={0.45} />
    </Svg>
  );
}

function IllustrationSophrology() {
  const w = width - spacing.lg * 2;
  const h = 220;
  return (
    <Svg width={w} height={h} viewBox="0 0 340 220">
      <Rect x="0" y="0" width="340" height="220" fill={colors.azure} rx="16" />
      <Circle cx="170" cy="110" r="100" fill="none" stroke={colors.primary} strokeWidth="1" opacity={0.1} />
      <Circle cx="170" cy="110" r="80" fill="none" stroke={colors.primary} strokeWidth="1" opacity={0.18} />
      <Circle cx="170" cy="110" r="60" fill="none" stroke={colors.primary} strokeWidth="1.2" opacity={0.28} />
      <Circle cx="170" cy="110" r="40" fill={colors.primary} opacity={0.12} />
      <Circle cx="170" cy="110" r="26" fill={colors.primary} opacity={0.2} />
      <Ellipse cx="170" cy="90" rx="9" ry="16" fill={colors.lavender} opacity={0.75} />
      <Ellipse cx="154" cy="98" rx="9" ry="16" fill={colors.lavender} opacity={0.65} transform="rotate(-30 154 98)" />
      <Ellipse cx="186" cy="98" rx="9" ry="16" fill={colors.lavender} opacity={0.65} transform="rotate(30 186 98)" />
      <Ellipse cx="147" cy="114" rx="9" ry="16" fill={colors.peachSoft} opacity={0.65} transform="rotate(-60 147 114)" />
      <Ellipse cx="193" cy="114" rx="9" ry="16" fill={colors.peachSoft} opacity={0.65} transform="rotate(60 193 114)" />
      <Ellipse cx="170" cy="130" rx="9" ry="16" fill={colors.lavender} opacity={0.55} transform="rotate(180 170 130)" />
      <Circle cx="170" cy="110" r="13" fill={colors.primary} opacity={0.9} />
      <Circle cx="170" cy="110" r="5" fill={colors.white} />
      {[{x:55,y:38},{x:285,y:52},{x:48,y:172},{x:292,y:178},{x:98,y:192},{x:252,y:28}].map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r="3.5" fill={colors.lavender} opacity={0.3 + i * 0.05} />
      ))}
      <Path d="M20 195 Q50 183 80 195 Q110 207 140 195 Q170 183 200 195 Q230 207 260 195 Q290 183 320 195" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity={0.25} />
    </Svg>
  );
}

function IllustrationStages() {
  const w = width - spacing.lg * 2;
  const h = 220;
  const scale = w / 340;
  return (
    <View style={{ width: w, height: h }}>
      <Svg width={w} height={h} viewBox="0 0 340 220" style={StyleSheet.absoluteFill}>
        <Rect x="0" y="0" width="340" height="220" fill={colors.lavender} opacity={0.25} rx="16" />
        <Rect x="0" y="0" width="340" height="220" fill={colors.sandLight} opacity={0.3} rx="16" />
        <Path d="M50 160 Q120 80 170 120 Q220 160 290 80" fill="none" stroke={colors.lavender} strokeWidth="3" strokeDasharray="6,4" />
        <Circle cx="50" cy="160" r="28" fill={colors.sandLight} />
        <Circle cx="50" cy="160" r="20" fill={colors.peachSoft} />
        <Path d="M44 158 Q44 154 48 154 Q50 154 50 156 Q50 154 52 154 Q56 154 56 158 Q56 162 50 166 Q44 162 44 158Z" fill={colors.accent} opacity={0.85} />
        <Circle cx="170" cy="120" r="32" fill={colors.azure} />
        <Circle cx="170" cy="120" r="23" fill={colors.primary} opacity={0.3} />
        <Ellipse cx="170" cy="124" rx="11" ry="14" fill={colors.primary} opacity={0.6} />
        <Circle cx="170" cy="107" r="8" fill="#F4C4A0" />
        <Circle cx="290" cy="80" r="28" fill={colors.lavender} opacity={0.5} />
        <Circle cx="290" cy="80" r="20" fill={colors.lavender} />
        <Circle cx="290" cy="68" r="7" fill="#F4C4A0" />
        <Path d="M280 78 Q283 68 290 68 Q297 68 300 78 Q297 90 290 92 Q283 90 280 78Z" fill={colors.lavender} opacity={0.5} />
        <Circle cx="290" cy="90" r="5" fill="#F4C4A0" />
        {[{x:95,y:122},{x:130,y:104},{x:210,y:135},{x:250,y:107}].map((d, i) => (
          <Circle key={i} cx={d.x} cy={d.y} r="4" fill={colors.primary} opacity={0.3} />
        ))}
      </Svg>
      <Text style={[stageLabel, { left: 50 * scale - 18, top: 176 * scale }]}>TTC</Text>
      <Text style={[stageLabel, { left: 170 * scale - 32, top: 158 * scale }]}>Pregnancy</Text>
      <Text style={[stageLabel, { left: 290 * scale - 36, top: 112 * scale }]}>Postpartum</Text>
    </View>
  );
}

function IllustrationCommunity() {
  const w = width - spacing.lg * 2;
  const h = 220;
  return (
    <Svg width={w} height={h} viewBox="0 0 340 220">
      <Rect x="0" y="0" width="340" height="220" fill={colors.sandLight} opacity={0.6} rx="16" />
      <Circle cx="170" cy="185" r="120" fill={colors.peachSoft} opacity={0.45} />
      <Circle cx="170" cy="185" r="85" fill={colors.accent} opacity={0.15} />
      <Line x1="0" y1="175" x2="340" y2="175" stroke={colors.peachSoft} strokeWidth="1.5" />
      <Circle cx="100" cy="120" r="14" fill="#F4C4A0" />
      <Path d="M88 134 Q92 118 100 118 Q108 118 112 134 Q108 158 100 160 Q92 158 88 134Z" fill={colors.lavender} />
      <Circle cx="170" cy="108" r="18" fill="#F4C4A0" />
      <Path d="M154 126 Q158 108 170 108 Q182 108 186 126 Q182 156 170 160 Q158 156 154 126Z" fill={colors.primary} opacity={0.55} />
      <Ellipse cx="170" cy="145" rx="16" ry="12" fill={colors.azure} opacity={0.9} />
      <Circle cx="240" cy="120" r="14" fill="#F4C4A0" />
      <Path d="M228 134 Q232 118 240 118 Q248 118 252 134 Q248 158 240 160 Q232 158 228 134Z" fill={colors.peachSoft} />
      <Path d="M112 140 Q135 135 154 145" fill="none" stroke={colors.azure} strokeWidth="4" strokeLinecap="round" />
      <Path d="M186 145 Q205 135 228 140" fill="none" stroke={colors.azure} strokeWidth="4" strokeLinecap="round" />
      {[{x:60,y:55},{x:280,y:45},{x:160,y:35},{x:310,y:95},{x:30,y:90}].map((s, i) => (
        <G key={i}>
          <Line x1={s.x - 5} y1={s.y} x2={s.x + 5} y2={s.y} stroke={colors.accent} strokeWidth="1.5" opacity={0.6} />
          <Line x1={s.x} y1={s.y - 5} x2={s.x} y2={s.y + 5} stroke={colors.accent} strokeWidth="1.5" opacity={0.6} />
        </G>
      ))}
    </Svg>
  );
}

// ─── Slide data ───────────────────────────────────────────────────────────────

type Slide = {
  id: string;
  gradient: [string, string, ...string[]];
  Illustration: React.ComponentType;
  title: string;
  body: string;
};

const SLIDES: Slide[] = [
  {
    id: 'welcome',
    gradient: ['#FFF8F4', '#F5F0FF', '#FFE6D5'],
    Illustration: IllustrationWelcome,
    title: 'Welcome to\nSL Pregnancy',
    body: 'A safe space to breathe, prepare, and feel supported through every stage of your perinatal journey.',
  },
  {
    id: 'sophrology',
    gradient: ['#EEF6F9', '#DBE8F0', '#F0F6F9'],
    Illustration: IllustrationSophrology,
    title: 'Discover Sophrology',
    body: 'A science-based mind-body practice combining breathing, deep relaxation, and positive visualization — to calm your mind and strengthen your body.',
  },
  {
    id: 'stages',
    gradient: ['#F5F0FF', '#EEF6F9', '#FFF8F4'],
    Illustration: IllustrationStages,
    title: 'Programs for Every Stage',
    body: 'From trying to conceive through the postpartum period — expert-guided sessions adapted to exactly where you are.',
  },
  {
    id: 'community',
    gradient: ['#FFF8F4', '#FFE6D5', '#F5F0FF'],
    Illustration: IllustrationCommunity,
    title: "You're Not Alone",
    body: 'Join thousands of women guided by certified sophrologists through one of life\'s most transformative experiences.',
  },
];

// ─── Screen ───────────────────────────────────────────────────────────────────

function finishIntro() {
  router.replace('/auth');
}

export default function IntroScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const slide = SLIDES[activeIndex];
  const isLast = activeIndex === SLIDES.length - 1;

  const goNext = () => {
    if (isLast) { finishIntro(); return; }
    Animated.timing(fadeAnim, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => {
      setActiveIndex((i) => i + 1);
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    });
  };

  const skip = () => finishIntro();

  return (
    <View style={{ flex: 1 }}>
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
        <LinearGradient colors={slide.gradient} locations={[0, 0.5, 1]} style={StyleSheet.absoluteFill} />
      </Animated.View>

      <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
        {!isLast && (
          <TouchableOpacity style={styles.skipBtn} onPress={skip} activeOpacity={0.7}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}

        <Animated.View style={[styles.slideWrapper, { opacity: fadeAnim }]}>
          <View style={styles.slide}>
            <View style={styles.illustrationWrap}>
              <slide.Illustration />
            </View>
            <View style={styles.textWrap}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.body}>{slide.body}</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.footer}>
          <ProgressDots total={SLIDES.length} current={activeIndex} />
          <View style={styles.btnWrap}>
            <PillButton label={isLast ? 'Get Started' : 'Next'} onPress={goNext} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const stageLabel: object = {
  position: 'absolute' as const,
  fontFamily: 'Montserrat_400Regular',
  fontSize: 10,
  color: colors.coldViolet,
  textAlign: 'center' as const,
  width: 64,
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: 'transparent' },
  skipBtn: {
    position: 'absolute',
    top: 56,
    right: spacing.lg,
    zIndex: 10,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
  skipText: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  slideWrapper: { flex: 1 },
  slide: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  textWrap: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Raleway_700Bold',
    fontSize: 28,
    color: colors.coldViolet,
    textAlign: 'center',
    lineHeight: 36,
    letterSpacing: 0.2,
    marginBottom: spacing.md,
  },
  body: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: spacing.sm,
  },
  footer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    paddingTop: spacing.md,
    gap: spacing.md,
    backgroundColor: 'transparent',
  },
  btnWrap: {},
});
