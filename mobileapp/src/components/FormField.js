import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors, spacing, control } from '../constants/theme';

export default function FormField({
  label, value, onChangeText, error, required, placeholder,
  secureTextEntry, keyboardType, multiline, maxLength, editable = true,
}) {
  return (
    <View style={styles.group}>
      {label ? (
        <Text style={styles.label}>
          {label} {required ? <Text style={styles.required}>*</Text> : null}
        </Text>
      ) : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        maxLength={maxLength}
        editable={editable}
        style={[
          styles.input,
          multiline && styles.multiline,
          error && styles.inputError,
          !editable && styles.disabled,
        ]}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { marginBottom: spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  required: { color: colors.danger },
  input: {
    ...control, borderColor: colors.border, fontSize: 14, color: colors.text,
    backgroundColor: colors.surface,
  },
  multiline: { minHeight: 80, textAlignVertical: 'top' },
  inputError: { borderColor: colors.danger },
  disabled: { backgroundColor: '#f0f0f0', color: colors.textMuted },
  error: { color: colors.danger, fontSize: 12, marginTop: 4 },
});
