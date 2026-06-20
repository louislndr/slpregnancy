import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';

const PARTS = [
  { label: 'Welcome', duration: '1 min', done: true },
  { label: 'Breathing', duration: '2 min', done: true },
  { label: 'Body Awareness', duration: '3 min', done: false },
  { label: 'Visualization', duration: '3 min', done: false },
  { label: 'Closing', duration: '1 min', done: false },
];

export default function SessionPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [playing, setPlaying] = useState(false);

  const title = id === 'safe-in-this-moment' ? 'Safe In This Moment' : 'Session';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={colors.coldViolet} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.wordmark}>SL Pregnancy</Text>
          <Text style={styles.byLine}>by SophroLounge</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={{ marginRight: spacing.sm }}>
            <Ionicons name="heart-outline" size={22} color={colors.coldViolet} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="ellipsis-vertical" size={22} color={colors.coldViolet} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Title */}
        <View style={styles.titleArea}>
          <View style={styles.sessionMeta}>
            <Ionicons name="leaf-outline" size={14} color={colors.primary} />
            <Text style={styles.metaText}>2 of 5</Text>
          </View>
          <View style={styles.audioBadge}>
            <Text style={styles.audioBadgeText}>Audio + Visual</Text>
          </View>
        </View>
        <Text style={styles.sessionTitle}>{title}</Text>

        {/* Scrub bar */}
        <View style={styles.scrubArea}>
          <Text style={styles.timeText}>02:35</Text>
          <View style={styles.scrubBar}>
            <View style={[styles.scrubFill, { width: '25%' }]} />
            <View style={styles.scrubThumb} />
          </View>
          <Text style={styles.timeText}>-07:25</Text>
        </View>

        {/* Intention card */}
        <View style={styles.intentionCard}>
          <Text style={styles.intentionLabel}>INTENTION</Text>
          <Text style={styles.intentionText}>
            "Je choisis de me reconnecter à la{'\n'}sécurité de cet instant."
          </Text>
        </View>

        {/* Transport controls */}
        <View style={styles.transport}>
          <TouchableOpacity style={styles.transportBtn}>
            <Ionicons name="play-skip-back" size={20} color={colors.coldViolet} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.transportBtn}>
            <Text style={styles.skipText}>-15</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.playBtn}
            onPress={() => setPlaying((p) => !p)}
            activeOpacity={0.85}
          >
            <Ionicons name={playing ? 'pause' : 'play'} size={32} color={colors.white} />
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

        {/* Self-Care Tip */}
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
            <Text style={styles.bottomActionText}>Download</Text>
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border },
  headerCenter: { flex: 1, alignItems: 'center' },
  wordmark: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.primary, letterSpacing: 0.5 },
  byLine: { fontFamily: 'Montserrat_400Regular', fontSize: 10, color: colors.textMuted },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  titleArea: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  sessionMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.primary },
  audioBadge: { backgroundColor: colors.azure, borderRadius: 9999, paddingVertical: 4, paddingHorizontal: 12 },
  audioBadgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 11, color: colors.primary },
  sessionTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 28, color: colors.coldViolet, marginBottom: spacing.lg },
  scrubArea: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  timeText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, minWidth: 44 },
  scrubBar: { flex: 1, height: 4, backgroundColor: colors.azure, borderRadius: 2, flexDirection: 'row', alignItems: 'center' },
  scrubFill: { height: 4, backgroundColor: colors.primary, borderRadius: 2 },
  scrubThumb: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary, marginLeft: -6 },
  intentionCard: { backgroundColor: colors.sandLight, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  intentionLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: colors.textMuted, letterSpacing: 1.5, marginBottom: spacing.sm },
  intentionText: { fontFamily: 'PlayfairDisplay_400Regular_Italic', fontSize: 16, color: colors.coldViolet, lineHeight: 26 },
  transport: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, marginBottom: spacing.xl },
  transportBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  skipText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: colors.coldViolet },
  playBtn: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center', ...shadow.button },
  partsTitle: { fontFamily: 'Raleway_700Bold', fontSize: 16, color: colors.coldViolet, marginBottom: spacing.md },
  partsList: { gap: 12, marginBottom: spacing.lg },
  partRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  partDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors.lavender },
  partDotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  partLabel: { fontFamily: 'Montserrat_500Medium', fontSize: 14, color: colors.textSecondary },
  partLabelDone: { color: colors.coldViolet, fontFamily: 'Montserrat_600SemiBold' },
  partDuration: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted },
  tipCard: { backgroundColor: colors.azure, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.lg },
  tipLabel: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, color: colors.textMuted, letterSpacing: 1.5, marginBottom: spacing.sm },
  tipText: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.coldViolet, lineHeight: 22 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  bottomAction: { flex: 1, alignItems: 'center', gap: 4 },
  bottomActionText: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textSecondary },
  pauseBtn: { flex: 2, backgroundColor: colors.accent, borderRadius: 9999, paddingVertical: 14, alignItems: 'center', ...shadow.button },
  pauseBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.white },
});
