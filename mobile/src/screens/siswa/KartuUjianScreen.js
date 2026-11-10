import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function KartuUjianScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

  const fetchKartuData = async () => {
    try {
      const res = await apiClient.get('/siswa/seleksi');
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
      }
    } catch (e) {
      console.log('Error fetch data seleksi:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKartuData();
  }, []);

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const res = await apiClient.get('/siswa/seleksi/cetak-kartu');
      if (res.data?.success && res.data?.data?.pdf_url) {
        const fullUrl = formatFileUrl(res.data.data.pdf_url);
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.open(fullUrl, '_blank');
          return;
        }
        await WebBrowser.openBrowserAsync(fullUrl);
      } else {
        // Fallback direct url with token
        const directUrl = formatFileUrl('/api/siswa/seleksi/download-kartu-pdf');
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.open(directUrl, '_blank');
          return;
        }
        await WebBrowser.openBrowserAsync(directUrl);
      }
    } catch (err) {
      // In web or fallback, try direct download endpoint
      const directUrl = formatFileUrl('/api/siswa/seleksi/download-kartu-pdf');
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(directUrl, '_blank');
        return;
      }
      Alert.alert(
        'Gagal Mengunduh',
        err.response?.data?.message || 'Pastikan koneksi internet stabil dan data pendaftaran Anda aktif.'
      );
    } finally {
      setDownloadingPdf(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loadingOrb3D}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        <Text style={styles.loadingText}>Memuat Kartu Peserta Ujian 3D...</Text>
      </View>
    );
  }

  const seleksi = data?.seleksi;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* ═══════════════════════════════════════
          3D HOLOGRAPHIC EXAM PASS CARD
      ═══════════════════════════════════════ */}
      <View style={styles.passCard3D}>
        {/* Specular light streak */}
        <View style={styles.specularShine3D} />

        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.emblemBox3D}>
            <View style={styles.emblemShine} />
            <Ionicons name="school" size={24} color="#FBBF24" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <View style={styles.badgeOfficial3D}>
              <Ionicons name="shield-checkmark" size={11} color="#38BDF8" />
              <Text style={styles.badgeOfficialText}>DOKUMEN RESMI SPMB</Text>
            </View>
            <Text style={styles.passTitle}>Kartu Peserta Ujian</Text>
            <Text style={styles.passSub}>SMP DHARMA BAKTI • 2026/2027</Text>
          </View>
        </View>

        <View style={styles.passDivider} />

        {/* Nommor Peserta Badge */}
        <View style={styles.nomorPesertaBox}>
          <Text style={styles.nomorLabel}>NOMOR PESERTA UJIAN</Text>
          <Text style={styles.nomorVal}>{data?.nomor_pendaftaran || 'SPMB-2026-ONLINE'}</Text>
        </View>

        {/* Candidate Detail Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nama Lengkap</Text>
            <Text style={styles.detailVal}>{data?.nama_lengkap || 'Calon Siswa'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Asal Sekolah</Text>
            <Text style={styles.detailVal}>{data?.asal_sekolah || 'SD / MI'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Status Berkas</Text>
            <View style={{ alignSelf: 'flex-start' }}>
              <StatusBadge status={data?.status_pendaftaran || 'terverifikasi'} />
            </View>
          </View>
        </View>

        {/* Schedule Box */}
        <View style={styles.scheduleBox3D}>
          <View style={styles.scheduleHeaderRow}>
            <Ionicons name="calendar" size={16} color="#059669" />
            <Text style={styles.scheduleTitle}>JADWAL & LOKASI UJIAN</Text>
          </View>
          <Text style={styles.scheduleDate}>
            📅 {seleksi?.tanggal_seleksi || 'Sesuai Jadwal Gelombang'}
          </Text>
          <Text style={styles.scheduleTime}>
            ⏰ Waktu: {seleksi?.waktu_seleksi || '08.00 WIB - 10.00 WIB'}
          </Text>
          <Text style={styles.scheduleLoc}>
            📍 Lokasi: {seleksi?.tempat_seleksi || 'Ruang CBT / Lab Komputer'}
          </Text>
        </View>

        {/* Big 3D Tactile Action Button */}
        <TouchableOpacity
          style={[styles.btnDownload3D, downloadingPdf && { opacity: 0.7 }]}
          activeOpacity={0.82}
          disabled={downloadingPdf}
          onPress={handleDownloadPdf}
        >
          <View style={styles.btnShineHighlight} />
          {downloadingPdf ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="print" size={20} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.btnDownloadText}>UNDUH & CETAK KARTU (PDF)</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Instructions Card */}
      <View style={styles.guideCard3D}>
        <View style={styles.guideHeader}>
          <Ionicons name="information-circle" size={18} color="#2563EB" />
          <Text style={styles.guideTitle}>Petunjuk Cetak & Ujian</Text>
        </View>
        <Text style={styles.guideText}>
          1. Ketuk tombol <Text style={{ fontWeight: '700' }}>"UNDUH & CETAK KARTU (PDF)"</Text> di atas.
        </Text>
        <Text style={styles.guideText}>
          2. Simpan file PDF ke penyimpanan ponsel Anda atau cetak langsung menggunakan printer.
        </Text>
        <Text style={styles.guideText}>
          3. Bawa cetakan fisik kartu ujian ini saat hadir mengikuti ujian seleksi offline di sekolah.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 16,
    paddingBottom: 110,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: '#0F172A',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingOrb3D: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#94A3B8',
    fontWeight: '600',
  },
  passCard3D: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderBottomWidth: 6,
    borderBottomColor: '#0284C7',
    padding: 20,
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.4,
    shadowRadius: 24,
    elevation: 14,
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 20,
  },
  specularShine3D: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '42%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emblemBox3D: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(30, 58, 138, 0.8)',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  emblemShine: {
    position: 'absolute',
    top: 3,
    left: 8,
    width: 14,
    height: 8,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  },
  badgeOfficial3D: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    marginBottom: 4,
  },
  badgeOfficialText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.6,
  },
  passTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  passSub: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '600',
  },
  passDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.15)',
    marginVertical: 16,
  },
  nomorPesertaBox: {
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.25)',
    marginBottom: 16,
  },
  nomorLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.8,
  },
  nomorVal: {
    fontSize: 20,
    fontWeight: '900',
    color: '#38BDF8',
    letterSpacing: 1.2,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginTop: 2,
  },
  detailsGrid: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 14,
    padding: 14,
    gap: 10,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  detailVal: {
    fontSize: 13,
    color: '#F8FAFC',
    fontWeight: '700',
  },
  scheduleBox3D: {
    backgroundColor: 'rgba(6, 95, 70, 0.25)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.4)',
    borderBottomWidth: 3,
    borderBottomColor: '#059669',
    marginBottom: 20,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  scheduleTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#34D399',
    letterSpacing: 0.6,
  },
  scheduleDate: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  scheduleTime: {
    fontSize: 12,
    color: '#D1FAE5',
    marginBottom: 2,
  },
  scheduleLoc: {
    fontSize: 12,
    color: '#A7F3D0',
  },
  btnDownload3D: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderBottomWidth: 5,
    borderBottomColor: '#1D4ED8',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  btnShineHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '45%',
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  btnDownloadText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  guideCard3D: {
    backgroundColor: '#1E293B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
    borderBottomWidth: 3,
    borderBottomColor: '#334155',
    padding: 16,
  },
  guideHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  guideTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#F8FAFC',
  },
  guideText: {
    fontSize: 12,
    color: '#94A3B8',
    lineHeight: 18,
    marginBottom: 6,
  },
});
