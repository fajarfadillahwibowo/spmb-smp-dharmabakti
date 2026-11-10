import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { COLORS, formatFileUrl } from '../../config';
import { useAuth } from '../../contexts/AuthContext';
import { downloadPdfReport, previewPdfReport } from '../../utils/downloadHelper';

export default function LaporanScreen() {
  const { user } = useAuth();
  const isKepsek = user?.role === 'kepala_sekolah';

  const [data, setData] = useState([]);
  const [ringkasan, setRingkasan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchLaporan = async () => {
    try {
      const endpoint = isKepsek ? '/kepala-sekolah/laporan' : '/admin/laporan';
      const res = await apiClient.get(endpoint);
      if (res.data.success) {
        setData(res.data.data || []);
        setRingkasan(res.data.ringkasan);
      }
    } catch (e) {
      console.log('Error fetching laporan:', e);
      // Fallback try /admin/laporan
      try {
        const res = await apiClient.get('/admin/laporan');
        if (res.data.success) {
          setData(res.data.data || []);
          setRingkasan(res.data.ringkasan);
        }
      } catch (err) {
        console.log('Fallback error:', err);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLaporan();
  }, []);

  const handleDownloadPdf = async () => {
    setIsDownloading(true);
    try {
      await downloadPdfReport();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreviewPdf = async () => {
    await previewPdfReport();
  };

  const handleExportCsv = () => {
    const exportUrl = formatFileUrl('/api/admin/download-rekap-excel');
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.open(exportUrl, '_blank');
      return;
    }
  };

  const filteredData = data.filter((item) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      (item.nama_lengkap && item.nama_lengkap.toLowerCase().includes(q)) ||
      (item.nomor_pendaftaran && item.nomor_pendaftaran.toLowerCase().includes(q)) ||
      (item.nisn && item.nisn.toLowerCase().includes(q)) ||
      (item.nik && item.nik.toLowerCase().includes(q)) ||
      (item.asal_sekolah && item.asal_sekolah.toLowerCase().includes(q))
    );
  });

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Menyiapkan pratinjau rekapitulasi data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mainWrapper}>
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
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>
                {isKepsek ? 'Laporan Rekapitulasi Akhir (Kepsek)' : 'Rekapitulasi Data Diri Calon Siswa'}
              </Text>
              <Text style={styles.headerSub}>SMP DHARMA BAKTI - T.A 2026/2027</Text>
            </View>
            <View style={styles.roleBadge}>
              <Text style={styles.roleBadgeText}>
                {isKepsek ? 'KEPALA SEKOLAH' : 'PANITIA ADMIN'}
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statNum}>{ringkasan?.total_pendaftar || 0}</Text>
              <Text style={styles.statLabel}>Total Pendaftar</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#86EFAC' }]}>{ringkasan?.total_diterima || 0}</Text>
              <Text style={styles.statLabel}>Diterima / Lulus</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#FCA5A5' }]}>{ringkasan?.total_tidak_diterima || 0}</Text>
              <Text style={styles.statLabel}>Tidak Diterima</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: '#FDE047' }]}>{ringkasan?.total_lunas || 0}</Text>
              <Text style={styles.statLabel}>Lunas Bayar</Text>
            </View>
          </View>
        </View>

        {/* Action Button Panel */}
        <View style={styles.actionPanel}>
          <TouchableOpacity
            style={[styles.downloadPdfBtn, isDownloading && { opacity: 0.7 }]}
            onPress={handleDownloadPdf}
            disabled={isDownloading}
            activeOpacity={0.85}
          >
            {isDownloading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="download-outline" size={22} color="#FFFFFF" />
            )}
            <View style={{ flex: 1 }}>
              <Text style={styles.downloadPdfBtnText}>UNDUH LAPORAN REKAPITULASI (PDF)</Text>
              <Text style={styles.downloadPdfBtnSub}>Format Resmi Buku Induk PPDB T.P 2026/2027</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.secondaryActionRow}>
            <TouchableOpacity
              style={styles.previewPdfBtn}
              onPress={handlePreviewPdf}
              activeOpacity={0.8}
            >
              <Ionicons name="eye-outline" size={18} color="#1E3A8A" />
              <Text style={styles.previewPdfBtnText}>Buka PDF Layar Penuh</Text>
            </TouchableOpacity>

            {!isKepsek && (
              <TouchableOpacity
                style={styles.excelBtn}
                onPress={handleExportCsv}
                activeOpacity={0.8}
              >
                <Ionicons name="document-attach-outline" size={18} color="#047857" />
                <Text style={styles.excelBtnText}>Ekspor Excel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Lembar Pratinjau Dokumen (Document Sheet Preview) */}
        <View style={styles.paperCard}>
          <View style={styles.previewNoticeBadge}>
            <Ionicons name="information-circle-outline" size={15} color="#1E40AF" />
            <Text style={styles.previewNoticeText}>
              Pratinjau Lembar Rekapan Resmi Sebelum Diunduh
            </Text>
          </View>

          {/* Kop Surat Resmi */}
          <View style={styles.kopContainer}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.kopLogo}
              resizeMode="contain"
            />
            <View style={styles.kopTextContainer}>
              <Text style={styles.kopYayasan}>YAYASAN PENDIDIKAN DHARMA BAKTI</Text>
              <Text style={styles.kopSekolah}>SMP DHARMA BAKTI</Text>
              <Text style={styles.kopAkreditasi}>
                STATUS TERAKREDITASI • NDS: 2011050007 • NSS: 2011020018 • NPSN: 10609254
              </Text>
              <Text style={styles.kopAlamat}>
                Jln. Rambutan, Rt.10 Dusun 2 Desa Suka Maju, Kec. Lempuing Jaya, Kab. OKI, Sumatera Selatan
              </Text>
              <Text style={styles.kopKontak}>
                Kode Pos: 30657 | Telp: 082185769311 | Email: smpsdb72@gmail.com
              </Text>
            </View>
          </View>

          {/* Garis Ganda Kop Surat */}
          <View style={styles.doubleLineTop} />
          <View style={styles.doubleLineBottom} />

          {/* Judul Laporan */}
          <View style={styles.docTitleBlock}>
            <Text style={styles.docTitle}>
              REKAPITULASI DATA DIRI CALON PESERTA DIDIK BARU
            </Text>
            <Text style={styles.docSubTitle}>(BUKU INDUK PPDB) TAHUN PELAJARAN 2026 / 2027</Text>
          </View>

          {/* Kolom Pencarian pada Pratinjau */}
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={18} color="#64748B" />
            <TextInput
              style={styles.searchInput}
              placeholder="Cari nama siswa, NISN, NIK, atau asal sekolah..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.tableTotalInfo}>
            Menampilkan <Text style={{ fontWeight: 'bold' }}>{filteredData.length}</Text> dari{' '}
            <Text style={{ fontWeight: 'bold' }}>{data.length}</Text> Calon Peserta Didik Baru
          </Text>

          {/* Tabel Pratinjau Berkas Rekap (Horizontal Scrollable Table) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScroll}>
            <View>
              {/* Header Tabel */}
              <View style={styles.tableHeaderRow}>
                <Text style={[styles.thCell, { width: 36, textAlign: 'center' }]}>NO</Text>
                <Text style={[styles.thCell, { width: 120 }]}>NO. DAFTAR</Text>
                <Text style={[styles.thCell, { width: 110 }]}>NISN</Text>
                <Text style={[styles.thCell, { width: 130 }]}>NIK</Text>
                <Text style={[styles.thCell, { width: 180 }]}>NAMA PESERTA DIDIK</Text>
                <Text style={[styles.thCell, { width: 45, textAlign: 'center' }]}>JK</Text>
                <Text style={[styles.thCell, { width: 180 }]}>TEMPAT, TGL LAHIR</Text>
                <Text style={[styles.thCell, { width: 75, textAlign: 'center' }]}>AGAMA</Text>
                <Text style={[styles.thCell, { width: 160 }]}>ASAL SEKOLAH</Text>
                <Text style={[styles.thCell, { width: 170 }]}>NAMA ORANG TUA</Text>
                <Text style={[styles.thCell, { width: 120, textAlign: 'center' }]}>NO. TELEPON/WA</Text>
                <Text style={[styles.thCell, { width: 110, textAlign: 'center' }]}>HASIL SELEKSI</Text>
              </View>

              {/* Baris Data Tabel */}
              {filteredData.map((item, idx) => (
                <View
                  key={item.id_pendaftaran || idx}
                  style={[
                    styles.tableDataRow,
                    idx % 2 === 1 && { backgroundColor: '#F8FAFC' },
                  ]}
                >
                  <Text style={[styles.tdCell, { width: 36, textAlign: 'center', fontWeight: 'bold' }]}>
                    {idx + 1}
                  </Text>
                  <Text style={[styles.tdCell, { width: 120, fontWeight: '700', color: '#1E3A8A' }]}>
                    {item.nomor_pendaftaran}
                  </Text>
                  <Text style={[styles.tdCell, { width: 110 }]}>{item.nisn}</Text>
                  <Text style={[styles.tdCell, { width: 130 }]}>{item.nik}</Text>
                  <Text style={[styles.tdCell, { width: 180, fontWeight: 'bold', color: '#0F172A' }]}>
                    {item.nama_lengkap}
                  </Text>
                  <Text style={[styles.tdCell, { width: 45, textAlign: 'center' }]}>
                    {item.jenis_kelamin}
                  </Text>
                  <Text style={[styles.tdCell, { width: 180 }]}>{item.tempat_tanggal_lahir}</Text>
                  <Text style={[styles.tdCell, { width: 75, textAlign: 'center' }]}>
                    {item.agama}
                  </Text>
                  <Text style={[styles.tdCell, { width: 160 }]}>{item.asal_sekolah}</Text>
                  <Text style={[styles.tdCell, { width: 170, fontSize: 11 }]}>
                    {item.nama_orang_tua}
                  </Text>
                  <Text style={[styles.tdCell, { width: 120, textAlign: 'center' }]}>
                    {item.no_hp_ortu}
                  </Text>
                  <View style={[styles.tdCellWrap, { width: 110 }]}>
                    {item.status_seleksi === 'diterima' ? (
                      <View style={styles.badgeLulus}>
                        <Text style={styles.badgeLulusText}>LULUS ({item.nilai_seleksi})</Text>
                      </View>
                    ) : item.status_seleksi === 'tidak_diterima' ? (
                      <View style={styles.badgeGagal}>
                        <Text style={styles.badgeGagalText}>TIDAK LULUS</Text>
                      </View>
                    ) : (
                      <View style={styles.badgeMenunggu}>
                        <Text style={styles.badgeMenungguText}>MENUNGGU</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}

              {filteredData.length === 0 && (
                <View style={{ padding: 24, alignItems: 'center' }}>
                  <Text style={{ color: '#64748B', fontSize: 13 }}>
                    Tidak ada calon peserta didik yang cocok dengan pencarian.
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          {/* Bagian Tanda Tangan Resmi Pengesahan Dokumen */}
          <View style={styles.signatureSectionSingle}>
            <View style={styles.signColRight}>
              <Text style={styles.signDate}>
                Sukamaju, .............................. 2026
              </Text>
              <Text style={styles.signTitle}>Ketua Panitia SPMB,</Text>
              <View style={styles.signSpace} />
              <Text style={styles.signName}>Ngaisah Maisaroh S. Pd.</Text>
            </View>
          </View>
        </View>

        {/* Tombol Unduh Tambahan di Bagian Bawah */}
        <TouchableOpacity
          style={[styles.downloadPdfBtn, { marginTop: 16 }, isDownloading && { opacity: 0.7 }]}
          onPress={handleDownloadPdf}
          disabled={isDownloading}
          activeOpacity={0.85}
        >
          {isDownloading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Ionicons name="download" size={22} color="#FFFFFF" />
          )}
          <View style={{ flex: 1 }}>
            <Text style={styles.downloadPdfBtnText}>UNDUH LAPORAN REKAPITULASI (PDF)</Text>
            <Text style={styles.downloadPdfBtnSub}>Simpan dokumen PDF resmi ke perangkat Anda</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  container: {
    flex: 1,
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
    paddingBottom: 50,
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
    gap: 10,
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
  roleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  roleBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#FDE047',
    letterSpacing: 0.5,
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
    fontSize: 17,
    fontWeight: '900',
    color: COLORS.white,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
    textAlign: 'center',
  },
  actionPanel: {
    marginBottom: 14,
    gap: 10,
  },
  downloadPdfBtn: {
    backgroundColor: '#15803D',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#15803D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  downloadPdfBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  downloadPdfBtnSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    marginTop: 1,
  },
  secondaryActionRow: {
    flexDirection: 'row',
    gap: 10,
  },
  previewPdfBtn: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
    borderRadius: 10,
    height: 44,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  previewPdfBtnText: {
    color: '#1E3A8A',
    fontSize: 12.5,
    fontWeight: '700',
  },
  excelBtn: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderRadius: 10,
    height: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  excelBtnText: {
    color: '#047857',
    fontSize: 12,
    fontWeight: '700',
  },
  paperCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  previewNoticeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DBEAFE',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  previewNoticeText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#1E40AF',
  },
  kopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  kopLogo: {
    width: 60,
    height: 60,
  },
  kopTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  kopYayasan: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  kopSekolah: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E3A8A',
    letterSpacing: 0.8,
    marginVertical: 1,
  },
  kopAkreditasi: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  kopAlamat: {
    fontSize: 8,
    color: '#334155',
    textAlign: 'center',
    marginTop: 1,
  },
  kopKontak: {
    fontSize: 7.5,
    color: '#475569',
    textAlign: 'center',
  },
  doubleLineTop: {
    borderTopWidth: 2.5,
    borderTopColor: '#000000',
    marginTop: 6,
  },
  doubleLineBottom: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    marginTop: 2,
    marginBottom: 12,
  },
  docTitleBlock: {
    alignItems: 'center',
    marginBottom: 14,
  },
  docTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#1E3A8A',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  docSubTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
    textAlign: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    marginBottom: 10,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 12,
    color: '#0F172A',
  },
  tableTotalInfo: {
    fontSize: 11,
    color: '#64748B',
    marginBottom: 8,
  },
  tableScroll: {
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    marginBottom: 16,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderBottomWidth: 1.5,
    borderBottomColor: '#94A3B8',
  },
  thCell: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: '#CBD5E1',
  },
  tableDataRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  tdCell: {
    fontSize: 11,
    color: '#1E293B',
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRightWidth: 1,
    borderRightColor: '#E2E8F0',
  },
  tdCellWrap: {
    paddingVertical: 5,
    paddingHorizontal: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLulus: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: '#86EFAC',
  },
  badgeLulusText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#15803D',
  },
  badgeGagal: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 0.8,
    borderColor: '#FCA5A5',
  },
  badgeGagalText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#B91C1C',
  },
  badgeMenunggu: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  badgeMenungguText: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
  },
  signatureSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  signatureSectionSingle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  signCol: {
    flex: 1,
    alignItems: 'center',
  },
  signColRight: {
    width: 250,
    alignItems: 'center',
  },
  signTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  signInstansi: {
    fontSize: 10,
    color: '#475569',
  },
  signDate: {
    fontSize: 10.5,
    color: '#334155',
    marginBottom: 2,
    textAlign: 'center',
  },
  signSpace: {
    height: 48,
  },
  signName: {
    fontSize: 11,
    fontWeight: '800',
    textDecorationLine: 'underline',
    color: '#0F172A',
  },
  signNip: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },
});
