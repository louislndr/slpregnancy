import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView,
  TextInput,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { protocols, ContentType } from '@/data/protocols';
import { useSessionStore } from '@/store/sessionStore';

const CONTENT_TYPES: ContentType[] = ['REFLECT', 'MOVE', 'FULL SESSION', 'PREPARE'];
const DURATIONS = [
  { label: 'All', max: 999 },
  { label: '≤5 min', max: 5 },
  { label: '10 min', max: 10 },
  { label: '15+ min', max: 999, min: 15 },
];

const TYPE_COLORS: Record<string, string> = {
  REFLECT: colors.lavender,
  MOVE: colors.primary,
  'FULL SESSION': colors.accent,
  PREPARE: colors.sandLight,
};

export default function LibraryScreen() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<ContentType | null>(null);
  const [activeDuration, setActiveDuration] = useState(0);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const { toggleFavorite, isFavorite } = useSessionStore();

  const filtered = useMemo(() => {
    const dur = DURATIONS[activeDuration];
    return protocols.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeType && p.contentType !== activeType) return false;
      if (dur.max !== 999 && p.duration > dur.max) return false;
      if ((dur as any).min && p.duration < (dur as any).min) return false;
      if (showFavoritesOnly && !isFavorite(p.id)) return false;
      return true;
    });
  }, [search, activeType, activeDuration, showFavoritesOnly, isFavorite]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>Library</Text>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sessions…"
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Content type filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll} contentContainerStyle={{ gap: 8, paddingHorizontal: spacing.lg }}>
          <TouchableOpacity
            style={[styles.filterChip, showFavoritesOnly && styles.filterChipActive]}
            onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
          >
            <Ionicons name={showFavoritesOnly ? 'heart' : 'heart-outline'} size={14} color={showFavoritesOnly ? colors.white : colors.textSecondary} />
            <Text style={[styles.filterChipText, showFavoritesOnly && styles.filterChipTextActive]}>Favorites</Text>
          </TouchableOpacity>
          {CONTENT_TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              style={[styles.filterChip, activeType === t && styles.filterChipActive]}
              onPress={() => setActiveType(activeType === t ? null : t)}
            >
              <Text style={[styles.filterChipText, activeType === t && styles.filterChipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
          {DURATIONS.map((d, i) => (
            <TouchableOpacity
              key={d.label}
              style={[styles.filterChip, activeDuration === i && styles.filterChipActive]}
              onPress={() => setActiveDuration(i)}
            >
              <Text style={[styles.filterChipText, activeDuration === i && styles.filterChipTextActive]}>{d.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.count}>{filtered.length} session{filtered.length !== 1 ? 's' : ''}</Text>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No sessions match your filters.</Text>
            <TouchableOpacity onPress={() => { setSearch(''); setActiveType(null); setActiveDuration(0); setShowFavoritesOnly(false); }}>
              <Text style={styles.clearLink}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filtered.map((p) => (
            <TouchableOpacity
              key={p.id}
              style={styles.sessionCard}
              onPress={() => router.push(`/session/${p.id}`)}
              activeOpacity={0.85}
            >
              <View style={styles.sessionCardTop}>
                <View style={[styles.typeBadge, { backgroundColor: TYPE_COLORS[p.contentType] + '33' }]}>
                  <Text style={[styles.typeBadgeText, { color: TYPE_COLORS[p.contentType] === colors.sandLight ? colors.coldViolet : TYPE_COLORS[p.contentType] }]}>
                    {p.contentType}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={(e) => { e.stopPropagation(); toggleFavorite(p.id); }}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={isFavorite(p.id) ? 'heart' : 'heart-outline'}
                    size={20}
                    color={isFavorite(p.id) ? colors.accent : colors.textMuted}
                  />
                </TouchableOpacity>
              </View>
              <Text style={styles.sessionTitle}>{p.title}</Text>
              <Text style={styles.sessionDesc} numberOfLines={2}>{p.description}</Text>
              <View style={styles.sessionFooter}>
                <View style={styles.sessionMeta}>
                  <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                  <Text style={styles.sessionMetaText}>{p.duration} min</Text>
                </View>
                {p.hasVisual && (
                  <View style={styles.sessionMeta}>
                    <Ionicons name="eye-outline" size={13} color={colors.textMuted} />
                    <Text style={styles.sessionMetaText}>Visual</Text>
                  </View>
                )}
                <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
              </View>
            </TouchableOpacity>
          ))
        )}
        <View style={{ height: spacing.xl }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  headerArea: { paddingTop: spacing.xl, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.md },
  headerTitle: { fontFamily: 'Raleway_700Bold', fontSize: 26, color: colors.coldViolet, paddingHorizontal: spacing.lg, marginBottom: spacing.md },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.azure, borderRadius: 12, paddingHorizontal: spacing.md,
    marginHorizontal: spacing.lg, marginBottom: spacing.md,
  },
  searchInput: { flex: 1, fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.coldViolet, paddingVertical: 12 },
  filtersScroll: { marginBottom: spacing.sm },
  filterChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 7, paddingHorizontal: 14, borderRadius: 9999,
    backgroundColor: colors.azure, borderWidth: 1, borderColor: 'transparent',
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontFamily: 'Montserrat_500Medium', fontSize: 12, color: colors.textSecondary },
  filterChipTextActive: { color: colors.white },
  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  count: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIcon: { fontSize: 40, marginBottom: spacing.md },
  emptyText: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, marginBottom: spacing.sm },
  clearLink: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: colors.primary },
  sessionCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow.card },
  sessionCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  typeBadge: { borderRadius: 9999, paddingVertical: 3, paddingHorizontal: 10 },
  typeBadgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 10, letterSpacing: 0.5 },
  sessionTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 17, color: colors.coldViolet, marginBottom: 4 },
  sessionDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: spacing.sm },
  sessionFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  sessionMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sessionMetaText: { fontFamily: 'Montserrat_400Regular', fontSize: 12, color: colors.textMuted },
});
