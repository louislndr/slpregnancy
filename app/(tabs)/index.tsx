import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Svg, Path } from 'react-native-svg';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useSessionStore } from '@/store/sessionStore';
import { useDataStore } from '@/store/dataStore';
import Card from '@/components/Card';
import AppHeader from '@/components/AppHeader';

function QuoteOpen({ size = 28, color = colors.accent }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M76.729,44.54c0.005-0.138,0.021-0.273,0.021-0.413c0-0.047-0.007-0.092-0.007-0.138c0.001-0.092,0.007-0.183,0.007-0.275l-0.021,0.014c-0.212-6.166-5.265-11.103-11.481-11.103c-6.353,0-11.502,5.149-11.502,11.502c0,5.796,4.292,10.577,9.869,11.372c-1.387,4.595-5.646,7.938-10.695,7.938v4.106C65.813,67.542,76.293,57.325,76.729,44.54z" fill={color} />
      <Path d="M46.893,44.54c0.005-0.138,0.021-0.273,0.021-0.413c0-0.047-0.007-0.092-0.007-0.138c0.001-0.092,0.007-0.183,0.007-0.275l-0.021,0.014c-0.212-6.166-5.265-11.103-11.481-11.103c-6.353,0-11.502,5.149-11.502,11.502c0,5.796,4.292,10.577,9.869,11.372c-1.386,4.595-5.645,7.938-10.694,7.938v4.106C35.978,67.542,46.456,57.325,46.893,44.54z" fill={color} />
    </Svg>
  );
}

function QuoteClose({ size = 28, color = colors.accent }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path d="M23.105,55.627c-0.005,0.138-0.021,0.273-0.021,0.413c0,0.047,0.006,0.092,0.007,0.138c-0.001,0.092-0.007,0.183-0.007,0.275l0.02-0.014c0.212,6.166,5.265,11.103,11.482,11.103c6.352,0,11.502-5.149,11.502-11.502c0-5.796-4.292-10.577-9.869-11.372c1.386-4.595,5.645-7.938,10.695-7.938v-4.106C34.021,32.625,23.541,42.841,23.105,55.627z" fill={color} />
      <Path d="M52.941,55.627c-0.005,0.138-0.021,0.273-0.021,0.413c0,0.047,0.007,0.092,0.007,0.138c-0.001,0.092-0.007,0.183-0.007,0.275l0.021-0.014c0.212,6.166,5.265,11.103,11.481,11.103c6.353,0,11.502-5.149,11.502-11.502c0-5.796-4.292-10.577-9.869-11.372c1.386-4.595,5.645-7.938,10.694-7.938v-4.106C63.856,32.625,53.378,42.841,52.941,55.627z" fill={color} />
    </Svg>
  );
}

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const SUPPORT_NOW: { key: string; icon: IoniconsName; label: string; protocolId: string }[] = [
  { key: 'panic',             icon: 'pulse-outline',         label: 'Panic Reset',        protocolId: 'panic-reset' },
  { key: 'waiting-room',      icon: 'time-outline',          label: 'Waiting Room',        protocolId: 'waiting-room-calm' },
  { key: 'before-ultrasound', icon: 'scan-outline',          label: 'Before Ultrasound',   protocolId: 'before-ultrasound' },
  { key: 'waiting-results',   icon: 'document-text-outline', label: 'Waiting Results',     protocolId: 'waiting-for-results' },
  { key: 'sleep',             icon: 'moon-outline',          label: 'Sleep Reset',         protocolId: 'sleep-reset' },
];

