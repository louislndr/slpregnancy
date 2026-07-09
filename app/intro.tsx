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
import { Svg, Circle, Path, Ellipse, Line, G, Rect, Text as SvgText } from 'react-native-svg';
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
      <Rect x="0" y="0" width="340" height="160" fill="#EEF6F9" rx="16" />
      <Path d="M0 130 L60 70 L120 110 L180 55 L240 95 L300 60 L340 90 L340 160 L0 160Z" fill="#C8DDE6" />
      <Path d="M0 145 L80 90 L140 125 L200 80 L260 115 L320 85 L340 100 L340 160 L0 160Z" fill="#A8C8D4" />
      <Ellipse cx="170" cy="165" rx="160" ry="18" fill="#B8D8E4" opacity={0.5} />
      <Rect x="0" y="155" width="340" height="65" fill="#D4EBF2" />
      <Ellipse cx="120" cy="175" rx="40" ry="4" fill="#B8D4E0" opacity={0.4} />
      <Ellipse cx="230" cy="182" rx="30" ry="3" fill="#B8D4E0" opacity={0.3} />
      <Ellipse cx="170" cy="185" rx="55" ry="10" fill={colors.sandLight} />
      <Ellipse cx="170" cy="183" rx="50" ry="8" fill={colors.peachSoft} opacity={0.7} />
      <Ellipse cx="170" cy="175" rx="38" ry="14" fill="#A8C4DA" />
      <Path d="M152 175 Q155 145 170 140 Q185 145 188 175Z" fill="#C4DAEC" />
      <Circle cx="170" cy="128" r="20" fill="#F4C4A0" />
      <Path d="M152 122 Q155 105 170 108 Q185 105 188 122 Q182 112 170 114 Q158 112 152 122Z" fill="#8B6355" />
      <Circle cx="170" cy="107" r="7" fill="#8B6355" />
      <Ellipse cx="172" cy="162" rx="22" ry="16" fill="#D4E8F4" opacity={0.9} />
      <Path d="M152 155 Q145 165 148 172 Q155 168 158 162Z" fill="#C4DAEC" />
      <Path d="M188 155 Q195 165 192 172 Q185 168 182 162Z" fill="#C4DAEC" />
      <Ellipse cx="158" cy="168" rx="8" ry="5" fill="#F4C4A0" />
      <Ellipse cx="182" cy="168" rx="8" ry="5" fill="#F4C4A0" />
      <Path d="M30 160 Q25 130 35 120 Q40 130 38 160Z" fill="#7BA89C" opacity={0.7} />
      <Path d="M22 160 Q15 140 28 128 Q30 138 27 160Z" fill="#8DB8AC" opacity={0.6} />
      <Path d="M310 160 Q315 130 305 120 Q300 130 302 160Z" fill="#7BA89C" opacity={0.7} />
      <Path d="M318 160 Q325 140 312 128 Q310 138 313 160Z" fill="#8DB8AC" opacity={0.6} />
    </Svg>
  );
}

