import { useState } from 'react';
import { View, Text, Pressable, Modal, StyleSheet, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors, spacing, control } from '../constants/theme';

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function DateField({ label, value, onChange, error, required, maximumDate }) {
  const [show, setShow] = useState(false);
  const [draft, setDraft] = useState(value ? new Date(value) : new Date(1995, 0, 1));

  const openPicker = () => {
    setDraft(value ? new Date(value) : new Date(1995, 0, 1));
    setShow(true);
  };

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
      if (event.type === 'set' && selectedDate) onChange(toISODate(selectedDate));
      return;
    }
    if (selectedDate) setDraft(selectedDate);
  };

  return (
    <View style={styles.group}>
      {label ? (
        <Text style={styles.label}>
          {label} {required ? <Text style={styles.required}>*</Text> : null}
        </Text>
      ) : null}
      <Pressable style={[styles.field, error && styles.fieldError]} onPress={openPicker}>
        <Text style={value ? styles.valueText : styles.placeholderText}>{value || 'Select date'}</Text>
      </Pressable>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {show && Platform.OS === 'android' && (
        <DateTimePicker value={draft} mode="date" display="default" maximumDate={maximumDate} onChange={handleChange} />
      )}

      {Platform.OS === 'ios' && (
        <Modal visible={show} transparent animationType="slide" onRequestClose={() => setShow(false)}>
          <View style={styles.iosModalBackdrop}>
            <View style={styles.iosModalSheet}>
              <View style={styles.iosModalHeader}>
                <Pressable onPress={() => setShow(false)}><Text style={styles.iosModalBtn}>Cancel</Text></Pressable>
                <Pressable onPress={() => { onChange(toISODate(draft)); setShow(false); }}>
                  <Text style={[styles.iosModalBtn, styles.iosModalDone]}>Done</Text>
                </Pressable>
              </View>
              <DateTimePicker value={draft} mode="date" display="spinner" maximumDate={maximumDate} onChange={handleChange} />
            </View>
          </View>
        </Modal>
      )}
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
  valueText: { fontSize: 14, color: colors.text },
  placeholderText: { fontSize: 14, color: colors.textMuted },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
  iosModalBackdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' },
  iosModalSheet: { backgroundColor: colors.surface, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  iosModalHeader: {
    flexDirection: 'row', justifyContent: 'space-between', padding: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  iosModalBtn: { fontSize: 15, color: colors.textMuted },
  iosModalDone: { color: colors.primary, fontWeight: '700' },
});
