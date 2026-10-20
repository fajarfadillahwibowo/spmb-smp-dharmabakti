import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../api/client';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../../theme';
import SkeletonLoader from '../../components/SkeletonLoader';

// Dummy fallback untuk Admin Dashboard jika API offline
const DUMMY_ADMIN_DATA = {
  admin_info: {
    nama: 'Administrator SPMB',
    jabatan: 'Ketua Panitia SPMB 2026/2027',
  },
  statistik_pendaftaran: {
    total: 38,
    terverifikasi: 24,
    menunggu_verifikasi: 11,
    belum_lengkap: 2,
    ditolak: 1,
  },
  statistik_seleksi: {
    total: 24,
    diterima: 18,
    tidak_diterima: 4,
    menunggu: 2,
  },
  statistik_pembayaran: {
    total: 18,
    lunas: 14,
    cicilan: 3,
    menunggu_verifikasi: 1,
  },
};

export default function AdminDashboard({ navigation }) {
  const { user, logout } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSimulated, setIsSimulated] = useState(false);

  const fetchDashboard = async () => {
    try {
      const res = await apiClient.get('/admin/dashboard');
      if (res.data?.success && res.data?.data) {
        setData(res.data.data);
        setIsSimulated(false);
      } else {
        setData(DUMMY_ADMIN_DATA);
        setIsSimulated(true);
      }
    } catch (e) {
      console.log('Menggunakan data simulasi admin dashboard:', e.message);
      setData(DUMMY_ADMIN_DATA);
      setIsSimulated(true);
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

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryDark} />
        <View style={styles.heroHeader}>
          <SkeletonLoader width="40%" height={16} borderRadius={RADIUS.xs} />
          <SkeletonLoader width="65%" height={24} borderRadius={RADIUS.xs} style={{ marginTop: 8 }} />
          <SkeletonLoader width="100%" height={88} borderRadius={RADIUS.xl} style={{ marginTop: SPACING.lg }} />
        </View>
        <View style={{ padding: SPACING.xl }}>
          <SkeletonLoader width="50%" height={18} borderRadius={RADIUS.xs} style={{ marginBottom: SPACING.lg }} />
          <View style={{ flexDirection: 'row', gap: SPACING.md, marginBottom: SPACING.md }}>
            <SkeletonLoader width="48%" height={110} borderRadius={RADIUS.lg} />
            <SkeletonLoader width="48%" height={110} borderRadius={RADIUS.lg} />
          </View>
          <View style={{ flexDirection: 'row', gap: SPACING.md }}>
            <SkeletonLoader width="48%" height={110} borderRadius={RADIUS.lg} />
            <SkeletonLoader width="48%" height={110} borderRadius={RADIUS.lg} />
          </View>
        </View>
      </View>
    );
  }

  const statPendaftaran = data?.statistik_pendaftaran || DUMMY_ADMIN_DATA.statistik_pendaftaran;
  const statSeleksi = data?.statistik_seleksi || DUMMY_ADMIN_DATA.statistik_seleksi;
  const statBayar = data?.statistik_pembayaran || DUMMY_ADMIN_DATA.statistik_pembayaran;
  const adminNama = data?.admin_info?.nama || user?.username || 'Administrator';
  const adminJabatan = data?.admin_info?.jabatan || 'Panitia SPMB SMP Dharma Bakti';

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
        {/* Modern Hero Header */}
        <View style={styles.heroHeader}>
          <View style={styles.navRow}>
            <View style={styles.adminInfo}>
              <View style={styles.rolePill}>
                <View style={styles.roleDot} />
                <Text style={styles.rolePillText}>PANEL ADMINISTRATOR</Text>
              </View>
              <Text style={styles.adminName} numberOfLines={1}>
                {adminNama}
              </Text>
              <Text style={styles.adminJabatan}>
                {adminJabatan}
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.logoutBtn}
              onPress={logout}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="log-out-outline" size={20} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          {/* Floating Metric Card Highlight */}
          <View style={styles.highlightCard}>
            <View>
              <Text style={styles.highlightLabel}>TOTAL PENDAFTAR MASUK</Text>
              <Text style={styles.highlightCount}>{statPendaftaran?.total || 0}</Text>
              <Text style={styles.highlightSub}>Calon siswa terdaftar pada sistem</Text>
            </View>
            <View style={styles.highlightIconWrapper}>
              <Ionicons name="people" size={32} color={COLORS.primary} />
            </View>
          </View>
        </View>

        {isSimulated && (
          <View style={styles.simulatedBanner}>
            <Ionicons name="information-circle-outline" size={18} color={COLORS.infoDark} />
            <Text style={styles.simulatedText}>
              Mode Pratinjau Desain Aktif (Menampilkan simulasi statistik admin)
            </Text>
          </View>
        )}

        <View style={styles.content}>
          {/* Quick Action Grid */}
          <Text style={styles.sectionTitle}>Menu Operasional SPMB</Text>
          <Text style={styles.sectionSubtitle}>
            Akses langsung modul verifikasi, seleksi, dan keuangan
          </Text>

          <View style={styles.menuGrid}>
            {/* Card 1: Data Pendaftar */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuCard}
              onPress={() => navigation.navigate('TabPendaftar')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="people" size={24} color={COLORS.primary} />
              </View>
              <Text style={styles.menuTitle}>Data Pendaftar</Text>
              <Text style={styles.menuDesc}>{statPendaftaran?.total || 0} Calon Siswa</Text>
            </TouchableOpacity>

            {/* Card 2: Verifikasi Berkas */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuCard}
              onPress={() => navigation.navigate('TabBerkas')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#FFFBEB' }]}>
                <Ionicons name="document-text" size={24} color={COLORS.secondary} />
              </View>
              <Text style={styles.menuTitle}>Verifikasi Berkas</Text>
              <Text style={[styles.menuDesc, { color: COLORS.secondaryDark, fontWeight: '700' }]}>
                {statPendaftaran?.menunggu_verifikasi || 0} Perlu Cek
              </Text>
            </TouchableOpacity>

            {/* Card 3: Penilaian Seleksi */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuCard}
              onPress={() => navigation.navigate('TabAdminSeleksi')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#ECFDF5' }]}>
                <Ionicons name="ribbon" size={24} color={COLORS.success} />
              </View>
              <Text style={styles.menuTitle}>Penilaian Seleksi</Text>
              <Text style={styles.menuDesc}>{statSeleksi?.diterima || 0} Siswa Lulus</Text>
            </TouchableOpacity>

            {/* Card 4: Verifikasi Pembayaran */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.menuCard}
              onPress={() => navigation.navigate('TabAdminBayar')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#F5F3FF' }]}>
                <Ionicons name="wallet" size={24} color="#7C3AED" />
              </View>
              <Text style={styles.menuTitle}>Pembayaran</Text>
              <Text style={[styles.menuDesc, { color: '#7C3AED', fontWeight: '700' }]}>
                {statBayar?.menunggu_verifikasi || 0} Perlu Cek
              </Text>
            </TouchableOpacity>

            {/* Card 5: Cetak & Laporan Full Width */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.menuCard, styles.menuCardWide]}
              onPress={() => navigation.navigate('TabLaporan')}
            >
              <View style={[styles.menuIconBox, { backgroundColor: '#F0F9FF' }]}>
                <Ionicons name="print" size={24} color={COLORS.infoDark} />
              </View>
              <View style={styles.menuWideTexts}>
                <Text style={styles.menuTitle}>Rekap & Cetak Laporan</Text>
                <Text style={styles.menuDesc}>
                  Ekspor data pendaftar & laporan kelulusan format Excel / PDF
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Breakdown Status Berkas */}
          <Text style={[styles.sectionTitle, { marginTop: SPACING['2xl'] }]}>
            Ringkasan Berkas Calon Siswa
          </Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <View style={styles.breakdownItem}>
                <View style={[styles.statusDot, { backgroundColor: COLORS.success }]} />
                <Text style={styles.breakdownLabel}>Terverifikasi</Text>
                <Text style={[styles.breakdownVal, { color: COLORS.successDark }]}>
                  {statPendaftaran?.terverifikasi || 0}
                </Text>
              </View>

              <View style={styles.breakdownItem}>
                <View style={[styles.statusDot, { backgroundColor: COLORS.warning }]} />
                <Text style={styles.breakdownLabel}>Menunggu</Text>
                <Text style={[styles.breakdownVal, { color: COLORS.warningDark }]}>
                  {statPendaftaran?.menunggu_verifikasi || 0}
                </Text>
              </View>
            </View>

            <View style={[styles.breakdownRow, { marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.borderLight }]}>
              <View style={styles.breakdownItem}>
                <View style={[styles.statusDot, { backgroundColor: '#94A3B8' }]} />
                <Text style={styles.breakdownLabel}>Belum Lengkap</Text>
                <Text style={styles.breakdownVal}>
                  {statPendaftaran?.belum_lengkap || 0}
                </Text>
              </View>

              <View style={styles.breakdownItem}>
                <View style={[styles.statusDot, { backgroundColor: COLORS.danger }]} />
                <Text style={styles.breakdownLabel}>Ditolak</Text>
                <Text style={[styles.breakdownVal, { color: COLORS.dangerDark }]}>
                  {statPendaftaran?.ditolak || 0}
                </Text>
              </View>
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

  // Hero
  heroHeader: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 48,
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING['3xl'],
    borderBottomLeftRadius: RADIUS['2xl'],
    borderBottomRightRadius: RADIUS['2xl'],
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  adminInfo: {
    flex: 1,
  },
  rolePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.secondary,
    marginRight: 6,
  },
  rolePillText: {
    fontSize: 10,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: '#FDE68A',
    letterSpacing: 0.8,
  },
  adminName: {
    fontSize: TYPOGRAPHY.size.xl,
    fontWeight: TYPOGRAPHY.weight.extraBold,
    color: COLORS.white,
  },
  adminJabatan: {
    fontSize: TYPOGRAPHY.size.xs + 1,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 2,
  },
  logoutBtn: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Highlight Card
  highlightCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...SHADOWS.card,
  },
  highlightLabel: {
    fontSize: TYPOGRAPHY.size.xs,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.textMuted,
    letterSpacing: 0.5,
  },
  highlightCount: {
    fontSize: TYPOGRAPHY.size['3xl'],
    fontWeight: TYPOGRAPHY.weight.extraBold,
    color: COLORS.primaryDark,
    marginTop: 2,
  },
  highlightSub: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  highlightIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
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

  // Content
  content: {
    paddingHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
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
    marginBottom: SPACING.md,
  },

  // Menu Grid
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  menuCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    width: '47.6%',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    minHeight: 120,
    ...SHADOWS.sm,
  },
  menuCardWide: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 76,
  },
  menuIconBox: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  menuTitle: {
    fontSize: TYPOGRAPHY.size.sm + 1,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
  },
  menuDesc: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  menuWideTexts: {
    flex: 1,
    marginLeft: SPACING.md,
    marginRight: SPACING.sm,
  },

  // Breakdown Card
  breakdownCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginTop: SPACING.md,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    ...SHADOWS.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  breakdownLabel: {
    fontSize: TYPOGRAPHY.size.sm,
    color: COLORS.textSecondary,
    flex: 1,
  },
  breakdownVal: {
    fontSize: TYPOGRAPHY.size.base,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
    marginRight: SPACING.md,
  },
});
