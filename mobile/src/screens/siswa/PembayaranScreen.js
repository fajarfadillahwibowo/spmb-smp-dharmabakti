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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import apiClient from '../../api/client';
import { COLORS } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function PembayaranScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

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
      Alert.alert('Info', err.response?.data?.message || 'Halaman pembayaran belum tersedia.');
    } finally {
      setLoading(false);
    }
  };

  const handlePickReceipt = async () => {
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat informasi pembayaran...</Text>
      </View>
    );
  }

  const infoRek = data?.info_rekening;
  const bayar = data?.pembayaran;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Rekening Sekolah Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="card" size={22} color={COLORS.primary} />
          <Text style={styles.cardTitle}>Rekening Pembayaran Resmi</Text>
        </View>

        <View style={styles.bankBox}>
          <Text style={styles.bankName}>{infoRek?.nama_bank || 'BANK BNI'}</Text>
          <Text style={styles.accountNumber}>{infoRek?.nomor_rekening || '1234567890'}</Text>
          <Text style={styles.accountHolder}>a.n. {infoRek?.atas_nama || 'SMP Dharma Bakti'}</Text>
          <View style={styles.amountBadge}>
            <Text style={styles.amountLabel}>Total Biaya Pendaftaran:</Text>
            <Text style={styles.amountValue}>{infoRek?.jumlah_biaya || 'Rp 1.500.000'}</Text>
          </View>
        </View>

        <Text style={styles.instructionText}>
          Silakan transfer ke nomor rekening di atas melalui ATM, Mobile Banking, atau Teller Bank, lalu unggah foto struk / tangkapan layar bukti transfer di bawah ini.
        </Text>
      </View>

      {/* Status Bukti Pembayaran */}
      <View style={styles.card}>
        <View style={styles.cardHeaderBetween}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Ionicons name="receipt-outline" size={20} color={COLORS.primary} />
            <Text style={styles.cardTitle}>Status Verifikasi Pembayaran</Text>
          </View>
          {bayar?.status_pembayaran && (
            <StatusBadge status={bayar.status_pembayaran} />
          )}
        </View>

        {bayar ? (
          <View style={styles.paymentInfoBox}>
            <Text style={styles.uploadDate}>Tanggal Upload: {bayar.tanggal_upload || '-'}</Text>
            {bayar.catatan_admin ? (
              <View style={styles.adminNoteBox}>
                <Text style={styles.adminNoteLabel}>Catatan Admin:</Text>
                <Text style={styles.adminNoteText}>{bayar.catatan_admin}</Text>
              </View>
            ) : null}
          </View>
        ) : (
          <Text style={styles.notUploadedText}>Belum ada bukti pembayaran yang diunggah.</Text>
        )}

        {/* Upload Form */}
        <View style={styles.uploadSection}>
          <TouchableOpacity style={styles.pickButton} onPress={handlePickReceipt}>
            <Ionicons name="camera-outline" size={20} color={COLORS.primary} />
            <Text style={styles.pickButtonText}>
              {selectedReceipt ? 'Ganti Foto Bukti' : 'Pilih Foto Bukti Transfer'}
            </Text>
          </TouchableOpacity>

          {selectedReceipt && (
            <View style={styles.previewContainer}>
              <Image source={{ uri: selectedReceipt.uri }} style={styles.previewImage} />
              <Text style={styles.selectedFileName} numberOfLines={1}>
                {selectedReceipt.name}
              </Text>
            </View>
          )}

          {selectedReceipt && (
            <TouchableOpacity
              style={[styles.submitButton, uploading && styles.buttonDisabled]}
              onPress={handleUploadReceipt}
              disabled={uploading}
            >
              {uploading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={18} color={COLORS.white} />
                  <Text style={styles.submitButtonText}>UNGGAH BUKTI SEKARANG</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>
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
    marginBottom: 12,
  },
  cardHeaderBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginLeft: 8,
  },
  bankBox: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  bankName: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.secondary,
    letterSpacing: 1,
  },
  accountNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 2,
    marginVertical: 4,
  },
  accountHolder: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  amountBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 10,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  amountValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#86EFAC',
    marginTop: 2,
  },
  instructionText: {
    fontSize: 12,
    color: COLORS.textMuted,
    lineHeight: 18,
  },
  paymentInfoBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  uploadDate: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '600',
  },
  adminNoteBox: {
    backgroundColor: '#FEF3C7',
    padding: 8,
    borderRadius: 6,
    marginTop: 8,
  },
  adminNoteLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
  },
  adminNoteText: {
    fontSize: 12,
    color: '#92400E',
    marginTop: 2,
  },
  notUploadedText: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 12,
    fontStyle: 'italic',
  },
  uploadSection: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  pickButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: COLORS.primaryLight,
    borderRadius: 10,
    height: 48,
    gap: 8,
    backgroundColor: '#EFF6FF',
  },
  pickButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primary,
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  previewImage: {
    width: 140,
    height: 140,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  selectedFileName: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: COLORS.success,
    borderRadius: 10,
    height: 46,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
