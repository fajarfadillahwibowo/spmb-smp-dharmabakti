import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { COLORS } from '../../config';

export default function PengumumanScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPengumuman = async () => {
    try {
      const res = await apiClient.get('/siswa/pengumuman');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (e) {
      console.log('Error fetching pengumuman:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPengumuman();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memeriksa pengumuman kelulusan...</Text>
      </View>
    );
  }

  const isAnnounced = data?.status === 'sudah_diumumkan';
  const isAccepted = data?.hasil_pendaftaran === 'Diterima';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchPengumuman();
          }}
        />
      }
    >
      {!isAnnounced ? (
        // Belum diumumkan
        <View style={styles.cardWaiting}>
          <View style={styles.iconWaitingCircle}>
            <Ionicons name="time-outline" size={48} color={COLORS.secondary} />
          </View>
          <Text style={styles.waitingTitle}>Pengumuman Belum Tersedia</Text>
          <Text style={styles.waitingText}>
            Hasil seleksi penerimaan murid baru sedang diproses oleh panitia SPMB SMP Dharma Bakti. Silakan cek secara berkala.
          </Text>
        </View>
      ) : isAccepted ? (
        // LULUS / DITERIMA
        <View style={styles.cardAccepted}>
          <View style={styles.badgeTop}>
            <Ionicons name="trophy" size={24} color="#15803D" />
            <Text style={styles.badgeTopText}>SELAMAT!</Text>
          </View>

          <View style={styles.logoAcceptWrapper}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.acceptLogo}
              resizeMode="contain"
            />
          </View>

          <Text style={styles.acceptedTitle}>ANDA DINYATAKAN DITERIMA</Text>
          <Text style={styles.schoolName}>SMP DHARMA BAKTI</Text>
          <Text style={styles.yearText}>Tahun Ajaran 2025 / 2026</Text>

          <View style={styles.studentInfoBox}>
            <Text style={styles.studentName}>{data?.nama_lengkap}</Text>
            <Text style={styles.regNumber}>No. Pendaftaran: {data?.nomor_pendaftaran}</Text>
            <Text style={styles.announceDate}>Diumumkan pada: {data?.tanggal_pengumuman}</Text>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            style={styles.btnPdf}
            onPress={() => navigation.navigate('CetakBukti')}
          >
            <Ionicons name="document-text-outline" size={20} color={COLORS.white} />
            <Text style={styles.btnPdfText}>CETAK BUKTI PENERIMAAN (PDF)</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnPay}
            onPress={() => navigation.navigate('TabBayar')}
          >
            <Ionicons name="wallet-outline" size={20} color={COLORS.white} />
            <Text style={styles.btnPayText}>LANJUT KE PEMBAYARAN</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // TIDAK DITERIMA
        <View style={styles.cardRejected}>
          <View style={styles.iconRejectedCircle}>
            <Ionicons name="close-circle" size={48} color={COLORS.danger} />
          </View>
          <Text style={styles.rejectedTitle}>MOHON MAAF</Text>
          <Text style={styles.rejectedDesc}>
            Berdasarkan hasil penilaian seleksi SPMB SMP Dharma Bakti, Anda belum memenuhi kriteria penerimaan tahun ini.
          </Text>
          <View style={styles.studentInfoBox}>
            <Text style={styles.studentName}>{data?.nama_lengkap}</Text>
            <Text style={styles.regNumber}>No. Pendaftaran: {data?.nomor_pendaftaran}</Text>
          </View>
          <Text style={styles.encourageText}>
            Tetap semangat dan jangan putus asa dalam menuntut ilmu!
          </Text>
        </View>
      )}
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
    justifyContent: 'center',
  },
  cardWaiting: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginTop: 40,
  },
  iconWaitingCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  waitingTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 8,
  },
  waitingText: {
    fontSize: 13,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
  cardAccepted: {
    backgroundColor: '#F0FDF4',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#86EFAC',
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  badgeTop: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 14,
  },
  badgeTopText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#15803D',
  },
  logoAcceptWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#BBF7D0',
    overflow: 'hidden',
  },
  acceptLogo: {
    width: 60,
    height: 60,
  },
  acceptedTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#166534',
    textAlign: 'center',
  },
  schoolName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.primaryDark,
    marginTop: 4,
  },
  yearText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  studentInfoBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
    width: '100%',
    alignItems: 'center',
    marginVertical: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  studentName: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  regNumber: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: '700',
    marginTop: 2,
  },
  announceDate: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  btnPdf: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: '100%',
    borderRadius: 10,
    gap: 8,
    marginBottom: 10,
  },
  btnPdfText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  btnPay: {
    backgroundColor: COLORS.success,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 48,
    width: '100%',
    borderRadius: 10,
    gap: 8,
  },
  btnPayText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cardRejected: {
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FECACA',
    marginTop: 20,
  },
  iconRejectedCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  rejectedTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.danger,
    marginBottom: 8,
  },
  rejectedDesc: {
    fontSize: 13,
    color: '#7F1D1D',
    textAlign: 'center',
    lineHeight: 20,
  },
  encourageText: {
    fontSize: 13,
    fontStyle: 'italic',
    color: COLORS.textMuted,
    textAlign: 'center',
  },
});
