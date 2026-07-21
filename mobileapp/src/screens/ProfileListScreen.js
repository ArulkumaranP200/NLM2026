import { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, Switch, TextInput, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import api from '../api/client';
import { fetchCastes } from '../api/castes';
import ProfileCard from '../components/ProfileCard';
import PickerField from '../components/PickerField';
import LoadingSpinner from '../components/LoadingSpinner';
import { colors, spacing } from '../constants/theme';
import { RELIGIONS, religionLabel } from '../data/staticOptions';

const RELIGION_OPTIONS = RELIGIONS.map((r) => ({ value: r, label: religionLabel(r) }));

export default function ProfileListScreen({ navigation }) {
  const [profiles, setProfiles] = useState([]);
  const [filters, setFilters] = useState({ religion: '', caste: '', city: '' });
  const [casteOptions, setCasteOptions] = useState([]);
  const [useExpectations, setUseExpectations] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchCastes(filters.religion).then((data) => { if (active) setCasteOptions(data); });
    return () => { active = false; };
  }, [filters.religion]);

  const fetchProfiles = useCallback(async (opts = {}) => {
    const expectationsOn = opts.useExpectations ?? useExpectations;
    const activeFilters = opts.filters ?? filters;
    setLoading(true);
    const params = new URLSearchParams();
    if (expectationsOn) {
      params.append('my_expectations', 'true');
    } else {
      if (activeFilters.religion) params.append('religion', activeFilters.religion);
      if (activeFilters.caste) params.append('caste', activeFilters.caste);
      if (activeFilters.city) params.append('city', activeFilters.city);
    }
    try {
      const { data } = await api.get(`/profiles/?${params}`);
      setProfiles(data);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, useExpectations]);

  useFocusEffect(
    useCallback(() => {
      fetchProfiles();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  );

  const handleToggleExpectations = (checked) => {
    setUseExpectations(checked);
    fetchProfiles({ useExpectations: checked });
  };

  return (
    <View style={styles.container}>
      <View style={styles.filterBar}>
        <View style={styles.toggleRow}>
          <Switch value={useExpectations} onValueChange={handleToggleExpectations} trackColor={{ true: colors.primary }} />
          <Text style={styles.toggleLabel}>Use My Expectations</Text>
        </View>

        {!useExpectations && (
          <>
            <PickerField
              value={filters.religion}
              onValueChange={(v) => setFilters((f) => ({ ...f, religion: v, caste: '' }))}
              options={RELIGION_OPTIONS} placeholder="Any Religion"
            />
            <PickerField
              value={filters.caste}
              onValueChange={(v) => setFilters((f) => ({ ...f, caste: v }))}
              options={casteOptions} placeholder="Any Caste"
            />
            <TextInput
              style={styles.cityInput}
              placeholder="Search by city..."
              placeholderTextColor={colors.textMuted}
              value={filters.city}
              onChangeText={(v) => setFilters((f) => ({ ...f, city: v }))}
            />
            <Pressable style={styles.searchBtn} onPress={() => fetchProfiles()}>
              <Text style={styles.searchBtnText}>Search</Text>
            </Pressable>
          </>
        )}
        {useExpectations && (
          <Text style={styles.hint}>Showing profiles matching your saved partner expectations.</Text>
        )}
      </View>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <FlatList
          data={profiles}
          keyExtractor={(item) => String(item.id)}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ProfileCard profile={item} onPress={() => navigation.navigate('ProfileDetail', { id: item.id })} />
          )}
          ListEmptyComponent={<Text style={styles.empty}>No profiles found matching your criteria.</Text>}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  filterBar: { padding: spacing.md, gap: spacing.sm, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  toggleLabel: { fontSize: 13, color: colors.text, fontWeight: '600' },
  cityInput: {
    borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: colors.text,
  },
  searchBtn: { backgroundColor: colors.primary, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  searchBtnText: { color: '#fff', fontWeight: '700' },
  hint: { fontSize: 12, color: colors.textMuted },
  listContent: { padding: spacing.md, gap: spacing.md },
  row: { gap: spacing.md },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },
});
