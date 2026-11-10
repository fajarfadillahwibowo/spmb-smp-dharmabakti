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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/client';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';
import { SkeletonDashboard } from '../../components/SkeletonLoader';

// Dummy fallback data
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

// Layanan cepat (grid menu 3D)
const QUICK_SERVICES = [
  { id: 1, icon: 'document-text', label: 'Formulir',    screen: 'TabDaftar',   color: '#2563EB', darkColor: '#1D4ED8', shadow: '#2563EB' },
  { id: 2, icon: 'cloud-upload',  label: 'Dokumen',     screen: 'TabDokumen',  color: '#8B5CF6', darkColor: '#6D28D9', shadow: '#8B5CF6' },
  { id: 3, icon: 'ribbon',        label: 'Seleksi',     screen: 'TabSeleksi',  color: '#06B6D4', darkColor: '#0891B2', shadow: '#06B6D4' },
  { id: 4, icon: 'megaphone',     label: 'Pengumuman',  screen: 'TabInfo',     color: '#10B981', darkColor: '#059669', shadow: '#10B981' },
  { id: 5, icon: 'card',          label: 'Pembayaran',  screen: 'TabBayar',    color: '#F59E0B', darkColor: '#D97706', shadow: '#F59E0B' },
  { id: 6, icon: 'print',         label: 'Cetak Bukti', screen: 'CetakBukti',  color: '#EF4444', darkColor: '#DC2626', shadow: '#EF4444' },
];

