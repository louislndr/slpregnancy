import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, Dimensions, Animated, Image,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Path, Ellipse, Line, G, Rect } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';

const { width } = Dimensions.get('window');

const PARTS = [
  { label: 'Welcome', duration: '1 min', done: true },
  { label: 'Breathing', duration: '2 min', done: true },
  { label: 'Body Awareness', duration: '3 min', done: false },
  { label: 'Visualization', duration: '3 min', done: false },
  { label: 'Closing', duration: '1 min', done: false },
];

// Breathing animation circle
function BreathingCircle({ phase }: { phase: 'inhale' | 'exhale' }) {
  const anim = useRef(new Animated.Value(0)).current;
  const size = 160;
  const r = 68;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: phase === 'inhale' ? 1 : 0,
      duration: phase === 'inhale' ? 4000 : 6000,
      useNativeDriver: false,
    }).start();
  }, [phase]);

  const strokeDash = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [`0 ${circ}`, `${circ} 0`],
  });

  return (
    <View style={breathStyles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={colors.azure} strokeWidth="6" fill="none"
        />
        {/* Progress arc — static approximation for non-animated SVG */}
        <Circle
          cx={size / 2} cy={size / 2} r={r}
          stroke={colors.primary} strokeWidth="6" fill="none"
          strokeDasharray={`${phase === 'inhale' ? circ * 0.7 : circ * 0.3} ${circ}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        {/* Inner soft circle */}
        <Circle
          cx={size / 2} cy={size / 2} r={r - 16}
          fill={colors.azure} opacity={0.3}
        />
      </Svg>
      <View style={breathStyles.labelWrap}>
        <Text style={breathStyles.phase}>
          {phase === 'inhale' ? 'Inhale' : 'Exhale'}
        </Text>
        <Text style={breathStyles.seconds}>
          {phase === 'inhale' ? '4 sec' : '6 sec'}
        </Text>
      </View>
    </View>
  );
}

const breathStyles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
  labelWrap: {
    position: 'absolute', alignItems: 'center',
  },
  phase: {
    fontFamily: 'PlayfairDisplay_400Regular',
    fontSize: 20, color: colors.coldViolet,
  },
  seconds: {
    fontFamily: 'Montserrat_400Regular',
    fontSize: 13, color: colors.textMuted, marginTop: 2,
  },
});

// Scene illustration for visual mode
function SceneIllustration() {
  const w = width;
  const h = 260;
  return (
    <Svg width={w} height={h} viewBox={`0 0 ${width} 260`}>
      {/* Sky */}
      <Rect x="0" y="0" width={width} height="260" fill="#DDEEF5" />
      {/* Mountains far */}
      <Path d={`M0 180 L${width*0.2} 100 L${width*0.4} 150 L${width*0.55} 80 L${width*0.72} 130 L${width*0.88} 75 L${width} 110 L${width} 260 L0 260Z`}
        fill="#B8D0DC" />
      {/* Mountains near */}
      <Path d={`M0 200 L${width*0.15} 140 L${width*0.3} 175 L${width*0.5} 110 L${width*0.65} 155 L${width*0.82} 120 L${width} 145 L${width} 260 L0 260Z`}
        fill="#9DC0CF" />
      {/* Water */}
      <Rect x="0" y="215" width={width} height="45" fill="#B8DCE8" />
      <Ellipse cx={width*0.3} cy="230" rx="60" ry="5" fill="#A0CCE0" opacity={0.5} />
      <Ellipse cx={width*0.7} cy="238" rx="45" ry="4" fill="#A0CCE0" opacity={0.4} />

      {/* Rocks */}
      <Ellipse cx={width*0.42} cy="218" rx="35" ry="10" fill="#8FA8B0" />
      <Ellipse cx={width*0.5} cy="215" rx="28" ry="8" fill="#9DB5BE" />

      {/* Woman sitting on rock */}
      {/* Mat */}
      <Ellipse cx={width*0.5} cy="222" rx="32" ry="7" fill={colors.sandLight} opacity={0.8} />
      {/* Dress/skirt */}
      <Ellipse cx={width*0.5} cy="212" rx="28" ry="10" fill="#A8C4DA" />
      {/* Torso */}
      <Path d={`M${width*0.5-13} 210 Q${width*0.5-10} 185 ${width*0.5} 182 Q${width*0.5+10} 185 ${width*0.5+13} 210Z`}
        fill="#C4DAEC" />
      {/* Baby bump */}
      <Ellipse cx={width*0.5+2} cy="200" rx="16" ry="12" fill="#D4E8F4" opacity={0.9} />
      {/* Arms/hands on belly */}
      <Path d={`M${width*0.5-13} 198 Q${width*0.5-20} 205 ${width*0.5-16} 210Z`} fill="#C4DAEC" />
      <Path d={`M${width*0.5+13} 198 Q${width*0.5+20} 205 ${width*0.5+16} 210Z`} fill="#C4DAEC" />
      <Ellipse cx={width*0.5-14} cy="205" rx="7" ry="4" fill="#F4C4A0" />
      <Ellipse cx={width*0.5+14} cy="205" rx="7" ry="4" fill="#F4C4A0" />
      {/* Head */}
      <Circle cx={width*0.5} cy="176" r="16" fill="#F4C4A0" />
      {/* Hair */}
      <Path d={`M${width*0.5-14} 172 Q${width*0.5-11} 160 ${width*0.5} 163 Q${width*0.5+11} 160 ${width*0.5+14} 172 Q${width*0.5+8} 165 ${width*0.5} 166 Q${width*0.5-8} 165 ${width*0.5-14} 172Z`}
        fill="#8B6355" />
      <Circle cx={width*0.5} cy="162" r="6" fill="#8B6355" />

      {/* Plants left */}
      <Path d={`M${width*0.12} 215 Q${width*0.08} 185 ${width*0.14} 170 Q${width*0.18} 183 ${width*0.16} 215Z`} fill="#7BA89C" opacity={0.7} />
      <Circle cx={width*0.14} cy="168" r="7" fill="#6A9A8C" opacity={0.6} />
      {/* Plants right */}
      <Path d={`M${width*0.88} 215 Q${width*0.92} 185 ${width*0.86} 170 Q${width*0.82} 183 ${width*0.84} 215Z`} fill="#7BA89C" opacity={0.7} />
      <Circle cx={width*0.86} cy="168" r="7" fill="#6A9A8C" opacity={0.6} />

      {/* Dandelion */}
      <Line x1={width*0.85} y1="145" x2={width*0.85} y2="95" stroke={colors.primary} strokeWidth="1" />
      {[0,40,80,120,160,200,240,280,320].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const len = 14;
        const x2 = width*0.85 + Math.cos(rad) * len;
        const y2 = 95 + Math.sin(rad) * len;
        return (
          <G key={i}>
            <Line x1={width*0.85} y1="95" x2={x2} y2={y2} stroke={colors.primary} strokeWidth="0.7" opacity={0.5} />
            <Circle cx={x2} cy={y2} r="1.8" fill={colors.primary} opacity={0.45} />
          </G>
        );
      })}
      <Circle cx={width*0.85} cy="95" r="4" fill={colors.primary} opacity={0.8} />

      {/* Gradient overlay at bottom */}
      <Path d={`M0 200 L${width} 200 L${width} 260 L0 260Z`} fill="white" opacity={0.15} />
    </Svg>
  );
}

export default function SessionPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState<'audio' | 'visual'>('audio');
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale'>('inhale');

  const title = 'Safe In This Moment';
  const isVisual = mode === 'visual';

  useEffect(() => {
    if (!playing || !isVisual) return;
    const cycle = () => {
      setBreathPhase('inhale');
      const t1 = setTimeout(() => setBreathPhase('exhale'), 4000);
      const t2 = setTimeout(cycle, 10000);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    };
    const cleanup = cycle();
    return cleanup;
  }, [playing, isVisual]);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.coldViolet} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image source={require('@/assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="heart-outline" size={22} color={colors.coldViolet} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Ionicons name="ellipsis-vertical" size={22} color={colors.coldViolet} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mode toggle */}
      <View style={styles.modeToggle}>
        <TouchableOpacity
          style={[styles.modeBtn, !isVisual && styles.modeBtnActive]}
          onPress={() => setMode('audio')}
        >
          <Text style={[styles.modeBtnText, !isVisual && styles.modeBtnTextActive]}>Audio</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, isVisual && styles.modeBtnActive]}
          onPress={() => setMode('visual')}
        >
          <Text style={[styles.modeBtnText, isVisual && styles.modeBtnTextActive]}>Audio + Visual</Text>
        </TouchableOpacity>
      </View>

      {isVisual ? (
        /* ── VISUAL MODE ── */
        <View style={styles.visualContainer}>
          {/* Full-width scene */}
          <View style={styles.sceneWrap}>
            <SceneIllustration />
            <View style={styles.sceneTitleWrap}>
              <Text style={styles.sceneTitleText}>Belly Breathing</Text>
            </View>
          </View>

          {/* Instruction */}
          <Text style={styles.handInstruction}>
            Place one hand on your heart{'\n'}and one hand on your belly.
          </Text>

          {/* Breathing circle */}
          <View style={styles.breathRow}>
            <TouchableOpacity style={styles.handBtn}>
              <Ionicons name="hand-left-outline" size={28} color={colors.primary} />
              <Text style={styles.handBtnText}>Heart</Text>
            </TouchableOpacity>
            <BreathingCircle phase={breathPhase} />
            <TouchableOpacity style={styles.handBtn}>
              <Ionicons name="hand-right-outline" size={28} color={colors.primary} />
              <Text style={styles.handBtnText}>Belly</Text>
            </TouchableOpacity>
          </View>

          {/* Dot pager */}
          <View style={styles.dotPager}>
            {[0,1,2].map(i => (
              <View key={i} style={[styles.pagerDot, i===1 && styles.pagerDotActive]} />
            ))}
          </View>

          {/* Transport */}
          <View style={styles.transportSmall}>
            <TouchableOpacity style={styles.transportBtn}>
              <Text style={styles.skipText}>-15</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playBtnSmall}
              onPress={() => setPlaying(p => !p)}
            >
              <Ionicons name={playing ? 'pause' : 'play'} size={24} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.transportBtn}>
              <Text style={styles.skipText}>+15</Text>
            </TouchableOpacity>
          </View>

          {/* Pause */}
          <View style={styles.visualBottom}>
            <TouchableOpacity style={styles.pauseBtn} onPress={() => setPlaying(false)}>
              <Text style={styles.pauseBtnText}>Pause Session</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* ── AUDIO MODE ── */
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.audioContent}>
          {/* Title */}
          <View style={styles.titleRow}>
            <View style={styles.sessionMetaRow}>
              <Ionicons name="leaf-outline" size={13} color={colors.primary} />
              <Text style={styles.metaText}>2 · Prepare</Text>
            </View>
            <View style={styles.audioBadge}>
              <Text style={styles.audioBadgeText}>◉ Audio + Visual</Text>
            </View>
          </View>
          <Text style={styles.sessionTitle}>{title}</Text>

          {/* Scrub bar */}
          <View style={styles.scrubArea}>
            <Text style={styles.timeText}>03:26</Text>
            <View style={styles.scrubTrack}>
              <View style={[styles.scrubFill, { width: '35%' }]} />
              <View style={styles.scrubThumb} />
            </View>
            <Text style={styles.timeText}>-07:25</Text>
          </View>

          {/* Intention */}
          <View style={styles.intentionCard}>
            <Text style={styles.intentionLabel}>INTENTION</Text>
            <Text style={styles.intentionText}>
              "Je choisis de me reconnecter à la sécurité de cet instant."
            </Text>
          </View>

          {/* Transport */}
          <View style={styles.transport}>
            <TouchableOpacity style={styles.transportBtn}>
              <Ionicons name="play-skip-back" size={20} color={colors.coldViolet} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.transportBtn}>
              <Text style={styles.skipText}>-15</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playBtn}
              onPress={() => setPlaying(p => !p)}
              activeOpacity={0.85}
            >
              <Ionicons name={playing ? 'pause' : 'play'} size={30} color={colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.transportBtn}>
              <Text style={styles.skipText}>+15</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.transportBtn}>
              <Ionicons name="play-skip-forward" size={20} color={colors.coldViolet} />
            </TouchableOpacity>
          </View>

          {/* Session Parts */}
          <Text style={styles.partsTitle}>Session Parts</Text>
          <View style={styles.partsList}>
            {PARTS.map((part, i) => (
              <View key={i} style={styles.partRow}>
                <View style={[styles.partDot, part.done && styles.partDotDone]} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.partLabel, part.done && styles.partLabelDone]}>{part.label}</Text>
                  <Text style={styles.partDuration}>{part.duration}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Self-care tip */}
          <View style={styles.tipCard}>
            <Text style={styles.tipLabel}>SELF-CARE TIP</Text>
            <Text style={styles.tipText}>
              Place one hand on your heart and one on your belly. Feel the warmth between your hands and your body.
            </Text>
          </View>

          {/* Bottom row */}
          <View style={styles.bottomRow}>
            <TouchableOpacity style={styles.bottomAction}>
              <Ionicons name="download-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.bottomActionText}>Audio</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.pauseBtn}>
              <Text style={styles.pauseBtnText}>Pause Session</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.bottomAction}>
              <Ionicons name="bookmark-outline" size={20} color={colors.textSecondary} />
              <Text style={styles.bottomActionText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: spacing.xl }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },

  // Header
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerLogo: { width: 130, height: 38 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },

  // Mode toggle
  modeToggle: { flexDirection: 'row', margin: spacing.md, backgroundColor: colors.azure, borderRadius: 9999, padding: 3 },
  modeBtn: { flex: 1, paddingVertical: 8, borderRadius: 9999, alignItems: 'center' },
  modeBtnActive: { backgroundColor: colors.white },
  modeBtnText: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.textMuted },
  modeBtnTextActive: { color: colors.primary, fontFamily: 'Montserrat_600SemiBold' },

  // Audio mode
  audioContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sessionMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.primary },
  audioBadge: { backgroundColor: colors.azure, borderRadius: 9999, paddingVertical: 4, paddingHorizontal: 10 },
  audioBadgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.primary },
  sessionTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 26, color: colors.coldViolet, marginBottom: spacing.md, lineHeight: 34 },
  scrubArea: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  timeText: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted, minWidth: 40 },
  scrubTrack: { flex: 1, height: 4, backgroundColor: colors.azure, borderRadius: 2, flexDirection: 'row', alignItems: 'center' },
  scrubFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  scrubThumb: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, marginLeft: -6 },
  intentionCard: { backgroundColor: colors.sandLight, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  intentionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: colors.textMuted, letterSpacing: 1.5, marginBottom: spacing.sm },
  intentionText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 15, color: colors.coldViolet, lineHeight: 24 },
  transport: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, marginBottom: spacing.xl },
  transportBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  skipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.coldViolet },
  playBtn: { width: 68, height: 68, borderRadius: 34, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', ...shadow.button },
  partsTitle: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.coldViolet, marginBottom: spacing.md },
  partsList: { gap: 14, marginBottom: spacing.lg },
  partRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  partDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.lavender, backgroundColor: 'transparent' },
  partDotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  partLabel: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary },
  partLabelDone: { color: colors.coldViolet, fontFamily: 'Montserrat_600SemiBold' },
  partDuration: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted, marginTop: 1 },
  tipCard: { backgroundColor: colors.azure, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  tipLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: colors.textMuted, letterSpacing: 1.5, marginBottom: spacing.sm },
  tipText: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.coldViolet, lineHeight: 22 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bottomAction: { flex: 1, alignItems: 'center', gap: 4, paddingVertical: 8 },
  bottomActionText: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textSecondary },
  pauseBtn: { flex: 2, backgroundColor: colors.accent, borderRadius: 9999, paddingVertical: 14, alignItems: 'center', ...shadow.button },
  pauseBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.white },

  // Visual mode
  visualContainer: { flex: 1 },
  sceneWrap: { position: 'relative' },
  sceneTitleWrap: { position: 'absolute', top: spacing.md, left: 0, right: 0, alignItems: 'center' },
  sceneTitleText: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 22, color: colors.coldViolet },
  handInstruction: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginVertical: spacing.md, paddingHorizontal: spacing.lg },
  breathRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, marginBottom: spacing.md },
  handBtn: { alignItems: 'center', gap: 4 },
  handBtnText: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.primary },
  dotPager: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: spacing.md },
  pagerDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.lavender },
  pagerDotActive: { width: 16, backgroundColor: colors.primary },
  transportSmall: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xl, marginBottom: spacing.md },
  playBtnSmall: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', ...shadow.button },
  visualBottom: { paddingHorizontal: spacing.lg },
});
