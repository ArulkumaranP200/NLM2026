import { Pressable, Text, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { confirmAction } from './ConfirmDialog';
import { colors } from '../constants/theme';

export default function HeaderLogoutButton() {
  const { logout } = useAuth();
  return (
    <Pressable
      onPress={() => confirmAction({
        title: 'Log out',
        message: 'Are you sure you want to log out?',
        confirmLabel: 'Log out',
        onConfirm: logout,
      })}
      style={styles.btn}
      hitSlop={8}
    >
      <Text style={styles.text}>Logout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  btn: { paddingHorizontal: 12, paddingVertical: 6 },
  text: { color: colors.primary, fontWeight: '600', fontSize: 14 },
});
