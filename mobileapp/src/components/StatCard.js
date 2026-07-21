import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing } from '../constants/theme';

export default function StatCard({ icon, value, label }) {
  return (
    <View style={styles.card}>
      {icon ? <Text style={styles.icon}>{icon}</Text> : null}
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 100,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  icon: { fontSize: 22, marginBottom: spacing.xs },
  value: { fontSize: 20, fontWeight: '700', color: colors.text },
  label: { fontSize: 12, color: colors.textMuted, marginTop: 2, textAlign: 'center' },
});
