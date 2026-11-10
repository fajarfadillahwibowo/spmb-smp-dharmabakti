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
  Platform,
  TextInput,
  ScrollView,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';
import { downloadPhotoFile } from '../../utils/downloadHelper';

export default function VerifikasiPembayaranScreen() {
  // Main Tab: 'verifikasi' | 'pengaturan'
  const [activeTab, setActiveTab] = useState('verifikasi');

  // List Verifikasi Data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Verifikasi Aksi
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [actionStatus, setActionStatus] = useState('lunas'); // 'lunas' | 'cicilan' | 'ditolak'
  const [adminNote, setAdminNote] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  // Modal Lightbox Pratinjau Foto Bukti
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewReceiptItem, setPreviewReceiptItem] = useState(null);

  // Form Pengaturan Rekening
  const [bankSettings, setBankSettings] = useState({
    nama_bank: 'BANK BNI',
    nomor_rekening: '1234 5678 9012',
    atas_nama: 'SMP DHARMA BAKTI',
    jumlah_biaya: 'Rp 1.500.000',
    keterangan: 'Biaya Pendaftaran SPMB Tahun Ajaran 2025/2026',
  });
  const [loadingSettings, setLoadingSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => {
    fetchPembayaranList();
    fetchBankSettings();
  }, []);

  // ══════════════════════════════════════════════════
  // API CALLS
  // ══════════════════════════════════════════════════
  const fetchPembayaranList = async () => {
    try {
      const res = await apiClient.get('/admin/pembayaran');
      if (res.data.success) {
        setData(res.data.data?.data || res.data.data || []);
      }
    } catch (e) {
      console.log('Error fetching pembayaran list:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchBankSettings = async () => {
    setLoadingSettings(true);
    try {
      const res = await apiClient.get('/admin/pengaturan-pembayaran');
      if (res.data.success && res.data.data) {
        setBankSettings({
          nama_bank: res.data.data.nama_bank || '',
          nomor_rekening: res.data.data.nomor_rekening || '',
          atas_nama: res.data.data.atas_nama || '',
          jumlah_biaya: res.data.data.jumlah_biaya || '',
          keterangan: res.data.data.keterangan || '',
        });
      }
    } catch (e) {
      console.log('Error fetching bank settings:', e);
    } finally {
      setLoadingSettings(false);
    }
  };

  const handleSaveBankSettings = async () => {
    if (!bankSettings.nama_bank || !bankSettings.nomor_rekening || !bankSettings.atas_nama) {
      const msg = 'Mohon lengkapi Nama Bank, Nomor Rekening, dan Atas Nama.';
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.alert(msg);
      } else {
        Alert.alert('Perhatian', msg);
      }
      return;
    }

    setSavingSettings(true);
    try {
      const res = await apiClient.put('/admin/pengaturan-pembayaran', bankSettings);
      if (res.data.success) {
        const successMsg = 'Pengaturan rekening dan nominal transfer berhasil disimpan!';
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.alert(successMsg);
        } else {
          Alert.alert('Berhasil', successMsg);
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Gagal menyimpan pengaturan rekening.';
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.alert(errorMsg);
      } else {
        Alert.alert('Gagal', errorMsg);
      }
    } finally {
      setSavingSettings(false);
    }
  };

  const handleOpenReceipt = async (url) => {
    if (url) {
      const fullUrl = formatFileUrl(url);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(fullUrl, '_blank');
        return;
      }
      try {
        await WebBrowser.openBrowserAsync(fullUrl);
      } catch (e) {
        console.log('Error opening browser:', e);
      }
    }
  };

  // Buka modal untuk verifikasi status
  const openActionModal = (item, status) => {
    setSelectedItem(item);
    setActionStatus(status);
    // Default suggestion note
    if (status === 'lunas') {
      setAdminNote('Pembayaran telah valid dan terverifikasi lunas.');
    } else if (status === 'cicilan') {
      setAdminNote('Pembayaran cicilan/sebagian diterima. Mohon lunasi sisa pembayaran.');
    } else if (status === 'ditolak') {
      setAdminNote('Bukti transfer tidak valid atau nominal tidak sesuai. Silakan upload ulang.');
    } else {
      setAdminNote(item.catatan_admin || '');
    }
    setModalVisible(true);
  };

  const submitAction = async () => {
    if (!selectedItem) return;

    setSubmittingAction(true);
    try {
      const res = await apiClient.put(`/admin/pembayaran/${selectedItem.id_pembayaran}`, {
        status_pembayaran: actionStatus,
        catatan_admin: adminNote,
      });

      if (res.data.success) {
        setModalVisible(false);
        const labelStatus = actionStatus.toUpperCase();
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.alert(`Pembayaran berhasil diubah menjadi: ${labelStatus}`);
        } else {
          Alert.alert('Sukses', `Pembayaran berhasil diubah menjadi: ${labelStatus}`);
        }
        fetchPembayaranList();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengubah status pembayaran.';
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.alert(msg);
      } else {
        Alert.alert('Gagal', msg);
      }
    } finally {
      setSubmittingAction(false);
    }
  };

  // ══════════════════════════════════════════════════
  // FILTER DATA
  // ══════════════════════════════════════════════════
  const filteredData = data.filter((item) => {
    // Filter status
    if (statusFilter !== 'semua' && item.status_pembayaran !== statusFilter) {
      return false;
    }
    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const nama = item.pendaftaran?.nama_siswa?.toLowerCase() || '';
      const noDaftar = item.pendaftaran?.nomor_pendaftaran?.toLowerCase() || '';
      return nama.includes(q) || noDaftar.includes(q);
    }
    return true;
  });

  // ══════════════════════════════════════════════════
  // RENDER ITEM SISWA
  // ══════════════════════════════════════════════════
  const renderItem = ({ item }) => {
    return (
      <View style={styles.card3D}>
        <View style={styles.cardHeader}>
          <View style={styles.badgeWrap}>
            <Text style={styles.regNumber}>{item.pendaftaran?.nomor_pendaftaran || '-'}</Text>
          </View>
          <StatusBadge status={item.status_pembayaran} />
        </View>

        <Text style={styles.studentName}>
          {item.pendaftaran?.nama_siswa || 'Calon Siswa'}
        </Text>
        <Text style={styles.uploadDate}>
          <Ionicons name="calendar-outline" size={13} color="#64748B" /> Diunggah: {item.tanggal_upload || '-'}
        </Text>

        {/* Catatan Admin saat ini jika ada */}
        {item.catatan_admin ? (
          <View style={styles.catatanBox}>
            <Text style={styles.catatanLabel}>Catatan Petugas:</Text>
            <Text style={styles.catatanText}>{item.catatan_admin}</Text>
          </View>
        ) : null}

        {/* Pratinjau Foto Bukti Pembayaran */}
        {item.bukti_url ? (
          <View style={styles.adminReceiptSection}>
            <TouchableOpacity
              style={styles.adminReceiptThumbWrap}
              activeOpacity={0.88}
              onPress={() => {
                setPreviewReceiptItem(item);
                setPreviewModalVisible(true);
              }}
            >
              <Image
                source={{ uri: formatFileUrl(item.bukti_url) }}
                style={styles.adminReceiptThumbImage}
                resizeMode="cover"
              />
              <View style={styles.adminReceiptThumbBadge}>
                <Ionicons name="scan-outline" size={13} color="#FFFFFF" />
                <Text style={styles.adminReceiptThumbText}>Ketuk untuk Perbesar</Text>
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 6, marginTop: 6 }}>
              <TouchableOpacity
                style={[styles.receiptButton3D, { flex: 1 }]}
                activeOpacity={0.8}
                onPress={() => {
                  setPreviewReceiptItem(item);
                  setPreviewModalVisible(true);
                }}
              >
                <Ionicons name="eye" size={15} color="#2563EB" />
                <Text style={styles.receiptButtonText}>Periksa Bukti</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.receiptButton3D, { backgroundColor: '#ECFDF5', borderColor: '#86EFAC' }]}
                activeOpacity={0.8}
                onPress={() => {
                  downloadPhotoFile(
                    item.bukti_url,
                    `bukti_transfer_${item.nomor_pendaftaran}_${item.calon_siswa?.nama_lengkap}`
                  );
                }}
              >
                <Ionicons name="download-outline" size={15} color="#059669" />
                <Text style={[styles.receiptButtonText, { color: '#059669', fontWeight: '800' }]}>Unduh</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.noReceiptBox}>
            <Ionicons name="alert-circle-outline" size={15} color="#EF4444" />
            <Text style={styles.noReceiptText}>Belum ada foto struk transfer.</Text>
          </View>
        )}

        {/* Tombol Aksi Verifikasi: Tolak, Cicilan, Lunas */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.btnAction, styles.btnReject]}
            activeOpacity={0.8}
            onPress={() => openActionModal(item, 'ditolak')}
          >
            <Ionicons name="close-circle" size={15} color="#DC2626" />
            <Text style={styles.btnRejectText}>Tolak</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnAction, styles.btnInstallment]}
            activeOpacity={0.8}
            onPress={() => openActionModal(item, 'cicilan')}
          >
            <Ionicons name="hourglass" size={15} color="#D97706" />
            <Text style={styles.btnInstallmentText}>Cicilan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnAction, styles.btnPaid]}
            activeOpacity={0.8}
            onPress={() => openActionModal(item, 'lunas')}
          >
            <Ionicons name="checkmark-circle" size={15} color="#FFFFFF" />
            <Text style={styles.btnPaidText}>Lunas</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* ═══════════════════════════════════════════
          TOP SEGMENTED SWITCHER (2 TAB)
      ═══════════════════════════════════════════ */}
      <View style={styles.topSegmentWrap}>
        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'verifikasi' && styles.segmentBtnActive]}
          activeOpacity={0.85}
          onPress={() => setActiveTab('verifikasi')}
        >
          <Ionicons
            name="receipt-outline"
            size={16}
            color={activeTab === 'verifikasi' ? '#FFFFFF' : '#64748B'}
          />
          <Text
            style={[
              styles.segmentBtnText,
              activeTab === 'verifikasi' && styles.segmentBtnTextActive,
            ]}
          >
            Verifikasi Bukti ({data.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segmentBtn, activeTab === 'pengaturan' && styles.segmentBtnActive]}
          activeOpacity={0.85}
          onPress={() => setActiveTab('pengaturan')}
        >
          <Ionicons
            name="card-outline"
            size={16}
            color={activeTab === 'pengaturan' ? '#FFFFFF' : '#64748B'}
          />
          <Text
            style={[
              styles.segmentBtnText,
              activeTab === 'pengaturan' && styles.segmentBtnTextActive,
            ]}
          >
            Atur Rekening Bank
          </Text>
        </TouchableOpacity>
      </View>

      {/* ═══════════════════════════════════════════
          TAB 1: VERIFIKASI PEMBAYARAN SISWA
      ═══════════════════════════════════════════ */}
      {activeTab === 'verifikasi' && (
        <View style={{ flex: 1 }}>
          {/* Search Bar */}
          <View style={styles.searchBarWrap}>
            <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari nama atau nomor pendaftaran..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Status Chips */}
          <View style={styles.filterChipRow}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
              {[
                { key: 'semua', label: 'Semua' },
                { key: 'menunggu', label: 'Menunggu' },
                { key: 'lunas', label: 'Lunas' },
                { key: 'cicilan', label: 'Cicilan' },
                { key: 'ditolak', label: 'Ditolak' },
              ].map((chip) => {
                const isActive = statusFilter === chip.key;
                return (
                  <TouchableOpacity
                    key={chip.key}
                    style={[styles.chip, isActive && styles.chipActive]}
                    onPress={() => setStatusFilter(chip.key)}
                  >
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                      {chip.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {loading ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Memuat data pembayaran...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredData}
              keyExtractor={(item) => String(item.id_pembayaran)}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={() => {
                    setRefreshing(true);
                    fetchPembayaranList();
                  }}
                />
              }
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Ionicons name="wallet-outline" size={54} color="#CBD5E1" />
                  <Text style={styles.emptyTitle}>Tidak ada data pembayaran</Text>
                  <Text style={styles.emptyText}>
                    {statusFilter !== 'semua'
                      ? `Tidak ada bukti pembayaran dengan status "${statusFilter}".`
                      : 'Belum ada bukti pembayaran yang masuk.'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      )}

      {/* ═══════════════════════════════════════════
          TAB 2: PENGATURAN REKENING & BIAYA
      ═══════════════════════════════════════════ */}
      {activeTab === 'pengaturan' && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.formContainer}>
          {loadingSettings ? (
            <View style={styles.centerContainer}>
              <ActivityIndicator size="large" color="#2563EB" />
              <Text style={styles.loadingText}>Memuat konfigurasi rekening...</Text>
            </View>
          ) : (
            <>
              {/* Info Banner */}
              <View style={styles.infoBanner3D}>
                <Ionicons name="shield-checkmark" size={22} color="#2563EB" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.infoBannerTitle}>Kendali Penuh Rekening Sekolah</Text>
                  <Text style={styles.infoBannerDesc}>
                    Ubah data rekening dan biaya transfer di bawah. Data ini langsung tampil di kartu ATM aplikasi HP seluruh calon murid.
                  </Text>
                </View>
              </View>

              {/* 3D LIVE CARD PREVIEW */}
              <Text style={styles.previewSectionTitle}>Pratinjau Kartu di HP Siswa:</Text>
              <View style={styles.atmCardPreview3D}>
                <View style={styles.atmTopRow}>
                  <View style={styles.atmChipWrap}>
                    <View style={styles.emvChip3D}>
                      <View style={styles.emvLineH} />
                      <View style={styles.emvLineV} />
                    </View>
                    <Ionicons name="wifi" size={16} color="rgba(255,255,255,0.7)" style={{ marginLeft: 8 }} />
                  </View>
                  <View style={styles.atmBankBadge}>
                    <Text style={styles.atmBankText}>{bankSettings.nama_bank || 'BANK TUJUAN'}</Text>
                  </View>
                </View>

                <View style={styles.atmNumberRow}>
                  <Text style={styles.atmNumberText}>
                    {bankSettings.nomor_rekening || '0000 0000 0000'}
                  </Text>
                </View>

                <View style={styles.atmBottomRow}>
                  <View>
                    <Text style={styles.atmHolderLabel}>ATAS NAMA PENERIMA</Text>
                    <Text style={styles.atmHolderValue}>{bankSettings.atas_nama || 'SMP DHARMA BAKTI'}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.atmHolderLabel}>TOTAL BIAYA</Text>
                    <Text style={styles.atmAmountValue}>{bankSettings.jumlah_biaya || 'Rp 1.500.000'}</Text>
                  </View>
                </View>
              </View>

              {/* FORM FIELDS */}
              <View style={styles.formCard3D}>
                <Text style={styles.inputLabel}>NAMA BANK / METODE TRANSFER</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="business-outline" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={bankSettings.nama_bank}
                    onChangeText={(val) => setBankSettings({ ...bankSettings, nama_bank: val })}
                    placeholder="Contoh: BANK BNI / BANK BRI / BCA"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <Text style={styles.inputLabel}>NOMOR REKENING / VIRTUAL ACCOUNT</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="card-outline" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, { fontFamily: Platform.OS === 'web' ? 'monospace' : undefined, fontWeight: '700' }]}
                    value={bankSettings.nomor_rekening}
                    onChangeText={(val) => setBankSettings({ ...bankSettings, nomor_rekening: val })}
                    placeholder="Contoh: 1234 5678 9012"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <Text style={styles.inputLabel}>ATAS NAMA PENERIMA (REKENING)</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    value={bankSettings.atas_nama}
                    onChangeText={(val) => setBankSettings({ ...bankSettings, atas_nama: val })}
                    placeholder="Contoh: SMP DHARMA BAKTI"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <Text style={styles.inputLabel}>TOTAL BIAYA PENDAFTARAN</Text>
                <View style={styles.inputWrap}>
                  <Ionicons name="cash-outline" size={18} color="#059669" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, { color: '#059669', fontWeight: '800' }]}
                    value={bankSettings.jumlah_biaya}
                    onChangeText={(val) => setBankSettings({ ...bankSettings, jumlah_biaya: val })}
                    placeholder="Contoh: Rp 1.500.000"
                    placeholderTextColor="#94A3B8"
                  />
                </View>

                <Text style={styles.inputLabel}>KETERANGAN / PETUNJUK TAMBAHAN (OPSIONAL)</Text>
                <View style={[styles.inputWrap, { height: 75, alignItems: 'flex-start', paddingTop: 10 }]}>
                  <Ionicons name="information-circle-outline" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={[styles.textInput, { height: 60 }]}
                    value={bankSettings.keterangan}
                    onChangeText={(val) => setBankSettings({ ...bankSettings, keterangan: val })}
                    placeholder="Petunjuk transfer tambahan untuk siswa..."
                    placeholderTextColor="#94A3B8"
                    multiline
                  />
                </View>

                {/* Tombol Simpan 3D */}
                <TouchableOpacity
                  style={[styles.btnSaveSettings3D, savingSettings && styles.btnDisabled]}
                  activeOpacity={0.85}
                  onPress={handleSaveBankSettings}
                  disabled={savingSettings}
                >
                  {savingSettings ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <>
                      <Ionicons name="save" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                      <Text style={styles.btnSaveSettingsText}>SIMPAN PENGATURAN REKENING</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* ═══════════════════════════════════════════
          MODAL KONFIRMASI STATUS & CATATAN
      ═══════════════════════════════════════════ */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent3D}>
            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.modalIconWrap,
                  actionStatus === 'lunas' && { backgroundColor: '#DCFCE7' },
                  actionStatus === 'cicilan' && { backgroundColor: '#FEF3C7' },
                  actionStatus === 'ditolak' && { backgroundColor: '#FEE2E2' },
                ]}
              >
                <Ionicons
                  name={
                    actionStatus === 'lunas'
                      ? 'checkmark-circle'
                      : actionStatus === 'cicilan'
                      ? 'hourglass'
                      : 'close-circle'
                  }
                  size={24}
                  color={
                    actionStatus === 'lunas'
                      ? '#16A34A'
                      : actionStatus === 'cicilan'
                      ? '#D97706'
                      : '#DC2626'
                  }
                />
              </View>
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.modalTitle}>
                  Konfirmasi: {actionStatus.toUpperCase()}
                </Text>
                <Text style={styles.modalSubtitle} numberOfLines={1}>
                  {selectedItem?.pendaftaran?.nama_siswa}
                </Text>
              </View>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            {/* Thumbnail Bukti di Dalam Modal Konfirmasi */}
            {selectedItem?.bukti_url ? (
              <TouchableOpacity
                style={styles.modalReceiptPreviewBox}
                activeOpacity={0.85}
                onPress={() => {
                  setPreviewReceiptItem(selectedItem);
                  setPreviewModalVisible(true);
                }}
              >
                <Image
                  source={{ uri: formatFileUrl(selectedItem.bukti_url) }}
                  style={styles.modalReceiptPreviewImage}
                  resizeMode="cover"
                />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.modalReceiptPreviewTitle}>Foto Struk Terlampir</Text>
                  <Text style={styles.modalReceiptPreviewSub}>Tgl Upload: {selectedItem.tanggal_upload || '-'}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                    <Ionicons name="scan-outline" size={13} color="#2563EB" />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#2563EB', marginLeft: 4 }}>
                      Ketuk untuk Perbesar Foto
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : null}

            {/* Input Catatan Admin */}
            <Text style={styles.modalNoteLabel}>
              Catatan Petugas (Dapat dibaca oleh siswa):
            </Text>
            <TextInput
              style={styles.modalTextInput}
              value={adminNote}
              onChangeText={setAdminNote}
              placeholder="Tulis catatan atau alasan verifikasi..."
              placeholderTextColor="#94A3B8"
              multiline
            />

            {/* Tombol Aksi Modal */}
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.modalBtnCancel}
                onPress={() => setModalVisible(false)}
                disabled={submittingAction}
              >
                <Text style={styles.modalBtnCancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalBtnConfirm,
                  actionStatus === 'lunas' && { backgroundColor: '#10B981', borderBottomColor: '#059669' },
                  actionStatus === 'cicilan' && { backgroundColor: '#F59E0B', borderBottomColor: '#D97706' },
                  actionStatus === 'ditolak' && { backgroundColor: '#EF4444', borderBottomColor: '#DC2626' },
                  submittingAction && styles.btnDisabled,
                ]}
                onPress={submitAction}
                disabled={submittingAction}
              >
                {submittingAction ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.modalBtnConfirmText}>Simpan Status</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════════
          MODAL LIGHTBOX PRATINJAU BUKTI UNTUK ADMIN
      ═══════════════════════════════════════════ */}
      <Modal
        visible={previewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={styles.previewModalOverlay}>
          <View style={styles.previewModalContainer}>
            {/* Header */}
            <View style={styles.previewModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewModalTitle}>
                  {previewReceiptItem?.pendaftaran?.nama_siswa || 'Calon Siswa'}
                </Text>
                <Text style={styles.previewModalSub}>
                  No: {previewReceiptItem?.pendaftaran?.nomor_pendaftaran || '-'} • Diunggah: {previewReceiptItem?.tanggal_upload || '-'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.previewModalCloseBtn}
                onPress={() => setPreviewModalVisible(false)}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Image Box */}
            <View style={styles.previewImageContainer}>
              {previewReceiptItem?.bukti_url && (
                <Image
                  source={{ uri: formatFileUrl(previewReceiptItem.bukti_url) }}
                  style={styles.previewModalImage}
                  resizeMode="contain"
                />
              )}
            </View>

            {/* Quick Action Footer for Admin */}
            <View style={styles.previewModalFooter}>
              <TouchableOpacity
                style={styles.previewBtnTab}
                onPress={async () => {
                  if (previewReceiptItem?.bukti_url) {
                    const fullUrl = formatFileUrl(previewReceiptItem.bukti_url);
                    if (Platform.OS === 'web' && typeof window !== 'undefined') {
                      window.open(fullUrl, '_blank');
                    } else {
                      try {
                        await WebBrowser.openBrowserAsync(fullUrl);
                      } catch (e) {
                        console.log('Error opening browser:', e);
                      }
                    }
                  }
                }}
              >
                <Ionicons name="open-outline" size={15} color="#2563EB" />
                <Text style={styles.previewBtnTabText}>Buka Penuh</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.previewBtnTab, { backgroundColor: '#ECFDF5', borderColor: '#86EFAC' }]}
                onPress={() => {
                  if (previewReceiptItem?.bukti_url) {
                    downloadPhotoFile(
                      previewReceiptItem.bukti_url,
                      `bukti_transfer_${previewReceiptItem.nomor_pendaftaran}_${previewReceiptItem.calon_siswa?.nama_lengkap}`
                    );
                  }
                }}
              >
                <Ionicons name="download-outline" size={15} color="#059669" />
                <Text style={[styles.previewBtnTabText, { color: '#059669', fontWeight: '800' }]}>Unduh</Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity
                  style={[styles.previewActionBtn, { backgroundColor: '#DC2626' }]}
                  onPress={() => {
                    const it = previewReceiptItem;
                    setPreviewModalVisible(false);
                    openActionModal(it, 'ditolak');
                  }}
                >
                  <Ionicons name="close-circle" size={14} color="#FFF" />
                  <Text style={styles.previewActionBtnText}>Tolak</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.previewActionBtn, { backgroundColor: '#D97706' }]}
                  onPress={() => {
                    const it = previewReceiptItem;
                    setPreviewModalVisible(false);
                    openActionModal(it, 'cicilan');
                  }}
                >
                  <Ionicons name="hourglass" size={14} color="#FFF" />
                  <Text style={styles.previewActionBtnText}>Cicilan</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.previewActionBtn, { backgroundColor: '#16A34A' }]}
                  onPress={() => {
                    const it = previewReceiptItem;
                    setPreviewModalVisible(false);
                    openActionModal(it, 'lunas');
                  }}
                >
                  <Ionicons name="checkmark-circle" size={14} color="#FFF" />
                  <Text style={styles.previewActionBtnText}>Lunas</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },

  // ══════════════════════════════════════════════════
  // TOP SEGMENTS
  // ══════════════════════════════════════════════════
  topSegmentWrap: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 8,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.04)' },
      default: { elevation: 2 },
    }),
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#2563EB',
  },
  segmentBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  segmentBtnTextActive: {
    color: '#FFFFFF',
  },

  // ══════════════════════════════════════════════════
  // SEARCH & FILTER
  // ══════════════════════════════════════════════════
  searchBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 6,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#1E293B',
    paddingVertical: 4,
  },
  filterChipRow: {
    marginVertical: 10,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E2E8F0',
  },
  chipActive: {
    backgroundColor: '#1E3A8A',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  // ══════════════════════════════════════════════════
  // CARDS LIST (VERIFIKASI)
  // ══════════════════════════════════════════════════
  listContent: {
    padding: 16,
    paddingTop: 4,
    paddingBottom: 40,
    gap: 14,
  },
  card3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    ...Platform.select({
      web: { boxShadow: '0 8px 20px rgba(0,0,0,0.06)' },
      default: { elevation: 3 },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  badgeWrap: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  regNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  uploadDate: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  catatanBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  catatanLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
  catatanText: {
    fontSize: 12,
    color: '#1E293B',
    marginTop: 2,
  },
  receiptButton3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 12,
    gap: 8,
  },
  receiptButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  noReceiptBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    gap: 6,
  },
  noReceiptText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '600',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: 10,
    gap: 4,
  },
  btnReject: {
    backgroundColor: '#FEE2E2',
    borderBottomWidth: 3,
    borderBottomColor: '#FCA5A5',
  },
  btnRejectText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#DC2626',
  },
  btnInstallment: {
    backgroundColor: '#FEF3C7',
    borderBottomWidth: 3,
    borderBottomColor: '#FCD34D',
  },
  btnInstallmentText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#B45309',
  },
  btnPaid: {
    backgroundColor: '#10B981',
    borderBottomWidth: 3,
    borderBottomColor: '#059669',
  },
  btnPaidText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnDisabled: {
    opacity: 0.6,
  },

  // ══════════════════════════════════════════════════
  // TAB PENGATURAN (ADMIN FORM & LIVE CARD)
  // ══════════════════════════════════════════════════
  formContainer: {
    padding: 16,
    paddingBottom: 60,
  },
  infoBanner3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  infoBannerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1E3A8A',
  },
  infoBannerDesc: {
    fontSize: 11,
    color: '#3B82F6',
    marginTop: 2,
    lineHeight: 16,
  },
  previewSectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },

  // ATM Card Live Preview
  atmCardPreview3D: {
    backgroundColor: '#1E3A8A',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    borderBottomWidth: 5,
    borderBottomColor: '#0F172A',
    marginBottom: 20,
    ...Platform.select({
      web: { boxShadow: '0 16px 30px rgba(30, 58, 138, 0.4)' },
      default: { elevation: 6 },
    }),
  },
  atmTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  atmChipWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emvChip3D: {
    width: 32,
    height: 24,
    backgroundColor: '#F59E0B',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#FDE68A',
    overflow: 'hidden',
    position: 'relative',
  },
  emvLineH: {
    position: 'absolute',
    top: 11,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#B45309',
  },
  emvLineV: {
    position: 'absolute',
    left: 15,
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#B45309',
  },
  atmBankBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 8,
  },
  atmBankText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 1,
  },
  atmNumberRow: {
    marginBottom: 16,
  },
  atmNumberText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  atmBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  atmHolderLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  atmHolderValue: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  atmAmountValue: {
    color: '#38BDF8',
    fontWeight: '900',
    fontSize: 15,
  },

  // Form Fields
  formCard3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    ...Platform.select({
      web: { boxShadow: '0 8px 24px rgba(0,0,0,0.06)' },
      default: { elevation: 3 },
    }),
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 10,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  inputIcon: {
    marginRight: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
  },
  btnSaveSettings3D: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 22,
    borderBottomWidth: 4,
    borderBottomColor: '#1D4ED8',
    ...Platform.select({
      web: { boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)' },
      default: { elevation: 4 },
    }),
  },
  btnSaveSettingsText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 13,
    letterSpacing: 0.5,
  },

  // ══════════════════════════════════════════════════
  // MODAL STYLES
  // ══════════════════════════════════════════════════
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent3D: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderBottomWidth: 5,
    borderBottomColor: '#CBD5E1',
    ...Platform.select({
      web: { boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
      default: { elevation: 10 },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  modalNoteLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  modalTextInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 12,
    fontSize: 13,
    color: '#0F172A',
    height: 90,
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  modalBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  modalBtnCancel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  modalBtnCancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#64748B',
  },
  modalBtnConfirm: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    borderBottomWidth: 4,
  },
  modalBtnConfirmText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#475569',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },

  /* ─── Admin Receipt Inline Preview ─── */
  adminReceiptSection: {
    marginVertical: 10,
  },
  adminReceiptThumbWrap: {
    width: '100%',
    height: 150,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    marginBottom: 8,
  },
  adminReceiptThumbImage: {
    width: '100%',
    height: '100%',
  },
  adminReceiptThumbBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  adminReceiptThumbText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalReceiptPreviewBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 14,
  },
  modalReceiptPreviewImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  modalReceiptPreviewTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
  },
  modalReceiptPreviewSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  /* ─── Lightbox Modal ─── */
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  previewModalContainer: {
    width: '100%',
    maxWidth: 540,
    maxHeight: '92%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    ...Platform.select({
      web: { boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
      default: { elevation: 12 },
    }),
  },
  previewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  previewModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  previewModalSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  previewModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImageContainer: {
    width: '100%',
    height: 380,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModalImage: {
    width: '100%',
    height: '100%',
  },
  previewModalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  previewBtnTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 4,
  },
  previewBtnTabText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#2563EB',
  },
  previewActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  previewActionBtnText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
