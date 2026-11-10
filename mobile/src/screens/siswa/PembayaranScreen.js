import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../api/client';
import { COLORS, PALETTE_3D, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function PembayaranScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [copied, setCopied] = useState(false);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState(null);

  useEffect(() => {
    fetchPembayaranInfo();
  }, []);

  const fetchPembayaranInfo = async () => {
    try {
      const res = await apiClient.get('/siswa/pembayaran');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      console.log('Error fetching pembayaran:', err?.response?.data || err?.message);
      // Fallback: coba ambil info rekening langsung
      try {
        const rekRes = await apiClient.get('/pengaturan-pembayaran');
        if (rekRes.data?.success && rekRes.data?.data) {
          setData((prev) => ({
            ...prev,
            info_rekening: rekRes.data.data,
          }));
        }
      } catch (e) {
        console.log('Error fallback rekening:', e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePickReceipt = async () => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/png,image/jpg';
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            Alert.alert('Ukuran Terlalu Besar', 'Maksimal ukuran foto adalah 2MB.');
            return;
          }
          setSelectedReceipt({
            uri: URL.createObjectURL(file),
            name: file.name,
            type: file.type || 'image/jpeg',
            file: file,
          });
        }
      };
      input.click();
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setSelectedReceipt({
          uri: asset.uri,
          name: asset.fileName || asset.name || `bukti_transfer_${Date.now()}.jpg`,
          type: asset.mimeType || 'image/jpeg',
          file: asset.file || null,
        });
      }
    } catch (e) {
      console.log('Error picking receipt image:', e);
    }
  };

  const handleUploadReceipt = async () => {
    if (!data?.nomor_pendaftaran) {
      Alert.alert(
        'Perhatian',
        'Silakan lengkapi formulir pendaftaran terlebih dahulu sebelum mengunggah bukti pembayaran.'
      );
      return;
    }

    if (!selectedReceipt) {
      Alert.alert('Perhatian', 'Pilih foto bukti transfer terlebih dahulu.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      if (Platform.OS === 'web') {
        if (selectedReceipt.file instanceof File || selectedReceipt.file instanceof Blob) {
          formData.append('bukti_pembayaran', selectedReceipt.file, selectedReceipt.name);
        } else if (selectedReceipt.uri) {
          const response = await fetch(selectedReceipt.uri);
          const blob = await response.blob();
          formData.append('bukti_pembayaran', blob, selectedReceipt.name);
        }
      } else {
        formData.append('bukti_pembayaran', {
          uri: selectedReceipt.uri,
          name: selectedReceipt.name,
          type: selectedReceipt.type,
        });
      }

      const res = await apiClient.post('/siswa/pembayaran', formData, {
        headers: Platform.OS === 'web' ? {} : { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        Alert.alert('Berhasil', res.data.message);
        setSelectedReceipt(null);
        fetchPembayaranInfo();
      }
    } catch (err) {
      Alert.alert('Gagal Upload', err.response?.data?.message || 'Gagal mengunggah bukti pembayaran.');
    } finally {
      setUploading(false);
    }
  };

  const handleCopyAccount = (number) => {
    if (Platform.OS === 'web' && navigator?.clipboard) {
      navigator.clipboard.writeText(number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      Alert.alert('Tersalin', `Nomor rekening ${number} tersalin.`);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loadingOrb3D}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        <Text style={styles.loadingText}>Memuat Data Pembayaran...</Text>
      </View>
    );
  }

  const infoRek = data?.info_rekening;
  const bayar = data?.pembayaran;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* ═══════════════════════════════════════
          3D HOLOGRAPHIC BANK CARD
      ═══════════════════════════════════════ */}
      <View style={styles.atmCard3D}>
        <View style={styles.atmSpecularShine} />

        <View style={styles.atmTopRow}>
          <View style={styles.atmChipWrap}>
            <View style={styles.emvChip3D}>
              <View style={styles.emvLineH} />
              <View style={styles.emvLineV} />
            </View>
            <Ionicons name="wifi" size={18} color="rgba(255,255,255,0.7)" style={{ marginLeft: 8 }} />
          </View>

          <View style={styles.atmBankBadge}>
            <Text style={styles.atmBankText}>{infoRek?.nama_bank || 'REKENING RESMI'}</Text>
          </View>
        </View>

        {/* Account Number */}
        <View style={styles.atmNumberRow}>
          <Text style={styles.atmNumberText}>
            {infoRek?.nomor_rekening || '--------'}
          </Text>
          <TouchableOpacity
            style={styles.atmCopyBtn}
            activeOpacity={0.7}
            onPress={() => handleCopyAccount(infoRek?.nomor_rekening || '')}
          >
            <Ionicons name={copied ? 'checkmark' : 'copy'} size={14} color="#FFFFFF" />
            <Text style={styles.atmCopyText}>{copied ? 'Tersalin' : 'Salin'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.atmBottomRow}>
          <View>
            <Text style={styles.atmHolderLabel}>ATAS NAMA PENERIMA</Text>
            <Text style={styles.atmHolderValue}>{infoRek?.atas_nama || 'SMP DHARMA BAKTI'}</Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.atmHolderLabel}>TOTAL BIAYA</Text>
            <Text style={styles.atmAmountValue}>{infoRek?.jumlah_biaya || '-'}</Text>
          </View>
        </View>
      </View>

      {/* ═══════════════════════════════════════
          3D STATUS VERIFIKASI PEMBAYARAN
      ═══════════════════════════════════════ */}
      <View style={styles.clayCard3D}>
        <View style={styles.cardHeader3D}>
          <View style={[styles.sectionOrbSmall, { backgroundColor: '#10B981', borderColor: '#6EE7B7', borderBottomColor: '#047857' }]}>
            <Ionicons name="receipt" size={16} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.cardTitle3D}>Status Pembayaran</Text>
            <Text style={styles.cardSubtitle3D}>Verifikasi administrasi pendaftaran</Text>
          </View>
          {bayar?.status_pembayaran && (
            <StatusBadge status={bayar.status_pembayaran} />
          )}
        </View>

        {bayar ? (
          <View style={styles.paymentInfoBox3D}>
            {/* Status Feedback Banners */}
            {bayar.status_pembayaran === 'lunas' && (
              <View style={styles.lunasBanner3D}>
                <Ionicons name="checkmark-circle" size={22} color="#16A34A" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.lunasTitle}>Pembayaran Terverifikasi Lunas</Text>
                  <Text style={styles.lunasDesc}>
                    Selamat! Pembayaran biaya pendaftaran Anda telah diverifikasi dan dinyatakan LUNAS oleh panitia.
                  </Text>
                </View>
              </View>
            )}

            {bayar.status_pembayaran === 'ditolak' && (
              <View style={styles.rejectedBanner3D}>
                <Ionicons name="close-circle" size={22} color="#DC2626" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.rejectedTitle}>Pembayaran Belum Sesuai / Ditolak</Text>
                  <Text style={styles.rejectedDesc}>
                    Bukti pembayaran belum memenuhi syarat. Silakan baca catatan panitia di bawah dan unggah ulang bukti yang benar.
                  </Text>
                </View>
              </View>
            )}

            {bayar.status_pembayaran === 'cicilan' && (
              <View style={styles.cicilanBanner3D}>
                <Ionicons name="hourglass" size={22} color="#D97706" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.cicilanTitle}>Pembayaran Cicilan (Sebagian)</Text>
                  <Text style={styles.cicilanDesc}>
                    Pembayaran sebagian telah dicatat. Mohon lunasi sisa biaya sesuai petunjuk panitia.
                  </Text>
                </View>
              </View>
            )}

            {bayar.status_pembayaran === 'menunggu' && (
              <View style={styles.menungguBanner3D}>
                <Ionicons name="time" size={22} color="#2563EB" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.menungguTitle}>Menunggu Konfirmasi Panitia</Text>
                  <Text style={styles.menungguDesc}>
                    Bukti transfer Anda telah diterima dan sedang diperiksa oleh admin panitia SPMB.
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.paymentRow3D}>
              <Text style={styles.infoLabel3D}>Tanggal Unggah</Text>
              <Text style={styles.infoValue3D}>{bayar.tanggal_upload || 'Hari ini'}</Text>
            </View>

            {bayar.catatan_admin ? (
              <View style={styles.adminNoteBox3D}>
                <Text style={styles.adminNoteTitle}>Catatan Petugas Panitia:</Text>
                <Text style={styles.adminNoteDesc}>{bayar.catatan_admin}</Text>
              </View>
            ) : null}

            {bayar.bukti_url ? (
              <View style={styles.receiptPreviewCard}>
                <View style={styles.receiptPreviewHeader}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Ionicons name="image" size={16} color="#2563EB" />
                    <Text style={styles.receiptPreviewTitle}>Pratinjau Bukti Transfer</Text>
                  </View>
                  <Text style={styles.receiptTapHint}>Ketuk untuk memperbesar</Text>
                </View>

                <TouchableOpacity
                  style={styles.receiptThumbnailWrap}
                  activeOpacity={0.88}
                  onPress={() => {
                    setPreviewImageUrl(formatFileUrl(bayar.bukti_url));
                    setPreviewModalVisible(true);
                  }}
                >
                  <Image
                    source={{ uri: formatFileUrl(bayar.bukti_url) }}
                    style={styles.receiptThumbnail}
                    resizeMode="cover"
                  />
                  <View style={styles.receiptZoomOverlay}>
                    <Ionicons name="scan-outline" size={15} color="#FFFFFF" />
                    <Text style={styles.receiptZoomText}>Buka Foto Ukuran Penuh</Text>
                  </View>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        ) : (
          <View style={styles.notUploadedBox3D}>
            <Ionicons name="information-circle" size={18} color="#D97706" />
            <Text style={styles.notUploadedText3D}>
              Belum ada struk pembayaran yang diunggah. Silakan lakukan transfer dan unggah bukti di bawah.
            </Text>
          </View>
        )}

        {/* ═══════════════════════════════════════
            UPLOAD BUKTI 3D
        ═══════════════════════════════════════ */}
        {bayar?.status_pembayaran !== 'lunas' && (
          <View style={styles.uploadSection3D}>
            <TouchableOpacity
              style={styles.btnPickReceipt3D}
              activeOpacity={0.8}
              onPress={handlePickReceipt}
            >
              <Ionicons name="camera" size={20} color="#2563EB" style={{ marginRight: 8 }} />
              <Text style={styles.btnPickReceiptText}>
                {selectedReceipt
                  ? 'Ganti Foto Struk'
                  : bayar
                  ? 'Unggah Ulang Bukti Transfer'
                  : 'Pilih Foto Bukti Transfer'}
              </Text>
            </TouchableOpacity>

          {selectedReceipt && (
            <TouchableOpacity
              style={styles.previewBox3D}
              activeOpacity={0.88}
              onPress={() => {
                setPreviewImageUrl(selectedReceipt.uri);
                setPreviewModalVisible(true);
              }}
            >
              <Image source={{ uri: selectedReceipt.uri }} style={styles.previewImage3D} />
              <View style={styles.previewFileBadge}>
                <Ionicons name="image" size={14} color="#2563EB" />
                <Text style={styles.previewFileName} numberOfLines={1}>
                  {selectedReceipt.name} (Ketuk untuk perbesar)
                </Text>
              </View>
            </TouchableOpacity>
          )}

          {selectedReceipt && (
            <TouchableOpacity
              style={[styles.btnSubmitReceipt3D, uploading && styles.btnDisabled]}
              onPress={handleUploadReceipt}
              disabled={uploading}
              activeOpacity={0.85}
            >
              <View style={styles.btnShine3D} />
              {uploading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                  <Text style={styles.btnSubmitReceiptText}>UNGGAH BUKTI SEKARANG</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
      </View>

      {/* Panduan Pembayaran 3D */}
      <View style={styles.guideClayCard3D}>
        <View style={styles.guideHeaderRow}>
          <View style={styles.guideOrb}>
            <Ionicons name="help-circle" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.guideTitleText}>Cara Melakukan Pembayaran</Text>
        </View>

        <Text style={styles.guideStepText}>1. Transfer ke nomor rekening di atas melalui ATM, M-Banking, atau Teller.</Text>
        <Text style={styles.guideStepText}>2. Pastikan nominal transfer sesuai dengan total biaya pendaftaran.</Text>
        <Text style={styles.guideStepText}>3. Foto atau screenshot struk bukti pembayaran dengan jelas.</Text>
        <Text style={styles.guideStepText}>4. Unggah foto bukti transfer melalui tombol di atas.</Text>
      </View>

      {/* ═══════════════════════════════════════════
          MODAL LIGHTBOX PRATINJAU FOTO BUKTI
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
                <Text style={styles.previewModalTitle}>Bukti Pembayaran Pendaftaran</Text>
                <Text style={styles.previewModalSub}>{data?.nomor_pendaftaran || 'SMP Dharma Bakti'}</Text>
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
              {previewImageUrl && (
                <Image
                  source={{ uri: previewImageUrl }}
                  style={styles.previewModalImage}
                  resizeMode="contain"
                />
              )}
            </View>

            {/* Footer Actions */}
            <View style={styles.previewModalFooter}>
              <TouchableOpacity
                style={styles.previewBtnSecondary}
                onPress={() => setPreviewModalVisible(false)}
              >
                <Text style={styles.previewBtnSecondaryText}>Tutup</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.previewBtnPrimary}
                onPress={async () => {
                  if (previewImageUrl) {
                    if (Platform.OS === 'web' && typeof window !== 'undefined') {
                      window.open(previewImageUrl, '_blank');
                    } else {
                      try {
                        await WebBrowser.openBrowserAsync(previewImageUrl);
                      } catch (e) {
                        console.log('Error opening browser:', e);
                      }
                    }
                  }
                }}
              >
                <Ionicons name="open-outline" size={16} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.previewBtnPrimaryText}>Buka Gambar Penuh</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
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
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#60A5FA',
    borderBottomWidth: 5,
    borderBottomColor: '#1D4ED8',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },

  /* ─── 3D ATM Holographic Card ─── */
  atmCard3D: {
    backgroundColor: '#1E3A8A',
    borderRadius: 26,
    padding: 22,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 6,
    borderBottomColor: '#172554',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 35px -8px rgba(30, 58, 138, 0.45)',
      },
      default: {
        elevation: 8,
      },
    }),
  },
  atmSpecularShine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 999,
  },
  atmTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  atmChipWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emvChip3D: {
    width: 40,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#F59E0B',
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderBottomWidth: 2.5,
    borderBottomColor: '#B45309',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  emvLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#B45309',
  },
  emvLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: '#B45309',
  },
  atmBankBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  atmBankText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  atmNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  atmNumberText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
    fontFamily: Platform.OS === 'web' ? 'monospace' : undefined,
  },
  atmCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
  },
  atmCopyText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    marginLeft: 4,
  },
  atmBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.12)',
  },
  atmHolderLabel: {
    fontSize: 9,
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  atmHolderValue: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: 2,
  },
  atmAmountValue: {
    fontSize: 15,
    color: '#38BDF8',
    fontWeight: '800',
    marginTop: 2,
  },

  /* ─── Claymorphic Card ─── */
  clayCard3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.06)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  cardHeader3D: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sectionOrbSmall: {
    width: 38,
    height: 38,
    borderRadius: 19,
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
  paymentInfoBox3D: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  paymentRow3D: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel3D: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  infoValue3D: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  adminNoteBox3D: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  adminNoteTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  adminNoteDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  notUploadedBox3D: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFBEB',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#FDE68A',
    gap: 8,
  },
  notUploadedText3D: {
    flex: 1,
    fontSize: 12,
    color: '#B45309',
    lineHeight: 17,
  },

  /* ─── Upload Area ─── */
  uploadSection3D: {
    marginTop: 14,
  },
  btnPickReceipt3D: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderBottomWidth: 3.5,
    borderBottomColor: '#93C5FD',
    paddingVertical: 14,
  },
  btnPickReceiptText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#2563EB',
  },
  previewBox3D: {
    marginTop: 12,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    padding: 10,
  },
  previewImage3D: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    resizeMode: 'contain',
    backgroundColor: '#0F172A',
  },
  previewFileBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  previewFileName: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '600',
  },
  btnSubmitReceipt3D: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderBottomWidth: 5,
    borderBottomColor: '#047857',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 12,
  },
  btnShine3D: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  btnSubmitReceiptText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnDisabled: {
    opacity: 0.6,
  },

  /* ─── Guide ─── */
  guideClayCard3D: {
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
  },
  guideHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  guideOrb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#06B6D4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  guideTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  guideStepText: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
    marginBottom: 4,
  },

  /* ─── Status Feedback Banners ─── */
  lunasBanner3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  lunasTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#15803D',
  },
  lunasDesc: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
    lineHeight: 16,
  },
  rejectedBanner3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  rejectedTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B91C1C',
  },
  rejectedDesc: {
    fontSize: 11,
    color: '#991B1B',
    marginTop: 2,
    lineHeight: 16,
  },
  cicilanBanner3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  cicilanTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#B45309',
  },
  cicilanDesc: {
    fontSize: 11,
    color: '#92400E',
    marginTop: 2,
    lineHeight: 16,
  },
  menungguBanner3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  menungguTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  menungguDesc: {
    fontSize: 11,
    color: '#1E40AF',
    marginTop: 2,
    lineHeight: 16,
  },
  btnViewCurrentReceipt: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 12,
    marginTop: 10,
    gap: 6,
  },
  btnViewCurrentReceiptText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },

  /* ─── Receipt Inline Preview ─── */
  receiptPreviewCard: {
    marginTop: 14,
    backgroundColor: '#F8FAFC',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  receiptPreviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptPreviewTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  receiptTapHint: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  receiptThumbnailWrap: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  receiptThumbnail: {
    width: '100%',
    height: '100%',
  },
  receiptZoomOverlay: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  receiptZoomText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  /* ─── Lightbox Modal ─── */
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  previewModalContainer: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    ...Platform.select({
      web: { boxShadow: '0 20px 45px rgba(0,0,0,0.4)' },
      default: { elevation: 10 },
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
    fontSize: 14,
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
    justifyContent: 'flex-end',
    gap: 10,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  previewBtnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  previewBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
