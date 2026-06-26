import React from 'react';
import {
  View, Text, StyleSheet,  TouchableOpacity, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { protocols } from '@/data/protocols';
import AppHeader from '@/components/AppHeader';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const SUPPORT_ITEMS: { key: string; icon: IoniconsName; label: string; subtitle: string; color: string; protocolId: string }[] = [
  { key: 'panic', icon: 'pulse-outline', label: 'Panic Reset', subtitle: 'Immediate calm', color: '#EEF6FA', protocolId: 'panic-reset' },
  { key: 'waiting-room', icon: 'time-outline', label: 'Waiting Room Calm', subtitle: 'Eyes-open session', color: '#F0EEF8', protocolId: 'waiting-room-calm' },
  { key: 'before-ultrasound', icon: 'scan-outline', label: 'Before Ultrasound', subtitle: 'Prepare your mind', color: '#FFF3EC', protocolId: 'before-ultrasound' },
  { key: 'before-transfer', icon: 'leaf-outline', label: 'Before Embryo Transfer', subtitle: 'Hold hope', color: '#EEF6FA', protocolId: 'before-embryo-transfer' },
  { key: 'waiting-results', icon: 'document-text-outline', label: 'Waiting for Results', subtitle: 'Release control', color: '#F0EEF8', protocolId: 'waiting-for-results' },
  { key: 'sleep', icon: 'moon-outline', label: 'Sleep Reset', subtitle: 'Drift into rest', color: '#FFF3EC', protocolId: 'sleep-reset' },
];

export default function SupportScreen() {
  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader />
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
                <View style={styles.cardIconWrap}>
                <Ionicons name={item.icon} size={24} color={colors.primary} />
              </View>
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

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  header: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.md },
  headerTitle: { fontFamily: 'Raleway_700Bold', fontSize: 26, color: colors.coldViolet, marginBottom: 4 },
  headerSub: { fontFamily: 'Montserrat_400Regular', fontSize: 14, color: colors.textSecondary },
  content: { paddingHorizontal: spacing.lg },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  card: {
    width: '47%', borderRadius: radius.md, padding: spacing.md,
    ...shadow.card,
  },
  cardIconWrap: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
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
