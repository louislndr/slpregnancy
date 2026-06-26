import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  TextInput, Modal, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { spacing, radius, shadow } from '@/theme/spacing';
import { protocols, ContentType } from '@/data/protocols';
import { useSessionStore } from '@/store/sessionStore';
import AppHeader from '@/components/AppHeader';

const CONTENT_TYPES: ContentType[] = ['REFLECT', 'MOVE', 'FULL SESSION', 'PREPARE'];
const DURATIONS = [
  { label: 'Any length', max: 999 },
  { label: '≤5 min', max: 5 },
  { label: '10 min', max: 10 },
  { label: '15+ min', max: 999, min: 15 },
];
const JOURNEYS = [
  { id: 'trying-to-conceive', label: 'Trying to Conceive' },
  { id: 'pregnancy', label: 'Pregnancy' },
  { id: 'pregnancy-recovery', label: 'Pregnancy After Loss' },
  { id: 'postpartum', label: 'Postpartum' },
];
const TYPE_BADGES: Record<string, { bg: string; text: string }> = {
  REFLECT:        { bg: colors.lavender,  text: colors.coldViolet },  // light purple → dark purple
  MOVE:           { bg: colors.azure,     text: colors.primary },     // light teal → teal
  'FULL SESSION': { bg: colors.sandLight, text: colors.accent },      // warm sand → peach
  PREPARE:        { bg: colors.accent,    text: colors.coldViolet },  // peach → deep violet
};

function FilterOption({
  label, active, onPress,
}: { label: string; active: boolean; onPress: () => void }) {
  return (
    <TouchableOpacity style={[styles.filterOption, active && styles.filterOptionActive]} onPress={onPress} activeOpacity={0.7}>
      <Text style={[styles.filterOptionText, active && styles.filterOptionTextActive]}>{label}</Text>
      {active && <Ionicons name="checkmark" size={15} color={colors.primary} />}
    </TouchableOpacity>
  );
}

