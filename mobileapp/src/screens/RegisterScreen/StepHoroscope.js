import { View, Text, StyleSheet } from 'react-native';
import FormField from '../../components/FormField';
import PickerField from '../../components/PickerField';
import { colors, spacing } from '../../constants/theme';
import { ZODIAC_SIGNS } from '../../data/zodiac';
import { NAKSHATRAS } from '../../data/nakshatra';

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MINUTES = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));
const PERIODS = ['AM', 'PM'];

export default function StepHoroscope({ form, errors, onChange }) {
  return (
    <View>
      <View style={styles.header}>
        <Text style={styles.icon}>🔯</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.heading}>Horoscope Details</Text>
          <Text style={styles.note}>All fields are optional. Fill in for better compatibility matching.</Text>
        </View>
      </View>

      <PickerField label="Zodiac Sign (Rasi)" value={form.zodiac_sign} onValueChange={(v) => onChange('zodiac_sign', v)} options={ZODIAC_SIGNS} placeholder="Select Zodiac Sign" />
      <PickerField label="Nakshatra (Birth Star)" value={form.nakshatra} onValueChange={(v) => onChange('nakshatra', v)} options={NAKSHATRAS} placeholder="Select Nakshatra" />
      <FormField label="Birth Place" value={form.birth_place} onChangeText={(v) => onChange('birth_place', v)} placeholder="e.g. Chennai, Tamil Nadu" error={errors.birth_place} />

      <Text style={styles.label}>Birth Time</Text>
      <View style={styles.birthTimeRow}>
        <View style={styles.birthTimeCol}>
          <PickerField value={form.birth_time_hour} onValueChange={(v) => onChange('birth_time_hour', v)} options={HOURS} placeholder="HH" error={errors.birth_time} />
        </View>
        <View style={styles.birthTimeCol}>
          <PickerField value={form.birth_time_minute} onValueChange={(v) => onChange('birth_time_minute', v)} options={MINUTES} placeholder="MM" error={errors.birth_time} />
        </View>
        <View style={styles.birthTimeCol}>
          <PickerField value={form.birth_time_period} onValueChange={(v) => onChange('birth_time_period', v)} options={PERIODS} placeholder="AM/PM" error={errors.birth_time} />
        </View>
      </View>
      {errors.birth_time ? <Text style={styles.errorText}>{errors.birth_time}</Text> : null}

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>🌟 Horoscope details help in finding astrologically compatible matches based on your Rasi and Nakshatra.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.md },
  icon: { fontSize: 28 },
  heading: { fontSize: 17, fontWeight: '700', color: colors.text },
  note: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  label: { fontSize: 13, fontWeight: '600', color: colors.text, marginBottom: 6 },
  birthTimeRow: { flexDirection: 'row', gap: spacing.sm },
  birthTimeCol: { flex: 1 },
  errorText: { color: colors.danger, fontSize: 12, marginTop: -8, marginBottom: spacing.sm },
  infoBox: { backgroundColor: '#fff8e1', borderRadius: 10, padding: spacing.md, marginTop: spacing.sm },
  infoText: { fontSize: 12, color: colors.text },
});
