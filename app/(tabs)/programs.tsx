import React from 'react';
import {
  View, Text, StyleSheet,  TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { programs, Program } from '@/data/programs';
import { useSessionStore } from '@/store/sessionStore';
import AppHeader from '@/components/AppHeader';
import Card from '@/components/Card';

function ProgramCard({ program }: { program: Program }) {
  const progress = useSessionStore((s) => s.getProgramProgress(program.id));
  const setCurrentProgram = useSessionStore((s) => s.setCurrentProgram);
  const completed = progress?.completedSessions.length ?? 0;
  const pct = (completed / program.totalSessions) * 100;
  const currentIdx = progress?.currentSessionIndex ?? 0;
  const nextSession = program.sessions[currentIdx];

  return (
    <Card style={{ borderTopWidth: 4, borderTopColor: program.color }}>
      <Text style={styles.cardTitle}>{program.title}</Text>
      <Text style={styles.cardDesc}>{program.description}</Text>

      {/* Progress */}
      <View style={styles.progressRow}>
        <Text style={styles.progressText}>Session {currentIdx + 1} of {program.totalSessions}</Text>
        <Text style={styles.progressPct}>{Math.round(pct)}%</Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: program.color }]} />
      </View>

      {/* Sessions list */}
      <View style={styles.sessionsList}>
        {program.sessions.map((s, i) => {
          const isDone = progress?.completedSessions.includes(s.id) ?? false;
          const isCurrent = i === currentIdx;
          return (
            <TouchableOpacity
              key={s.id}
              style={[styles.sessionRow, isCurrent && styles.sessionRowCurrent]}
              onPress={() => {
                setCurrentProgram(program.id);
                router.push(`/session/${s.protocolId}?sessionId=${s.id}&programId=${program.id}`);
              }}
              activeOpacity={0.8}
            >
              <View style={[styles.sessionDot, isDone && styles.sessionDotDone, isCurrent && styles.sessionDotCurrent]}>
                {isDone && <Ionicons name="checkmark" size={10} color={colors.white} />}
                {isCurrent && !isDone && <View style={styles.sessionDotInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.sessionLabel, isDone && styles.sessionLabelDone]}>
                  {s.sessionNumber}. {s.title}
                </Text>
                <Text style={styles.sessionDuration}>{s.duration} min</Text>
              </View>
              {(isCurrent || isDone) && (
                <Ionicons
                  name={isDone ? 'checkmark-circle' : 'play-circle-outline'}
                  size={20}
                  color={isDone ? colors.primary : colors.accent}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {nextSession && currentIdx < program.totalSessions && (
        <TouchableOpacity
          style={styles.continueBtn}
          onPress={() => {
            setCurrentProgram(program.id);
            router.push(`/session/${nextSession.protocolId}?sessionId=${nextSession.id}&programId=${program.id}`);
          }}
          activeOpacity={0.85}
        >
          <Text style={styles.continueBtnText}>
            {completed === 0 ? 'Start Program' : 'Continue →'}
          </Text>
        </TouchableOpacity>
      )}
      {completed === program.totalSessions && (
        <View style={styles.completedBadge}>
          <Ionicons name="ribbon-outline" size={16} color={colors.primary} />
          <Text style={styles.completedText}>Program Completed!</Text>
        </View>
      )}
    </Card>
  );
}

export default function ProgramsScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Guided Programs</Text>
        <Text style={styles.headerSub}>Structured journeys for each stage</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {programs.map((p) => (
          <ProgramCard key={p.id} program={p} />
        ))}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md },
  headerTitle: { fontFamily: 'Raleway_700Bold', fontSize: 26, color: colors.coldViolet, marginBottom: 4 },
  headerSub: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary },
  content: { paddingHorizontal: spacing.lg, gap: spacing.lg, paddingBottom: 100 },
  cardTitle: { fontFamily: 'Raleway_700Bold', fontSize: 18, color: colors.coldViolet, marginBottom: 4 },
  cardDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: spacing.md },
  progressRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progressText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted },
  progressPct: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.primary },
  progressBar: { height: 5, backgroundColor: colors.azure, borderRadius: 3, marginBottom: spacing.md },
  progressFill: { height: 5, borderRadius: 3 },
  sessionsList: { gap: 10, marginBottom: spacing.md },
  sessionRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingVertical: 4 },
  sessionRowCurrent: {},
  sessionDot: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.lavender, alignItems: 'center', justifyContent: 'center' },
  sessionDotDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  sessionDotCurrent: { borderColor: colors.accent },
  sessionDotInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.accent },
  sessionLabel: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.textPrimary },
  sessionLabelDone: { color: colors.textMuted, textDecorationLine: 'line-through' },
  sessionDuration: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginTop: 1 },
  continueBtn: { backgroundColor: colors.accent, borderRadius: 9999, paddingVertical: 12, alignItems: 'center', marginTop: spacing.sm },
  continueBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.white },
  completedBadge: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: spacing.sm, marginTop: spacing.sm },
  completedText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: colors.primary },
});