function IllustrationSophrology() {
  const w = width - spacing.lg * 2;
  const h = 220;
  return (
    <Svg width={w} height={h} viewBox="0 0 340 220">
      <Rect x="0" y="0" width="340" height="220" fill="#EEF6F9" rx="16" />
      {/* Concentric breath rings */}
      <Circle cx="170" cy="110" r="95" fill="none" stroke={colors.primary} strokeWidth="1" opacity={0.15} />
      <Circle cx="170" cy="110" r="75" fill="none" stroke={colors.primary} strokeWidth="1.2" opacity={0.25} />
      <Circle cx="170" cy="110" r="55" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity={0.35} />
      <Circle cx="170" cy="110" r="36" fill="#DBE8F0" opacity={0.7} />
      <Circle cx="170" cy="110" r="24" fill={colors.azure} />
      {/* Lotus petals */}
      <Ellipse cx="170" cy="92" rx="8" ry="14" fill={colors.lavender} opacity={0.7} />
      <Ellipse cx="155" cy="99" rx="8" ry="14" fill={colors.lavender} opacity={0.6} transform="rotate(-30 155 99)" />
      <Ellipse cx="185" cy="99" rx="8" ry="14" fill={colors.lavender} opacity={0.6} transform="rotate(30 185 99)" />
      <Ellipse cx="148" cy="114" rx="8" ry="14" fill={colors.peachSoft} opacity={0.6} transform="rotate(-60 148 114)" />
      <Ellipse cx="192" cy="114" rx="8" ry="14" fill={colors.peachSoft} opacity={0.6} transform="rotate(60 192 114)" />
      <Ellipse cx="170" cy="128" rx="8" ry="14" fill={colors.lavender} opacity={0.5} transform="rotate(180 170 128)" />
      {/* Center circle */}
      <Circle cx="170" cy="110" r="12" fill={colors.primary} opacity={0.8} />
      <Circle cx="170" cy="110" r="5" fill={colors.white} />
      {/* Floating particles */}
      {[{x:60,y:40},{x:280,y:55},{x:50,y:170},{x:295,y:175},{x:100,y:190},{x:255,y:30}].map((p, i) => (
        <Circle key={i} cx={p.x} cy={p.y} r="3" fill={colors.primary} opacity={0.2 + i * 0.05} />
      ))}
      {/* Breath wave lines */}
      <Path d="M20 190 Q50 178 80 190 Q110 202 140 190 Q170 178 200 190 Q230 202 260 190 Q290 178 320 190" fill="none" stroke={colors.primary} strokeWidth="1.5" opacity={0.3} />
    </Svg>
  );
}

function IllustrationStages() {
  const w = width - spacing.lg * 2;
  const h = 220;
  return (
    <Svg width={w} height={h} viewBox="0 0 340 220">
      <Rect x="0" y="0" width="340" height="220" fill="#F5F0FF" rx="16" />
      {/* Curved path connecting stages */}
      <Path d="M50 160 Q120 80 170 120 Q220 160 290 80" fill="none" stroke={colors.lavender} strokeWidth="3" strokeDasharray="6,4" />
      {/* Stage 1 — TTC */}
      <Circle cx="50" cy="160" r="28" fill={colors.sandLight} />
      <Circle cx="50" cy="160" r="20" fill={colors.peachSoft} />
      {/* small heart */}
      <Path d="M44 158 Q44 154 48 154 Q50 154 50 156 Q50 154 52 154 Q56 154 56 158 Q56 162 50 166 Q44 162 44 158Z" fill={colors.accent} opacity={0.8} />
      <SvgText x="50" y="200" textAnchor="middle" fontSize="10" fill={colors.coldViolet} fontFamily="Montserrat-Regular">TTC</SvgText>
      {/* Stage 2 — Pregnant */}
      <Circle cx="170" cy="120" r="32" fill={colors.azure} />
      <Circle cx="170" cy="120" r="23" fill="#C8DDE6" />
      {/* bump silhouette */}
      <Ellipse cx="170" cy="124" rx="11" ry="14" fill={colors.primary} opacity={0.6} />
      <Circle cx="170" cy="107" r="8" fill="#F4C4A0" />
      <SvgText x="170" y="166" textAnchor="middle" fontSize="10" fill={colors.coldViolet} fontFamily="Montserrat-Regular">Pregnancy</SvgText>
      {/* Stage 3 — Postpartum */}
      <Circle cx="290" cy="80" r="28" fill={colors.lavender} opacity={0.5} />
      <Circle cx="290" cy="80" r="20" fill={colors.lavender} />
      {/* mother + baby */}
      <Circle cx="290" cy="68" r="7" fill="#F4C4A0" />
      <Path d="M280 78 Q283 68 290 68 Q297 68 300 78 Q297 90 290 92 Q283 90 280 78Z" fill="#BEB5DA" />
      <Circle cx="290" cy="90" r="5" fill="#F4C4A0" />
      <SvgText x="290" y="120" textAnchor="middle" fontSize="10" fill={colors.coldViolet} fontFamily="Montserrat-Regular">Postpartum</SvgText>
      {/* decorative dots along path */}
      {[{x:95,y:122},{x:130,y:104},{x:210,y:135},{x:250,y:107}].map((d, i) => (
        <Circle key={i} cx={d.x} cy={d.y} r="4" fill={colors.primary} opacity={0.3} />
      ))}
    </Svg>
  );
}

