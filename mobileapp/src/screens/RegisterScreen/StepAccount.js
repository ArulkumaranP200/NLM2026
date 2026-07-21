import { View, Text, StyleSheet } from 'react-native';
import FormField from '../../components/FormField';
import { colors, spacing } from '../../constants/theme';

export default function StepAccount({ form, errors, onChange }) {
  return (
    <View>
      <Text style={styles.heading}>Account Details</Text>
      <FormField label="Full Name" value={form.full_name} onChangeText={(v) => onChange('full_name', v)} placeholder="Enter your full name" error={errors.full_name} required />
      <FormField label="Email Address" value={form.email} onChangeText={(v) => onChange('email', v)} placeholder="Enter your email" keyboardType="email-address" error={errors.email} required />
      <FormField label="Password" value={form.password} onChangeText={(v) => onChange('password', v)} placeholder="Min 8 chars, 1 uppercase, 1 number" secureTextEntry error={errors.password} required />
      <FormField label="Confirm Password" value={form.confirm_password} onChangeText={(v) => onChange('confirm_password', v)} placeholder="Re-enter your password" secureTextEntry error={errors.confirm_password} required />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
});
