import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import apiClient from '../../api/client';
import ExecutiveMetricCard from '../../components/ExecutiveMetricCard';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../config';

export default function KepalaSekolahDashboard({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const fetchMetrics = async () => {
    try {
      setErrorMessage(null);
      const res = await apiClient.get('/kepala-sekolah/dashboard');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      if (!err.response) {
        setErrorMessage('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else if (err.response.status === 403) {
        setErrorMessage('Akses ditolak: Akun ini tidak memiliki hak pengawas.');
      } else {
        setErrorMessage(err.response.data?.message || 'Gagal memuat ringkasan data.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerBox}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat metrik pengawasan...</Text>
      </View>
    );
  }

  if (errorMessage && !data) {
    return (
      <View style={styles.centerBox}>
        <Ionicons name="cloud-offline-outline" size={56} color="#EF4444" />
        <Text style={styles.errorTitle}>Kendala Sinkronisasi Data</Text>
        <Text style={styles.errorDesc}>{errorMessage}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={fetchMetrics}>
          <Ionicons name="refresh" size={18} color="#FFFFFF" />
          <Text style={styles.retryBtnText}>Coba Muat Ulang</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const pendaftaran = data?.pendaftaran;
  const seleksi = data?.seleksi;
  const keuangan = data?.keuangan;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
    >
      {/* Header Banner Eksekutif */}
      <View style={styles.headerBanner}>
        <Text style={styles.bannerTag}>PANEL PENGAWASAN SPMB</Text>
        <Text style={styles.bannerTitle}>SMP DHARMA BAKTI</Text>
        <Text style={styles.bannerDesc}>
          Tahun Ajaran {data?.tahun_ajaran || '2026/2027'} • Monitoring Real-Time
        </Text>
      </View>

      {/* Quick Access Action Pills */}
      <View style={styles.quickAccessRow}>
        <TouchableOpacity
          style={styles.pillButton}
          onPress={() => navigation.navigate('TabKepsekPendaftar')}
        >
          <Ionicons name="people" size={16} color="#1E3A8A" />
          <Text style={styles.pillText}>Data Siswa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pillButton, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}
          onPress={() => navigation.navigate('TabKepsekKeuangan')}
        >
          <Ionicons name="cash" size={16} color="#059669" />
          <Text style={[styles.pillText, { color: '#059669' }]}>Keuangan</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pillButton, { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' }]}
          onPress={() => navigation.navigate('TabKepsekLaporan')}
        >
          <Ionicons name="document-text" size={16} color="#15803D" />
          <Text style={[styles.pillText, { color: '#15803D' }]}>Laporan PDF</Text>
        </TouchableOpacity>
      </View>

      {/* Laporan Rekapitulasi Akhir Banner */}
      <TouchableOpacity
        style={styles.laporanBanner}
        onPress={() => navigation.navigate('TabKepsekLaporan')}
        activeOpacity={0.88}
      >
        <View style={styles.laporanBannerIcon}>
          <Ionicons name="newspaper" size={24} color="#15803D" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.laporanBannerTitle}>Laporan Rekapitulasi Akhir (PDF)</Text>
          <Text style={styles.laporanBannerSub}>
            Pratinjau lembar data diri calon siswa baru & unduh laporan resmi ber-kop sekolah
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#15803D" />
      </TouchableOpacity>

      {/* Grid Metrik Utama */}
      <View style={styles.metricGrid}>
        <Text style={styles.sectionTitle}>Ringkasan Pendaftaran & Berkas</Text>

        <ExecutiveMetricCard
          title="Total Pendaftar Masuk"
          value={`${pendaftaran?.total || 0} Siswa`}
          subtitle={`${pendaftaran?.terverifikasi || 0} berkas terverifikasi resmi`}
          icon="people"
          iconColor="#2563EB"
          bgColor="#DBEAFE"
        />

        <View style={styles.subCardRow}>
          <View style={[styles.miniCard, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.miniLabel}>PENDING VERIFIKASI</Text>
            <Text style={[styles.miniValue, { color: '#D97706' }]}>{pendaftaran?.menunggu || 0}</Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: '#FEE2E2' }]}>
            <Text style={styles.miniLabel}>BERKAS DITOLAK</Text>
            <Text style={[styles.miniValue, { color: '#DC2626' }]}>{pendaftaran?.ditolak || 0}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Arus Finansial & Kas Masuk</Text>

        <ExecutiveMetricCard
          title="Total Uang Masuk (Lunas)"
          value={keuangan?.format_rupiah || 'Rp 0'}
          subtitle={`${keuangan?.lunas || 0} pendaftar lunas administrasi`}
          icon="wallet"
          iconColor="#059669"
          bgColor="#D1FAE5"
        />

        <View style={styles.subCardRow}>
          <View style={[styles.miniCard, { backgroundColor: '#EFF6FF' }]}>
            <Text style={styles.miniLabel}>CICILAN BERJALAN</Text>
            <Text style={[styles.miniValue, { color: '#2563EB' }]}>{keuangan?.cicilan || 0}</Text>
          </View>
          <View style={[styles.miniCard, { backgroundColor: '#FEF3C7' }]}>
            <Text style={styles.miniLabel}>STRUK BUTUH APPROVAL</Text>
            <Text style={[styles.miniValue, { color: '#D97706' }]}>{keuangan?.menunggu_konfirmasi || 0}</Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Hasil Seleksi Penerimaan</Text>

        <ExecutiveMetricCard
          title="Kelulusan Siswa"
          value={`${seleksi?.diterima || 0} / ${seleksi?.peserta || 0} Siswa`}
          subtitle={`Nilai Rata-rata Ujian: ${seleksi?.rata_rata || 0}`}
          icon="school"
          iconColor="#7C3AED"
          bgColor="#EDE9FE"
        />
      </View>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerBanner: {
    backgroundColor: '#172554',
    padding: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  bannerTag: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    marginTop: 4,
  },
  bannerDesc: {
    color: '#E2E8F0',
    fontSize: 12,
    marginTop: 4,
  },
  quickAccessRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 10,
  },
  pillButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 6,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  metricGrid: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
  },
  subCardRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  miniCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
  },
  miniLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  miniValue: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 4,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 12,
  },
  errorDesc: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 18,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E3A8A',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    gap: 6,
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  laporanBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 6,
    padding: 14,
    gap: 12,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  laporanBannerIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#DCFCE7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  laporanBannerTitle: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#15803D',
  },
  laporanBannerSub: {
    fontSize: 11,
    color: '#166534',
    marginTop: 2,
  },
});
