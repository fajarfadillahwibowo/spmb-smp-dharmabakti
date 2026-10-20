import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, STORAGE_BASE_URL, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function DetailPendaftarScreen({ route }) {
  const { id } = route.params || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      const res = await apiClient.get(`/admin/pendaftar/${id}`);
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (e) {
      console.log('Error fetching detail pendaftar:', e);
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

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat rincian data...</Text>
      </View>
    );
  }

  const pendaftaran = data?.pendaftaran;
  const cs = data?.calon_siswa;
  const docs = data?.dokumen;
  const seleksi = data?.seleksi;
  const bayar = data?.pembayaran;

  const formatTTL = (tempat, tanggal) => {
    if (!tempat && !tanggal) return '-';
    const cleanTgl = tanggal ? String(tanggal).split('T')[0] : '';
    if (tempat && cleanTgl) return `${tempat}, ${cleanTgl}`;
    return tempat || cleanTgl || '-';
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Header Info */}
      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text style={styles.regNumber}>{pendaftaran?.nomor_pendaftaran}</Text>
          <StatusBadge status={pendaftaran?.status_pendaftaran} />
        </View>
        <Text style={styles.studentName}>{cs?.nama_lengkap || 'Belum Mengisi Nama'}</Text>
        <Text style={styles.schoolOrigin}>Asal Sekolah: {pendaftaran?.asal_sekolah || '-'}</Text>
        <Text style={styles.regDate}>Tanggal Daftar: {pendaftaran?.tanggal_daftar || '-'}</Text>
      </View>

      {/* 1. Data Pribadi */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>1. Data Pribadi Siswa</Text>
        <View style={styles.infoRow}><Text style={styles.label}>NISN:</Text><Text style={styles.val}>{cs?.nisn || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>TTL:</Text><Text style={styles.val}>{formatTTL(cs?.tempat_lahir, cs?.tanggal_lahir)}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Jenis Kelamin:</Text><Text style={styles.val}>{cs?.jenis_kelamin || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Alamat:</Text><Text style={styles.val}>{cs?.alamat || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Nama Ortu/Wali:</Text><Text style={styles.val}>{cs?.nama_ortu_wali || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>No. HP Ortu:</Text><Text style={styles.val}>{cs?.no_hp_ortu || '-'}</Text></View>
      </View>

      {/* 2. Berkas Dokumen Persyaratan */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>2. Berkas Persyaratan</Text>
        {[
          { label: 'Pasfoto 3x4', url: docs?.pasfoto },
          { label: 'Akta Kelahiran', url: docs?.akte_kelahiran },
          { label: 'Kartu Keluarga', url: docs?.kartu_keluarga },
          { label: 'Ijazah / SKL', url: docs?.ijazah },
        ].map((item, i) => (
          <View key={i} style={styles.docRow}>
            <Text style={styles.docLabel}>{item.label}</Text>
            {item.url ? (
              <TouchableOpacity style={styles.docBtn} onPress={() => handleOpenDoc(item.url)}>
                <Ionicons name="eye-outline" size={14} color={COLORS.primary} />
                <Text style={styles.docBtnText}>Lihat Berkas</Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.docEmpty}>Belum Ada</Text>
            )}
          </View>
        ))}

        {pendaftaran?.status_pendaftaran === 'ditolak' && pendaftaran?.catatan_verifikasi ? (
          <View style={styles.rejectionBox}>
            <View style={styles.rejectionHeader}>
              <Ionicons name="alert-circle" size={16} color="#DC2626" />
              <Text style={styles.rejectionTitle}>Catatan Revisi Berkas:</Text>
            </View>
            <Text style={styles.rejectionText}>{pendaftaran.catatan_verifikasi}</Text>
          </View>
        ) : null}
      </View>

      {/* 3. Hasil Seleksi */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>3. Penjadwalan & Penilaian Seleksi</Text>
        <View style={styles.infoRow}><Text style={styles.label}>Tanggal Seleksi:</Text><Text style={styles.valBold}>{seleksi?.tanggal_seleksi ? String(seleksi.tanggal_seleksi).split('T')[0] : 'Belum Ditetapkan'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Waktu / Jam:</Text><Text style={styles.val}>{seleksi?.waktu_seleksi || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Tempat / Ruang:</Text><Text style={styles.val}>{seleksi?.tempat_seleksi || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Nilai Seleksi:</Text><Text style={styles.valBold}>{seleksi?.nilai_seleksi ?? 'Belum Dinilai'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Status Seleksi:</Text><StatusBadge status={seleksi?.status_seleksi || 'MENUNGGU'} /></View>
        {seleksi?.catatan && (
          <View style={styles.infoRow}><Text style={styles.label}>Catatan Panitia:</Text><Text style={styles.val}>{seleksi.catatan}</Text></View>
        )}
      </View>

      {/* 4. Bukti Pembayaran */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>4. Pembayaran</Text>
        <View style={styles.infoRow}><Text style={styles.label}>Status Pembayaran:</Text><StatusBadge status={bayar?.status_pembayaran || 'MENUNGGU'} /></View>
        <View style={styles.infoRow}><Text style={styles.label}>Tgl Upload:</Text><Text style={styles.val}>{bayar?.tanggal_upload || '-'}</Text></View>
        {bayar?.bukti_url && (
          <TouchableOpacity style={[styles.docBtn, { marginTop: 8, alignSelf: 'flex-start' }]} onPress={() => handleOpenDoc(bayar.bukti_url)}>
            <Ionicons name="receipt-outline" size={14} color={COLORS.primary} />
            <Text style={styles.docBtnText}>Lihat Bukti Transfer</Text>
          </TouchableOpacity>
        )}
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
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  regNumber: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.white,
    marginBottom: 4,
  },
  schoolOrigin: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  regDate: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: COLORS.textMuted,
    flex: 1,
  },
  val: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1.5,
    textAlign: 'right',
  },
  valBold: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
  },
  docLabel: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  docBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  docBtnText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },
  docEmpty: {
    fontSize: 12,
    color: COLORS.danger,
    fontWeight: '600',
  },
  rejectionBox: {
    backgroundColor: '#FEF2F2',
    borderLeftWidth: 3.5,
    borderLeftColor: '#DC2626',
    borderRadius: 8,
    padding: 10,
    marginTop: 12,
  },
  rejectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  rejectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#991B1B',
  },
  rejectionText: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
    fontWeight: '500',
  },
});
