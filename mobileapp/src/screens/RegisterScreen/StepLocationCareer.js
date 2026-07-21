import { View, Text, StyleSheet } from 'react-native';
import FormField from '../../components/FormField';
import PickerField from '../../components/PickerField';
import SearchablePickerModal from '../../components/SearchablePickerModal';
import { colors, spacing } from '../../constants/theme';
import { EDUCATION_LEVELS } from '../../data/staticOptions';
import { INDIA_STATES, INDIA_STATES_CITIES } from '../../data/indiaCities';

export default function StepLocationCareer({ form, errors, onChange }) {
  const cityOptions = form.state ? INDIA_STATES_CITIES[form.state] || [] : [];

  const handleStateChange = (state) => {
    onChange('state', state);
    onChange('city', '');
  };

  return (
    <View>
      <Text style={styles.heading}>Location & Career</Text>

      <PickerField label="State" value={form.state} onValueChange={handleStateChange} options={INDIA_STATES} placeholder="Select State" error={errors.state} required />

      <SearchablePickerModal
        label="City" value={form.city} onSelect={(v) => onChange('city', v)}
        options={cityOptions} placeholder={form.state ? 'Select City' : 'Select state first'}
        error={errors.city} required disabled={!form.state}
      />

      <FormField label="Country" value={form.country} editable={false} />

      <PickerField label="Education" value={form.education} onValueChange={(v) => onChange('education', v)} options={EDUCATION_LEVELS} placeholder="Select Education" error={errors.education} required />
      {form.education === 'other' && (
        <FormField value={form.education_other} onChangeText={(v) => onChange('education_other', v)} placeholder="Please specify" error={errors.education_other} />
      )}

      <FormField label="Degree (optional)" value={form.degree} onChangeText={(v) => onChange('degree', v)} placeholder="e.g. B.Tech CSE, MBBS, B.Com" error={errors.degree} />
      <FormField label="Occupation" value={form.occupation} onChangeText={(v) => onChange('occupation', v)} placeholder="e.g. Software Engineer" error={errors.occupation} required />
      <FormField label="Annual Income (optional)" value={form.annual_income} onChangeText={(v) => onChange('annual_income', v)} placeholder="e.g. 5-10 LPA" error={errors.annual_income} />
    </View>
  );
}

const styles = StyleSheet.create({
  heading: { fontSize: 17, fontWeight: '700', color: colors.text, marginBottom: spacing.md },
});
