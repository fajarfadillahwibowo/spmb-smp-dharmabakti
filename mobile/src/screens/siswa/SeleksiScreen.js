import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, PALETTE_3D, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function SeleksiScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloadingPdf, setDownloadingPdf] = useState(false);

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

  const handleDownloadKartuPdf = async () => {
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
        Alert.alert('Perhatian', res.data?.message || 'Kartu ujian belum dapat diunduh.');
      }
    } catch (err) {
      Alert.alert(
        'Kartu Ujian Belum Tersedia',
        err.response?.data?.message || 'Pastikan dokumen pendaftaran Anda telah diverifikasi oleh panitia dan jadwal ujian telah diterbitkan.'
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
        <Text style={styles.loadingText}>Memuat Jadwal Seleksi...</Text>
      </View>
    );
  }

  const seleksi = data?.seleksi;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchSeleksi();
          }}
          tintColor="#2563EB"
        />
      }
    >
      {/* ═══════════════════════════════════════
          3D HOLOGRAPHIC EXAM PASS (Kartu Peserta 3D)
      ═══════════════════════════════════════ */}
      <View style={styles.examPass3D}>
        <View style={styles.passSpecularShine} />

        {/* Lanyard Clip / Top Notch */}
        <View style={styles.lanyardClip}>
          <View style={styles.lanyardHole} />
        </View>

        <View style={styles.passHeader}>
          <View>
            <View style={styles.passBadgeRow}>
              <Ionicons name="school" size={13} color="#FBBF24" />
              <Text style={styles.passBadgeText}>SMP DHARMA BAKTI</Text>
            </View>
            <Text style={styles.passTitle}>KARTU PESERTA SELEKSI</Text>
          </View>

          <View style={styles.passStatusWrap}>
            <StatusBadge status={seleksi?.status_seleksi || 'MENUNGGU'} />
          </View>
        </View>

        <View style={styles.passDivider} />

        {/* Candidate Detail Grid */}
        <View style={styles.passGrid}>
          <View style={styles.passRow}>
            <Text style={styles.passLabel}>No. Pendaftaran</Text>
            <Text style={styles.passValueBold}>{data?.nomor_pendaftaran || '—'}</Text>
          </View>

          <View style={styles.passRow}>
            <Text style={styles.passLabel}>Nama Lengkap</Text>
            <Text style={styles.passValue}>{data?.nama_lengkap || '—'}</Text>
          </View>

          <View style={styles.passRow}>
            <Text style={styles.passLabel}>Asal Sekolah</Text>
            <Text style={styles.passValue}>{data?.asal_sekolah || '—'}</Text>
          </View>

          <View style={styles.passRow}>
            <Text style={styles.passLabel}>Status Dokumen</Text>
            <View style={{ alignSelf: 'flex-start' }}>
              <StatusBadge status={data?.status_pendaftaran || '-'} />
            </View>
          </View>
        </View>

        {/* 3D Button: UNDUH & CETAK KARTU UJIAN (PDF) */}
        <TouchableOpacity
          style={[styles.btnCetakKartu3D, downloadingPdf && { opacity: 0.7 }]}
          activeOpacity={0.85}
          disabled={downloadingPdf}
          onPress={handleDownloadKartuPdf}
        >
          <View style={styles.btnShine3D} />
          {downloadingPdf ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="print" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.btnCetakKartuText}>UNDUH & CETAK KARTU UJIAN (PDF)</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* ═══════════════════════════════════════
          ALERT REVISI BERKAS 3D (Jika Berkas Ditolak)
      ═══════════════════════════════════════ */}
      {data?.status_pendaftaran === 'ditolak' && (
        <View style={styles.rejectionNotice3D}>
          <View style={styles.rejectionHeaderRow}>
            <View style={styles.rejectionOrb}>
              <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.rejectionTitle}>Berkas Pendaftaran Ditolak</Text>
              <Text style={styles.rejectionText}>
                {data?.catatan_verifikasi || 'Beberapa dokumen persyaratan belum sesuai kriteria.'}
              </Text>
            </View>
          </View>
          <Text style={styles.rejectionSub}>
            ⚠️ Jadwal seleksi akan diterbitkan otomatis setelah Anda mengirimkan berkas perbaikan di menu Dokumen.
          </Text>
        </View>
      )}

      {/* ═══════════════════════════════════════
          3D SCHEDULE & VENUE TILES
      ═══════════════════════════════════════ */}
      <Text style={styles.sectionHeaderTitle}>Jadwal & Lokasi Ujian</Text>

      <View style={styles.tilesGrid}>
        {/* Tile 1: Tanggal */}
        <View style={styles.tile3D}>
          <View style={[styles.tileOrb3D, { backgroundColor: '#2563EB', borderColor: '#60A5FA', borderBottomColor: '#1D4ED8' }]}>
            <Ionicons name="calendar" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.tileLabel}>TANGGAL SELEKSI</Text>
          <Text style={styles.tileValue}>
            {seleksi?.tanggal_seleksi || (data?.status_pendaftaran === 'terverifikasi' ? 'Segera Terbit' : 'Menunggu Berkas')}
          </Text>
        </View>

        {/* Tile 2: Waktu */}
        <View style={styles.tile3D}>
          <View style={[styles.tileOrb3D, { backgroundColor: '#8B5CF6', borderColor: '#A78BFA', borderBottomColor: '#6D28D9' }]}>
            <Ionicons name="time" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.tileLabel}>WAKTU / JAM</Text>
          <Text style={styles.tileValue}>
            {seleksi?.waktu_seleksi || (seleksi?.tanggal_seleksi ? '08:00 - 10:00 WIB' : '—')}
          </Text>
        </View>
      </View>

      <View style={styles.tilesGrid}>
        {/* Tile 3: Lokasi */}
        <View style={[styles.tile3D, { flex: 1 }]}>
          <View style={[styles.tileOrb3D, { backgroundColor: '#06B6D4', borderColor: '#22D3EE', borderBottomColor: '#0891B2' }]}>
            <Ionicons name="location" size={20} color="#FFFFFF" />
          </View>
          <Text style={styles.tileLabel}>RUANG UJIAN / TEMPAT</Text>
          <Text style={styles.tileValue}>
            {seleksi?.tempat_seleksi || (seleksi?.tanggal_seleksi ? 'Lab Komputer CBT Kampus SMP' : '—')}
          </Text>
        </View>
      </View>

      {/* ═══════════════════════════════════════
          3D SCOREBOARD / NILAI AKHIR
      ═══════════════════════════════════════ */}
      <View style={styles.scoreCard3D}>
        <View style={styles.scoreRow}>
          <View style={styles.scoreOrb3D}>
            <Ionicons name="trophy" size={28} color="#FFFFFF" />
          </View>
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={styles.scoreCardLabel}>NILAI HASIL SELEKSI</Text>
            <Text style={styles.scoreBigText}>
              {seleksi?.nilai_seleksi !== null && seleksi?.nilai_seleksi !== undefined
                ? `${seleksi.nilai_seleksi} Poin`
                : 'Belum Dinilai'}
            </Text>
          </View>
        </View>

        {seleksi?.catatan && (
          <View style={styles.noteBox3D}>
            <Text style={styles.noteTitle3D}>Catatan Panitia Penguji:</Text>
            <Text style={styles.noteText3D}>{seleksi.catatan}</Text>
          </View>
        )}
      </View>

      {/* ═══════════════════════════════════════
          BANNER KELULUSAN RESMI 3D
      ═══════════════════════════════════════ */}
      {(seleksi?.status_seleksi === 'diterima' || (seleksi?.nilai_seleksi !== null && seleksi?.nilai_seleksi !== undefined && seleksi?.status_seleksi !== 'tidak_diterima')) && (
        <View style={styles.passBannerCard3D}>
          <View style={styles.passBannerHeader}>
            <View style={styles.passCheckOrb}>
              <Ionicons name="ribbon" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.passBannerTitle}>SELAMAT! ANDA DINYATAKAN LULUS</Text>
              <Text style={styles.passBannerSub}>Surat Keterangan Kelulusan Resmi SMP Dharma Bakti telah diterbitkan.</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.btnLihatSurat3D}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('TabInfo')}
          >
            <Ionicons name="document-text" size={17} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnLihatSuratText}>LIHAT & CETAK SURAT KELULUSAN RESMI</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ═══════════════════════════════════════
          PETUNJUK UJIAN 3D
      ═══════════════════════════════════════ */}
      <View style={styles.tipsClayCard3D}>
        <View style={styles.tipsHeaderRow}>
          <View style={styles.tipsOrb}>
            <Ionicons name="bulb" size={16} color="#FFFFFF" />
          </View>
          <Text style={styles.tipsTitleText}>Petunjuk & Tata Tertib Seleksi</Text>
        </View>

        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={{ marginTop: 2 }} />
          <Text style={styles.tipText}>Wajib mencetak Kartu Peserta Ujian dan membawanya saat seleksi.</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={{ marginTop: 2 }} />
          <Text style={styles.tipText}>Hadir di lokasi 15 menit sebelum ujian dimulai.</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="checkmark-circle" size={16} color="#2563EB" style={{ marginTop: 2 }} />
          <Text style={styles.tipText}>Kenakan seragam sekolah asal (SD/MI) rapi dan bersepatu.</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    padding: 20,
  },
  loadingOrb3D: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#60A5FA',
    borderBottomWidth: 5,
    borderBottomColor: '#1D4ED8',
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },

  /* ─── 3D Holographic Exam Pass ─── */
  examPass3D: {
    backgroundColor: '#0F172A',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomWidth: 6,
    borderBottomColor: '#020617',
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 35px -10px rgba(15, 23, 42, 0.5), 0 0 30px rgba(56, 189, 248, 0.1)',
      },
      default: {
        elevation: 8,
      },
    }),
  },
  passSpecularShine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 999,
  },
  lanyardClip: {
    alignSelf: 'center',
    width: 36,
    height: 10,
    backgroundColor: '#334155',
    borderRadius: 6,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  lanyardHole: {
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0F172A',
  },
  passHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  passBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 3,
  },
  passBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FBBF24',
    letterSpacing: 0.8,
  },
  passTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  passStatusWrap: {
    alignItems: 'flex-end',
  },
  passDivider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginVertical: 14,
  },
  passGrid: {
    gap: 10,
  },
  passRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
  passValue: {
    fontSize: 13,
    color: '#F1F5F9',
    fontWeight: '600',
  },
  passValueBold: {
    fontSize: 13,
    color: '#38BDF8',
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* ─── 3D Print Button ─── */
  btnCetakKartu3D: {
    backgroundColor: '#2563EB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#60A5FA',
    borderBottomWidth: 4.5,
    borderBottomColor: '#1D4ED8',
    paddingVertical: 13,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 20px -4px rgba(37, 99, 235, 0.45)',
        cursor: 'pointer',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  btnShine3D: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  btnCetakKartuText: {
    color: '#FFFFFF',
    fontSize: 12.5,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* ─── Rejection Notice 3D ─── */
  rejectionNotice3D: {
    backgroundColor: '#FEF2F2',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderBottomWidth: 4,
    borderBottomColor: '#F87171',
    marginBottom: 20,
  },
  rejectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rejectionOrb: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderBottomWidth: 3,
    borderBottomColor: '#B91C1C',
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  rejectionText: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
    lineHeight: 16,
  },
  rejectionSub: {
    fontSize: 11,
    color: '#7F1D1D',
    marginTop: 10,
    fontWeight: '600',
    lineHeight: 16,
  },

  /* ─── Schedule Tiles ─── */
  sectionHeaderTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 12,
  },
  tilesGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  tile3D: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.05)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  tileOrb3D: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderBottomWidth: 3,
    marginBottom: 10,
  },
  tileLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  tileValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 4,
    lineHeight: 18,
  },

  /* ─── Scoreboard 3D ─── */
  scoreCard3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginTop: 8,
    marginBottom: 18,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 20px -5px rgba(15, 23, 42, 0.06)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreOrb3D: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    borderBottomWidth: 4,
    borderBottomColor: '#B45309',
  },
  scoreCardLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  scoreBigText: {
    fontSize: 20,
    fontWeight: '900',
    color: '#0F172A',
    marginTop: 2,
  },
  noteBox3D: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  noteTitle3D: {
    fontSize: 11,
    fontWeight: '800',
    color: '#334155',
    marginBottom: 3,
  },
  noteText3D: {
    fontSize: 12,
    color: '#64748B',
    lineHeight: 17,
  },

  /* ─── Pass Banner 3D ─── */
  passBannerCard3D: {
    backgroundColor: '#ECFDF5',
    borderRadius: 22,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderBottomWidth: 5,
    borderBottomColor: '#059669',
    marginBottom: 16,
    ...Platform.select({
      web: { boxShadow: '0 8px 24px -4px rgba(5, 150, 105, 0.25)' },
      default: { elevation: 4 },
    }),
  },
  passBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  passCheckOrb: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#059669',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#34D399',
    borderBottomWidth: 3,
    borderBottomColor: '#047857',
  },
  passBannerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: 0.5,
  },
  passBannerSub: {
    fontSize: 11.5,
    color: '#047857',
    marginTop: 2,
    lineHeight: 16,
  },
  btnLihatSurat3D: {
    backgroundColor: '#059669',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#34D399',
    borderBottomWidth: 4,
    borderBottomColor: '#047857',
  },
  btnLihatSuratText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 0.5,
  },

  /* ─── Tips 3D ─── */
  tipsClayCard3D: {
    backgroundColor: '#F8FAFC',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
  },
  tipsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsOrb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  tipsTitleText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#475569',
    lineHeight: 18,
  },
});
