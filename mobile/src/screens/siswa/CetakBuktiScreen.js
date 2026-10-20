import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, formatFileUrl } from '../../config';

export default function CetakBuktiScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPdfUrl();
  }, []);

  const fetchPdfUrl = async () => {
    try {
      const res = await apiClient.get('/siswa/cetak-bukti');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      Alert.alert(
        'Akses Dibatasi',
        err.response?.data?.message || 'Bukti penerimaan belum dapat diunduh.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPdf = async () => {
    if (data?.pdf_url) {
      const fullUrl = formatFileUrl(data.pdf_url);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(fullUrl, '_blank');
        return;
      }
      try {
        await WebBrowser.openBrowserAsync(fullUrl);
      } catch (e) {
        Alert.alert('Gagal Membuka Browser', 'Tidak dapat membuka tautan PDF.');
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Menyiapkan berkas PDF...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.buktiLogo}
            resizeMode="contain"
          />
        </View>

        <Text style={styles.title}>Surat Bukti Penerimaan Siswa Baru</Text>
        <Text style={styles.subtitle}>SMP DHARMA BAKTI</Text>

        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nama Calon Siswa:</Text>
            <Text style={styles.infoValue}>{data?.nama_lengkap || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nomor Pendaftaran:</Text>
            <Text style={styles.infoValueBold}>{data?.nomor_pendaftaran || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Format Dokumen:</Text>
            <Text style={styles.infoValue}>PDF Resmi Ber-Barcode</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.downloadButton} onPress={handleOpenPdf}>
          <Ionicons name="download-outline" size={20} color={COLORS.white} />
          <Text style={styles.downloadText}>UNDUH / CETAK PDF</Text>
        </TouchableOpacity>

        <Text style={styles.hintText}>
          * Surat resmi ini wajib dicetak dan dibawa saat proses daftar ulang fisik di sekolah.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
    justifyContent: 'center',
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
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 6,
  },
  iconCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  buktiLogo: {
    width: 76,
    height: 76,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
    marginTop: 2,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 14,
    width: '100%',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
  },
  infoValueBold: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  downloadButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: '100%',
    borderRadius: 10,
    gap: 8,
    marginBottom: 14,
  },
  downloadText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  hintText: {
    fontSize: 11,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});
