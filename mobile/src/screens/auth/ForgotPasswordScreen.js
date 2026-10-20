import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../config';
import ModernInput from '../../components/ModernInput';
import ModernButton from '../../components/ModernButton';

export default function ForgotPasswordScreen({ navigation }) {
  const { forgotPassword, resetPassword, resendResetOtp } = useAuth();

  // Step 1: Request OTP | Step 2: Enter OTP & New Password
  const [step, setStep] = useState(1);

  // Form State
  const [identifier, setIdentifier] = useState('');
  const [targetEmail, setTargetEmail] = useState('');
  const [maskedEmail, setMaskedEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Loading & Feedback
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Resend Countdown Timer
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval = null;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Handle Step 1: Kirim Permintaan OTP ke Email
  const handleRequestOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!identifier.trim()) {
      setErrorMsg('Harap masukkan alamat email atau username Anda.');
      return;
    }

    setLoading(true);

    try {
      const res = await forgotPassword(identifier.trim());
      if (res.success) {
        setTargetEmail(res.data.email);
        setMaskedEmail(res.data.masked_email || res.data.email);
        setStep(2);
        setTimer(60);
        setSuccessMsg(res.message || 'Kode verifikasi telah dikirim ke email terdaftar Anda.');
      } else {
        setErrorMsg(res.message || 'Gagal mengirim kode verifikasi.');
      }
    } catch (err) {
      console.log('Forgot password error:', err);
      setErrorMsg(
        err.response?.data?.message ||
        'Akun dengan email atau username tersebut tidak ditemukan di sistem.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Step 2: Simpan Kata Sandi Baru
  const handleResetPassword = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setErrorMsg('Harap masukkan 6 digit kode verifikasi OTP yang dikirim ke email.');
      return;
    }

    if (!newPassword) {
      setErrorMsg('Harap masukkan kata sandi baru Anda.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Kata sandi baru minimal harus 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(
        targetEmail,
        otpCode.trim(),
        newPassword,
        confirmPassword
      );

      if (res.success) {
        if (Platform.OS === 'web') {
          window.alert('Kata sandi akun Anda berhasil diperbarui! Silakan masuk dengan kata sandi baru Anda.');
          navigation.navigate('Login');
        } else {
          Alert.alert(
            'Kata Sandi Berhasil Diperbarui',
            'Silakan masuk menggunakan kata sandi baru Anda.',
            [{ text: 'Masuk Sekarang', onPress: () => navigation.navigate('Login') }]
          );
        }
      } else {
        setErrorMsg(res.message || 'Gagal mereset kata sandi.');
      }
    } catch (err) {
      console.log('Reset password error:', err);
      const msg =
        err.response?.data?.errors?.password?.[0] ||
        err.response?.data?.errors?.otp_code?.[0] ||
        err.response?.data?.message ||
        'Gagal mereset kata sandi. Pastikan kode OTP benar dan belum kadaluarsa.';
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // Kirim Ulang OTP
  const handleResendOtp = async () => {
    if (timer > 0 || resending) return;

    setResending(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await resendResetOtp(targetEmail);
      if (res.success) {
        setSuccessMsg('Kode verifikasi baru telah berhasil dikirim ke email Anda.');
        setTimer(60);
      } else {
        setErrorMsg(res.message || 'Gagal mengirim ulang kode OTP.');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Gagal mengirim ulang kode OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor="#172554" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (step === 2) {
                setStep(1);
                setErrorMsg('');
                setSuccessMsg('');
              } else {
                navigation.goBack();
              }
            }}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <View style={styles.brandIconWrapper}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.brandTitle}>SMP DHARMA BAKTI</Text>
          <Text style={styles.brandSubtitle}>Pemulihan Kata Sandi Akun</Text>
        </View>

        {/* Card Form */}
        <View style={styles.card}>
          {step === 1 ? (
            /* ======================================================== */
            /* STEP 1: INPUT IDENTIFIER (EMAIL / USERNAME)              */
            /* ======================================================== */
            <>
              <View style={styles.cardHeader}>
                <View style={styles.stepBadge}>
                  <Text style={styles.stepBadgeText}>LANGKAH 1 DARI 2</Text>
                </View>
                <Text style={styles.cardTitle}>Lupa Kata Sandi?</Text>
                <Text style={styles.cardSubtitle}>
                  Masukkan alamat email atau username akun yang terdaftar. Kami akan mengirimkan kode verifikasi (OTP) ke email Anda.
                </Text>
              </View>

              {errorMsg ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color="#DC2626" />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}

              {successMsg ? (
                <View style={styles.successBox}>
                  <Ionicons name="checkmark-circle" size={18} color="#15803D" />
                  <Text style={styles.successText}>{successMsg}</Text>
                </View>
              ) : null}

              <ModernInput
                label="Email atau Username Akun *"
                placeholder="Contoh: siswa@gmail.com atau saputra"
                icon="mail-outline"
                value={identifier}
                onChangeText={(txt) => {
                  setIdentifier(txt);
                  if (errorMsg) setErrorMsg('');
                }}
                autoCapitalize="none"
              />

              <ModernButton
                title="KIRIM KODE KE EMAIL"
                onPress={handleRequestOtp}
                loading={loading}
                icon="paper-plane-outline"
                iconPosition="right"
                size="large"
                style={styles.submitBtn}
              />

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Ingat kata sandi Anda? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.7}
                >
                  <Text style={styles.footerLink}>Kembali ke Login</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* ======================================================== */
            /* STEP 2: INPUT KODE OTP & KATA SANDI BARU                 */
            /* ======================================================== */
            <>
              <View style={styles.cardHeader}>
                <View style={[styles.stepBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
                  <Text style={[styles.stepBadgeText, { color: '#059669' }]}>LANGKAH 2 DARI 2</Text>
                </View>
                <Text style={styles.cardTitle}>Atur Kata Sandi Baru</Text>
                <Text style={styles.cardSubtitle}>
                  Kode verifikasi 6 digit telah dikirim ke email terdaftar:
                </Text>
                <View style={styles.emailPill}>
                  <Ionicons name="mail" size={15} color="#1E3A8A" />
                  <Text style={styles.emailPillText}>{maskedEmail}</Text>
                </View>
              </View>

              {errorMsg ? (
                <View style={styles.errorBox}>
                  <Ionicons name="alert-circle" size={18} color="#DC2626" />
                  <Text style={styles.errorText}>{errorMsg}</Text>
                </View>
              ) : null}

              {successMsg ? (
                <View style={styles.successBox}>
                  <Ionicons name="checkmark-circle" size={18} color="#15803D" />
                  <Text style={styles.successText}>{successMsg}</Text>
                </View>
              ) : null}

              {/* Input Kode OTP */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kode Verifikasi OTP (6 Digit) *</Text>
                <View style={styles.otpInputWrapper}>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="Contoh: 123456"
                    placeholderTextColor="#94A3B8"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={otpCode}
                    onChangeText={(txt) => {
                      setOtpCode(txt);
                      if (errorMsg) setErrorMsg('');
                    }}
                  />
                </View>
              </View>

              {/* Input Password Baru */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kata Sandi Baru (Min. 8 Karakter) *</Text>
                <View style={styles.passwordWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Masukkan kata sandi baru"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showNewPassword}
                    value={newPassword}
                    onChangeText={(txt) => {
                      setNewPassword(txt);
                      if (errorMsg) setErrorMsg('');
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPassword(!showNewPassword)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showNewPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Konfirmasi Password Baru */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ulangi Kata Sandi Baru *</Text>
                <View style={styles.passwordWrapper}>
                  <Ionicons name="checkmark-done-outline" size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Ketik ulang kata sandi baru"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showConfirmPassword}
                    value={confirmPassword}
                    onChangeText={(txt) => {
                      setConfirmPassword(txt);
                      if (errorMsg) setErrorMsg('');
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Kirim Ulang OTP */}
              <View style={styles.resendRow}>
                <Text style={styles.resendText}>Tidak menerima kode? </Text>
                {timer > 0 ? (
                  <Text style={styles.timerText}>Kirim ulang ({timer}s)</Text>
                ) : (
                  <TouchableOpacity
                    onPress={handleResendOtp}
                    disabled={resending}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.resendLink}>
                      {resending ? 'Mengirim...' : 'Kirim Ulang Kode'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <ModernButton
                title="SIMPAN KATA SANDI BARU"
                onPress={handleResetPassword}
                loading={loading}
                icon="checkmark-circle-outline"
                iconPosition="right"
                size="large"
                style={styles.submitBtn}
              />

              <TouchableOpacity
                style={styles.changeEmailBtn}
                onPress={() => {
                  setStep(1);
                  setErrorMsg('');
                  setSuccessMsg('');
                }}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back-outline" size={16} color="#64748B" />
                <Text style={styles.changeEmailText}>Ganti Email / Username</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#172554',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    paddingTop: Platform.OS === 'ios' ? 60 : 36,
    paddingBottom: 28,
    paddingHorizontal: 20,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: Platform.OS === 'ios' ? 56 : 32,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconWrapper: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    ...SHADOWS.md,
  },
  brandLogo: {
    width: 66,
    height: 66,
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: 13,
    color: '#93C5FD',
    marginTop: 4,
    fontWeight: '600',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 32,
    ...SHADOWS.lg,
  },
  cardHeader: {
    marginBottom: 20,
  },
  stepBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 10,
  },
  stepBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    lineHeight: 19,
  },
  emailPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 8,
  },
  emailPillText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    gap: 8,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
    gap: 8,
  },
  successText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  otpInputWrapper: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    paddingHorizontal: 14,
  },
  otpInput: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E3A8A',
    letterSpacing: 4,
    textAlign: 'center',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  passwordInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 6,
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  resendText: {
    fontSize: 13,
    color: '#64748B',
  },
  timerText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#94A3B8',
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#2563EB',
  },
  submitBtn: {
    marginTop: 10,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
  },
  footerLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  changeEmailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 8,
    gap: 6,
  },
  changeEmailText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
  },
});