function IllustrationCommunity() {
  const w = width - spacing.lg * 2;
  const h = 220;
  return (
    <Svg width={w} height={h} viewBox="0 0 340 220">
      <Rect x="0" y="0" width="340" height="220" fill="#FFF8F4" rx="16" />
      {/* Sunrise glow */}
      <Circle cx="170" cy="175" r="110" fill={colors.sandLight} opacity={0.5} />
      <Circle cx="170" cy="175" r="80" fill={colors.peachSoft} opacity={0.4} />
      {/* Horizon line */}
      <Line x1="0" y1="175" x2="340" y2="175" stroke={colors.peachSoft} strokeWidth="1.5" />
      {/* Left figure */}
      <Circle cx="100" cy="120" r="14" fill="#F4C4A0" />
      <Path d="M88 134 Q92 118 100 118 Q108 118 112 134 Q108 158 100 160 Q92 158 88 134Z" fill="#BEB5DA" />
      {/* Middle figure — larger, central */}
      <Circle cx="170" cy="108" r="18" fill="#F4C4A0" />
      <Path d="M154 126 Q158 108 170 108 Q182 108 186 126 Q182 156 170 160 Q158 156 154 126Z" fill="#A8C4DA" />
      {/* Bump */}
      <Ellipse cx="170" cy="145" rx="16" ry="12" fill="#C4DAEC" opacity={0.8} />
      {/* Right figure */}
      <Circle cx="240" cy="120" r="14" fill="#F4C4A0" />
      <Path d="M228 134 Q232 118 240 118 Q248 118 252 134 Q248 158 240 160 Q232 158 228 134Z" fill={colors.lavender} />
      {/* Arms reaching to middle */}
      <Path d="M112 140 Q135 135 154 145" fill="none" stroke="#C4DAEC" strokeWidth="4" strokeLinecap="round" />
      <Path d="M186 145 Q205 135 228 140" fill="none" stroke="#C4DAEC" strokeWidth="4" strokeLinecap="round" />
      {/* Stars / sparkles */}
      {[{x:60,y:55},{x:280,y:45},{x:160,y:35},{x:310,y:95},{x:30,y:90}].map((s, i) => (
        <G key={i}>
          <Line x1={s.x - 5} y1={s.y} x2={s.x + 5} y2={s.y} stroke={colors.accent} strokeWidth="1.5" opacity={0.5} />
          <Line x1={s.x} y1={s.y - 5} x2={s.x} y2={s.y + 5} stroke={colors.accent} strokeWidth="1.5" opacity={0.5} />
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
    <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
      {!isLast && (
        <TouchableOpacity style={styles.skipBtn} onPress={skip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <Animated.View style={[styles.slideWrapper, { opacity: fadeAnim }]}>
        <LinearGradient colors={slide.gradient} locations={[0, 0.5, 1]} style={styles.slide}>
          <View style={styles.illustrationWrap}>
            <slide.Illustration />
          </View>
          <View style={styles.textWrap}>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.body}>{slide.body}</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <View style={styles.footer}>
        <ProgressDots total={SLIDES.length} current={activeIndex} />
        <View style={styles.btnWrap}>
          <PillButton label={isLast ? 'Get Started' : 'Next'} onPress={goNext} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
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
    paddingBottom: spacing.lg,
    paddingTop: spacing.md,
    gap: spacing.md,
    backgroundColor: colors.white,
  },
  btnWrap: {},
});
