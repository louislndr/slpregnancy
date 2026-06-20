import React from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { useOnboardingStore } from '@/store/onboardingStore';
import Eyebrow from '@/components/Eyebrow';
import Card from '@/components/Card';

export default function HomeScreen() {
  const profile = useOnboardingStore((s) => s.profile);
  const firstName = profile.firstName || 'Charlotte';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity><Ionicons name="menu" size={24} color={colors.coldViolet} /></TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.wordmark}>SL Pregnancy</Text>
          <Text style={styles.byLine}>by SophroLounge</Text>
        </View>
        <TouchableOpacity><Ionicons name="notifications-outline" size={24} color={colors.coldViolet} /></TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Greeting */}
        <Text style={styles.greeting}>Good morning, {firstName} 🌿</Text>
        <Text style={styles.subGreeting}>How can we support you today?</Text>

        {/* Today's Permission */}
        <Eyebrow label="TODAY'S PERMISSION" />
        <Card variant="sand" style={styles.permissionCard}>
          <Text style={styles.permissionQuote}>"Today, I allow myself{'\n'}to take one day at a time."</Text>
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
          <Text style={styles.checkInArrow}>Start Check-In →</Text>
        </TouchableOpacity>

        {/* Support Now */}
        <View style={styles.sectionHeader}>
          <Eyebrow label="SUPPORT NOW" />
          <TouchableOpacity><Text style={styles.viewAll}>View all</Text></TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.supportScroll}>
          {[
            { label: 'Panic\nReset', icon: '🫁' },
            { label: 'Waiting\nRoom', icon: '⏳' },
            { label: 'Before\nUltrasound', icon: '🔍' },
            { label: 'Waiting\nResults', icon: '📋' },
            { label: 'Sleep\nReset', icon: '🌙' },
          ].map((item, i) => (
            <TouchableOpacity key={i} style={styles.supportItem} activeOpacity={0.8}>
              <Text style={styles.supportIcon}>{item.icon}</Text>
              <Text style={styles.supportLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Continue My Journey */}
        <Eyebrow label="CONTINUE MY JOURNEY" />
        <Card style={styles.programCard}>
          <Text style={styles.programTitle}>Preparing For Birth</Text>
          <Text style={styles.programMeta}>Session 2 of 4</Text>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '50%' }]} />
          </View>
          <TouchableOpacity style={styles.continueBtn} onPress={() => router.push('/session/preparing-for-birth-2')}>
            <Text style={styles.continueBtnText}>Continue →</Text>
          </TouchableOpacity>
        </Card>

        {/* Baby Arrived Banner */}
        <TouchableOpacity style={styles.babyBanner} activeOpacity={0.8}>
          <Text style={styles.babyBannerIcon}>👶</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.babyBannerTitle}>My Baby Has Arrived</Text>
            <Text style={styles.babyBannerSub}>Update your journey →</Text>
          </View>
        </TouchableOpacity>

        {/* Recommended Today */}
        <Eyebrow label="RECOMMENDED TODAY" />
        <Card style={styles.recommendedCard}>
          <Text style={styles.recommendedTitle}>Safe In This Moment</Text>
          <Text style={styles.recommendedMeta}>🎧 10 min  ·  Audio + Visual</Text>
          <TouchableOpacity
            style={styles.startBtn}
            onPress={() => router.push('/session/safe-in-this-moment')}
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerCenter: { flex: 1, alignItems: 'center' },
  wordmark: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.primary, letterSpacing: 0.5 },
  byLine: { fontFamily: 'Montserrat_400Regular', fontSize: 10, color: colors.textMuted },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: spacing.md },
  greeting: { fontFamily: 'Raleway_700Bold', fontSize: 22, color: colors.coldViolet },
  subGreeting: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, marginTop: 4, marginBottom: spacing.md },
  permissionCard: { marginBottom: spacing.lg },
  permissionQuote: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 18, color: colors.coldViolet, lineHeight: 28, textAlign: 'center', padding: spacing.sm },
  checkInCard: { backgroundColor: colors.primary, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, ...shadow.card, gap: 8 },
  checkInTitle: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.white },
  checkInSub: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.8)' },
  checkInArrow: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.white, opacity: 0.9 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.primary },
  supportScroll: { marginHorizontal: -spacing.lg, paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
  supportItem: { backgroundColor: colors.azure, borderRadius: radius.md, padding: spacing.md, marginRight: spacing.sm, alignItems: 'center', minWidth: 80 },
  supportIcon: { fontSize: 24, marginBottom: 4 },
  supportLabel: { fontFamily: 'Montserrat_500Medium', fontSize: 12, color: colors.coldViolet, textAlign: 'center' },
  programCard: { marginBottom: spacing.lg },
  programTitle: { fontFamily: 'Raleway_700Bold', fontSize: 18, color: colors.coldViolet, marginBottom: 4 },
  programMeta: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm },
  progressBar: { height: 6, backgroundColor: colors.azure, borderRadius: 3, marginBottom: spacing.md },
  progressFill: { height: 6, backgroundColor: colors.primary, borderRadius: 3 },
  continueBtn: { alignSelf: 'flex-end' },
  continueBtnText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: colors.primary },
  babyBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.sandLight, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg, gap: spacing.md, borderWidth: 1, borderColor: colors.accent },
  babyBannerIcon: { fontSize: 32 },
  babyBannerTitle: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.coldViolet },
  babyBannerSub: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary },
  recommendedCard: { marginBottom: spacing.sm },
  recommendedTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 20, color: colors.coldViolet, marginBottom: 4 },
  recommendedMeta: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  startBtn: { backgroundColor: colors.accent, borderRadius: 9999, paddingVertical: 12, alignItems: 'center', ...shadow.button },
  startBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.white },
});