export default function LibraryScreen() {
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState<ContentType | null>(null);
  const [activeDuration, setActiveDuration] = useState(0);
  const [activeJourney, setActiveJourney] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const { toggleFavorite, isFavorite } = useSessionStore();

  const activeFilterCount = [
    activeType !== null,
    activeDuration !== 0,
    activeJourney !== null,
    showFavoritesOnly,
  ].filter(Boolean).length;

  const clearAll = () => {
    setActiveType(null);
    setActiveDuration(0);
    setActiveJourney(null);
    setShowFavoritesOnly(false);
  };

  const filtered = useMemo(() => {
    const dur = DURATIONS[activeDuration];
    return protocols.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeType && p.contentType !== activeType) return false;
      if (dur.max !== 999 && p.duration > dur.max) return false;
      if ((dur as any).min && p.duration < (dur as any).min) return false;
      if (activeJourney && !p.journeys.includes(activeJourney)) return false;
      if (showFavoritesOnly && !isFavorite(p.id)) return false;
      return true;
    });
  }, [search, activeType, activeDuration, activeJourney, showFavoritesOnly, isFavorite]);

  return (
    <SafeAreaView edges={['top']} style={styles.safe}>
      <AppHeader />
      <View style={styles.headerArea}>
        <Text style={styles.headerTitle}>Library</Text>

        {/* Search + Filter row */}
        <View style={styles.searchRow}>
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

          <TouchableOpacity style={[styles.filterBtn, activeFilterCount > 0 && styles.filterBtnActive]} onPress={() => setFilterOpen(true)} activeOpacity={0.8}>
            <Ionicons name="options-outline" size={18} color={activeFilterCount > 0 ? colors.white : colors.coldViolet} />
            {activeFilterCount > 0 && (
              <View style={styles.filterBadge}>
                <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Active filter pills */}
        {activeFilterCount > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.activePills}>
            {activeJourney && (
              <TouchableOpacity style={styles.activePill} onPress={() => setActiveJourney(null)}>
                <Text style={styles.activePillText}>{JOURNEYS.find(j => j.id === activeJourney)?.label}</Text>
                <Ionicons name="close" size={12} color={colors.primary} />
              </TouchableOpacity>
            )}
            {activeType && (
              <TouchableOpacity style={styles.activePill} onPress={() => setActiveType(null)}>
                <Text style={styles.activePillText}>{activeType}</Text>
                <Ionicons name="close" size={12} color={colors.primary} />
              </TouchableOpacity>
            )}
            {activeDuration !== 0 && (
              <TouchableOpacity style={styles.activePill} onPress={() => setActiveDuration(0)}>
                <Text style={styles.activePillText}>{DURATIONS[activeDuration].label}</Text>
                <Ionicons name="close" size={12} color={colors.primary} />
              </TouchableOpacity>
            )}
            {showFavoritesOnly && (
              <TouchableOpacity style={styles.activePill} onPress={() => setShowFavoritesOnly(false)}>
                <Text style={styles.activePillText}>Favorites</Text>
                <Ionicons name="close" size={12} color={colors.primary} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={clearAll}>
              <Text style={styles.clearAllText}>Clear all</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.count}>{filtered.length} session{filtered.length !== 1 ? 's' : ''}</Text>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyText}>No sessions match your filters.</Text>
            <TouchableOpacity onPress={() => { setSearch(''); clearAll(); }}>
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
                <View style={[styles.typeBadge, { backgroundColor: TYPE_BADGES[p.contentType]?.bg ?? colors.azure }]}>
                  <Text style={[styles.typeBadgeText, { color: TYPE_BADGES[p.contentType]?.text ?? colors.primary }]}>
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

      {/* Filter bottom sheet */}
      <Modal visible={filterOpen} transparent animationType="slide" onRequestClose={() => setFilterOpen(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setFilterOpen(false)} />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Filters</Text>
            <TouchableOpacity onPress={clearAll}>
              <Text style={styles.sheetClear}>Clear all</Text>
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.sheetSection}>Journey</Text>
            {JOURNEYS.map((j) => (
              <FilterOption
                key={j.id}
                label={j.label}
                active={activeJourney === j.id}
                onPress={() => setActiveJourney(activeJourney === j.id ? null : j.id)}
              />
            ))}

            <Text style={styles.sheetSection}>Type</Text>
            {CONTENT_TYPES.map((t) => (
              <FilterOption
                key={t}
                label={t}
                active={activeType === t}
                onPress={() => setActiveType(activeType === t ? null : t)}
              />
            ))}

            <Text style={styles.sheetSection}>Duration</Text>
            {DURATIONS.map((d, i) => (
              <FilterOption
                key={d.label}
                label={d.label}
                active={activeDuration === i}
                onPress={() => setActiveDuration(i)}
              />
            ))}

            <Text style={styles.sheetSection}>Special</Text>
            <FilterOption
              label="Favorites only"
              active={showFavoritesOnly}
              onPress={() => setShowFavoritesOnly(!showFavoritesOnly)}
            />

            <View style={{ height: spacing.xl }} />
          </ScrollView>

          <TouchableOpacity style={styles.applyBtn} onPress={() => setFilterOpen(false)} activeOpacity={0.85}>
            <Text style={styles.applyBtnText}>
              Show {filtered.length} session{filtered.length !== 1 ? 's' : ''}
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.white },
  headerArea: { paddingTop: spacing.md, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.sm },
  headerTitle: { fontFamily: 'Raleway_700Bold', fontSize: 26, color: colors.coldViolet, paddingHorizontal: spacing.lg, marginBottom: spacing.md },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, marginBottom: spacing.sm },
  searchBar: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.azure, borderRadius: 12, paddingHorizontal: spacing.md,
  },
  searchInput: { flex: 1, fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.coldViolet, paddingVertical: 12 },
  filterBtn: {
    width: 44, height: 44, borderRadius: 12, backgroundColor: colors.azure,
    alignItems: 'center', justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: colors.primary },
  filterBadge: {
    position: 'absolute', top: -4, right: -4,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: colors.accent, alignItems: 'center', justifyContent: 'center',
  },
  filterBadgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 9, color: colors.white },

  activePills: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: spacing.lg, paddingBottom: spacing.sm },
  activePill: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: '#EBF4F8', borderRadius: 9999,
    paddingVertical: 5, paddingHorizontal: 10,
    borderWidth: 1, borderColor: colors.primary + '40',
  },
  activePillText: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.primary },
  clearAllText: { fontFamily: 'Montserrat_500Medium', fontSize: 13, color: colors.textMuted, paddingHorizontal: 4 },

  content: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  count: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted, marginBottom: spacing.md },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyIcon: { fontSize: 40, marginBottom: spacing.md },
  emptyText: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.textSecondary, marginBottom: spacing.sm },
  clearLink: { fontFamily: 'Montserrat_600SemiBold', fontSize: 14, color: colors.primary },

  sessionCard: { backgroundColor: colors.white, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.md, ...shadow.card },
  sessionCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  typeBadge: { borderRadius: 9999, paddingVertical: 3, paddingHorizontal: 10 },
  typeBadgeText: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13 },
  sessionTitle: { fontFamily: 'PlayfairDisplay_400Regular', fontSize: 17, color: colors.coldViolet, marginBottom: 4 },
  sessionDesc: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textSecondary, lineHeight: 19, marginBottom: spacing.sm },
  sessionFooter: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  sessionMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sessionMetaText: { fontFamily: 'Montserrat_400Regular', fontSize: 13, color: colors.textMuted },

  // Bottom sheet
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: colors.white, borderTopLeftRadius: 24, borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.xl,
    maxHeight: '80%',
  },
  sheetHandle: { width: 36, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: spacing.md },
  sheetHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.lg },
  sheetTitle: { fontFamily: 'Raleway_700Bold', fontSize: 20, color: colors.coldViolet },
  sheetClear: { fontFamily: 'Montserrat_500Medium', fontSize: 14, color: colors.textMuted },
  sheetSection: { fontFamily: 'Montserrat_600SemiBold', fontSize: 13, color: colors.textMuted, marginBottom: spacing.sm, marginTop: spacing.md },
  filterOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 13, paddingHorizontal: spacing.md,
    borderRadius: radius.sm, marginBottom: 4,
  },
  filterOptionActive: { backgroundColor: '#EBF4F8' },
  filterOptionText: { fontFamily: 'Montserrat_400Regular', fontSize: 15, color: colors.coldViolet },
  filterOptionTextActive: { fontFamily: 'Montserrat_600SemiBold', color: colors.primary },
  applyBtn: { backgroundColor: colors.accent, borderRadius: 9999, paddingVertical: 14, alignItems: 'center', marginTop: spacing.md, ...shadow.button },
  applyBtnText: { fontFamily: 'Raleway_700Bold', fontSize: 15, color: colors.white },
});
