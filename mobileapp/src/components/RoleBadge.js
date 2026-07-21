import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../constants/theme';

const ROLE_COLORS = {
  user: colors.primary,
  admin: '#2980b9',
  developer: '#8e44ad',
};

export default function RoleBadge({ role }) {
  const bg = ROLE_COLORS[role] || colors.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.text}>{role}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12, alignSelf: 'flex-start' },
  text: { color: '#fff', fontSize: 11, fontWeight: '700', textTransform: 'uppercase' },
});
