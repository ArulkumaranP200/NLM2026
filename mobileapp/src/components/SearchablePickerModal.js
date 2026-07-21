import { useMemo, useState } from 'react';
import { View, Text, Pressable, Modal, TextInput, FlatList, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { colors, spacing, control } from '../constants/theme';

// On web, react-native-web's Modal marks its container aria-hidden as soon as it
// closes. If the element the user just tapped (Cancel, a row) still has DOM focus
// at that instant, the browser blocks the aria-hidden change and warns. Blurring
// first avoids ever hiding a focused element.
function blurActiveElement() {
  if (Platform.OS === 'web' && document.activeElement instanceof HTMLElement) {
    document.activeElement.blur();
  }
}

export default function SearchablePickerModal({
  label, value, options, onSelect, placeholder = 'Select...', error, required, disabled,
}) {
  const [visible, setVisible] = useState(false);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return options;
    const q = query.trim().toLowerCase();
    return options.filter((o) => o.toLowerCase().includes(q));
  }, [options, query]);

  const openModal = () => {
    if (disabled) return;
    setQuery('');
    setVisible(true);
  };

  const select = (item) => {
    blurActiveElement();
    onSelect(item);
    setVisible(false);
  };

  const closeModal = () => {
    blurActiveElement();
    setVisible(false);
  };

  return (
    <View style={styles.group}>
      {label ? (
        <Text style={styles.label}>
          {label} {required ? <Text style={styles.required}>*</Text> : null}
        </Text>
      ) : null}
      <Pressable
        style={[styles.field, error && styles.fieldError, disabled && styles.disabled]}
        onPress={openModal}
      >
        <Text style={value ? styles.valueText : styles.placeholderText}>{value || placeholder}</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Modal visible={visible} animationType="none" onRequestClose={closeModal}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.searchBar}>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search..."
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              autoFocus
            />
            <Pressable onPress={closeModal} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
          </View>
          <FlatList
            data={filtered}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pressable style={styles.row} onPress={() => select(item)}>
                <Text style={styles.rowText}>{item}</Text>
              </Pressable>
            )}
            ListEmptyComponent={<Text style={styles.empty}>No results</Text>}
            initialNumToRender={25}
            windowSize={5}
            removeClippedSubviews
          />
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  required: { color: colors.danger },
  field: {
    ...control, borderColor: colors.border, backgroundColor: colors.surface, justifyContent: 'center',
  },
  fieldError: { borderColor: colors.danger },
  disabled: { backgroundColor: '#f0f0f0' },
  valueText: { fontSize: 14, color: colors.text },
  placeholderText: { fontSize: 14, color: colors.textMuted },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
  modalContainer: { flex: 1, backgroundColor: colors.surface },
  searchBar: {
    flexDirection: 'row', alignItems: 'center', padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm,
  },
  searchInput: {
    flex: 1, borderWidth: 1, borderColor: colors.border, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 8, fontSize: 14,
  },
  cancelBtn: { paddingHorizontal: 8 },
  cancelText: { color: colors.primary, fontWeight: '600' },
  row: { paddingHorizontal: spacing.md, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  rowText: { fontSize: 15, color: colors.text },
  empty: { textAlign: 'center', color: colors.textMuted, marginTop: spacing.xl },
});
