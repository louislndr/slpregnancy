import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { protocols } from '@/data/protocols';

const SUPPORT_ITEMS = [
  { key: 'panic', icon: '🫁', label: 'Panic Reset', subtitle: 'Immediate calm', color: '#EEF6FA', protocolId: 'panic-reset' },
  { key: 'waiting-room', icon: '⏳', label: 'Waiting Room Calm', subtitle: 'Eyes-open session', color: '#F0EEF8', protocolId: 'waiting-room-calm' },
  { key: 'before-ultrasound', icon: '🔍', label: 'Before Ultrasound', subtitle: 'Prepare your mind', color: '#FFF3EC', protocolId: 'before-ultrasound' },
  { key: 'before-transfer', icon: '🌱', label: 'Before Embryo Transfer', subtitle: 'Hold hope', color: '#EEF6FA', protocolId: 'before-embryo-transfer' },
  { key: 'waiting-results', icon: '📋', label: 'Waiting for Results', subtitle: 'Release control', color: '#F0EEF8', protocolId: 'waiting-for-results' },
  { key: 'sleep', icon: '🌙', label: 'Sleep Reset', subtitle: 'Drift into rest', color: '#FFF3EC', protocolId: 'sleep-reset' },
];

export default function SupportScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Support Now</Text>
        <Text style={styles.headerSub}>Immediate support, no check-in needed</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {SUPPORT_ITEMS.map((item) => {
            const protocol = protocols.find((p) => p.id === item.protocolId);
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.card, { backgroundColor: item.color }]}
                onPress={() => router.push(`/session/${item.protocolId}`)}
                activeOpacity={0.85}
              >
                <Text style={styles.cardIcon}>{item.icon}</Text>
                <Text style={styles.cardLabel}>{item.label}</Text>
                <Text style={styles.cardSub}>{item.subtitle}</Text>
                {protocol && (
                  <View style={styles.cardMeta}>
                    <Ionicons name="time-outline" size={12} color={colors.textMuted} />
                    <Text style={styles.cardDuration}>{protocol.duration} min</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.noteCard}>
          <Text style={styles.noteTitle}>About Support Now</Text>
          <Text style={styles.noteText}>
            These sessions bypass the check-in and go directly to what you need. They're designed for moments when you need support immediately.
          </Text>
        </View>

        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.xl, paddingBottom: spacing.md },
  headerTitle: { fontFamily: 'Raleway_700Bold', fontSize: 26, color: colors.coldViolet, marginBottom: 4 },
  headerSub: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary },
  content: { paddingHorizontal: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    width: '47%', borderRadius: radius.md, padding: spacing.md,
    ...shadow.card,
  },
  cardIcon: { fontSize: 32, marginBottom: spacing.sm },
  cardLabel: { fontFamily: 'Raleway_700Bold', fontSize: 14, color: colors.coldViolet, marginBottom: 2 },
  cardSub: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textSecondary, marginBottom: spacing.sm },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardDuration: { fontFamily: 'Montserrat_400Regular', fontSize: 11, color: colors.textMuted },
  noteCard: {
    backgroundColor: colors.sandLight, borderRadius: radius.md,
    padding: spacing.md, marginTop: spacing.lg,
  },
  noteTitle: { fontFamily: 'Raleway_700Bold', fontSize: 14, color: colors.coldViolet, marginBottom: 4 },
  noteText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 20 },
});
