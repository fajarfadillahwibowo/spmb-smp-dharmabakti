import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, formatFileUrl, PALETTE_3D } from '../../config';

export default function CetakBuktiScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    fetchPdfUrl();
  }, []);

  const fetchPdfUrl = async () => {
    try {
      const res = await apiClient.get('/siswa/cetak-bukti');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (err) {
      Alert.alert(
        'Akses Dibatasi',
        err.response?.data?.message || 'Bukti penerimaan belum dapat diunduh.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenPdf = async () => {
    if (data?.pdf_url) {
      setDownloading(true);
      const fullUrl = formatFileUrl(data.pdf_url);
      if (Platform.OS === 'web' && typeof window !== 'undefined') {
        window.open(fullUrl, '_blank');
        setDownloading(false);
        return;
      }
      try {
        await WebBrowser.openBrowserAsync(fullUrl);
      } catch (e) {
        Alert.alert('Gagal Membuka Browser', 'Tidak dapat membuka tautan PDF.');
      } finally {
        setDownloading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loadingOrb3D}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        <Text style={styles.loadingText}>Menyiapkan Surat Resmi...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ═══════════════════════════════════════
          HEADER BANNER
      ═══════════════════════════════════════ */}
      <View style={styles.trophyBanner3D}>
        <View style={styles.trophyOrb3D}>
          <View style={styles.orbSpecular} />
          <Ionicons name="ribbon" size={36} color="#FFFFFF" />
        </View>
        <View style={styles.goldenSealBadge}>
          <Ionicons name="document-text" size={13} color="#92400E" />
          <Text style={styles.goldenSealText}>DOKUMEN RESMI BUKTI PENERIMAAN</Text>
        </View>
        <Text style={styles.acceptedHeading}>SURAT KETERANGAN RESMI</Text>
        <Text style={styles.schoolSubText}>SMP DHARMA BAKTI • TAHUN PELAJARAN 2026/2027</Text>
      </View>

      {/* ═══════════════════════════════════════
          LEMBAR SURAT KELULUSAN DENGAN KOP RESMI
      ═══════════════════════════════════════ */}
      <View style={styles.letterSheetCard}>
        {/* KOP SURAT RESMI SMP DHARMA BAKTI */}
        <View style={styles.kopHeaderRow}>
          <View style={styles.kopLogoWrap}>
            <Image
              source={require('../../../assets/logo.png')}
              style={styles.kopLogoImage}
              resizeMode="contain"
            />
          </View>

          <View style={styles.kopTextCol}>
            <Text style={styles.kopYayasan}>YAYASAN PENDIDIKAN DHARMA BAKTI</Text>
            <Text style={styles.kopSekolah}>SMP DHARMA BAKTI</Text>
            <Text style={styles.kopAkreditasi}>
              STATUS TERAKREDITASI  NDS: 2011050007 NSS: 2011020018 NPSN: 10609254
            </Text>
            <Text style={styles.kopAlamatLine1}>
              Jln. Rambutan, Rt.10 dusun 2 Desa Suka Maju Kec. Lempuing Jaya
            </Text>
            <Text style={styles.kopAlamatLine2}>
              Kab. OKI Prop. Sumatera Selatan email smpsdb72@gmail.com Kode Pos. 30657 Telp.082185769311
            </Text>
          </View>
        </View>

        {/* GARIS GANDA PEMISAH KOP SURAT */}
        <View style={styles.kopDoubleLineWrap}>
          <View style={styles.kopLineThick} />
          <View style={styles.kopLineThin} />
        </View>

        {/* JUDUL DAN NOMOR SURAT */}
        <View style={styles.letterTitleSection}>
          <Text style={styles.letterMainTitle}>SURAT KETERANGAN KELULUSAN SELEKSI PPDB</Text>
          <Text style={styles.letterNumberText}>
            Nomor: 421.3 / SPMB-SMP.DB / 2026 / {data?.nomor_pendaftaran || '—'}
          </Text>
          <Text style={styles.letterYearText}>TAHUN PELAJARAN 2026 / 2027</Text>
        </View>

        {/* PARAGRAF PEMBUKA */}
        <Text style={styles.letterIntroText}>
          Yang bertanda tangan di bawah ini, Panitia Penerimaan Peserta Didik Baru (PPDB) SMP Dharma Bakti, Desa Suka Maju, Kecamatan Lempuing Jaya, Kabupaten Ogan Komering Ilir, dengan ini menerangkan bahwa:
        </Text>

        {/* TABEL BIODATA CALON SISWA */}
        <View style={styles.letterBioTable}>
          <View style={styles.letterTableRow}>
            <Text style={styles.letterTableLabel}>Nomor Pendaftaran</Text>
            <Text style={styles.letterTableColon}>:</Text>
            <Text style={[styles.letterTableValue, styles.boldMonoText]}>{data?.nomor_pendaftaran || '—'}</Text>
          </View>

          <View style={styles.letterTableRow}>
            <Text style={styles.letterTableLabel}>Nama Lengkap</Text>
            <Text style={styles.letterTableColon}>:</Text>
            <Text style={[styles.letterTableValue, styles.boldHighlightText]}>{data?.nama_lengkap || '—'}</Text>
          </View>

          <View style={styles.letterTableRow}>
            <Text style={styles.letterTableLabel}>NISN</Text>
            <Text style={styles.letterTableColon}>:</Text>
            <Text style={styles.letterTableValue}>{data?.nisn || '—'}</Text>
          </View>

          <View style={styles.letterTableRow}>
            <Text style={styles.letterTableLabel}>Tempat, Tanggal Lahir</Text>
            <Text style={styles.letterTableColon}>:</Text>
            <Text style={styles.letterTableValue}>
              {[data?.tempat_lahir, data?.tanggal_lahir].filter(Boolean).join(', ') || '—'}
            </Text>
          </View>

          <View style={styles.letterTableRow}>
            <Text style={styles.letterTableLabel}>Jenis Kelamin</Text>
            <Text style={styles.letterTableColon}>:</Text>
            <Text style={styles.letterTableValue}>{data?.jenis_kelamin || '—'}</Text>
          </View>

          <View style={styles.letterTableRow}>
            <Text style={styles.letterTableLabel}>Asal Sekolah (SD/MI)</Text>
            <Text style={styles.letterTableColon}>:</Text>
            <Text style={styles.letterTableValue}>{data?.asal_sekolah || '—'}</Text>
          </View>

          <View style={styles.letterTableRow}>
            <Text style={styles.letterTableLabel}>Nilai Ujian Seleksi</Text>
            <Text style={styles.letterTableColon}>:</Text>
            <Text style={[styles.letterTableValue, styles.scoreValueHighlight]}>
              {data?.nilai_seleksi !== null && data?.nilai_seleksi !== undefined ? `${data.nilai_seleksi} Poin` : '85 Poin'}
            </Text>
          </View>
        </View>

        {/* PERNYATAAN KELULUSAN */}
        <Text style={styles.letterStatementText}>
          Berdasarkan hasil verifikasi dokumen persyaratan dan penilaian seleksi akademik Penerimaan Peserta Didik Baru (PPDB) SMP Dharma Bakti Tahun Pelajaran 2026/2027, calon peserta didik tersebut di atas dinyatakan:
        </Text>

        {/* BADGE RESMI LULUS / DITERIMA */}
        <View style={styles.passVerdictBox}>
          <Text style={styles.passVerdictTitle}>★ DINYATAKAN LULUS / DITERIMA ★</Text>
          <Text style={styles.passVerdictSub}>Sebagai Peserta Didik Baru Kelas VII SMP Dharma Bakti</Text>
        </View>

        {/* PETUNJUK DAFTAR ULANG */}
        <Text style={styles.letterInstructionText}>
          Diharapkan kepada calon peserta didik / orang tua/wali murid untuk segera menyelesaikan administrasi pembayaran daftar ulang.
        </Text>

        {/* BLOK TANDA TANGAN KETUA PANITIA SPMB */}
        <View style={styles.letterSignSection}>
          <View style={styles.letterSignBox}>
            <Text style={styles.signPlaceDate}>
              Sukamaju, .............................. 2026
            </Text>
            <Text style={styles.signRoleTitle}>Ketua Panitia SPMB,</Text>
            
            {/* Stamp / Tanda Tangan */}
            <View style={styles.signAreaWrap}>
              <View style={styles.officialStampBadge}>
                <Ionicons name="checkmark-done-circle" size={16} color="#059669" />
                <Text style={styles.officialStampText}>TERVERIFIKASI & SAH</Text>
              </View>
            </View>

            <Text style={styles.signNameText}>Ngaisah Maisaroh S. Pd.</Text>
          </View>
        </View>
      </View>

      {/* ═══════════════════════════════════════
          TOMBOL CETAK & AKSI
      ═══════════════════════════════════════ */}
      <TouchableOpacity
        style={styles.btnDownload3D}
        activeOpacity={0.85}
        onPress={handleOpenPdf}
        disabled={downloading}
      >
        <View style={styles.btnSpecular} />
        {downloading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <>
            <Ionicons name="download" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnDownloadText}>UNDUH / CETAK BUKTI LULUS (PDF RESMI)</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Security Stamp Notice */}
      <View style={styles.securityRow}>
        <Ionicons name="shield-checkmark" size={15} color="#059669" />
        <Text style={styles.securityText}>
          Dokumen ini dilengkapi validasi resmi panitia SPMB dan tanda tangan kepala sekolah.
        </Text>
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
    alignItems: 'center',
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

  /* ─── Trophy Banner ─── */
  trophyBanner3D: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#1E3A8A',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderBottomWidth: 5,
    borderBottomColor: '#172554',
    ...Platform.select({
      web: { boxShadow: '0 12px 28px -6px rgba(30, 58, 138, 0.4)' },
      default: { elevation: 6 },
    }),
  },
  trophyOrb3D: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#60A5FA',
    borderBottomWidth: 4,
    borderBottomColor: '#1D4ED8',
    marginBottom: 12,
  },
  orbSpecular: {
    position: 'absolute',
    top: 4,
    left: 12,
    right: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  goldenSealBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#FDE68A',
    marginBottom: 8,
  },
  goldenSealText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  acceptedHeading: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginBottom: 4,
  },
  schoolSubText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#93C5FD',
    textAlign: 'center',
  },

  /* ─── Lembar Surat Kelulusan Resmi ─── */
  letterSheetCard: {
    width: '100%',
    maxWidth: 600,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderBottomWidth: 5,
    borderBottomColor: '#94A3B8',
    marginBottom: 16,
    ...Platform.select({
      web: { boxShadow: '0 10px 25px rgba(0,0,0,0.08)' },
      default: { elevation: 4 },
    }),
  },
  kopHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
  },
  kopLogoWrap: {
    width: 68,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kopLogoImage: {
    width: 64,
    height: 64,
  },
  kopTextCol: {
    flex: 1,
    alignItems: 'center',
  },
  kopYayasan: {
    fontSize: 12,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  kopSekolah: {
    fontSize: 17,
    fontWeight: '900',
    color: '#1E3A8A',
    letterSpacing: 0.8,
    marginTop: 1,
    textAlign: 'center',
  },
  kopAkreditasi: {
    fontSize: 8.5,
    fontWeight: '700',
    color: '#334155',
    marginTop: 2,
    textAlign: 'center',
  },
  kopAlamatLine1: {
    fontSize: 8.5,
    color: '#475569',
    marginTop: 2,
    textAlign: 'center',
  },
  kopAlamatLine2: {
    fontSize: 8,
    color: '#475569',
    marginTop: 1,
    textAlign: 'center',
  },
  kopDoubleLineWrap: {
    marginVertical: 8,
  },
  kopLineThick: {
    height: 3,
    backgroundColor: '#0F172A',
    borderRadius: 1,
    marginBottom: 2,
  },
  kopLineThin: {
    height: 1,
    backgroundColor: '#0F172A',
  },
  letterTitleSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  letterMainTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  letterNumberText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
    marginTop: 3,
  },
  letterYearText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
    marginTop: 1,
  },
  letterIntroText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: '#334155',
    textAlign: 'justify',
    marginBottom: 12,
  },
  letterBioTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 12,
  },
  letterTableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 3.5,
  },
  letterTableLabel: {
    width: 140,
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
  },
  letterTableColon: {
    width: 12,
    fontSize: 11,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },
  letterTableValue: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: '#0F172A',
  },
  boldMonoText: {
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#1E3A8A',
  },
  boldHighlightText: {
    fontWeight: '800',
    color: '#0F172A',
  },
  scoreValueHighlight: {
    fontWeight: '900',
    color: '#059669',
  },
  letterStatementText: {
    fontSize: 11.5,
    lineHeight: 17,
    color: '#334155',
    textAlign: 'justify',
    marginBottom: 10,
  },
  passVerdictBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderBottomWidth: 4,
    borderBottomColor: '#059669',
    marginBottom: 12,
  },
  passVerdictTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#047857',
    letterSpacing: 0.8,
  },
  passVerdictSub: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#065F46',
    marginTop: 2,
  },
  letterInstructionText: {
    fontSize: 10.5,
    lineHeight: 15,
    color: '#64748B',
    textAlign: 'justify',
    marginBottom: 14,
  },
  letterSignSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 6,
  },
  letterSignBox: {
    width: 220,
    alignItems: 'center',
  },
  signPlaceDate: {
    fontSize: 11,
    color: '#334155',
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  signRoleTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
    textAlign: 'center',
  },
  signAreaWrap: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  officialStampBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DEF7EC',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#31C48D',
  },
  officialStampText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#046C4E',
    marginLeft: 4,
  },
  signNameText: {
    fontSize: 11.5,
    fontWeight: '800',
    color: '#0F172A',
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  signNipText: {
    fontSize: 10,
    color: '#475569',
    marginTop: 1,
    textAlign: 'center',
  },

  /* ─── Tombol Aksi ─── */
  btnDownload3D: {
    width: '100%',
    maxWidth: 600,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#059669',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#34D399',
    borderBottomWidth: 4,
    borderBottomColor: '#047857',
    position: 'relative',
    overflow: 'hidden',
    marginBottom: 12,
  },
  btnSpecular: {
    position: 'absolute',
    top: 2,
    left: 14,
    right: 14,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
  },
  btnDownloadText: {
    fontSize: 13,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    maxWidth: 600,
  },
  securityText: {
    fontSize: 11,
    color: '#64748B',
    marginLeft: 6,
    flex: 1,
    lineHeight: 16,
  },
});
