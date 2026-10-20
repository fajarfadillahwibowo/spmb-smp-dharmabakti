import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/client';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';
import SkeletonLoader, { SkeletonDashboard } from '../../components/SkeletonLoader';
import EmptyState from '../../components/EmptyState';

// Dummy State Fallback (Mensimulasikan respons JSON dari Laravel 11 jika server offline)
const DUMMY_DASHBOARD_DATA = {
  nama_lengkap: 'Ahmad Faiz Al-Ghifari',
  nomor_pendaftaran: 'SPMB-2026-0042',
  status_pendaftaran: 'menunggu_verifikasi',
  formulir_selesai: true,
  dokumen_lengkap: true,
  status_seleksi: 'menunggu',
  hasil_pengumuman: null,
  status_pembayaran: null,
  asal_sekolah: 'SD Negeri 01 Pagi',
  tanggal_daftar: '2026-09-01',
};

export default function SiswaDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  // Ambil Data Dashboard dari Backend Laravel
  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get('/siswa/dashboard');
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
        setIsUsingDummy(false);
      } else {
        // Fallback ke dummy state jika response kosong
        setData(DUMMY_DASHBOARD_DATA);
        setIsUsingDummy(true);
      }
    } catch (e) {
      console.log('Menggunakan simulated dummy data (koneksi API belum aktif):', e.message);
      setData(DUMMY_DASHBOARD_DATA);
      setIsUsingDummy(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, []);

  // Hitung persentase progres pendaftaran
  const calculateProgress = () => {
    if (!data) return 0;
    let completed = 0;
    if (data.formulir_selesai) completed += 1;
    if (data.dokumen_lengkap) completed += 1;
    if (data.status_seleksi && data.status_seleksi !== 'menunggu') completed += 1;
    if (data.hasil_pengumuman) completed += 1;
    if (data.status_pembayaran === 'lunas') completed += 1;
    return Math.round((completed / 5) * 100);
  };

  // Tahapan Alur SPMB Siswa
  const steps = [
    {
      id: 1,
      title: 'Formulir Pendaftaran',
      desc: data?.formulir_selesai ? 'Biodata & data orang tua terisi lengkap' : 'Isi identitas diri, NISN, dan asal sekolah',
      done: !!data?.formulir_selesai,
      icon: 'document-text',
      screen: 'TabDaftar',
    },
    {
      id: 2,
      title: 'Upload Dokumen Persyaratan',
      desc: data?.dokumen_lengkap ? '4 Berkas wajib lengkap terunggah' : 'Upload pasfoto, KK, Akta, dan Ijazah/SKL',
      done: !!data?.dokumen_lengkap,
      icon: 'cloud-upload',
      screen: 'TabDokumen',
    },
    {
      id: 3,
      title: 'Verifikasi & Seleksi Nilai',
      desc: data?.status_seleksi && data.status_seleksi !== 'menunggu'
        ? `Status: ${data.status_seleksi.toUpperCase()}`
        : 'Panitia sedang memvalidasi berkas & tes nilai',
      done: data?.status_seleksi && data?.status_seleksi !== 'menunggu',
      icon: 'ribbon',
      screen: 'TabSeleksi',
    },
    {
      id: 4,
      title: 'Hasil Pengumuman Kelulusan',
      desc: data?.hasil_pengumuman
        ? `Status Akhir: ${data.hasil_pengumuman}`
        : 'Menunggu rilis resmi dari pihak sekolah',
      done: !!data?.hasil_pengumuman,
      icon: 'megaphone',
      screen: 'TabInfo',
    },
    {
      id: 5,
      title: 'Cetak Surat Penerimaan PDF',
      desc: data?.hasil_pengumuman === 'Diterima'
        ? 'Unduh & cetak surat kelulusan resmi'
        : 'Terbuka otomatis jika dinyatakan Lulus',
      done: data?.hasil_pengumuman === 'Diterima',
      icon: 'print',
      screen: 'CetakBukti',
      disabled: data?.hasil_pengumuman !== 'Diterima',
    },
    {
      id: 6,
      title: 'Pembayaran Uang Pendaftaran',
      desc: data?.status_pembayaran
        ? `Status Bayar: ${data.status_pembayaran.toUpperCase()}`
        : 'Transfer ke rekening resmi sekolah',
      done: data?.status_pembayaran === 'lunas',
      icon: 'card',
      screen: 'TabBayar',
      disabled: data?.hasil_pengumuman !== 'Diterima',
    },
  ];

  // State Pemuatan dengan Skeleton Shimmer
  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
        <SkeletonDashboard />
      </View>
    );
  }

  const progressPercent = calculateProgress();
  const displayName = data?.nama_lengkap && data.nama_lengkap !== '-'
    ? data.nama_lengkap
    : user?.username || 'Calon Siswa';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
      >
        {/* Modern Clean Hero Header */}
        <View style={styles.heroSection}>
          <View style={styles.heroNavRow}>
            <TouchableOpacity
              style={styles.avatarRow}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Profile')}
            >
              <View style={styles.avatarCircle}>
                {user?.foto_profil_url ? (
                  <Image
                    source={{ uri: formatFileUrl(user.foto_profil_url) }}
                    style={styles.avatarImage}
                  />
                ) : (
                  <Text style={styles.avatarText}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={styles.userGreeting}>
                <Text style={styles.greetingSubtitle}>Selamat Datang,</Text>
                <Text style={styles.greetingTitle} numberOfLines={1}>
                  {displayName}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.logoutButton}
              onPress={logout}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Floating Registration Card */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryHeader}>
              <View>
                <Text style={styles.summaryCaption}>NOMOR PENDAFTARAN</Text>
                <Text style={styles.summaryRegNo}>
                  {data?.nomor_pendaftaran || 'Belum Mendaftar'}
                </Text>
              </View>
              <StatusBadge status={data?.status_pendaftaran || 'draft'} />
            </View>

            {/* Progress Bar Micro-interaction */}
            <View style={styles.progressContainer}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressLabel}>Kemajuan Registrasi</Text>
                <Text style={styles.progressValue}>{progressPercent}%</Text>
              </View>
              <View style={styles.progressBarTrack}>
                <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Info Banner Mode Demo/API */}
        {isUsingDummy && (
          <View style={styles.simulatedBanner}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.infoDark} />
            <Text style={styles.simulatedText}>
              Mode Pratinjau Desain Aktif (Menampilkan simulasi respons data Laravel)
            </Text>
          </View>
        )}

        {/* Alert Berkas Ditolak / Perlu Revisi */}
        {data?.status_pendaftaran === 'ditolak' && (
          <View style={styles.rejectionDashboardCard}>
            <View style={styles.rejectionHeaderRow}>
              <Ionicons name="alert-circle" size={22} color="#DC2626" />
              <Text style={styles.rejectionCardTitle}>Berkas Anda Perlu Diperbaiki</Text>
            </View>
            <Text style={styles.rejectionCardText}>
              {data.catatan_verifikasi || 'Beberapa dokumen persyaratan belum sesuai kriteria. Harap periksa dan unggah kembali berkas yang valid.'}
            </Text>
            <TouchableOpacity
              style={styles.rejectionActionBtn}
              onPress={() => navigation.navigate('TabDokumen')}
            >
              <Text style={styles.rejectionActionBtnText}>Perbaiki Berkas Sekarang</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Card Pengumuman Jadwal Seleksi */}
        {data?.status_pendaftaran === 'terverifikasi' && data?.tanggal_seleksi && (
          <View style={styles.scheduleDashboardCard}>
            <View style={styles.scheduleHeaderRow}>
              <Ionicons name="calendar" size={22} color="#059669" />
              <Text style={styles.scheduleCardTitle}>Jadwal Tes Seleksi Telah Terbit</Text>
            </View>
            <Text style={styles.scheduleCardDetail}>
              📅 {data.tanggal_seleksi} • ⏰ {data.waktu_seleksi || '08:00 WIB'}
            </Text>
            <Text style={styles.scheduleCardLocation}>
              📍 {data.tempat_seleksi || 'Kampus SMP Dharma Bakti'}
            </Text>
            <TouchableOpacity
              style={styles.scheduleActionBtn}
              onPress={() => navigation.navigate('TabSeleksi')}
            >
              <Text style={styles.scheduleActionBtnText}>Lihat Kartu Peserta & Petunjuk</Text>
              <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        )}

        {/* Section Steps */}
        <View style={styles.contentSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tahapan Pendaftaran</Text>
            <Text style={styles.sectionSubtitle}>
              Selesaikan tiap langkah berikut untuk verifikasi panitia
            </Text>
          </View>

          <View style={styles.stepsList}>
            {steps.map((step, idx) => {
              const isClickable = !step.disabled;

              return (
                <TouchableOpacity
                  key={step.id}
                  activeOpacity={0.75}
                  disabled={!isClickable}
                  onPress={() => isClickable && navigation.navigate(step.screen)}
                  style={[
                    styles.stepCard,
                    !isClickable && styles.stepCardDisabled,
                  ]}
                >
                  <View
                    style={[
                      styles.stepIconBox,
                      step.done
                        ? styles.stepIconBoxDone
                        : isClickable
                        ? styles.stepIconBoxActive
                        : styles.stepIconBoxDisabled,
                    ]}
                  >
                    <Ionicons
                      name={step.done ? 'checkmark' : step.icon}
                      size={20}
                      color={
                        step.done
                          ? COLORS.white
                          : isClickable
                          ? COLORS.primary
                          : COLORS.textSubtle
                      }
                    />
                  </View>

                  <View style={styles.stepContent}>
                    <View style={styles.stepTitleRow}>
                      <Text
                        style={[
                          styles.stepTitle,
                          !isClickable && styles.textDisabled,
                        ]}
                      >
                        {idx + 1}. {step.title}
                      </Text>
                      {step.done && (
                        <View style={styles.completedBadge}>
                          <Text style={styles.completedBadgeText}>Selesai</Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={[
                        styles.stepDesc,
                        !isClickable && styles.textDisabledSecondary,
                      ]}
                    >
                      {step.desc}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={isClickable ? COLORS.textMuted : '#CBD5E1'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Help Center Card */}
          <View style={styles.helpCard}>
            <View style={styles.helpIconBox}>
              <Ionicons name="chatbubbles-outline" size={24} color={COLORS.secondary} />
            </View>
            <View style={styles.helpTexts}>
              <Text style={styles.helpTitle}>Butuh Bantuan Panitia?</Text>
              <Text style={styles.helpDesc}>
                Hubungi Call Center SPMB SMP Dharma Bakti via WhatsApp jika ada kendala berkas.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SPACING['3xl'],
  },

  // Hero Section
  heroSection: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 48,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['3xl'],
    borderBottomLeftRadius: RADIUS['2xl'],
    borderBottomRightRadius: RADIUS['2xl'],
  },
  heroNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  avatarText: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.white,
  },
  userGreeting: {
    flex: 1,
  },
  greetingSubtitle: {
    fontSize: TYPOGRAPHY.size.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  greetingTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.white,
    marginTop: 2,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Summary Card Floating
  summaryCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.card,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryCaption: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  summaryRegNo: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.extraBold,
    color: COLORS.primaryDark,
    marginTop: 2,
  },

  // Progress Bar
  progressContainer: {
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.borderLight,
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  progressLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  progressValue: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  progressBarTrack: {
    height: 7,
    backgroundColor: '#E2E8F0',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.full,
  },

  // Simulated Banner
  simulatedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.infoSoft,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    gap: 8,
  },
  simulatedText: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.infoDark,
    lineHeight: 18,
  },
  rejectionDashboardCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#F87171',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  rejectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  rejectionCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  rejectionCardText: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: 10,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
  },
  rejectionActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  rejectionActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scheduleDashboardCard: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  scheduleCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  scheduleCardDetail: {
    fontSize: 13,
    fontWeight: '700',
    color: '#047857',
    marginBottom: 2,
  },
  scheduleCardLocation: {
    fontSize: 12,
    color: '#065F46',
    marginBottom: 10,
  },
  scheduleActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#059669',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 8,
    gap: 6,
  },
  scheduleActionBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Content Section
  contentSection: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  sectionHeader: {
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textMuted,
    marginTop: 2,
  },

  // Steps List
  stepsList: {
    gap: SPACING.md,
  },
  stepCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    minHeight: 74, // Ergonomic touch area
    ...SHADOWS.sm,
  },
  stepCardDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    opacity: 0.65,
  },
  stepIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  stepIconBoxActive: {
    backgroundColor: COLORS.primarySoft,
  },
  stepIconBoxDone: {
    backgroundColor: COLORS.success,
  },
  stepIconBoxDisabled: {
    backgroundColor: '#F1F5F9',
  },
  stepContent: {
    flex: 1,
    marginRight: SPACING.sm,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepTitle: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
  completedBadge: {
    backgroundColor: COLORS.successSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.xs,
  },
  completedBadgeText: {
    fontSize: 10,
    color: COLORS.successDark,
    fontWeight: TYPOGRAPHY.weight.bold,
  },
  stepDesc: {
    fontSize: TYPOGRAPHY.size.xs + 1,
    color: COLORS.textMuted,
    marginTop: 4,
    lineHeight: 18,
  },
  textDisabled: {
    color: COLORS.textSubtle,
  },
  textDisabledSecondary: {
    color: '#CBD5E1',
  },

  // Help Card
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.xl,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    ...SHADOWS.sm,
  },
  helpIconBox: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.secondarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  helpTexts: {
    flex: 1,
  },
  helpTitle: {
    fontSize: TYPOGRAPHY.size.sm + 1,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
  helpDesc: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 18,
  },
});