export default function HomeScreen() {
  const profile = useOnboardingStore((s) => s.profile);
  const currentProgramId = useSessionStore((s) => s.currentProgramId);
  const getProgramProgress = useSessionStore((s) => s.getProgramProgress);
  const protocols = useDataStore((s) => s.protocols);
  const programs = useDataStore((s) => s.programs);

  const firstName = profile.firstName || 'Charlotte';
  const currentProgram = programs.find((p) => p.id === currentProgramId) ?? programs[2];
  const progress = getProgramProgress(currentProgram.id);
  const completedCount = progress?.completedSessions.length ?? 0;
  const currentSessionIdx = progress?.currentSessionIndex ?? 0;
  const pct = Math.round((completedCount / currentProgram.totalSessions) * 100);
  const nextSession = currentProgram.sessions[currentSessionIdx];

  const recommendedProtocol = protocols.find((p) =>
    p.journeys.includes(profile.journey ?? 'pregnancy') && !p.isSupportNow
  ) ?? protocols[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <LinearGradient colors={['#FFFFFF', '#FFF8F4', colors.sandLight]} locations={[0, 0.5, 1]} style={styles.gradient}>
      <SafeAreaView edges={['top']} style={styles.safe}>
        <AppHeader rightIcon="notifications-outline" onRightPress={() => Alert.alert('Notifications', 'You have no new notifications.')} />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          {/* Greeting */}
          <View style={styles.greetingBlock}>
            <Text style={styles.greeting}>{greeting}, {firstName}</Text>
          </View>

          {/* Today's Permission */}
          <Card variant="sand">
            <Text style={styles.eyebrowAccent}>Today's Permission</Text>
            <QuoteClose size={44} />
            <Text style={styles.permissionQuote}>
              Today, I allow myself to take{'\n'}one day at a time.
            </Text>
            <View style={styles.quoteCloseWrap}>
              <QuoteOpen size={44} />
            </View>
          </Card>

          {/* Daily Check-In */}
          <TouchableOpacity style={styles.checkInCard} onPress={() => router.push('/check-in')} activeOpacity={0.85}>
            <View style={{ flex: 1 }}>
              <Text style={styles.checkInEyebrow}>Daily Check-In</Text>
              <Text style={styles.checkInTitle}>How are you feeling today?</Text>
              <Text style={styles.checkInSub}>Let us find the right support for you</Text>
            </View>
            <View style={styles.checkInArrow}>
              <Text style={styles.checkInArrowText}>Start</Text>
              <Ionicons name="arrow-forward" size={14} color={colors.white} />
            </View>
          </TouchableOpacity>

          {/* Support Now + Journey row */}
          <View style={styles.dualRow}>
            {/* Support Now */}
            <TouchableOpacity style={[styles.dualCard, styles.supportNowCard]} onPress={() => router.push('/(tabs)/support')} activeOpacity={0.85}>
              <Text style={styles.eyebrow}>Support Now</Text>
              <Text style={styles.supportNowTitle}>Need support?</Text>
              <Text style={styles.supportNowSub}>Immediate support, no check-in needed</Text>
              <Text style={styles.supportNowLink}>Open →</Text>
            </TouchableOpacity>

            {/* Continue My Journey */}
            <Card style={styles.dualCard}>
              <Text style={styles.eyebrow}>My journey</Text>
              <Text style={styles.programTitle} numberOfLines={2}>{currentProgram.title}</Text>
              <Text style={styles.programMeta}>Session {currentSessionIdx + 1} of {currentProgram.totalSessions}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>
              {nextSession && (
                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={() => router.push(`/session/${nextSession.protocolId}?sessionId=${nextSession.id}&programId=${currentProgram.id}`)}
                >
                  <Text style={styles.continueBtnText}>Continue →</Text>
                </TouchableOpacity>
              )}
            </Card>
          </View>

          {/* My Baby Has Arrived */}
          {profile.journey === 'pregnancy' && (
            <TouchableOpacity
              style={styles.babyBanner}
              activeOpacity={0.8}
              onPress={() => router.push('/celebrate-birth')}
            >
              <View style={styles.babyBannerIconWrap}>
                <MaterialCommunityIcons name="baby-face" size={22} color={colors.accent} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.babyBannerTitle}>My Baby Has Arrived</Text>
                <Text style={styles.babyBannerSub}>Update your journey →</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.coldViolet} />
            </TouchableOpacity>
          )}

          {/* Recommended Today */}
          <Card>
            <Text style={styles.eyebrow}>Recommended today</Text>
            <Text style={styles.recommendedTitle}>{recommendedProtocol.title}</Text>
            <View style={styles.recommendedMeta}>
              <Ionicons name="time-outline" size={14} color={colors.textMuted} />
              <Text style={styles.recommendedDuration}>{recommendedProtocol.duration} min</Text>
              <View style={styles.recommendedBadge}>
                <Ionicons name="ear-outline" size={14} color={colors.primary} />
                {recommendedProtocol.hasVisual && <Ionicons name="eye-outline" size={14} color={colors.primary} />}
              </View>
            </View>
            <Text style={styles.recommendedDesc} numberOfLines={2}>{recommendedProtocol.description}</Text>
            <TouchableOpacity style={styles.startBtn} onPress={() => router.push(`/session/${recommendedProtocol.id}`)} activeOpacity={0.85}>
              <Text style={styles.startBtnText}>Start Session</Text>
            </TouchableOpacity>
          </Card>

        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  safe: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: 100, gap: 18 },
  greetingBlock: { paddingTop: spacing.sm, paddingBottom: 0 },
  greeting: { fontFamily: 'Raleway_700Bold', fontSize: 26, color: colors.coldViolet, lineHeight: 34 },
  eyebrow: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary, marginBottom: spacing.xs },
  eyebrowAccent: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.accent, marginBottom: spacing.xs },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xs },
  viewAll: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.primary },
  dualRow: { flexDirection: 'row', gap: 18, alignItems: 'stretch' },
  dualCard: { flex: 1, justifyContent: 'space-between' },
  permissionQuote: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 22,
    color: colors.coldViolet, lineHeight: 32, textAlign: 'center',
  },
  quoteCloseWrap: { alignItems: 'flex-end' },
  checkInCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.primary, borderRadius: radius.md,
    padding: spacing.md, gap: spacing.sm, ...shadow.card,
  },
  checkInEyebrow: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  checkInTitle: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.white },
  checkInSub: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  checkInArrow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  checkInArrowText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.white },
  supportNowCard: {
    backgroundColor: colors.azure, borderRadius: radius.md, padding: spacing.md, ...shadow.card,
  },
  supportNowTitle: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.coldViolet, lineHeight: 22, marginBottom: 4 },
  supportNowSub: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm },
  supportNowLink: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.primary, marginTop: 'auto' },
  programTitle: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.coldViolet, marginBottom: 4 },
  programMeta: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm },
  progressBar: { height: 4, backgroundColor: colors.azure, borderRadius: 2, marginBottom: spacing.sm },
  progressFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  continueBtn: { alignSelf: 'flex-end', marginTop: 'auto' },
  continueBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.primary },
  babyBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.sandLight, borderRadius: radius.md,
    padding: spacing.md, gap: spacing.md,
    borderWidth: 1, borderColor: colors.accent,
  },
  babyBannerIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  babyBannerTitle: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.coldViolet },
  babyBannerSub: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary },
  recommendedTitle: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.coldViolet, marginBottom: spacing.xs },
  recommendedMeta: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm },
  recommendedBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: colors.azure, borderRadius: 9999, paddingVertical: 4, paddingHorizontal: 10,
  },
  recommendedDuration: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted },
  recommendedDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: spacing.md },
  startBtn: { backgroundColor: colors.accent, borderRadius: 9999, paddingVertical: 12, alignItems: 'center', ...shadow.button },
  startBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.white },
});
