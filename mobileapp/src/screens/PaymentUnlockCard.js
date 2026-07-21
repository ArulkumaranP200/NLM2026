import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import api from '../api/client';
import { colors, spacing } from '../constants/theme';
import { toast, apiErrorMessage } from '../utils/toast';
import { startRazorpayCheckout } from '../payments/startRazorpayCheckout';
import { PROFILE_UNLOCK_PRICE } from '../constants/config';

export default function PaymentUnlockCard({ profileId }) {
  const [paying, setPaying] = useState(false);

  const handleUnlock = async () => {
    setPaying(true);
    try {
      const { data: order } = await api.post(`/profiles/${profileId}/create-payment-order/`);
      await startRazorpayCheckout(order);
    } catch (err) {
      if (err.message === 'Payment integration coming soon.') {
        toast.error('Payment integration is coming soon. Order created successfully in the meantime.');
      } else {
        toast.error(apiErrorMessage(err, 'Could not start payment.'));
      }
    } finally {
      setPaying(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.icon}>🔒</Text>
      <Text style={styles.title}>Contact details are locked</Text>
      <Text style={styles.desc}>Unlock phone number, address, and family details for this profile.</Text>
      <Pressable style={[styles.unlockBtn, paying && styles.unlockBtnDisabled]} onPress={handleUnlock} disabled={paying}>
        <Text style={styles.unlockBtnText}>{paying ? 'Starting Payment...' : `Pay ₹${PROFILE_UNLOCK_PRICE} & Unlock`}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.locked, borderRadius: 12, padding: spacing.lg,
    alignItems: 'center', borderWidth: 1, borderColor: '#f0d9a8',
  },
  icon: { fontSize: 30, marginBottom: spacing.xs },
  title: { fontSize: 15, fontWeight: '700', color: colors.text },
  desc: { fontSize: 12, color: colors.textMuted, textAlign: 'center', marginTop: 4, marginBottom: spacing.md },
  unlockBtn: { backgroundColor: colors.primary, paddingVertical: 12, paddingHorizontal: spacing.lg, borderRadius: 10 },
  unlockBtnDisabled: { opacity: 0.6 },
  unlockBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
});
