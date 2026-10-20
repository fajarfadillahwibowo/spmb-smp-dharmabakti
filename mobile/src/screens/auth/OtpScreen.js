import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS } from '../../config';

export default function OtpScreen({ route, navigation }) {
  const { email } = route.params || {};
  const { verifyOtp, resendOtp } = useAuth();
  const [otpCode, setOtpCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval = null;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      setError('Kode OTP harus terdiri dari 6 digit angka.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await verifyOtp(email, otpCode);
      if (!res.success) {
        setError(res.message || 'Verifikasi OTP gagal.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Kode OTP salah atau telah kadaluarsa.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;
    setResending(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await resendOtp(email);
      if (res.success) {
        setSuccessMsg(res.message || 'Kode OTP baru telah berhasil dikirim ke email Anda.');
        setTimer(60);
      } else {
        setError(res.message || 'Gagal mengirim ulang OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengirim ulang OTP.');
    } finally {
      setResending(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons name="mail-open-outline" size={36} color={COLORS.primary} />
        </View>

        <Text style={styles.title}>Verifikasi OTP</Text>
        <Text style={styles.subtitle}>
          Masukkan 6 digit kode verifikasi yang dikirim ke email:
        </Text>
        <Text style={styles.emailText}>{email}</Text>

        {/* Notifikasi Error */}
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Notifikasi Sukses Kirim Ulang */}
        {successMsg ? (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={18} color="#15803D" />
            <Text style={styles.successText}>{successMsg}</Text>
          </View>
        ) : null}

        {/* Input OTP */}
        <TextInput
          style={styles.otpInput}
          value={otpCode}
          onChangeText={(text) => setOtpCode(text.replace(/[^0-9]/g, ''))}
          maxLength={6}
          keyboardType="number-pad"
          placeholder="000000"
          placeholderTextColor="#CBD5E1"
          textAlign="center"
          autoFocus
        />

        {/* Verify Button */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleVerify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <Text style={styles.buttonText}>VERIFIKASI & MASUK</Text>
          )}
        </TouchableOpacity>

        {/* Resend Button */}
        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Tidak menerima email? </Text>
          {timer > 0 ? (
            <Text style={styles.timerText}>Kirim ulang ({timer}s)</Text>
          ) : (
            <TouchableOpacity onPress={handleResend} disabled={resending}>
              {resending ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.resendLink}>Kirim Ulang OTP</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.backText}>Kembali ke Halaman Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 2,
    marginBottom: 18,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
  },
  otpInput: {
    width: '100%',
    height: 56,
    borderWidth: 2,
    borderColor: COLORS.primaryLight,
    borderRadius: 12,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 12,
    color: COLORS.text,
    backgroundColor: '#F8FAFC',
    marginBottom: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 48,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1,
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  resendText: {
    fontSize: 13,
    color: COLORS.textMuted,
  },
  timerText: {
    fontSize: 13,
    color: COLORS.textMuted,
    fontWeight: '600',
  },
  resendLink: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryLight,
  },
  successBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  successText: {
    color: '#15803D',
    fontSize: 12,
    marginLeft: 8,
    flex: 1,
    fontWeight: '600',
  },
  backLink: {
    marginTop: 6,
  },
  backText: {
    fontSize: 12,
    color: COLORS.textMuted,
    textDecorationLine: 'underline',
  },
});

