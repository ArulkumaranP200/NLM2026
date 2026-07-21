import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import api from '../api/client';
import FormField from '../components/FormField';
import { colors, spacing } from '../constants/theme';
import { toast, apiErrorMessage } from '../utils/toast';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      toast.error('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login/', { email, password });
      await login(data);
    } catch (err) {
      toast.error(apiErrorMessage(err, 'Invalid email or password.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>💑 UTM Matrimony</Text>
      <Text style={styles.subtitle}>Sign in to continue</Text>

      <FormField label="Email Address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" required />
      <FormField label="Password" value={password} onChangeText={setPassword} placeholder="Your password" secureTextEntry required />

      <Pressable style={[styles.submitBtn, loading && styles.submitBtnDisabled]} onPress={handleSubmit} disabled={loading}>
        <Text style={styles.submitBtnText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
      </Pressable>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footerLink}>Register here</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  title: { fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' },
  subtitle: { fontSize: 14, color: colors.textMuted, textAlign: 'center', marginBottom: spacing.lg, marginTop: 4 },
  submitBtn: { backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 10, alignItems: 'center', marginTop: spacing.sm },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: 13 },
  footerLink: { color: colors.primary, fontWeight: '700', fontSize: 13 },
});
