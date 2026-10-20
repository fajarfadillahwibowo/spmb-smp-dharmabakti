import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, STORAGE_BASE_URL, formatFileUrl } from '../../config';

export default function UploadDokumenScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Status berkas yang sudah tersimpan di server
  const [serverDocs, setServerDocs] = useState({});

  // File yang baru dipilih lokal sebelum diupload
  const [selectedFiles, setSelectedFiles] = useState({
    akte_kelahiran: null,
    kartu_keluarga: null,
    pasfoto: null,
    ijazah: null,
  });

  const docTypes = [
    {
      key: 'pasfoto',
      title: 'Pasfoto Berwarna 3x4',
      desc: 'Format JPG/PNG, latar belakang merah/biru, max 2MB',
      icon: 'image-outline',
      imageOnly: true,
    },
    {
      key: 'akte_kelahiran',
      title: 'Akta Kelahiran',
      desc: 'Format PDF/JPG/PNG, scan dokumen asli yang jelas, max 2MB',
      icon: 'document-text-outline',
    },
    {
      key: 'kartu_keluarga',
      title: 'Kartu Keluarga (KK)',
      desc: 'Format PDF/JPG/PNG, scan dokumen asli yang jelas, max 2MB',
      icon: 'people-outline',
    },
    {
      key: 'ijazah',
      title: 'Ijazah / Surat Keterangan Lulus (SKL)',
      desc: 'Format PDF/JPG/PNG, scan dokumen asli/legalisir, max 2MB',
      icon: 'ribbon-outline',
    },
  ];

  useEffect(() => {
    fetchDocStatus();
  }, []);

  const fetchDocStatus = async () => {
    try {
      const res = await apiClient.get('/siswa/dokumen');
      if (res.data.success) {
        setServerDocs(res.data.data);
      }
    } catch (e) {
      console.log('Error fetching doc status:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDoc = async (url) => {
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

  const handlePickFile = async (key, imageOnly = false) => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = imageOnly ? 'image/jpeg,image/png,image/jpg' : 'application/pdf,image/jpeg,image/png,image/jpg';
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            Alert.alert('Ukuran Terlalu Besar', 'Ukuran file maksimal adalah 2MB.');
            return;
          }
          setSelectedFiles((prev) => ({
            ...prev,
            [key]: {
              uri: URL.createObjectURL(file),
              name: file.name,
              type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
              file: file,
            },
          }));
        }
      };
      input.click();
      return;
    }

    try {
      if (imageOnly) {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
          const asset = result.assets[0];
          setSelectedFiles((prev) => ({
            ...prev,
            [key]: {
              uri: asset.uri,
              name: asset.fileName || asset.name || `${key}_${Date.now()}.jpg`,
              type: asset.mimeType || 'image/jpeg',
              file: asset.file || null,
            },
          }));
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'image/*'],
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
          const asset = result.assets[0];
          setSelectedFiles((prev) => ({
            ...prev,
            [key]: {
              uri: asset.uri,
              name: asset.name || `${key}_${Date.now()}.pdf`,
              type: asset.mimeType || (asset.name?.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
              file: asset.file || null,
            },
          }));
        }
      }
    } catch (err) {
      console.log('Error picking file:', err);
    }
  };

  const handleUploadAll = async () => {
    // Cek apakah ada file yang dipilih
    const hasFiles = Object.values(selectedFiles).some((f) => f !== null);
    if (!hasFiles) {
      Alert.alert('Perhatian', 'Pilih minimal satu file dokumen untuk diunggah.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      for (const key of Object.keys(selectedFiles)) {
        const file = selectedFiles[key];
        if (file) {
          if (Platform.OS === 'web') {
            if (file.file instanceof File || file.file instanceof Blob) {
              formData.append(key, file.file, file.name);
            } else if (file.uri) {
              const response = await fetch(file.uri);
              const blob = await response.blob();
              formData.append(key, blob, file.name);
            }
          } else {
            formData.append(key, {
              uri: file.uri,
              name: file.name,
              type: file.type || 'application/octet-stream',
            });
          }
        }
      }

      const res = await apiClient.post('/siswa/dokumen', formData, {
        headers: Platform.OS === 'web' ? {} : { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        // Reset selected local files
        setSelectedFiles({
          akte_kelahiran: null,
          kartu_keluarga: null,
          pasfoto: null,
          ijazah: null,
        });
        // Refresh server docs
        await fetchDocStatus();
        // Show celebration / confirmation modal
        setShowSuccessModal(true);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengunggah dokumen.';
      Alert.alert('Gagal Upload', msg);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memeriksa status dokumen...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Info & Alert Banners */}
      {serverDocs?.status_pendaftaran === 'ditolak' ? (
        <View style={styles.rejectionBanner}>
          <View style={styles.rejectionBannerHeader}>
            <Ionicons name="alert-circle" size={24} color="#DC2626" />
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={styles.rejectionBannerTitle}>Berkas Anda Perlu Diperbaiki</Text>
              <Text style={styles.rejectionBannerSubtitle}>Panitia SPMB meminta revisi pada dokumen Anda:</Text>
            </View>
          </View>
          <View style={styles.rejectionNoteBox}>
            <Text style={styles.rejectionNoteText}>
              {serverDocs.catatan_verifikasi || 'Beberapa dokumen belum memenuhi kriteria. Harap periksa dan unggah kembali berkas yang valid.'}
            </Text>
          </View>
          <Text style={styles.rejectionActionGuide}>
            👉 Silakan ganti berkas yang diminta menggunakan tombol "Ganti File" di bawah, lalu klik "SIMPAN & UNGGAH BERKAS".
          </Text>
        </View>
      ) : serverDocs?.status_pendaftaran === 'terverifikasi' ? (
        <View style={styles.verifiedBanner}>
          <Ionicons name="checkmark-circle" size={26} color="#059669" />
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={styles.verifiedBannerTitle}>Berkas Anda Telah Terverifikasi</Text>
            <Text style={styles.verifiedBannerSubtitle}>
              Seluruh berkas persyaratan telah dinyatakan VALID. Jadwal tes seleksi telah diterbitkan di menu Seleksi.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={COLORS.primary} />
          <Text style={styles.infoText}>
            Unggah seluruh 4 berkas persyaratan berikut. Setelah lengkap, panitia akan melakukan verifikasi berkas.
          </Text>
        </View>
      )}

      {/* Doc Cards */}
      {docTypes.map((doc) => {
        const isUploadedOnServer = !!serverDocs[doc.key];
        const isSelectedLocal = !!selectedFiles[doc.key];

        return (
          <View key={doc.key} style={styles.docCard}>
            <View style={styles.docCardHeader}>
              <View style={styles.docIconCircle}>
                <Ionicons name={doc.icon} size={22} color={COLORS.primary} />
              </View>
              <View style={styles.docTitleGroup}>
                <Text style={styles.docTitle}>{doc.title}</Text>
                <Text style={styles.docDesc}>{doc.desc}</Text>
              </View>
            </View>

            {/* Status & Action */}
            <View style={styles.docStatusRow}>
              {isSelectedLocal ? (
                <View style={styles.statusSelected}>
                  <Ionicons name="document-attach" size={16} color={COLORS.secondary} />
                  <Text style={styles.statusSelectedText} numberOfLines={1}>
                    Dipilih: {selectedFiles[doc.key].name}
                  </Text>
                </View>
              ) : isUploadedOnServer ? (
                <View style={styles.statusUploaded}>
                  <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
                  <Text style={styles.statusUploadedText}>Sudah diunggah</Text>
                </View>
              ) : (
                <View style={styles.statusEmpty}>
                  <Ionicons name="close-circle-outline" size={16} color={COLORS.danger} />
                  <Text style={styles.statusEmptyText}>Belum diunggah</Text>
                </View>
              )}

              <View style={styles.actionButtonGroup}>
                {isUploadedOnServer && (
                  <TouchableOpacity
                    style={styles.viewDocBtn}
                    onPress={() => handleOpenDoc(serverDocs[doc.key])}
                  >
                    <Ionicons name="eye-outline" size={14} color={COLORS.primary} />
                    <Text style={styles.viewDocBtnText}>Lihat Berkas</Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={[styles.pickButton, isUploadedOnServer && styles.pickButtonSecondary]}
                  onPress={() => handlePickFile(doc.key, doc.imageOnly)}
                >
                  <Ionicons
                    name="cloud-upload"
                    size={14}
                    color={isUploadedOnServer ? COLORS.primary : COLORS.white}
                  />
                  <Text
                    style={[
                      styles.pickButtonText,
                      isUploadedOnServer && styles.pickButtonTextSecondary,
                    ]}
                  >
                    {isUploadedOnServer ? 'Ganti File' : 'Pilih File'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}

      {/* Submit Button */}
      <TouchableOpacity
        style={[styles.uploadAllButton, uploading && styles.buttonDisabled]}
        onPress={handleUploadAll}
        disabled={uploading}
      >
        {uploading ? (
          <ActivityIndicator color={COLORS.white} />
        ) : (
          <>
            <Ionicons name="cloud-upload" size={20} color={COLORS.white} style={{ marginRight: 8 }} />
            <Text style={styles.uploadAllText}>SIMPAN & UNGGAH BERKAS</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Modal Sukses Upload Dokumen */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.successIconBadge}>
              <Ionicons name="cloud-done" size={48} color="#059669" />
            </View>

            <Text style={styles.modalSuccessTitle}>Selamat, Data & Berkas Anda Sudah Terekam!</Text>

            <Text style={styles.modalSuccessDesc}>
              Seluruh berkas persyaratan pendaftaran Anda telah berhasil diunggah ke sistem SPMB SMP Dharma Bakti.
            </Text>

            <View style={styles.modalStatusBox}>
              <View style={styles.statusBoxHeader}>
                <Ionicons name="time" size={18} color="#D97706" />
                <Text style={styles.statusBoxTitle}>Menunggu Konfirmasi & Verifikasi</Text>
              </View>
              <Text style={styles.statusBoxContent}>
                Panitia SPMB akan segera memvalidasi keabsahan dokumen Anda. Pantau terus status kelulusan dan informasi seleksi berikutnya secara berkala.
              </Text>
            </View>

            <TouchableOpacity
              style={styles.modalSuccessBtn}
              activeOpacity={0.85}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('TabHome');
              }}
            >
              <Ionicons name="home" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
              <Text style={styles.modalSuccessBtnText}>Kembali ke Beranda</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              activeOpacity={0.7}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalCloseBtnText}>Tetap di Halaman Ini</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.primaryDark,
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
  rejectionBanner: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#F87171',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rejectionBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rejectionBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  rejectionBannerSubtitle: {
    fontSize: 11,
    color: '#B91C1C',
    marginTop: 1,
  },
  rejectionNoteBox: {
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 3.5,
    borderLeftColor: '#DC2626',
    borderRadius: 8,
    padding: 10,
    marginTop: 6,
    marginBottom: 8,
  },
  rejectionNoteText: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
    fontWeight: '600',
  },
  rejectionActionGuide: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
    lineHeight: 16,
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  verifiedBannerTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  verifiedBannerSubtitle: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
    lineHeight: 16,
  },
  docCard: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  docCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  docIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  docTitleGroup: {
    flex: 1,
  },
  docTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  docDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  docStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  statusUploaded: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusUploadedText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.success,
    marginLeft: 4,
  },
  statusSelected: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  statusSelectedText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.secondary,
    marginLeft: 4,
  },
  statusEmpty: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusEmptyText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.danger,
    marginLeft: 4,
  },
  actionButtonGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  viewDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  viewDocBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  pickButtonSecondary: {
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pickButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  pickButtonTextSecondary: {
    color: COLORS.primaryDark,
  },
  uploadAllButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  uploadAllText: {
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
  successIconBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalSuccessTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginBottom: 8,
  },
  modalSuccessDesc: {
    fontSize: 13,
    color: '#475569',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  modalStatusBox: {
    width: '100%',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    padding: 12,
    marginBottom: 20,
  },
  statusBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statusBoxTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  statusBoxContent: {
    fontSize: 11,
    color: '#B45309',
    lineHeight: 16,
  },
  modalSuccessBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    height: 48,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: 8,
  },
  modalSuccessBtnText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
  },
  modalCloseBtn: {
    height: 38,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
