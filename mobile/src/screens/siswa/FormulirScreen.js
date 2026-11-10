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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { COLORS, PALETTE_3D, STYLES_3D } from '../../config';

const AGAMA_OPTIONS = [
  'Islam',
  'Kristen Protestan',
  'Katolik',
  'Hindu',
  'Buddha',
  'Konghucu',
];

const UKURAN_PAKAIAN_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL'];

export default function FormulirScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // 1. Nama Peserta Didik
  const [namaLengkap, setNamaLengkap] = useState('');
  // 2. Tempat / tanggal lahir
  const [tempatLahir, setTempatLahir] = useState('');
  const [tanggalLahir, setTanggalLahir] = useState('');
  // 3. NO KK
  const [noKk, setNoKk] = useState('');
  // 4. NIK
  const [nik, setNik] = useState('');
  // 5. NISN
  const [nisn, setNisn] = useState('');
  // Jenis Kelamin
  const [jenisKelamin, setJenisKelamin] = useState('Laki-laki');
  // 6. Agama
  const [agama, setAgama] = useState('Islam');
  // 7. Alamat Peserta Didik
  const [alamat, setAlamat] = useState('');

  // 8. Data Wali:
  // Data Ayah
  const [namaAyah, setNamaAyah] = useState('');
  const [pekerjaanAyah, setPekerjaanAyah] = useState('');
  const [alamatAyah, setAlamatAyah] = useState('');
  // Data Ibu
  const [namaIbu, setNamaIbu] = useState('');
  const [pekerjaanIbu, setPekerjaanIbu] = useState('');
  const [alamatIbu, setAlamatIbu] = useState('');

  // 9. Asal Sekolah
  const [asalSekolah, setAsalSekolah] = useState('');
  // 10. No. HP yang bisa dihubungi
  const [noHp, setNoHp] = useState('');
  // 11. Ukuran Pakaian
  const [ukuranPakaian, setUkuranPakaian] = useState('M');

  const [nomorPendaftaran, setNomorPendaftaran] = useState(null);

  useEffect(() => {
    fetchFormData();
  }, []);

  const fetchFormData = async () => {
    try {
      const res = await apiClient.get('/siswa/formulir');
      if (res.data?.success) {
        const cs = res.data.data?.calon_siswa;
        const pend = res.data.data?.pendaftaran;

        if (cs) {
          setNamaLengkap(cs.nama_lengkap || '');
          setTempatLahir(cs.tempat_lahir || '');
          setTanggalLahir(cs.tanggal_lahir ? cs.tanggal_lahir.substring(0, 10) : '');
          setNoKk(cs.no_kk || '');
          setNik(cs.nik || '');
          setNisn(cs.nisn || '');
          setJenisKelamin(cs.jenis_kelamin || 'Laki-laki');
          setAgama(cs.agama || 'Islam');
          setAlamat(cs.alamat || '');

          setNamaAyah(cs.nama_ayah || cs.nama_ortu_wali || '');
          setPekerjaanAyah(cs.pekerjaan_ayah || '');
          setAlamatAyah(cs.alamat_ayah || cs.alamat || '');

          setNamaIbu(cs.nama_ibu || '');
          setPekerjaanIbu(cs.pekerjaan_ibu || '');
          setAlamatIbu(cs.alamat_ibu || cs.alamat || '');

          setNoHp(cs.no_hp_ortu || '');
          setUkuranPakaian(cs.ukuran_pakaian || 'M');
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

  const handleCopyAddressToAyah = () => {
    if (alamat.trim()) {
      setAlamatAyah(alamat.trim());
    }
  };

  const handleCopyAddressToIbu = () => {
    if (alamat.trim()) {
      setAlamatIbu(alamat.trim());
    }
  };

  const handleSubmit = async () => {
    // Validasi field utama
    if (
      !namaLengkap.trim() ||
      !tempatLahir.trim() ||
      !tanggalLahir.trim() ||
      !nisn.trim() ||
      !agama.trim() ||
      !alamat.trim() ||
      !asalSekolah.trim() ||
      !noHp.trim()
    ) {
      Alert.alert(
        'Perhatian',
        'Harap lengkapi semua kolom bertanda (*) sebelum menyimpan formulir.'
      );
      return;
    }

    if (nisn.trim().length !== 10) {
      Alert.alert('Perhatian', 'NISN harus terdiri dari 10 digit angka resmi.');
      return;
    }

    if (noKk.trim() && noKk.trim().length !== 16) {
      Alert.alert('Perhatian', 'Nomor KK harus terdiri dari 16 digit angka.');
      return;
    }

    if (nik.trim() && nik.trim().length !== 16) {
      Alert.alert('Perhatian', 'NIK harus terdiri dari 16 digit angka.');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        nama_lengkap: namaLengkap.trim(),
        tempat_lahir: tempatLahir.trim(),
        tanggal_lahir: tanggalLahir.trim(),
        no_kk: noKk.trim(),
        nik: nik.trim(),
        nisn: nisn.trim(),
        jenis_kelamin: jenisKelamin,
        agama: agama,
        alamat: alamat.trim(),
        nama_ayah: namaAyah.trim(),
        pekerjaan_ayah: pekerjaanAyah.trim(),
        alamat_ayah: alamatAyah.trim(),
        nama_ibu: namaIbu.trim(),
        pekerjaan_ibu: pekerjaanIbu.trim(),
        alamat_ibu: alamatIbu.trim(),
        nama_ortu_wali: namaAyah.trim() || namaIbu.trim(),
        asal_sekolah: asalSekolah.trim(),
        no_hp_ortu: noHp.trim(),
        ukuran_pakaian: ukuranPakaian,
      };

      const res = await apiClient.post('/siswa/formulir', payload);

      if (res.data?.success) {
        if (res.data.data?.pendaftaran?.nomor_pendaftaran) {
          setNomorPendaftaran(res.data.data.pendaftaran.nomor_pendaftaran);
        }
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
        <View style={styles.loadingOrb3D}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        <Text style={styles.loadingText}>Memuat Formulir PPDB...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* ═══════════════════════════════════════
            KOP SURAT RESMI SMP DHARMA BAKTI (3D)
        ═══════════════════════════════════════ */}
        <View style={styles.kopCard3D}>
          <View style={styles.kopSpecularShine} />

          <View style={styles.kopHeaderRow}>
            <View style={styles.kopLogoWrap}>
              <Image
                source={require('../../../assets/logo.png')}
                style={styles.kopLogoImage}
                resizeMode="contain"
              />
            </View>

            <View style={styles.kopTextCol}>
              <Text style={styles.kopYayasan}>YAYASAN PENDIDIKAN DHARMA BAKTI</Text>
              <Text style={styles.kopSekolah}>SMP DHARMA BAKTI</Text>
              <View style={styles.kopBadgeAkreditasi}>
                <Text style={styles.kopBadgeText}>STATUS TERAKREDITASI</Text>
              </View>
              <Text style={styles.kopNds}>
                NDS: 2011050007  |  NSS: 2011020018  |  NPSN: 10609254
              </Text>
            </View>
          </View>

          <View style={styles.kopDivider} />

          <Text style={styles.kopAlamat}>
            Jln. Rambutan, Rt.10 dusun 2 Desa Suka Maju Kec. Lempuing Jaya
          </Text>
          <Text style={styles.kopKontak}>
            Kab. OKI Prop. Sumatera Selatan  •  Kode Pos: 30657  •  Telp: 082185769311
          </Text>
          <Text style={styles.kopEmail}>Email: smpsdb72@gmail.com</Text>

          {/* Judul Formulir PPDB */}
          <View style={styles.kopJudulBox}>
            <Text style={styles.kopJudulText}>
              FORMULIR PENDAFTARAN PPDB SMP DHARMA BAKTI
            </Text>
            <Text style={styles.kopTahunText}>TAHUN PELAJARAN 2026 / 2027</Text>
            {nomorPendaftaran ? (
              <View style={styles.kopNomorBadge}>
                <Ionicons name="card" size={12} color="#1E3A8A" />
                <Text style={styles.kopNomorText}>No. Pendaftaran: {nomorPendaftaran}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ═══════════════════════════════════════
            BAGIAN 1: DATA PESERTA DIDIK (No. 1 - 7)
        ═══════════════════════════════════════ */}
        <View style={styles.clayCard3D}>
          <View style={styles.cardHeader3D}>
            <View style={[styles.sectionOrbSmall, { backgroundColor: '#2563EB', borderColor: '#60A5FA', borderBottomColor: '#1D4ED8' }]}>
              <Ionicons name="person" size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardTitle3D}>Data Peserta Didik</Text>
              <Text style={styles.cardSubtitle3D}>Kolom 1 s/d 7 Formulir PPDB</Text>
            </View>
          </View>

          {/* 1. Nama Peserta Didik */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.itemNumberBadge}>1</Text>
              <Text style={styles.label3D}>Nama Peserta Didik *</Text>
            </View>
            <View style={styles.inputWrap3D}>
              <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input3D}
                placeholder="Nama lengkap sesuai Ijazah SD / Akta Kelahiran"
                placeholderTextColor="#94A3B8"
                value={namaLengkap}
                onChangeText={setNamaLengkap}
              />
            </View>
          </View>

          {/* 2. Tempat / Tanggal Lahir */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.itemNumberBadge}>2</Text>
              <Text style={styles.label3D}>Tempat / Tanggal Lahir *</Text>
            </View>
            <View style={styles.row}>
              <View style={[styles.inputWrap3D, { flex: 1, marginRight: 8 }]}>
                <Ionicons name="location-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input3D}
                  placeholder="Tempat Lahir (Kota/Kab)"
                  placeholderTextColor="#94A3B8"
                  value={tempatLahir}
                  onChangeText={setTempatLahir}
                />
              </View>
              <View style={[styles.inputWrap3D, { flex: 1 }]}>
                <Ionicons name="calendar-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input3D}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94A3B8"
                  value={tanggalLahir}
                  onChangeText={setTanggalLahir}
                />
              </View>
            </View>
            <Text style={styles.hintText}>Format tanggal lahir: TAHUN-BULAN-TANGGAL (Contoh: 2012-05-18)</Text>
          </View>

          {/* 3. NO KK */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.itemNumberBadge}>3</Text>
              <Text style={styles.label3D}>NO KK (Nomor Kartu Keluarga)</Text>
            </View>
            <View style={styles.inputWrap3D}>
              <Ionicons name="document-text-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input3D}
                placeholder="16 digit nomor Kartu Keluarga"
                placeholderTextColor="#94A3B8"
                value={noKk}
                onChangeText={(t) => setNoKk(t.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={16}
              />
            </View>
          </View>

          {/* 4. NIK */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.itemNumberBadge}>4</Text>
              <Text style={styles.label3D}>NIK (Nomor Induk Kependudukan)</Text>
            </View>
            <View style={styles.inputWrap3D}>
              <Ionicons name="finger-print-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input3D}
                placeholder="16 digit NIK siswa (lihat di Kartu Keluarga)"
                placeholderTextColor="#94A3B8"
                value={nik}
                onChangeText={(t) => setNik(t.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={16}
              />
            </View>
          </View>

          {/* 5. NISN */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.itemNumberBadge}>5</Text>
              <Text style={styles.label3D}>NISN (10 Digit Angka) *</Text>
            </View>
            <View style={styles.inputWrap3D}>
              <Ionicons name="card-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input3D}
                placeholder="Contoh: 0081234567"
                placeholderTextColor="#94A3B8"
                value={nisn}
                onChangeText={(t) => setNisn(t.replace(/[^0-9]/g, ''))}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
          </View>

          {/* Jenis Kelamin */}
          <View style={styles.inputGroup}>
            <Text style={styles.label3D}>Jenis Kelamin *</Text>
            <View style={styles.genderRow3D}>
              {['Laki-laki', 'Perempuan'].map((g) => {
                const isActive = jenisKelamin === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.genderBtn3D,
                      isActive && styles.genderBtnActive3D,
                    ]}
                    activeOpacity={0.8}
                    onPress={() => setJenisKelamin(g)}
                  >
                    <Ionicons
                      name={g === 'Laki-laki' ? 'man' : 'woman'}
                      size={18}
                      color={isActive ? '#FFFFFF' : '#64748B'}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={[styles.genderText3D, isActive && styles.genderTextActive3D]}>
                      {g}
                    </Text>
                    {isActive && (
                      <Ionicons name="checkmark-circle" size={16} color="#FFFFFF" style={{ marginLeft: 6 }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 6. Agama */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.itemNumberBadge}>6</Text>
              <Text style={styles.label3D}>Agama *</Text>
            </View>
            <View style={styles.pillsWrap}>
              {AGAMA_OPTIONS.map((item) => {
                const isActive = agama === item;
                return (
                  <TouchableOpacity
                    key={item}
                    style={[styles.pillBtn3D, isActive && styles.pillBtnActive3D]}
                    activeOpacity={0.8}
                    onPress={() => setAgama(item)}
                  >
                    <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                      {item}
                    </Text>
                    {isActive && (
                      <Ionicons name="checkmark-circle" size={14} color="#FFFFFF" style={{ marginLeft: 4 }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* 7. Alamat Peserta Didik */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.itemNumberBadge}>7</Text>
              <Text style={styles.label3D}>Alamat Peserta Didik *</Text>
            </View>
            <View style={[styles.inputWrap3D, { alignItems: 'flex-start', paddingTop: 10 }]}>
              <Ionicons name="home-outline" size={18} color="#64748B" style={[styles.inputIcon, { marginTop: 2 }]} />
              <TextInput
                style={[styles.input3D, styles.textArea3D]}
                placeholder="Dusun / Desa / RT / RW / Kecamatan / Kab"
                placeholderTextColor="#94A3B8"
                value={alamat}
                onChangeText={setAlamat}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════
            BAGIAN 2: DATA WALI (No. 8)
        ═══════════════════════════════════════ */}
        <View style={styles.clayCard3D}>
          <View style={styles.cardHeader3D}>
            <View style={[styles.sectionOrbSmall, { backgroundColor: '#8B5CF6', borderColor: '#A78BFA', borderBottomColor: '#6D28D9' }]}>
              <Ionicons name="people" size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <View style={styles.labelRow}>
                <Text style={styles.itemNumberBadge}>8</Text>
                <Text style={styles.cardTitle3D}>Data Wali / Orang Tua</Text>
              </View>
              <Text style={styles.cardSubtitle3D}>Informasi Ayah dan Ibu calon siswa</Text>
            </View>
          </View>

          {/* SUB-KARTU AYAH */}
          <View style={styles.subCard3D}>
            <View style={styles.subCardHeader}>
              <Ionicons name="man-outline" size={16} color="#1E3A8A" />
              <Text style={styles.subCardTitle}>Data Ayah</Text>
            </View>

            {/* Nama Ayah */}
            <View style={styles.inputGroup}>
              <Text style={styles.label3D}>Nama Ayah</Text>
              <View style={styles.inputWrap3D}>
                <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input3D}
                  placeholder="Nama lengkap ayah kandung / wali"
                  placeholderTextColor="#94A3B8"
                  value={namaAyah}
                  onChangeText={setNamaAyah}
                />
              </View>
            </View>

            {/* Pekerjaan Ayah */}
            <View style={styles.inputGroup}>
              <Text style={styles.label3D}>Pekerjaan Ayah</Text>
              <View style={styles.inputWrap3D}>
                <Ionicons name="briefcase-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input3D}
                  placeholder="Contoh: Petani / Wiraswasta / PNS / Buruh"
                  placeholderTextColor="#94A3B8"
                  value={pekerjaanAyah}
                  onChangeText={setPekerjaanAyah}
                />
              </View>
            </View>

            {/* Alamat Ayah */}
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={styles.label3D}>Alamat Ayah</Text>
                <TouchableOpacity onPress={handleCopyAddressToAyah} style={styles.btnQuickCopy}>
                  <Ionicons name="copy-outline" size={12} color="#2563EB" />
                  <Text style={styles.btnQuickCopyText}>Sama dengan alamat siswa</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputWrap3D, { alignItems: 'flex-start', paddingTop: 8 }]}>
                <Ionicons name="location-outline" size={18} color="#64748B" style={[styles.inputIcon, { marginTop: 2 }]} />
                <TextInput
                  style={[styles.input3D, styles.textAreaMini3D]}
                  placeholder="Alamat tempat tinggal ayah"
                  placeholderTextColor="#94A3B8"
                  value={alamatAyah}
                  onChangeText={setAlamatAyah}
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>
          </View>

          {/* SUB-KARTU IBU */}
          <View style={[styles.subCard3D, { marginTop: 14 }]}>
            <View style={styles.subCardHeader}>
              <Ionicons name="woman-outline" size={16} color="#BE185D" />
              <Text style={[styles.subCardTitle, { color: '#BE185D' }]}>Data Ibu</Text>
            </View>

            {/* Nama Ibu */}
            <View style={styles.inputGroup}>
              <Text style={styles.label3D}>Nama Ibu</Text>
              <View style={styles.inputWrap3D}>
                <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input3D}
                  placeholder="Nama lengkap ibu kandung"
                  placeholderTextColor="#94A3B8"
                  value={namaIbu}
                  onChangeText={setNamaIbu}
                />
              </View>
            </View>

            {/* Pekerjaan Ibu */}
            <View style={styles.inputGroup}>
              <Text style={styles.label3D}>Pekerjaan Ibu</Text>
              <View style={styles.inputWrap3D}>
                <Ionicons name="briefcase-outline" size={18} color="#64748B" style={styles.inputIcon} />
                <TextInput
                  style={styles.input3D}
                  placeholder="Contoh: Ibu Rumah Tangga / Wiraswasta / Guru"
                  placeholderTextColor="#94A3B8"
                  value={pekerjaanIbu}
                  onChangeText={setPekerjaanIbu}
                />
              </View>
            </View>

            {/* Alamat Ibu */}
            <View style={styles.inputGroup}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={styles.label3D}>Alamat Ibu</Text>
                <TouchableOpacity onPress={handleCopyAddressToIbu} style={styles.btnQuickCopy}>
                  <Ionicons name="copy-outline" size={12} color="#2563EB" />
                  <Text style={styles.btnQuickCopyText}>Sama dengan alamat siswa</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.inputWrap3D, { alignItems: 'flex-start', paddingTop: 8 }]}>
                <Ionicons name="location-outline" size={18} color="#64748B" style={[styles.inputIcon, { marginTop: 2 }]} />
                <TextInput
                  style={[styles.input3D, styles.textAreaMini3D]}
                  placeholder="Alamat tempat tinggal ibu"
                  placeholderTextColor="#94A3B8"
                  value={alamatIbu}
                  onChangeText={setAlamatIbu}
                  multiline
                  numberOfLines={2}
                />
              </View>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════
            BAGIAN 3: SEKOLAH, KONTAK & PAKAIAN (No. 9 - 11)
        ═══════════════════════════════════════ */}
        <View style={styles.clayCard3D}>
          <View style={styles.cardHeader3D}>
            <View style={[styles.sectionOrbSmall, { backgroundColor: '#06B6D4', borderColor: '#22D3EE', borderBottomColor: '#0891B2' }]}>
              <Ionicons name="school" size={16} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.cardTitle3D}>Asal Sekolah & Perlengkapan</Text>
              <Text style={styles.cardSubtitle3D}>Kolom 9 s/d 11 Formulir PPDB</Text>
            </View>
          </View>

          {/* 9. Asal Sekolah */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.itemNumberBadge}>9</Text>
              <Text style={styles.label3D}>Asal Sekolah (SD / MI) *</Text>
            </View>
            <View style={styles.inputWrap3D}>
              <Ionicons name="school-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.input3D}
                placeholder="Contoh: SDN 01 Suka Maju"
                placeholderTextColor="#94A3B8"
                value={asalSekolah}
                onChangeText={setAsalSekolah}
              />
            </View>
          </View>

          {/* 10. No. HP yang bisa dihubungi */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.itemNumberBadge}>10</Text>
              <Text style={styles.label3D}>No. HP yang bisa dihubungi (WhatsApp) *</Text>
            </View>
            <View style={styles.inputWrap3D}>
              <Ionicons name="logo-whatsapp" size={18} color="#10B981" style={styles.inputIcon} />
              <TextInput
                style={styles.input3D}
                placeholder="Contoh: 082185769311"
                placeholderTextColor="#94A3B8"
                value={noHp}
                onChangeText={(t) => setNoHp(t.replace(/[^0-9+]/g, ''))}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* 11. Ukuran Pakaian */}
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.itemNumberBadge}>11</Text>
              <Text style={styles.label3D}>Ukuran Pakaian Seragam</Text>
            </View>
            <View style={styles.sizeRow3D}>
              {UKURAN_PAKAIAN_OPTIONS.map((size) => {
                const isActive = ukuranPakaian === size;
                return (
                  <TouchableOpacity
                    key={size}
                    style={[styles.sizeBtn3D, isActive && styles.sizeBtnActive3D]}
                    activeOpacity={0.8}
                    onPress={() => setUkuranPakaian(size)}
                  >
                    <Text style={[styles.sizeBtnText, isActive && styles.sizeBtnTextActive]}>
                      {size}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════
            TOMBOL SIMPAN (3D Extruded Button)
        ═══════════════════════════════════════ */}
        <TouchableOpacity
          style={[styles.btnSubmit3D, submitting && styles.btnDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          <View style={styles.btnShine3D} />
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="cloud-upload" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.btnSubmitText3D}>SIMPAN FORMULIR PENDAFTARAN</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* ═══════════════════════════════════════
          3D POP-UP MODAL SUKSES SIMPAN
      ═══════════════════════════════════════ */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard3D}>
            <View style={styles.modalOrb3D}>
              <View style={styles.orbSpecular} />
              <Ionicons name="checkmark-circle" size={44} color="#FFFFFF" />
            </View>

            <Text style={styles.modalTitle3D}>Selamat!</Text>
            <View style={styles.modalSuccessPill}>
              <Ionicons name="sparkles" size={15} color="#059669" style={{ marginRight: 6 }} />
              <Text style={styles.modalSuccessPillText}>Formulir Anda Berhasil Di Unggah</Text>
            </View>

            {nomorPendaftaran ? (
              <View style={styles.modalRegBadge}>
                <Ionicons name="bookmark" size={13} color="#1D4ED8" style={{ marginRight: 6 }} />
                <Text style={styles.modalRegText}>No. Pendaftaran: {nomorPendaftaran}</Text>
              </View>
            ) : null}

            <Text style={styles.modalDesc3D}>
              Data formulir pendaftaran PPDB SMP Dharma Bakti telah berhasil disimpan di sistem. Silakan lanjutkan untuk mengunggah dokumen persyaratan.
            </Text>

            <TouchableOpacity
              style={styles.modalBtn3D}
              activeOpacity={0.85}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('TabDokumen');
              }}
            >
              <Text style={styles.modalBtnText3D}>Lanjut Unggah Dokumen</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              activeOpacity={0.7}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalCloseText}>Tetap di Halaman Ini</Text>
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
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 20,
  },
  loadingOrb3D: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderBottomWidth: 5,
    borderBottomColor: '#172554',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },

  /* ─── KOP SURAT RESMI SMP DHARMA BAKTI ─── */
  kopCard3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#DBEAFE',
    borderBottomWidth: 5,
    borderBottomColor: '#93C5FD',
    marginBottom: 16,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 24px -6px rgba(30, 58, 138, 0.12)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  kopSpecularShine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 3,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 999,
  },
  kopHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  kopLogoWrap: {
    width: 64,
    height: 64,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kopLogoImage: {
    width: '100%',
    height: '100%',
  },
  kopTextCol: {
    flex: 1,
  },
  kopYayasan: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  kopSekolah: {
    fontSize: 18,
    fontWeight: '900',
    color: '#1E3A8A',
    letterSpacing: 0.5,
    marginTop: 1,
  },
  kopBadgeAkreditasi: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginVertical: 3,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  kopBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#1D4ED8',
    letterSpacing: 0.5,
  },
  kopNds: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
  },
  kopDivider: {
    width: '100%',
    height: 2,
    backgroundColor: '#1E3A8A',
    marginVertical: 8,
  },
  kopAlamat: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
    lineHeight: 15,
  },
  kopKontak: {
    fontSize: 9.5,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 2,
  },
  kopEmail: {
    fontSize: 9.5,
    color: '#2563EB',
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 1,
  },
  kopJudulBox: {
    width: '100%',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  kopJudulText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  kopTahunText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    textAlign: 'center',
    marginTop: 2,
    letterSpacing: 1,
  },
  kopNomorBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginTop: 6,
    gap: 4,
  },
  kopNomorText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
  },

  /* ─── Claymorphic 3D Card ─── */
  clayCard3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 18px -4px rgba(15, 23, 42, 0.06)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  cardHeader3D: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionOrbSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 3,
  },
  cardTitle3D: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  cardSubtitle3D: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },

  /* ─── Labels & Inputs ─── */
  inputGroup: {
    marginBottom: 14,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  itemNumberBadge: {
    backgroundColor: '#1E3A8A',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    lineHeight: 18,
    marginRight: 6,
  },
  label3D: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#334155',
  },
  hintText: {
    fontSize: 10.5,
    color: '#64748B',
    marginTop: 4,
    fontStyle: 'italic',
  },
  inputWrap3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 8,
  },
  input3D: {
    flex: 1,
    height: 44,
    fontSize: 13.5,
    color: '#0F172A',
    fontWeight: '500',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },
  textArea3D: {
    height: 68,
    textAlignVertical: 'top',
    paddingTop: 6,
  },
  textAreaMini3D: {
    height: 50,
    textAlignVertical: 'top',
    paddingTop: 4,
  },
  row: {
    flexDirection: 'row',
  },

  /* ─── Gender Buttons ─── */
  genderRow3D: {
    flexDirection: 'row',
    gap: 10,
  },
  genderBtn3D: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    paddingVertical: 10,
  },
  genderBtnActive3D: {
    backgroundColor: '#2563EB',
    borderColor: '#60A5FA',
    borderBottomColor: '#1D4ED8',
  },
  genderText3D: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#475569',
  },
  genderTextActive3D: {
    color: '#FFFFFF',
  },

  /* ─── Pills Agama ─── */
  pillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pillBtn3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
  },
  pillBtnActive3D: {
    backgroundColor: '#1E3A8A',
    borderColor: '#3B82F6',
    borderBottomColor: '#172554',
  },
  pillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#475569',
  },
  pillTextActive: {
    color: '#FFFFFF',
  },

  /* ─── Sub-Card Ayah & Ibu ─── */
  subCard3D: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  subCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E3A8A',
    letterSpacing: 0.3,
  },
  btnQuickCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 4,
  },
  btnQuickCopyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* ─── Ukuran Pakaian Seragam ─── */
  sizeRow3D: {
    flexDirection: 'row',
    gap: 8,
  },
  sizeBtn3D: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    paddingVertical: 12,
  },
  sizeBtnActive3D: {
    backgroundColor: '#059669',
    borderColor: '#34D399',
    borderBottomColor: '#047857',
  },
  sizeBtnText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#475569',
  },
  sizeBtnTextActive: {
    color: '#FFFFFF',
  },

  /* ─── Submit Button 3D ─── */
  btnSubmit3D: {
    backgroundColor: '#1E3A8A',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderBottomWidth: 5,
    borderBottomColor: '#172554',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 6,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 24px -6px rgba(30, 58, 138, 0.45)',
        cursor: 'pointer',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  btnShine3D: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  btnSubmitText3D: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  btnDisabled: {
    opacity: 0.6,
  },

  /* ─── Modal 3D ─── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard3D: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 26,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderBottomWidth: 6,
    borderBottomColor: '#CBD5E1',
    ...Platform.select({
      web: {
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      },
      default: {
        elevation: 10,
      },
    }),
  },
  modalOrb3D: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6EE7B7',
    borderBottomWidth: 5,
    borderBottomColor: '#047857',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  orbSpecular: {
    position: 'absolute',
    top: 3,
    left: 10,
    right: 10,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  modalTitle3D: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalSuccessPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
    marginBottom: 14,
  },
  modalSuccessPillText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.2,
  },
  modalRegBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: 10,
  },
  modalRegText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  modalDesc3D: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  modalBtn3D: {
    width: '100%',
    backgroundColor: '#1E3A8A',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3B82F6',
    borderBottomWidth: 4,
    borderBottomColor: '#172554',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalBtnText3D: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '800',
  },
  modalCloseBtn: {
    paddingVertical: 8,
  },
  modalCloseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },
});
