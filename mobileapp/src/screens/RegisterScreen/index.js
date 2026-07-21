import { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useAuth } from '../../auth/AuthContext';
import api from '../../api/client';
import { colors, spacing } from '../../constants/theme';
import { toast } from '../../utils/toast';
import { validateStep } from './stepValidation';
import { buildSubmitData } from './buildSubmitData';
import { appendPhotoAsset } from '../../utils/photoFormData';
import StepAccount from './StepAccount';
import StepPersonal from './StepPersonal';
import StepLocationCareer from './StepLocationCareer';
import StepFamily from './StepFamily';
import StepHoroscope from './StepHoroscope';
import StepPhotoAbout from './StepPhotoAbout';

const INITIAL = {
  full_name: '', email: '', password: '', confirm_password: '',
  phone: '', date_of_birth: '', gender: '', gender_other: '',
  religion: '', religion_other: '',
  mother_tongue: '', mother_tongue_other: '',
  marital_status: '', marital_status_other: '',
  caste: '', caste_other: '',
  height: '', weight: '', present_address: '',
  city: '', state: '', country: 'India',
  education: '', education_other: '', degree: '', occupation: '', annual_income: '',
  father_name: '', father_occupation: '', mother_name: '', mother_occupation: '',
  number_of_brothers: '', number_of_sisters: '', sibling_details: '',
  zodiac_sign: '', nakshatra: '', birth_place: '',
  birth_time_hour: '', birth_time_minute: '', birth_time_period: '',
  about_me: '',
};

const STEPS = ['Account', 'Personal', 'Location & Career', 'Family', 'Horoscope', 'Photo & About'];
const STEP_COMPONENTS = [StepAccount, StepPersonal, StepLocationCareer, StepFamily, StepHoroscope, StepPhotoAbout];

export default function RegisterScreen({ navigation }) {
  const { login } = useAuth();
  const [form, setForm] = useState(INITIAL);
  const [photo, setPhoto] = useState(null);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const onChange = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: '' }));
  };

  const nextStep = () => {
    const e = validateStep(step, form);
    setErrors(e);
    if (Object.keys(e).length === 0) setStep((s) => s + 1);
  };
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = async () => {
    const e = validateStep(step, form);
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      const payload = buildSubmitData(form);
      const formData = new FormData();
      Object.entries(payload).forEach(([k, v]) => { if (v) formData.append(k, String(v)); });
      appendPhotoAsset(formData, photo);

      const { data } = await api.post('/auth/register/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await login(data);
      toast.success(`Welcome! Your ID is ${data.user.user_id}`);
    } catch (err) {
      const errs = err.response?.data;
      if (errs) {
        setErrors(errs);
        Object.values(errs).flat().forEach((msg) => toast.error(String(msg)));
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const StepComponent = STEP_COMPONENTS[step];
  const isLastStep = step === STEPS.length - 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
      <View style={styles.stepIndicator}>
        {STEPS.map((s, i) => (
          <View key={s} style={styles.stepItem}>
            <View style={[styles.stepCircle, i === step && styles.stepCircleActive, i < step && styles.stepCircleDone]}>
              <Text style={[styles.stepCircleText, (i === step || i < step) && styles.stepCircleTextActive]}>
                {i < step ? '✓' : i + 1}
              </Text>
            </View>
            <Text style={styles.stepLabel} numberOfLines={1}>{s}</Text>
          </View>
        ))}
      </View>

      <StepComponent form={form} errors={errors} onChange={onChange} photo={photo} onPhotoChange={setPhoto} />

      <View style={styles.actions}>
        {step > 0 && (
          <Pressable style={styles.secondaryBtn} onPress={prevStep}>
            <Text style={styles.secondaryBtnText}>← Back</Text>
          </Pressable>
        )}
        {!isLastStep ? (
          <Pressable style={styles.primaryBtn} onPress={nextStep}>
            <Text style={styles.primaryBtnText}>Next →</Text>
          </Pressable>
        ) : (
          <Pressable style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]} onPress={handleSubmit} disabled={loading}>
            <Text style={styles.primaryBtnText}>{loading ? 'Creating Account...' : '🎉 Create Account'}</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => navigation.navigate('Login')}>
          <Text style={styles.footerLink}>Login here</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  stepIndicator: { flexDirection: 'row', marginBottom: spacing.lg, justifyContent: 'space-between' },
  stepItem: { alignItems: 'center', flex: 1 },
  stepCircle: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: colors.border,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  stepCircleActive: { backgroundColor: colors.primary },
  stepCircleDone: { backgroundColor: colors.primaryDark },
  stepCircleText: { fontSize: 11, color: colors.textMuted, fontWeight: '700' },
  stepCircleTextActive: { color: '#fff' },
  stepLabel: { fontSize: 9, color: colors.textMuted, textAlign: 'center' },
  actions: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  primaryBtn: { flex: 1, backgroundColor: colors.primary, paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  primaryBtnDisabled: { opacity: 0.6 },
  primaryBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  secondaryBtn: { flex: 1, paddingVertical: 14, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  secondaryBtnText: { color: colors.text, fontWeight: '700', fontSize: 15 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.lg },
  footerText: { color: colors.textMuted, fontSize: 13 },
  footerLink: { color: colors.primary, fontWeight: '700', fontSize: 13 },
});
