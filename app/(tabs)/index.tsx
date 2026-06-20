import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, Image,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';
import { useSessionStore } from '@/store/sessionStore';
import { programs } from '@/data/programs';
import { protocols } from '@/data/protocols';
import Eyebrow from '@/components/Eyebrow';
import Card from '@/components/Card';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const SUPPORT_NOW: { key: string; icon: IoniconsName; label: string; protocolId: string }[] = [
  { key: 'panic', icon: 'pulse-outline', label: 'Panic\nReset', protocolId: 'panic-reset' },
  { key: 'waiting-room', icon: 'time-outline', label: 'Waiting\nRoom', protocolId: 'waiting-room-calm' },
  { key: 'before-ultrasound', icon: 'scan-outline', label: 'Before\nUltrasound', protocolId: 'before-ultrasound' },
  { key: 'waiting-results', icon: 'document-text-outline', label: 'Waiting\nResults', protocolId: 'waiting-for-results' },
  { key: 'sleep', icon: 'moon-outline', label: 'Sleep\nReset', protocolId: 'sleep-reset' },
];

export default function HomeScreen() {
  const profile = useOnboardingStore((s) => s.profile);
  const setJourney = useOnboardingStore((s) => s.setJourney);
  const currentProgramId = useSessionStore((s) => s.currentProgramId);
  const getProgramProgress = useSessionStore((s) => s.getProgramProgress);

  const firstName = profile.firstName || 'Charlotte';
  const currentProgram = programs.find((p) => p.id === currentProgramId) ?? programs[2];
  const progress = getProgramProgress(currentProgram.id);
  const completedCount = progress?.completedSessions.length ?? 0;
  const currentSessionIdx = progress?.currentSessionIndex ?? 0;
  const pct = Math.round((completedCount / currentProgram.totalSessions) * 100);
  const nextSession = currentProgram.sessions[currentSessionIdx];

  const recommendedProtocol = protocols.find((p) =>
    p.journeys.includes(profile.journey ?? 'pregnancy') &&
    !p.isSupportNow
  ) ?? protocols[0];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="menu" size={24} color={colors.coldViolet} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Image source={require('@/assets/logo.png')} style={styles.headerLogo} resizeMode="contain" />
        </View>
        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="notifications-outline" size={24} color={colors.coldViolet} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Greeting */}
        <Text style={styles.greeting}>{greeting}, {firstName} 🌿</Text>
        <Text style={styles.subGreeting}>How can we support you today?</Text>

        {/* Today's Permission */}
        <Eyebrow label="TODAY'S PERMISSION" />
        <Card variant="sand" style={styles.permissionCard}>
          <Text style={styles.permissionQuote}>
            "Today, I allow myself{'\n'}to take one day at a time."
          </Text>
        </Card>

        {/* Daily Check-In */}
        <Eyebrow label="DAILY CHECK-IN" />
        <TouchableOpacity
          style={styles.checkInCard}
          onPress={() => router.push('/check-in')}
          activeOpacity={0.85}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.checkInTitle}>How are you feeling today?</Text>
            <Text style={styles.checkInSub}>Let us find the right support for you</Text>
          </View>
          <View style={styles.checkInArrowWrap}>
            <Text style={styles.checkInArrow}>Start Check-In</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.white} />
          </View>
        </TouchableOpacity>

        {/* Support Now */}
        <View style={styles.sectionHeader}>
          <Eyebrow label="SUPPORT NOW" />
          <TouchableOpacity onPress={() => router.push('/(tabs)/support')}>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.supportScroll}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, gap: spacing.sm }}
        >
          {SUPPORT_NOW.map((item) => (
            <TouchableOpacity
              key={item.key}
              style={styles.supportItem}
              onPress={() => router.push(`/session/${item.protocolId}`)}
              activeOpacity={0.8}
            >
              <Ionicons name={item.icon} size={22} color={colors.primary} style={{ marginBottom: 4 }} />
              <Text style={styles.supportLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Continue My Journey */}
        <Eyebrow label="CONTINUE MY JOURNEY" />
        <Card style={styles.programCard}>
          <Text style={styles.programTitle}>{currentProgram.title}</Text>
          <Text style={styles.programMeta}>
            Session {currentSessionIdx + 1} of {currentProgram.totalSessions}
          </Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${pct}%` }]} />
          </View>
          {nextSession && (
            <TouchableOpacity
              style={styles.continueBtn}
              onPress={() =>
                router.push(
                  `/session/${nextSession.protocolId}?sessionId=${nextSession.id}&programId=${currentProgram.id}`
                )
              }
            >
              <Text style={styles.continueBtnText}>Continue →</Text>
            </TouchableOpacity>
          )}
        </Card>

        {/* My Baby Has Arrived */}
        {(profile.journey === 'pregnancy') && (
          <TouchableOpacity
            style={styles.babyBanner}
            activeOpacity={0.8}
            onPress={() => {
              setJourney('postpartum');
              router.push('/(tabs)/programs');
            }}
          >
            <Text style={styles.babyBannerIcon}>👶</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.babyBannerTitle}>My Baby Has Arrived</Text>
              <Text style={styles.babyBannerSub}>Update your journey →</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.coldViolet} />
          </TouchableOpacity>
        )}

        {/* Recommended Today */}
        <Eyebrow label="RECOMMENDED TODAY" />
        <Card style={styles.recommendedCard}>
          <View style={styles.recommendedBadge}>
            <Text style={styles.recommendedBadgeText}>
              {recommendedProtocol.hasVisual ? '◉ Audio + Visual' : '🎧 Audio Only'}
            </Text>
          </View>
          <Text style={styles.recommendedTitle}>{recommendedProtocol.title}</Text>
          <Text style={styles.recommendedMeta}>
            {recommendedProtocol.duration} min · {recommendedProtocol.contentType}
          </Text>
          <Text style={styles.recommendedDesc} numberOfLines={2}>
            {recommendedProtocol.description}
          </Text>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => router.push(`/session/${recommendedProtocol.id}`)}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>Start Session</Text>
          </TouchableOpacity>
        </Card>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerLogo: { width: 140, height: 40 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.sm },
  greeting: { fontFamily: 'Raleway_700Bold', fontSize: 22, color: colors.coldViolet },
  subGreeting: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, marginTop: 2, marginBottom: spacing.md },
  permissionCard: { marginBottom: spacing.lg },
  permissionQuote: {
    fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 18,
    color: colors.coldViolet, lineHeight: 28, textAlign: 'center', padding: spacing.sm,
  },
  checkInCard: {
    backgroundColor: colors.primary, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.lg, ...shadow.card, gap: 8,
  },
  checkInTitle: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.white },
  checkInSub: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  checkInArrowWrap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  checkInArrow: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.white },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.primary },
  supportScroll: { marginHorizontal: -spacing.lg, marginBottom: spacing.lg },
  supportItem: {
    backgroundColor: colors.azure, borderRadius: radius.md,
    padding: spacing.md, alignItems: 'center', minWidth: 80,
  },
  supportIcon: { marginBottom: 4 },
  supportLabel: { fontFamily: 'Montserrat_500Medium', fontSize: 12, color: colors.coldViolet, textAlign: 'center' },
  programCard: { marginBottom: spacing.lg },
  programTitle: { fontFamily: 'Raleway_700Bold', fontSize: 18, color: colors.coldViolet, marginBottom: 4 },
  programMeta: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm },
  progressBar: { height: 6, backgroundColor: colors.azure, borderRadius: 3, marginBottom: spacing.md },
  progressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  continueBtn: { alignSelf: 'flex-end' },
  continueBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: colors.primary },
  babyBanner: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.sandLight, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.lg, gap: spacing.md,
    borderWidth: 1, borderColor: colors.accent,
  },
  babyBannerIcon: { fontSize: 32 },
  babyBannerTitle: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.coldViolet },
  babyBannerSub: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary },
  recommendedCard: { marginBottom: spacing.sm },
  recommendedBadge: {
    alignSelf: 'flex-start', backgroundColor: colors.azure,
    borderRadius: 9999, paddingVertical: 4, paddingHorizontal: 12, marginBottom: spacing.sm,
  },
  recommendedBadgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.primary },
  recommendedTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 20, color: colors.coldViolet, marginBottom: 4 },
  recommendedMeta: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginBottom: 4 },
  recommendedDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary, lineHeight: 20, marginBottom: spacing.md },
  startBtn: { backgroundColor: colors.accent, borderRadius: 9999, paddingVertical: 12, alignItems: 'center', ...shadow.button },
  startBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.white },
});
