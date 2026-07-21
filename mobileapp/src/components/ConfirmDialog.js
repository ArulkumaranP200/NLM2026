import { Alert } from 'react-native';

export function confirmAction({ title, message, confirmLabel = 'Confirm', destructive = true, onConfirm }) {
  Alert.alert(title, message, [
    { text: 'Cancel', style: 'cancel' },
    { text: confirmLabel, style: destructive ? 'destructive' : 'default', onPress: onConfirm },
  ]);
}