export default function SiswaDashboard({ navigation }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isUsingDummy, setIsUsingDummy] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get('/siswa/dashboard');
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
        setIsUsingDummy(false);
      } else {
        setData(DUMMY_DASHBOARD_DATA);
        setIsUsingDummy(true);
      }
    } catch (e) {
      setData(DUMMY_DASHBOARD_DATA);
      setIsUsingDummy(true);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchDashboard(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboard();
  }, []);

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

  const steps = [
    {
      id: 1, title: 'Formulir Pendaftaran',
      desc: data?.formulir_selesai ? 'Biodata & data orang tua terisi lengkap' : 'Isi identitas diri, NISN, dan asal sekolah',
      done: !!data?.formulir_selesai, icon: 'document-text', screen: 'TabDaftar',
    },
    {
      id: 2, title: 'Upload Dokumen Persyaratan',
      desc: data?.dokumen_lengkap ? '4 Berkas wajib lengkap terunggah' : 'Upload pasfoto, KK, Akta, dan Ijazah/SKL',
      done: !!data?.dokumen_lengkap, icon: 'cloud-upload', screen: 'TabDokumen',
    },
    {
      id: 3, title: 'Verifikasi & Seleksi Nilai',
      desc: data?.status_seleksi && data.status_seleksi !== 'menunggu'
        ? `Status: ${data.status_seleksi.toUpperCase()}`
        : 'Panitia sedang memvalidasi berkas & tes nilai',
      done: data?.status_seleksi && data?.status_seleksi !== 'menunggu',
      icon: 'ribbon', screen: 'TabSeleksi',
    },
    {
      id: 4, title: 'Hasil Pengumuman Kelulusan',
      desc: data?.hasil_pengumuman ? `Status Akhir: ${data.hasil_pengumuman}` : 'Menunggu rilis resmi dari pihak sekolah',
      done: !!data?.hasil_pengumuman, icon: 'megaphone', screen: 'TabInfo',
    },
    {
      id: 5, title: 'Cetak Surat Penerimaan',
      desc: data?.hasil_pengumuman === 'Diterima' ? 'Unduh & cetak surat kelulusan resmi' : 'Terbuka otomatis jika dinyatakan Lulus',
      done: data?.hasil_pengumuman === 'Diterima', icon: 'print', screen: 'CetakBukti',
      disabled: data?.hasil_pengumuman !== 'Diterima',
    },
    {
      id: 6, title: 'Pembayaran Uang Pendaftaran',
      desc: data?.status_pembayaran ? `Status Bayar: ${data.status_pembayaran.toUpperCase()}` : 'Transfer ke rekening resmi sekolah',
      done: data?.status_pembayaran === 'lunas', icon: 'card', screen: 'TabBayar',
      disabled: false,
    },
  ];

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
  const firstName = displayName.split(' ')[0];

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
        {/* ═══════════════════════════════════════
            HEADER — Greeting + Avatar + Actions
        ═══════════════════════════════════════ */}
        <View style={styles.headerSection}>
          {/* Avatar + Greeting */}
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
            <View style={styles.greetingBlock}>
              <Text style={styles.greetingHello}>Halo,</Text>
              <Text style={styles.greetingName} numberOfLines={1}>{firstName}</Text>
            </View>
          </TouchableOpacity>


        </View>

        {/* ═══════════════════════════════════════
            HERO CARD — Nomor & Status Pendaftaran
        ═══════════════════════════════════════ */}
        <View style={styles.heroPad}>
          <View style={styles.heroCard}>
            <View style={styles.heroSpecularShine} />
            {/* Decorative gradient overlay orbs */}
            <View style={styles.heroOrb1} />
            <View style={styles.heroOrb2} />

            <View style={styles.heroContent}>
              {/* Left: registration info */}
              <View style={styles.heroLeft}>
                <View style={styles.heroNomorRow}>
                  <Text style={styles.heroNomorText} numberOfLines={1}>
                    {data?.nomor_pendaftaran || '— Belum Mendaftar —'}
                  </Text>
                  <View style={styles.heroNomorIcon}>
                    <Ionicons name="copy-outline" size={13} color={COLORS.primaryLight} />
                  </View>
                </View>

                <Text style={styles.heroLabel}>Status Pendaftaran</Text>
                <StatusBadge status={data?.status_pendaftaran || 'draft'} />

                {/* Progress mini */}
                <View style={styles.heroProgressRow}>
                  <View style={styles.heroProgressTrack}>
                    <View style={[styles.heroProgressFill, { width: `${progressPercent}%` }]} />
                  </View>
                  <Text style={styles.heroProgressPct}>{progressPercent}%</Text>
                </View>
                <Text style={styles.heroProgressLabel}>Kemajuan Registrasi</Text>
              </View>

              {/* Right: decorative 3D icon */}
              <View style={styles.heroRight}>
                <View style={styles.heroIconCircle}>
                  <View style={styles.heroIconShine} />
                  <Ionicons name="school" size={36} color={COLORS.white} />
                </View>
                <TouchableOpacity
                  style={styles.heroArrowBtn}
                  onPress={() => navigation.navigate('TabDaftar')}
                  activeOpacity={0.8}
                >
                  <Ionicons name="arrow-forward" size={16} color={COLORS.primaryDark} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* ═══════════════════════════════════════
            ALERT — Berkas Ditolak
        ═══════════════════════════════════════ */}
        {data?.status_pendaftaran === 'ditolak' && (
          <View style={styles.alertCard}>
            <View style={styles.alertHeaderRow}>
              <View style={styles.alertIconCircle3DRed}>
                <Ionicons name="alert-circle" size={18} color="#FFFFFF" />
              </View>
              <Text style={styles.alertTitle}>Berkas Perlu Diperbaiki</Text>
            </View>
            <Text style={styles.alertText}>
              {data.catatan_verifikasi || 'Beberapa dokumen belum sesuai. Harap unggah ulang.'}
            </Text>
            <TouchableOpacity style={styles.alertBtn} onPress={() => navigation.navigate('TabDokumen')}>
              <Text style={styles.alertBtnText}>Perbaiki Sekarang</Text>
              <Ionicons name="arrow-forward" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ═══════════════════════════════════════
            ALERT — Jadwal Seleksi
        ═══════════════════════════════════════ */}
        {data?.status_pendaftaran === 'terverifikasi' && data?.tanggal_seleksi && (
          <View style={[styles.alertCard, styles.alertCardGreen]}>
            <View style={styles.alertHeaderRow}>
              <View style={styles.alertIconCircle3DGreen}>
                <Ionicons name="calendar" size={17} color="#FFFFFF" />
              </View>
              <Text style={[styles.alertTitle, { color: '#065F46' }]}>Jadwal Tes Seleksi Terbit</Text>
            </View>
            <Text style={[styles.alertText, { color: '#047857' }]}>
              📅 {data.tanggal_seleksi} • ⏰ {data.waktu_seleksi || '08:00 WIB'}
            </Text>
            <Text style={[styles.alertText, { color: '#065F46', marginTop: 2 }]}>
              📍 {data.tempat_seleksi || 'Kampus SMP Dharma Bakti'}
            </Text>
            <TouchableOpacity style={[styles.alertBtn, { backgroundColor: '#059669' }]}
              onPress={() => navigation.navigate('TabSeleksi')}>
              <Text style={styles.alertBtnText}>Lihat Kartu Peserta</Text>
              <Ionicons name="arrow-forward" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ═══════════════════════════════════════
            ALERT — Hasil Seleksi & Kelulusan
        ═══════════════════════════════════════ */}
        {data?.hasil_pengumuman && (
          <View
            style={[
              styles.alertCard,
              data.hasil_pengumuman === 'Diterima' ? styles.alertCardGreen : {},
              { borderLeftColor: data.hasil_pengumuman === 'Diterima' ? '#10B981' : '#EF4444' },
            ]}
          >
            <View style={styles.alertHeaderRow}>
              <View
                style={
                  data.hasil_pengumuman === 'Diterima'
                    ? styles.alertIconCircle3DGreen
                    : styles.alertIconCircle3DRed
                }
              >
                <Ionicons
                  name={data.hasil_pengumuman === 'Diterima' ? 'trophy' : 'close-circle'}
                  size={18}
                  color="#FFFFFF"
                />
              </View>
              <Text
                style={[
                  styles.alertTitle,
                  { color: data.hasil_pengumuman === 'Diterima' ? '#065F46' : '#991B1B' },
                ]}
              >
                {data.hasil_pengumuman === 'Diterima'
                  ? 'Selamat! Anda Dinyatakan Lulus'
                  : 'Pengumuman Hasil Seleksi'}
              </Text>
            </View>
            <Text
              style={[
                styles.alertText,
                { color: data.hasil_pengumuman === 'Diterima' ? '#047857' : '#B91C1C' },
              ]}
            >
              {data.nilai_seleksi !== null && data.nilai_seleksi !== undefined
                ? `Nilai Seleksi: ${data.nilai_seleksi} • Status: ${data.hasil_pengumuman}`
                : `Status Kelulusan: ${data.hasil_pengumuman}`}
            </Text>
            <TouchableOpacity
              style={[
                styles.alertBtn,
                {
                  backgroundColor:
                    data.hasil_pengumuman === 'Diterima' ? '#059669' : '#DC2626',
                },
              ]}
              onPress={() => navigation.navigate('TabInfo')}
            >
              <Text style={styles.alertBtnText}>Buka Pengumuman</Text>
              <Ionicons name="arrow-forward" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ═══════════════════════════════════════
            LAYANAN CEPAT — 2×3 Grid dengan 3D Card Bulat
        ═══════════════════════════════════════ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Layanan Cepat</Text>

          <View style={styles.gridWrap}>
            {QUICK_SERVICES.map((svc) => (
              <TouchableOpacity
                key={svc.id}
                style={styles.gridItem}
                activeOpacity={0.8}
                onPress={() => navigation.navigate(svc.screen)}
              >
                {/* 3D Circular Card Orb */}
                <View
                  style={[
                    styles.gridIconCircle3D,
                    {
                      backgroundColor: svc.color,
                      borderBottomColor: svc.darkColor,
                      shadowColor: svc.shadow,
                    },
                  ]}
                >
                  {/* Glossy Top Specular Highlight */}
                  <View style={styles.orbSpecularShine} />

                  {/* High Contrast White Icon */}
                  <Ionicons name={svc.icon} size={25} color="#FFFFFF" />
                </View>

                <Text style={styles.gridLabel} numberOfLines={1}>{svc.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ═══════════════════════════════════════
            TAHAPAN PENDAFTARAN
        ═══════════════════════════════════════ */}
        <View style={styles.section}>
          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Tahapan Pendaftaran</Text>
            <Text style={styles.sectionSub}>
              {steps.filter(s => s.done).length}/{steps.length} selesai
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
                  style={[styles.stepCard, !isClickable && styles.stepCardDisabled]}
                >
                  <View style={[
                    styles.stepIconBox3D,
                    step.done ? styles.stepIconDone3D
                      : isClickable ? styles.stepIconActive3D
                      : styles.stepIconDisabled3D,
                  ]}>
                    {(step.done || isClickable) && (
                      <View style={styles.stepShine3D} />
                    )}
                    <Ionicons
                      name={step.done ? 'checkmark' : step.icon}
                      size={20}
                      color={step.done ? '#FFFFFF' : isClickable ? '#FFFFFF' : '#94A3B8'}
                    />
                  </View>

                  <View style={styles.stepBody}>
                    <View style={styles.stepTitleRow}>
                      <Text style={[styles.stepTitle, !isClickable && { color: COLORS.textSubtle }]} numberOfLines={1}>
                        {step.title}
                      </Text>
                      {step.done && (
                        <View style={styles.doneBadge}>
                          <Text style={styles.doneBadgeText}>✓ Selesai</Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.stepDesc, !isClickable && { color: '#CBD5E1' }]} numberOfLines={2}>
                      {step.desc}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={isClickable ? COLORS.textMuted : '#E2E8F0'}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ═══════════════════════════════════════
            INFO BANNER — Mode Demo
        ═══════════════════════════════════════ */}
        {isUsingDummy && (
          <View style={styles.demoBanner}>
            <Ionicons name="information-circle-outline" size={16} color={COLORS.infoDark} />
            <Text style={styles.demoBannerText}>
              Mode pratinjau aktif — menampilkan simulasi data
            </Text>
          </View>
        )}



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
    paddingBottom: 36,
  },

  /* ─── HEADER ─── */
  headerSection: {
    backgroundColor: COLORS.primaryDark,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 52,
    paddingBottom: 20,
    paddingHorizontal: SPACING.xl,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#2563EB',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.45)',
    borderBottomWidth: 3.5,
    borderBottomColor: '#1D4ED8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 5,
  },
  avatarImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.white,
  },
  greetingBlock: {
    flex: 1,
  },
  greetingHello: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  greetingName: {
    fontSize: 17,
    fontWeight: '800',
    color: COLORS.white,
    marginTop: 1,
  },


  /* ─── HERO CARD ─── */
  heroPad: {
    backgroundColor: COLORS.primaryDark,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['2xl'],
  },
  heroCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 26,
    padding: SPACING.lg + 2,
    overflow: 'hidden',
    position: 'relative',
    minHeight: 145,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 6,
    borderBottomColor: '#172554',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 35px -8px rgba(30, 58, 138, 0.45)',
      },
      default: {
        elevation: 8,
      },
    }),
  },
  heroSpecularShine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    borderRadius: 999,
  },
  heroOrb1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -30,
    right: -20,
  },
  heroOrb2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.06)',
    bottom: -20,
    right: 60,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  heroLeft: {
    flex: 1,
    paddingRight: SPACING.md,
  },
  heroNomorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  heroNomorText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  heroNomorIcon: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    padding: 3,
  },
  heroLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
    marginBottom: 4,
  },
  heroProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
  },
  heroProgressTrack: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: RADIUS.full,
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.full,
  },
  heroProgressPct: {
    fontSize: 11,
    color: COLORS.white,
    fontWeight: '700',
    minWidth: 32,
  },
  heroProgressLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 3,
    fontWeight: '500',
  },
  heroRight: {
    alignItems: 'center',
    gap: 10,
  },
  heroIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255, 255, 255, 0.65)',
    borderLeftWidth: 1.5,
    borderLeftColor: 'rgba(255, 255, 255, 0.35)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(15, 23, 42, 0.25)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  heroIconShine: {
    position: 'absolute',
    top: 4,
    width: '60%',
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  heroArrowBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2.5,
    borderBottomColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  /* ─── ALERT CARDS ─── */
  alertCard: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1.5,
    borderColor: '#F87171',
    borderBottomWidth: 3,
    borderBottomColor: '#EF4444',
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: 20,
    elevation: 3,
  },
  alertCardGreen: {
    backgroundColor: '#F0FDF4',
    borderColor: '#86EFAC',
    borderBottomWidth: 3,
    borderBottomColor: '#4ADE80',
  },
  alertHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 6,
  },
  alertIconCircle3DRed: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DC2626',
    borderBottomWidth: 2.5,
    borderBottomColor: '#991B1B',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  alertIconCircle3DGreen: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#059669',
    borderBottomWidth: 2.5,
    borderBottomColor: '#047857',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 4,
    elevation: 4,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  alertText: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 18,
    marginBottom: 4,
  },
  alertBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DC2626',
    paddingVertical: 9,
    borderRadius: 8,
    gap: 6,
    marginTop: 8,
  },
  alertBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff',
  },

  /* ─── SECTION WRAPPER ─── */
  section: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionSub: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '700',
  },

  /* ─── QUICK SERVICE GRID ─── */
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridItem: {
    width: '30%',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingVertical: SPACING.md + 4,
    paddingHorizontal: SPACING.xs,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.08)',
        cursor: 'pointer',
      },
      default: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
        elevation: 3,
      },
    }),
  },
  gridIconCircle3D: {
    width: 58,
    height: 58,
    borderRadius: 29, // Bulat sempurna
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    position: 'relative',
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.55)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.3)',
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.1)',
    borderBottomWidth: 4, // 3D Extrusion Bevel
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.38,
    shadowRadius: 8,
    elevation: 7,
  },
  orbSpecularShine: {
    position: 'absolute',
    top: 3,
    width: '60%',
    height: 9,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
  },
  gridLabel: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.1,
  },

  /* ─── STEPS LIST DENGAN ICON 3D BULAT ─── */
  stepsList: {
    gap: SPACING.sm + 2,
  },
  stepCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: SPACING.md + 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    minHeight: 74,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.06)',
        cursor: 'pointer',
      },
      default: {
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 3,
      },
    }),
  },
  stepCardDisabled: {
    backgroundColor: '#F8FAFC',
    borderColor: '#E2E8F0',
    borderBottomColor: '#E2E8F0',
    opacity: 0.65,
  },
  stepIconBox3D: {
    width: 46,
    height: 46,
    borderRadius: 23, // Bulat sempurna
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
    borderTopWidth: 1.2,
    borderTopColor: 'rgba(255, 255, 255, 0.5)',
    borderLeftWidth: 1,
    borderLeftColor: 'rgba(255, 255, 255, 0.25)',
  },
  stepIconDone3D: {
    backgroundColor: '#10B981',
    borderBottomWidth: 3.5,
    borderBottomColor: '#059669',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  stepIconActive3D: {
    backgroundColor: '#2563EB',
    borderBottomWidth: 3.5,
    borderBottomColor: '#1D4ED8',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  stepIconDisabled3D: {
    backgroundColor: '#E2E8F0',
    borderBottomWidth: 2.5,
    borderBottomColor: '#CBD5E1',
  },
  stepShine3D: {
    position: 'absolute',
    top: 2,
    width: '55%',
    height: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  stepBody: {
    flex: 1,
    marginRight: 6,
  },
  stepTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  stepTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
    flex: 1,
  },
  doneBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: RADIUS.full,
  },
  doneBadgeText: {
    fontSize: 10,
    color: '#059669',
    fontWeight: '800',
  },
  stepDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
    lineHeight: 17,
  },

  /* ─── DEMO BANNER ─── */
  demoBanner: {
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
  demoBannerText: {
    flex: 1,
    fontSize: 11,
    color: COLORS.infoDark,
    lineHeight: 17,
  },

  /* ─── HELP CARD DENGAN ICON 3D BULAT ─── */
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    borderBottomWidth: 3,
    borderBottomColor: '#FDE68A',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  helpIconBox3D: {
    width: 52,
    height: 52,
    borderRadius: 26, // Bulat sempurna
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
    position: 'relative',
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.55)',
    borderBottomWidth: 3.5,
    borderBottomColor: '#B45309',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  helpShine3D: {
    position: 'absolute',
    top: 3,
    width: '60%',
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  helpTexts: {
    flex: 1,
    marginRight: 6,
  },
  helpTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.text,
  },
  helpDesc: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
    lineHeight: 17,
  },
});
