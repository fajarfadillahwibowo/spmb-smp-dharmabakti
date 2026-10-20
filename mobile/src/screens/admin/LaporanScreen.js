import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, STORAGE_BASE_URL, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function LaporanScreen() {
  const [data, setData] = useState([]);
  const [ringkasan, setRingkasan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLaporan = async () => {
    try {
      const res = await apiClient.get('/admin/laporan');
      if (res.data.success) {
        setData(res.data.data || []);
        setRingkasan(res.data.ringkasan);
      }
    } catch (e) {
      console.log('Error fetching laporan:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handleExportCsv = async () => {
    const exportUrl = formatFileUrl('/admin/data-pendaftar/export');
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(exportUrl, '_blank');
      return;
    }
    try {
      await WebBrowser.openBrowserAsync(exportUrl);
    } catch (e) {
      Alert.alert('Gagal', 'Tidak dapat membuka tautan ekspor.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Menyiapkan rekapitulasi data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchLaporan();
          }}
        />
      }
    >
      {/* Header Rekap Banner */}
      <View style={styles.headerCard}>
        <View style={styles.headerTitleRow}>
          <Ionicons name="document-text" size={24} color={COLORS.secondary} />
          <Text style={styles.headerTitle}>Rekapitulasi Laporan SPMB</Text>
        </View>
        <Text style={styles.headerSub}>SMP DHARMA BAKTI - T.A 2025/2026</Text>
        <Text style={styles.headerDate}>Dicetak pada: {ringkasan?.tanggal_laporan || '-'}</Text>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statNum}>{ringkasan?.total_pendaftar || 0}</Text>
            <Text style={styles.statLabel}>Total Pendaftar</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#86EFAC' }]}>{ringkasan?.total_diterima || 0}</Text>
            <Text style={styles.statLabel}>Diterima</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#FCA5A5' }]}>{ringkasan?.total_tidak_diterima || 0}</Text>
            <Text style={styles.statLabel}>Tidak Diterima</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statNum, { color: '#FDE047' }]}>{ringkasan?.total_lunas || 0}</Text>
            <Text style={styles.statLabel}>Lunas</Text>
          </View>
        </View>
      </View>

      {/* Export Action */}
      <TouchableOpacity style={styles.exportBtn} onPress={handleExportCsv}>
        <Ionicons name="download-outline" size={20} color={COLORS.white} />
        <Text style={styles.exportBtnText}>EKSPOR DATA KE EXCEL / CSV</Text>
      </TouchableOpacity>

      {/* Daftar Rekap Calon Siswa */}
      <Text style={styles.sectionTitle}>Rincian Rekap Calon Siswa ({data.length})</Text>

      {data.map((item, index) => (
        <View key={index} style={styles.itemCard}>
          <View style={styles.itemHeader}>
            <Text style={styles.itemRegNum}>{item.nomor_pendaftaran}</Text>
            <StatusBadge status={item.status_seleksi} />
          </View>

          <Text style={styles.itemName}>{item.nama_lengkap}</Text>
          <Text style={styles.itemSub}>NISN: {item.nisn} | Asal: {item.asal_sekolah}</Text>

          <View style={styles.itemDetails}>
            <Text style={styles.itemDetailText}>Nilai: <Text style={styles.bold}>{item.nilai_seleksi}</Text></Text>
            <Text style={styles.itemDetailText}>Berkas: <Text style={styles.bold}>{item.status_berkas}</Text></Text>
            <Text style={styles.itemDetailText}>Bayar: <Text style={styles.bold}>{item.status_pembayaran}</Text></Text>
          </View>
        </View>
      ))}
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
  headerCard: {
    backgroundColor: COLORS.primaryDark,
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.white,
  },
  headerSub: {
    fontSize: 12,
    color: COLORS.secondary,
    fontWeight: '700',
    marginTop: 2,
  },
  headerDate: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
  },
  statNum: {
    fontSize: 18,
    fontWeight: '900',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    textAlign: 'center',
  },
  exportBtn: {
    backgroundColor: COLORS.success,
    borderRadius: 10,
    height: 48,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },
  exportBtnText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  itemCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  itemRegNum: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },
  itemSub: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  itemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 8,
    marginTop: 8,
  },
  itemDetailText: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
  bold: {
    fontWeight: '700',
    color: COLORS.text,
  },
});
