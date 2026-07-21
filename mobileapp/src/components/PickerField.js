import { View, Text, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { colors, spacing, control } from '../constants/theme';

export default function PickerField({ label, value, onValueChange, options, placeholder = 'Select...', error, required, enabled = true }) {
  return (
    <View style={styles.group}>
      {label ? (
        <Text style={styles.label}>
          {label} {required ? <Text style={styles.required}>*</Text> : null}
        </Text>
      ) : null}
      <View style={[styles.pickerWrap, error && styles.pickerError, !enabled && styles.disabled]}>
        <Picker selectedValue={value} onValueChange={onValueChange} enabled={enabled} style={styles.picker}>
          <Picker.Item label={placeholder} value="" color={colors.textMuted} />
          {options.map((opt) => {
            const optValue = typeof opt === 'string' ? opt : opt.value;
            const optLabel = typeof opt === 'string' ? opt : opt.label;
            return <Picker.Item key={optValue} label={optLabel} value={optValue} />;
          })}
        </Picker>
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  required: { color: colors.danger },
  pickerWrap: {
    ...control, paddingHorizontal: 0, borderColor: colors.border,
    backgroundColor: colors.surface, overflow: 'hidden', justifyContent: 'center',
    ...Platform.select({ ios: { paddingVertical: 4 } }),
  },
  picker: {
    color: colors.text, fontSize: 14, backgroundColor: 'transparent', borderWidth: 0,
    ...Platform.select({ web: { paddingHorizontal: control.paddingHorizontal, minHeight: 44, outlineStyle: 'none' } }),
  },
  pickerError: { borderColor: colors.danger },
  disabled: { backgroundColor: '#f0f0f0' },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
});
