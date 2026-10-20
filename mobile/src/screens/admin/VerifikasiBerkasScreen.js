import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function VerifikasiBerkasScreen({ navigation }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('semua'); // 'semua', 'menunggu_verifikasi', 'terverifikasi', 'ditolak'

  // Modal States
  const [activeItem, setActiveItem] = useState(null);
  const [modalApproveVisible, setModalApproveVisible] = useState(false);
  const [modalRejectVisible, setModalRejectVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form Verifikasi (Jadwal Seleksi)
  const [tanggalSeleksi, setTanggalSeleksi] = useState('');
  const [waktuSeleksi, setWaktuSeleksi] = useState('08:00 - 10:00 WIB');
  const [tempatSeleksi, setTempatSeleksi] = useState('Ruang CBT / Lab Komputer SMP Dharma Bakti');
  const [catatanSeleksi, setCatatanSeleksi] = useState('Harap hadir 30 menit sebelum jadwal, membawa kartu peserta pendaftaran dan seragam sekolah asal.');

  // Form Penolakan (Catatan Revisi Manual)
  const [catatanRevisi, setCatatanRevisi] = useState('');

  // Quick Rejection Suggestions
  const quickRejectionNotes = [
    'Scan Kartu Keluarga buram / tidak terbaca jelas.',
    'Pasfoto belum formal atau latar belakang bukan merah/biru.',
    'Ijazah / SKL belum dilegalisir basah.',
    'Akta Kelahiran terpotong / halaman tidak lengkap.',
    'Format file dokumen salah atau tidak bisa dibuka.',
  ];

  const fetchBerkas = async () => {
    try {
      const res = await apiClient.get('/admin/verifikasi-berkas');
      if (res.data.success) {
        setData(res.data.data.data || []);
      }
    } catch (e) {
      console.log('Error fetching berkas list:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBerkas();
  }, []);

  const handleOpenDoc = async (url) => {
    if (!url) {
      Alert.alert('Belum Diunggah', 'Calon siswa belum mengunggah berkas ini.');
      return;
    }
    const fullUrl = formatFileUrl(url);
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(fullUrl, '_blank');
      return;
    }
    try {
      await WebBrowser.openBrowserAsync(fullUrl);
    } catch (e) {
      console.log('Error opening doc:', e);
    }
  };

  // Helper tanggal default (+7 hari)
  const getDefaultDate = (daysAhead = 7) => {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Buka Modal Verifikasi
  const openApproveModal = (item) => {
    setActiveItem(item);
    setTanggalSeleksi(item.seleksi?.tanggal_seleksi || getDefaultDate(7));
    setWaktuSeleksi(item.seleksi?.waktu_seleksi || '08:00 - 10:00 WIB');
    setTempatSeleksi(item.seleksi?.tempat_seleksi || 'Ruang CBT / Lab Komputer SMP Dharma Bakti');
    setCatatanSeleksi(item.seleksi?.catatan || 'Harap hadir 30 menit sebelum jadwal, membawa kartu peserta pendaftaran dan seragam sekolah asal.');
    setModalApproveVisible(true);
  };

  // Buka Modal Penolakan
  const openRejectModal = (item) => {
    setActiveItem(item);
    setCatatanRevisi(item.catatan_verifikasi && item.status_pendaftaran === 'ditolak' ? item.catatan_verifikasi : '');
    setModalRejectVisible(true);
  };

  // Kirim Verifikasi & Jadwal
  const submitApprove = async () => {
    if (!tanggalSeleksi.trim()) {
      Alert.alert('Perhatian', 'Harap masukkan tanggal pelaksanaan tes seleksi.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.put(`/admin/verifikasi-berkas/${activeItem.id_pendaftaran}`, {
        status_pendaftaran: 'terverifikasi',
        tanggal_seleksi: tanggalSeleksi.trim(),
        waktu_seleksi: waktuSeleksi.trim(),
        tempat_seleksi: tempatSeleksi.trim(),
        catatan_seleksi: catatanSeleksi.trim(),
      });

      if (res.data.success) {
        Alert.alert('Berhasil Verifikasi', res.data.message);
        setModalApproveVisible(false);
        fetchBerkas();
      }
    } catch (err) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal memverifikasi berkas.');
    } finally {
      setSubmitting(false);
    }
  };

  // Kirim Penolakan & Catatan Revisi
  const submitReject = async () => {
    if (!catatanRevisi.trim()) {
      Alert.alert('Perhatian', 'Harap isi keterangan berkas yang perlu diperbaiki oleh calon siswa.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiClient.put(`/admin/verifikasi-berkas/${activeItem.id_pendaftaran}`, {
        status_pendaftaran: 'ditolak',
        catatan_verifikasi: catatanRevisi.trim(),
      });

      if (res.data.success) {
        Alert.alert('Berkas Ditolak', res.data.message);
        setModalRejectVisible(false);
        fetchBerkas();
      }
    } catch (err) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal menolak berkas.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Data
  const filteredData = data.filter((item) => {
    if (filterStatus === 'semua') return true;
    return item.status_pendaftaran === filterStatus;
  });

  const renderItem = ({ item }) => {
    const isVerified = item.status_pendaftaran === 'terverifikasi';
    const isRejected = item.status_pendaftaran === 'ditolak';
    const docs = item.dokumen || {};

    return (
      <View style={styles.card}>
        {/* Header Card */}
        <View style={styles.cardHeader}>
          <View>
            <Text style={styles.regNumber}>{item.nomor_pendaftaran}</Text>
            <Text style={styles.studentName}>{item.calon_siswa?.nama_lengkap || 'Belum Mengisi Nama'}</Text>
          </View>
          <StatusBadge status={item.status_pendaftaran} />
        </View>

        <Text style={styles.schoolOrigin}>
          <Ionicons name="school-outline" size={13} color={COLORS.textMuted} /> {item.calon_siswa?.asal_sekolah || '-'}
        </Text>
        {item.calon_siswa?.email ? (
          <Text style={styles.emailText}>
            <Ionicons name="mail-outline" size={13} color={COLORS.textMuted} /> {item.calon_siswa.email}
          </Text>
        ) : null}

        {/* Grid 4 Dokumen */}
        <View style={styles.docGrid}>
          <TouchableOpacity
            style={[styles.docChip, docs.akte_kelahiran ? styles.docChipDone : styles.docChipMissing]}
            onPress={() => handleOpenDoc(docs.akte_kelahiran)}
          >
            <Ionicons
              name={docs.akte_kelahiran ? 'document-text' : 'close-circle-outline'}
              size={14}
              color={docs.akte_kelahiran ? '#0284C7' : '#94A3B8'}
            />
            <Text style={[styles.docChipText, docs.akte_kelahiran && styles.docChipTextDone]}>Akta</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.docChip, docs.kartu_keluarga ? styles.docChipDone : styles.docChipMissing]}
            onPress={() => handleOpenDoc(docs.kartu_keluarga)}
          >
            <Ionicons
              name={docs.kartu_keluarga ? 'people' : 'close-circle-outline'}
              size={14}
              color={docs.kartu_keluarga ? '#0284C7' : '#94A3B8'}
            />
            <Text style={[styles.docChipText, docs.kartu_keluarga && styles.docChipTextDone]}>KK</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.docChip, docs.pasfoto ? styles.docChipDone : styles.docChipMissing]}
            onPress={() => handleOpenDoc(docs.pasfoto)}
          >
            <Ionicons
              name={docs.pasfoto ? 'image' : 'close-circle-outline'}
              size={14}
              color={docs.pasfoto ? '#0284C7' : '#94A3B8'}
            />
            <Text style={[styles.docChipText, docs.pasfoto && styles.docChipTextDone]}>Foto</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.docChip, docs.ijazah ? styles.docChipDone : styles.docChipMissing]}
            onPress={() => handleOpenDoc(docs.ijazah)}
          >
            <Ionicons
              name={docs.ijazah ? 'ribbon' : 'close-circle-outline'}
              size={14}
              color={docs.ijazah ? '#0284C7' : '#94A3B8'}
            />
            <Text style={[styles.docChipText, docs.ijazah && styles.docChipTextDone]}>Ijazah</Text>
          </TouchableOpacity>
        </View>

        {/* Informasi Status Penolakan / Catatan Perbaikan */}
        {isRejected && item.catatan_verifikasi ? (
          <View style={styles.rejectionNoticeCard}>
            <View style={styles.noticeHeader}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.rejectionTitle}>Keterangan Revisi Dikirim ke Siswa:</Text>
            </View>
            <Text style={styles.rejectionText}>{item.catatan_verifikasi}</Text>
          </View>
        ) : null}

        {/* Informasi Status Verifikasi & Jadwal Seleksi */}
        {isVerified && item.seleksi ? (
          <View style={styles.scheduleNoticeCard}>
            <View style={styles.noticeHeader}>
              <Ionicons name="calendar" size={16} color="#059669" />
              <Text style={styles.scheduleTitle}>Jadwal Seleksi Diterbitkan:</Text>
            </View>
            <Text style={styles.scheduleDetailText}>
              📅 {item.seleksi.tanggal_format || item.seleksi.tanggal_seleksi} • ⏰ {item.seleksi.waktu_seleksi || '08:00 WIB'}
            </Text>
            <Text style={styles.scheduleDetailSubText}>
              📍 {item.seleksi.tempat_seleksi || 'Kampus SMP Dharma Bakti'}
            </Text>
          </View>
        ) : null}

        {/* Action Row */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.detailBtn}
            onPress={() => navigation.navigate('DetailPendaftar', { id: item.id_pendaftaran })}
          >
            <Ionicons name="eye-outline" size={15} color={COLORS.primary} />
            <Text style={styles.detailBtnText}>Rincian Lengkap</Text>
          </TouchableOpacity>

          <View style={styles.decisionBtns}>
            {/* Tombol Tolak Berkas */}
            <TouchableOpacity
              style={styles.rejectBtn}
              onPress={() => openRejectModal(item)}
            >
              <Ionicons name="close-circle" size={15} color="#DC2626" />
              <Text style={styles.rejectBtnText}>{isRejected ? 'Ubah Catatan' : 'Tolak'}</Text>
            </TouchableOpacity>

            {/* Tombol Verifikasi & Jadwal */}
            <TouchableOpacity
              style={styles.approveBtn}
              onPress={() => openApproveModal(item)}
            >
              <Ionicons name="checkmark-circle" size={15} color="#FFFFFF" />
              <Text style={styles.approveBtnText}>{isVerified ? 'Edit Jadwal' : 'Verifikasi'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat data verifikasi berkas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {[
          { key: 'semua', label: 'Semua' },
          { key: 'menunggu_verifikasi', label: 'Menunggu' },
          { key: 'terverifikasi', label: 'Terverifikasi' },
          { key: 'ditolak', label: 'Ditolak' },
        ].map((f) => {
          const isActive = filterStatus === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              onPress={() => setFilterStatus(f.key)}
            >
              <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => String(item.id_pendaftaran)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchBerkas();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="folder-open-outline" size={48} color="#94A3B8" />
            <Text style={styles.emptyText}>Tidak ada data berkas pada kategori ini.</Text>
          </View>
        }
      />

      {/* ============================================================ */}
      {/* MODAL 1: VERIFIKASI BERKAS & TERBITKAN JADWAL SELEKSI        */}
      {/* ============================================================ */}
      <Modal
        visible={modalApproveVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalApproveVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGroup}>
                <Ionicons name="checkmark-done-circle" size={24} color="#059669" />
                <Text style={styles.modalTitle}>Verifikasi & Jadwal Tes</Text>
              </View>
              <TouchableOpacity onPress={() => setModalApproveVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>
                Calon Siswa: <Text style={{ fontWeight: '700', color: '#0F172A' }}>{activeItem?.calon_siswa?.nama_lengkap}</Text> ({activeItem?.nomor_pendaftaran})
              </Text>

              <View style={styles.modalAlert}>
                <Ionicons name="information-circle" size={18} color="#0284C7" />
                <Text style={styles.modalAlertText}>
                  Setelah disetujui, jadwal tes seleksi akan otomatis dikirimkan ke calon siswa via aplikasi dan email.
                </Text>
              </View>

              {/* Tanggal Seleksi */}
              <Text style={styles.inputLabel}>📅 Tanggal Pelaksanaan Tes (YYYY-MM-DD) *</Text>
              <TextInput
                style={styles.textInput}
                value={tanggalSeleksi}
                onChangeText={setTanggalSeleksi}
                placeholder="2026-10-15"
                placeholderTextColor="#94A3B8"
              />

              {/* Quick Date Chips */}
              <View style={styles.quickChipGroup}>
                {[
                  { label: '+3 Hari', days: 3 },
                  { label: '+7 Hari', days: 7 },
                  { label: '+10 Hari', days: 10 },
                  { label: '+14 Hari', days: 14 },
                ].map((c) => (
                  <TouchableOpacity
                    key={c.label}
                    style={styles.quickChip}
                    onPress={() => setTanggalSeleksi(getDefaultDate(c.days))}
                  >
                    <Text style={styles.quickChipText}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Waktu Seleksi */}
              <Text style={styles.inputLabel}>⏰ Waktu / Jam Tes</Text>
              <TextInput
                style={styles.textInput}
                value={waktuSeleksi}
                onChangeText={setWaktuSeleksi}
                placeholder="Contoh: 08:00 - 10:00 WIB"
                placeholderTextColor="#94A3B8"
              />
              <View style={styles.quickChipGroup}>
                {['08:00 - 10:00 WIB', '10:00 - 12:00 WIB', '13:00 - 15:00 WIB'].map((w) => (
                  <TouchableOpacity
                    key={w}
                    style={styles.quickChip}
                    onPress={() => setWaktuSeleksi(w)}
                  >
                    <Text style={styles.quickChipText}>{w}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Lokasi / Ruang Seleksi */}
              <Text style={styles.inputLabel}>📍 Lokasi / Ruangan Ujian</Text>
              <TextInput
                style={styles.textInput}
                value={tempatSeleksi}
                onChangeText={setTempatSeleksi}
                placeholder="Contoh: Ruang CBT / Lab Komputer SMP Dharma Bakti"
                placeholderTextColor="#94A3B8"
              />

              {/* Catatan Seleksi */}
              <Text style={styles.inputLabel}>📝 Catatan / Perlengkapan Peserta</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={catatanSeleksi}
                onChangeText={setCatatanSeleksi}
                multiline
                numberOfLines={3}
                placeholder="Contoh: Membawa pensil 2B, kartu pendaftaran, dan seragam asal..."
                placeholderTextColor="#94A3B8"
              />

              {/* Action Buttons */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setModalApproveVisible(false)}
                  disabled={submitting}
                >
                  <Text style={styles.modalCancelText}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalSubmitApproveBtn, submitting && styles.btnDisabled]}
                  onPress={submitApprove}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="send" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.modalSubmitText}>Verifikasi & Kirim Jadwal</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ============================================================ */}
      {/* MODAL 2: TOLAK BERKAS & KIRIM KETERANGAN REVISI MANUAL       */}
      {/* ============================================================ */}
      <Modal
        visible={modalRejectVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalRejectVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View style={styles.modalHeaderTitleGroup}>
                <Ionicons name="close-circle" size={24} color="#DC2626" />
                <Text style={styles.modalTitleReject}>Tolak & Minta Revisi Berkas</Text>
              </View>
              <TouchableOpacity onPress={() => setModalRejectVisible(false)}>
                <Ionicons name="close" size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.modalSubtitle}>
                Calon Siswa: <Text style={{ fontWeight: '700', color: '#0F172A' }}>{activeItem?.calon_siswa?.nama_lengkap}</Text> ({activeItem?.nomor_pendaftaran})
              </Text>

              <View style={styles.modalAlertReject}>
                <Ionicons name="alert-circle" size={18} color="#DC2626" />
                <Text style={styles.modalAlertRejectText}>
                  Tuliskan secara jelas berkas mana yang salah/buram agar calon siswa dapat segera memperbaikinya di menu Dokumen.
                </Text>
              </View>

              {/* Keterangan Revisi */}
              <Text style={styles.inputLabel}>
                📋 Keterangan Berkas yang Perlu Diperbaiki (Wajib) *
              </Text>
              <TextInput
                style={[styles.textInput, styles.textAreaLarge]}
                value={catatanRevisi}
                onChangeText={setCatatanRevisi}
                multiline
                numberOfLines={4}
                placeholder="Contoh: Scan Kartu Keluarga tidak terbaca karena blur. Pasfoto belum sesuai ketentuan (harus background merah). Harap unggah ulang file yang jelas."
                placeholderTextColor="#94A3B8"
              />

              {/* Quick Suggestion Chips */}
              <Text style={styles.quickChipHeading}>Pilihan Cepat Catatan (Sentuh untuk menambahkan):</Text>
              <View style={styles.rejectionChipsGroup}>
                {quickRejectionNotes.map((note, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={styles.rejectionChip}
                    onPress={() => {
                      if (!catatanRevisi) {
                        setCatatanRevisi(note);
                      } else {
                        setCatatanRevisi(catatanRevisi + '\n' + note);
                      }
                    }}
                  >
                    <Ionicons name="add-circle-outline" size={14} color="#B91C1C" />
                    <Text style={styles.rejectionChipText}>{note}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.modalActionRow}>
                <TouchableOpacity
                  style={styles.modalCancelBtn}
                  onPress={() => setModalRejectVisible(false)}
                  disabled={submitting}
                >
                  <Text style={styles.modalCancelText}>Batal</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalSubmitRejectBtn, submitting && styles.btnDisabled]}
                  onPress={submitReject}
                  disabled={submitting}
                >
                  {submitting ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="send" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                      <Text style={styles.modalSubmitText}>Kirim Notifikasi Penolakan</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 13,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: '#0284C7',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90,
    gap: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  regNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0284C7',
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  schoolOrigin: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  emailText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  docGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 12,
  },
  docChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 4,
  },
  docChipDone: {
    backgroundColor: '#E0F2FE',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  docChipMissing: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  docChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94A3B8',
  },
  docChipTextDone: {
    color: '#0369A1',
    fontWeight: '700',
  },
  rejectionNoticeCard: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  scheduleNoticeCard: {
    backgroundColor: '#F0FDF4',
    borderLeftWidth: 3,
    borderLeftColor: '#059669',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  noticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 4,
  },
  rejectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
  },
  rejectionText: {
    fontSize: 12,
    color: '#991B1B',
    lineHeight: 16,
  },
  scheduleTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
  },
  scheduleDetailText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#065F46',
  },
  scheduleDetailSubText: {
    fontSize: 11,
    color: '#047857',
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  detailBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0284C7',
  },
  decisionBtns: {
    flexDirection: 'row',
    gap: 8,
  },
  rejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  rejectBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#DC2626',
  },
  approveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#059669',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    gap: 4,
  },
  approveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 10,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalHeaderTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
  },
  modalTitleReject: {
    fontSize: 16,
    fontWeight: '800',
    color: '#B91C1C',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    marginTop: 4,
  },
  modalAlert: {
    flexDirection: 'row',
    backgroundColor: '#E0F2FE',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 14,
    alignItems: 'center',
  },
  modalAlertText: {
    fontSize: 11,
    color: '#0369A1',
    flex: 1,
    lineHeight: 15,
  },
  modalAlertReject: {
    flexDirection: 'row',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    gap: 8,
    marginBottom: 14,
    alignItems: 'center',
  },
  modalAlertRejectText: {
    fontSize: 11,
    color: '#991B1B',
    flex: 1,
    lineHeight: 15,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
    marginTop: 10,
  },
  textInput: {
    borderWidth: 1.2,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: '#0F172A',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    minHeight: 70,
    textAlignVertical: 'top',
  },
  textAreaLarge: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  quickChipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 6,
    marginBottom: 4,
  },
  quickChip: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  quickChipText: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
  },
  quickChipHeading: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginTop: 12,
    marginBottom: 6,
  },
  rejectionChipsGroup: {
    gap: 6,
    marginBottom: 16,
  },
  rejectionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFF1F2',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  rejectionChipText: {
    fontSize: 12,
    color: '#9F1239',
    flex: 1,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 18,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modalSubmitApproveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#059669',
  },
  modalSubmitRejectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#DC2626',
  },
  modalSubmitText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.6,
  },
});
