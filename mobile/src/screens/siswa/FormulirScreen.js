import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { COLORS } from '../../config';

export default function FormulirScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form Fields
  const [namaLengkap, setNamaLengkap] = useState('');
  const [nisn, setNisn] = useState('');
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
  const [alamat, setAlamat] = useState('');
  const [namaOrtuWali, setNamaOrtuWali] = useState('');
  const [noHpOrtu, setNoHpOrtu] = useState('');
  const [asalSekolah, setAsalSekolah] = useState('');
  const [nomorPendaftaran, setNomorPendaftaran] = useState(null);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const res = await apiClient.get('/siswa/formulir');
      if (res.data.success) {
        const cs = res.data.data.calon_siswa;
        const pend = res.data.data.pendaftaran;

        if (cs) {
          setNamaLengkap(cs.nama_lengkap || '');
          setNisn(cs.nisn || '');
          setTempatLahir(cs.tempat_lahir || '');
          setTanggalLahir(cs.tanggal_lahir ? cs.tanggal_lahir.substring(0, 10) : '');
          setJenisKelamin(cs.jenis_kelamin || 'Laki-laki');
          setAlamat(cs.alamat || '');
          setNamaOrtuWali(cs.nama_ortu_wali || '');
          setNoHpOrtu(cs.no_hp_ortu || '');
        }

        if (pend) {
          setAsalSekolah(pend.asal_sekolah || '');
          setNomorPendaftaran(pend.nomor_pendaftaran);
        }
      }
    } catch (e) {
      console.log('Error fetching formulir data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    // Validasi sederhana di client
    if (
      !namaLengkap.trim() ||
      !nisn.trim() ||
      !tempatLahir.trim() ||
      !tanggalLahir.trim() ||
      !alamat.trim() ||
      !namaOrtuWali.trim() ||
      !noHpOrtu.trim() ||
      !asalSekolah.trim()
    ) {
      Alert.alert('Perhatian', 'Harap lengkapi semua kolom formulir.');
      return;
    }

    if (nisn.length !== 10) {
      Alert.alert('Perhatian', 'NISN harus terdiri dari 10 digit angka.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await apiClient.post('/siswa/formulir', {
        nama_lengkap: namaLengkap.trim(),
        nisn: nisn.trim(),
        tempat_lahir: tempatLahir.trim(),
        tanggal_lahir: tanggalLahir.trim(),
        jenis_kelamin: jenisKelamin,
        alamat: alamat.trim(),
        nama_ortu_wali: namaOrtuWali.trim(),
        no_hp_ortu: noHpOrtu.trim(),
        asal_sekolah: asalSekolah.trim(),
      });

      if (res.data.success) {
        setShowSuccessModal(true);
      }
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors) {
        const first = Object.values(errors)[0][0];
        Alert.alert('Gagal Validasi', first);
      } else {
        Alert.alert('Error', err.response?.data?.message || 'Gagal menyimpan formulir.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat formulir...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Banner Info Nomor Pendaftaran */}
        {nomorPendaftaran ? (
          <View style={styles.bannerInfo}>
            <Ionicons name="information-circle" size={20} color={COLORS.primary} />
            <Text style={styles.bannerText}>
              Nomor Pendaftaran: <Text style={styles.bold}>{nomorPendaftaran}</Text>
            </Text>
          </View>
        ) : null}

        {/* Section 1: Data Diri Calon Siswa */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>1. Data Pribadi Siswa</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Lengkap *</Text>
            <TextInput
              style={styles.input}
              placeholder="Sesuai Akta Kelahiran / Ijazah SD"
              value={namaLengkap}
              onChangeText={setNamaLengkap}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>NISN (10 Digit Angka) *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 0081234567"
              value={nisn}
              onChangeText={(t) => setNisn(t.replace(/[^0-9]/g, ''))}
              keyboardType="number-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Tempat Lahir *</Text>
              <TextInput
                style={styles.input}
                placeholder="Kota Kelahiran"
                value={tempatLahir}
                onChangeText={setTempatLahir}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Tgl Lahir (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 2011-05-20"
                value={tanggalLahir}
                onChangeText={setTanggalLahir}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Jenis Kelamin *</Text>
            <View style={styles.genderRow}>
              {['Laki-laki', 'Perempuan'].map((g) => (
                <TouchableOpacity
                  key={g}
                  style={[
                    styles.genderButton,
                    jenisKelamin === g && styles.genderButtonActive,
                  ]}
                  onPress={() => setJenisKelamin(g)}
                >
                  <Ionicons
                    name={g === 'Laki-laki' ? 'man-outline' : 'woman-outline'}
                    size={18}
                    color={jenisKelamin === g ? COLORS.white : COLORS.text}
                  />
                  <Text
                    style={[
                      styles.genderText,
                      jenisKelamin === g && styles.genderTextActive,
                    ]}
                  >
                    {g}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Alamat Lengkap *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Alamat tempat tinggal saat ini"
              value={alamat}
              onChangeText={setAlamat}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Section 2: Data Orang Tua / Wali */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>2. Data Orang Tua / Wali</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama Orang Tua / Wali *</Text>
            <TextInput
              style={styles.input}
              placeholder="Nama Ayah/Ibu/Wali"
              value={namaOrtuWali}
              onChangeText={setNamaOrtuWali}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>No. HP / WhatsApp Orang Tua *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: 081234567890"
              value={noHpOrtu}
              onChangeText={(t) => setNoHpOrtu(t.replace(/[^0-9+]/g, ''))}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Section 3: Data Asal Sekolah */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="school" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>3. Data Asal Sekolah</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama SD / MI Asal *</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: SDN 01 Dharma Bakti"
              value={asalSekolah}
              onChangeText={setAsalSekolah}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color={COLORS.white} />
          ) : (
            <>
              <Ionicons name="save-outline" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
              <Text style={styles.submitButtonText}>SIMPAN DATA FORMULIR</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Pemberitahuan Lanjut Mengisi Dokumen */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Ionicons name="checkmark-circle" size={48} color="#10B981" />
            </View>

            <Text style={styles.modalTitle}>Data Pribadi Disimpan!</Text>

            <Text style={styles.modalDesc}>
              Data formulir Anda telah berhasil tersimpan. Silakan lanjutkan ke tahap berikutnya untuk mengunggah dokumen persyaratan pendaftaran.
            </Text>

            <View style={styles.modalStepsBox}>
              <View style={styles.stepItemDone}>
                <Ionicons name="checkmark-circle" size={16} color="#10B981" />
                <Text style={styles.stepTextDone}>1. Formulir Data Pribadi (Selesai)</Text>
              </View>
              <View style={styles.stepItemNext}>
                <Ionicons name="arrow-forward-circle" size={16} color={COLORS.primary} />
                <Text style={styles.stepTextNext}>2. Unggah Dokumen Persyaratan</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.modalPrimaryBtn}
              activeOpacity={0.85}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('TabDokumen');
              }}
            >
              <Text style={styles.modalPrimaryBtnText}>Lanjut Mengisi Dokumen</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalSecondaryBtn}
              activeOpacity={0.7}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalSecondaryBtnText}>Nanti Saja</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.textMuted,
    fontSize: 13,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  bannerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  bannerText: {
    fontSize: 13,
    color: COLORS.primaryDark,
    marginLeft: 8,
  },
  bold: {
    fontWeight: '800',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginLeft: 8,
  },
  inputGroup: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 13,
    color: COLORS.text,
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 70,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  genderRow: {
    flexDirection: 'row',
    gap: 10,
  },
  genderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    gap: 6,
  },
  genderButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  genderText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  genderTextActive: {
    color: COLORS.white,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  modalIconWrap: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalStepsBox: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 18,
    gap: 8,
  },
  stepItemDone: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepTextDone: {
    fontSize: 12,
    color: '#059669',
    fontWeight: '600',
  },
  stepItemNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepTextNext: {
    fontSize: 12,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  modalPrimaryBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    height: 48,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  },
  modalPrimaryBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  modalSecondaryBtn: {
    height: 38,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSecondaryBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
