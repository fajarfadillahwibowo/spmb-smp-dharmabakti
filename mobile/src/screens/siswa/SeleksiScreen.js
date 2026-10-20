import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { COLORS } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function SeleksiScreen() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchSeleksi = async () => {
    try {
      const res = await apiClient.get('/siswa/seleksi');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (e) {
      console.log('Error fetching seleksi data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSeleksi();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat status seleksi...</Text>
      </View>
    );
  }

  const seleksi = data?.seleksi;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchSeleksi();
          }}
        />
      }
    >
      {/* Kartu Peserta Ujian / Seleksi */}
      <View style={styles.card}>
        <View style={styles.cardBadgeHeader}>
          <Text style={styles.cardHeaderTitle}>KARTU PESERTA SELEKSI</Text>
          <StatusBadge status={seleksi?.status_seleksi || 'MENUNGGU'} />
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nomor Pendaftaran</Text>
          <Text style={styles.infoValueBold}>{data?.nomor_pendaftaran || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Nama Calon Siswa</Text>
          <Text style={styles.infoValue}>{data?.nama_lengkap || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Asal Sekolah</Text>
          <Text style={styles.infoValue}>{data?.asal_sekolah || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Status Berkas</Text>
          <StatusBadge status={data?.status_pendaftaran || '-'} />
        </View>
      </View>

      {/* Alert Jika Berkas Ditolak */}
      {data?.status_pendaftaran === 'ditolak' && (
        <View style={styles.rejectionNotice}>
          <View style={styles.rejectionNoticeHeader}>
            <Ionicons name="alert-circle" size={20} color="#DC2626" />
            <Text style={styles.rejectionNoticeTitle}>Berkas Pendaftaran Ditolak</Text>
          </View>
          <Text style={styles.rejectionNoticeText}>
            {data?.catatan_verifikasi || 'Beberapa dokumen persyaratan belum sesuai kriteria.'}
          </Text>
          <Text style={styles.rejectionNoticeSub}>
            ⚠️ Jadwal tes seleksi akan diterbitkan setelah Anda mengunggah ulang berkas perbaikan di menu Dokumen.
          </Text>
        </View>
      )}

      {/* Detail Seleksi & Jadwal */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <Ionicons name="calendar-outline" size={20} color={COLORS.primary} />
          <Text style={styles.sectionTitle}>Jadwal Pelaksanaan Tes Seleksi</Text>
        </View>

        <View style={styles.scheduleBox}>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>📅 Tanggal Seleksi</Text>
            <Text style={styles.scheduleValue}>
              {seleksi?.tanggal_seleksi || (data?.status_pendaftaran === 'terverifikasi' ? 'Segera diumumkan' : 'Menunggu verifikasi berkas')}
            </Text>
          </View>

          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>⏰ Waktu / Jam</Text>
            <Text style={styles.scheduleValue}>
              {seleksi?.waktu_seleksi || (seleksi?.tanggal_seleksi ? '08:00 - 10:00 WIB' : '-')}
            </Text>
          </View>
        </View>

        <View style={styles.scheduleBox}>
          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>📍 Lokasi / Ruangan</Text>
            <Text style={styles.scheduleValue}>
              {seleksi?.tempat_seleksi || (seleksi?.tanggal_seleksi ? 'Ruang CBT / Lab Komputer SMP Dharma Bakti' : '-')}
            </Text>
          </View>

          <View style={styles.scheduleItem}>
            <Text style={styles.scheduleLabel}>🎯 Nilai Seleksi</Text>
            <Text style={styles.scoreValue}>
              {seleksi?.nilai_seleksi !== null && seleksi?.nilai_seleksi !== undefined
                ? seleksi.nilai_seleksi
                : 'Belum Dinilai'}
            </Text>
          </View>
        </View>

        {seleksi?.catatan ? (
          <View style={styles.noteBox}>
            <Text style={styles.noteTitle}>📝 Petunjuk & Catatan Panitia:</Text>
            <Text style={styles.noteText}>{seleksi.catatan}</Text>
          </View>
        ) : null}
      </View>

      {/* Info Petunjuk */}
      <View style={styles.tipsBox}>
        <Text style={styles.tipsTitle}>💡 Petunjuk Ujian / Seleksi:</Text>
        <Text style={styles.tipsItem}>1. Pastikan berkas Anda telah berstatus TERVERIFIKASI.</Text>
        <Text style={styles.tipsItem}>2. Hadir tepat waktu 30 menit sebelum jadwal tes yang tertera.</Text>
        <Text style={styles.tipsItem}>3. Bawa fotokopi bukti pendaftaran dan seragam sekolah asal.</Text>
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
  cardBadgeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: COLORS.primaryDark,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  infoValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  infoValueBold: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '800',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginLeft: 8,
  },
  scheduleBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scheduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scheduleLabel: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '600',
  },
  scheduleValue: {
    fontSize: 13,
    color: COLORS.primaryDark,
    fontWeight: '700',
  },
  scoreValue: {
    fontSize: 18,
    color: COLORS.secondary,
    fontWeight: '800',
  },
  noteBox: {
    backgroundColor: '#FEF3C7',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  noteTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 12,
    color: '#92400E',
    lineHeight: 18,
  },
  tipsBox: {
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginBottom: 6,
  },
  tipsItem: {
    fontSize: 12,
    color: '#1E3A8A',
    lineHeight: 18,
    marginBottom: 2,
  },
  rejectionNotice: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#F87171',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  rejectionNoticeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  rejectionNoticeTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  rejectionNoticeText: {
    fontSize: 13,
    color: '#7F1D1D',
    lineHeight: 18,
    fontWeight: '600',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    marginBottom: 8,
  },
  rejectionNoticeSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
    lineHeight: 16,
  },
});
