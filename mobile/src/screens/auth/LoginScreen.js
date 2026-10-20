import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Modal,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, DEFAULT_API_URL } from '../../config';
import ModernInput from '../../components/ModernInput';
import ModernButton from '../../components/ModernButton';

export default function LoginScreen({ navigation }) {
  const { login, updateServerUrl, apiUrl } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal konfigurasi Server IP
  const [modalVisible, setModalVisible] = useState(false);
  const [customUrl, setCustomUrl] = useState(apiUrl || DEFAULT_API_URL);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError('Harap masukkan username/email dan password.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await login(username.trim(), password);
      if (!res.success) {
        setError(res.message || 'Kredensial salah. Periksa kembali akun Anda.');
      }
    } catch (err) {
      if (err.response?.data?.requires_otp) {
        Alert.alert(
          'Verifikasi OTP Diperlukan',
          err.response.data.message || 'Silakan verifikasi kode OTP email Anda.',
          [
            {
              text: 'Masukkan OTP',
              onPress: () =>
                navigation.navigate('Otp', { email: err.response.data.email }),
            },
          ]
        );
      } else {
        const msg =
          err.response?.data?.errors?.username?.[0] ||
          err.response?.data?.message ||
          'Gagal terhubung ke backend Laravel. Periksa URL API di pengaturan (ikon gear).';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveServerUrl = async () => {
    if (customUrl.trim()) {
      await updateServerUrl(customUrl.trim());
      setModalVisible(false);
      Alert.alert('Berhasil', 'URL Server backend Laravel berhasil diperbarui.');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Modern Clean Branding Hero */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="settings-outline" size={20} color={COLORS.white} />
          </TouchableOpacity>

          <View style={styles.brandIconWrapper}>
            <Image
              source={Platform.OS === 'web' ? { uri: '/logo.png' } : require('../../../assets/logo.png')}
              style={styles.brandLogo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.brandTitle}>SMP DHARMA BAKTI</Text>
          <Text style={styles.brandSubtitle}>
            Portal Penerimaan Murid Baru Berbasis Mobile
          </Text>
        </View>

        {/* Clean White Card Form */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Masuk ke Akun</Text>
            <Text style={styles.cardSubtitle}>
              Gunakan akun siswa, panitia admin, atau kepala sekolah
            </Text>
          </View>

          {error ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={COLORS.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Input Username */}
          <ModernInput
            label="Username atau Email"
            placeholder="Masukkan username atau email Anda"
            icon="person-outline"
            value={username}
            onChangeText={(txt) => {
              setUsername(txt);
              if (error) setError('');
            }}
            autoCapitalize="none"
          />

          {/* Input Password */}
          <ModernInput
            label="Kata Sandi"
            placeholder="Masukkan kata sandi Anda"
            icon="lock-closed-outline"
            isPassword={true}
            value={password}
            onChangeText={(txt) => {
              setPassword(txt);
              if (error) setError('');
            }}
          />

          {/* Lupa Kata Sandi */}
          <View style={styles.forgotPasswordRow}>
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.forgotPasswordLink}>Lupa Kata Sandi?</Text>
            </TouchableOpacity>
          </View>

          {/* CTA Submit Button */}
          <ModernButton
            title="MASUK SEKARANG"
            onPress={handleLogin}
            loading={loading}
            icon="log-in-outline"
            iconPosition="right"
            size="large"
            style={styles.submitBtn}
          />

          {/* Register Link */}
          <View style={styles.registerRow}>
            <Text style={styles.registerText}>Belum memiliki akun pendaftar? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.registerLink}>Daftar Siswa Baru</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Modal Settings Server URL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>⚙️ Pengaturan API Server</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color={COLORS.textMuted} />
              </TouchableOpacity>
            </View>

            <Text style={styles.modalDesc}>
              Arahkan endpoint REST API ke IP komputer tempat server Laravel berjalan:
            </Text>

            <ModernInput
              label="URL Endpoint Laravel"
              value={customUrl}
              onChangeText={setCustomUrl}
              placeholder="http://192.168.1.8:8000/api"
              autoCapitalize="none"
              style={{ marginBottom: SPACING.md }}
            />

            <View style={styles.modalHelperBox}>
              <Text style={styles.modalHelperText}>
                • Emulator Android: http://10.0.2.2:8000/api{'\n'}
                • Smartphone Fisik WiFi: http://192.168.1.8:8000/api{'\n'}
                • Laragon Virtual Host: http://spmb-smp-dharma-bakti.test/api
              </Text>
            </View>

            <View style={styles.modalActions}>
              <ModernButton
                title="Batal"
                variant="outline"
                size="small"
                onPress={() => setModalVisible(false)}
                style={{ flex: 1, marginRight: SPACING.sm }}
              />
              <ModernButton
                title="Simpan URL"
                variant="primary"
                size="small"
                onPress={handleSaveServerUrl}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: 54,
    paddingBottom: SPACING['3xl'],
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING['2xl'],
    position: 'relative',
    paddingTop: SPACING.xs,
  },
  settingsButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    width: 40,
    height: 40,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandIconWrapper: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    ...SHADOWS.md,
  },
  brandLogo: {
    width: 76,
    height: 76,
  },
  brandTitle: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.extraBold,
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    marginTop: 4,
    maxWidth: 260,
  },

  // Card Form
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    ...SHADOWS.lg,
  },
  cardHeader: {
    marginBottom: SPACING.xl,
  },
  cardTitle: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
  cardSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.dangerSoft,
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
    gap: 8,
  },
  errorText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs + 1,
    color: COLORS.dangerDark,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  forgotPasswordRow: {
    alignItems: 'flex-end',
    marginTop: -4,
    marginBottom: SPACING.md,
  },
  forgotPasswordLink: {
    fontSize: TYPOGRAPHY.size.xs + 1,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  submitBtn: {
    marginTop: SPACING.xs,
    marginBottom: SPACING.lg,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: SPACING.xs,
  },
  registerText: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
  },
  registerLink: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.primary,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING['2xl'],
    width: '100%',
    maxWidth: 400,
    ...SHADOWS.lg,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    fontSize: TYPOGRAPHY.size.md,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
  modalDesc: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  modalHelperBox: {
    backgroundColor: COLORS.cardSubtle,
    padding: SPACING.md,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.xl,
  },
  modalHelperText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  modalActions: {
    flexDirection: 'row',
  },
});
