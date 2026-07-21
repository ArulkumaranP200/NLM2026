import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, control } from '../constants/theme';

// @react-native-community/datetimepicker has no real web renderer, so the native
// DateField.js (Android dialog / iOS spinner modal) never showed anything on web.
// Metro picks this file automatically for web builds (the .web.js extension wins
// over DateField.js there) and uses the browser's native date input instead.
function toMaxAttr(date) {
  if (!date) return undefined;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function DateField({ label, value, onChange, error, required, maximumDate }) {
  return (
    <View style={styles.group}>
      {label ? (
        <Text style={styles.label}>
          {label} {required ? <Text style={styles.required}>*</Text> : null}
        </Text>
      ) : null}
      <input
        type="date"
        value={value || ''}
        max={toMaxAttr(maximumDate)}
        onChange={(e) => onChange(e.target.value)}
        style={{ ...webInputStyle, borderColor: error ? colors.danger : colors.border }}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const webInputStyle = {
  fontFamily: 'inherit',
  fontSize: 14,
  color: colors.text,
  backgroundColor: colors.surface,
  borderWidth: control.borderWidth,
  borderStyle: 'solid',
  borderRadius: control.borderRadius,
  paddingLeft: control.paddingHorizontal,
  paddingRight: control.paddingHorizontal,
  paddingTop: control.paddingVertical,
  paddingBottom: control.paddingVertical,
  width: '100%',
  boxSizing: 'border-box',
  outline: 'none',
};

const styles = StyleSheet.create({
  group: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  required: { color: colors.danger },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
});
