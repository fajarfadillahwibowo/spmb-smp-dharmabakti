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
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, PALETTE_3D, formatFileUrl } from '../../config';

export default function PengumumanScreen({ navigation }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      if (data?.pdf_url) {
        const fullUrl = formatFileUrl(data.pdf_url);
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.open(fullUrl, '_blank');
          return;
        }
        await WebBrowser.openBrowserAsync(fullUrl);
        return;
      }

      const res = await apiClient.get('/siswa/cetak-bukti');
      if (res.data?.success && res.data?.data?.pdf_url) {
        const fullUrl = formatFileUrl(res.data.data.pdf_url);
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.open(fullUrl, '_blank');
          return;
        }
        await WebBrowser.openBrowserAsync(fullUrl);
      } else {
        navigation.navigate('CetakBukti');
      }
    } catch (e) {
      navigation.navigate('CetakBukti');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loadingOrb3D}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        <Text style={styles.loadingText}>Memeriksa Hasil Pengumuman...</Text>
      </View>
    );
  }

  const isAnnounced = data?.status === 'sudah_diumumkan';
  const isAccepted = data?.hasil_pendaftaran === 'Diterima';

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
            fetchPengumuman();
          }}
          tintColor="#2563EB"
        />
      }
    >
      {!isAnnounced ? (
        /* ═══════════════════════════════════════
            STATE: BELUM DIUMUMKAN (3D Clay Card)
        ═══════════════════════════════════════ */
        <View style={styles.waitingCard3D}>
          <View style={styles.waitingOrb3D}>
            <View style={styles.orbSpecular} />
            <Ionicons name="hourglass" size={36} color="#FFFFFF" />
          </View>

          <Text style={styles.waitingTitle3D}>Pengumuman Belum Terbit</Text>
          <Text style={styles.waitingDesc3D}>
            Hasil seleksi penerimaan murid baru sedang dalam tahap sidang pleno dewan juri dan Panitia SPMB SMP Dharma Bakti.
          </Text>

          <View style={styles.waitingBadge3D}>
            <Ionicons name="time" size={14} color="#D97706" />
            <Text style={styles.waitingBadgeText}>STATUS: PROSES PENILAIAN</Text>
          </View>
        </View>
      ) : isAccepted ? (
        /* ═══════════════════════════════════════
            STATE: DITERIMA / LULUS DENGAN SURAT RESMI
        ═══════════════════════════════════════ */
        <View style={styles.graduatedWrapper}>
          {/* Header Trophy Banner */}
          <View style={styles.trophyBanner3D}>
            <View style={styles.trophyOrb3D}>
              <View style={styles.orbSpecular} />
              <Ionicons name="trophy" size={38} color="#FFFFFF" />
            </View>
            <View style={styles.goldenSealBadge}>
              <Ionicons name="ribbon" size={13} color="#92400E" />
              <Text style={styles.goldenSealText}>RESMI DINYATAKAN LULUS</Text>
            </View>
            <Text style={styles.acceptedHeading}>SELAMAT, ANDA DINYATAKAN LULUS!</Text>
            <Text style={styles.schoolSubText}>PESERTA DIDIK BARU SMP DHARMA BAKTI • 2026/2027</Text>
          </View>

          {/* ═══════════════════════════════════════
              LEMBAR SURAT KELULUSAN RESMI DENGAN KOP
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
              TOMBOL AKSI CEPAT
          ═══════════════════════════════════════ */}
          <TouchableOpacity
            style={styles.btnDownloadPdf3D}
            activeOpacity={0.85}
            onPress={handleDownloadPdf}
            disabled={downloading}
          >
            <View style={styles.btnSpecularShine} />
            {downloading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="download" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.btnDownloadPdfText}>UNDUH / CETAK SURAT KELULUSAN (PDF)</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnBayar3D}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('TabBayar')}
          >
            <View style={styles.btnSpecularShine} />
            <Ionicons name="card" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnBayarText}>LANJUT KE PEMBAYARAN DAFTAR ULANG</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* ═══════════════════════════════════════
            STATE: TIDAK DITERIMA (3D Sympathy Card)
        ═══════════════════════════════════════ */
        <View style={styles.rejectedCard3D}>
          <View style={styles.rejectedOrb3D}>
            <View style={styles.orbSpecular} />
            <Ionicons name="close" size={38} color="#FFFFFF" />
          </View>

          <Text style={styles.rejectedTitle3D}>MOHON MAAF</Text>
          <Text style={styles.rejectedDesc3D}>
            Berdasarkan hasil seleksi dan kuota penerimaan tahun ini, Anda belum memenuhi kriteria penerimaan di SMP Dharma Bakti.
          </Text>

          <View style={styles.studentClayBox3D}>
            <View style={styles.infoRow3D}>
              <Text style={styles.infoLabel3D}>Nama Siswa</Text>
              <Text style={styles.infoValue3D}>{data?.nama_lengkap || '—'}</Text>
            </View>
            <View style={styles.infoRow3D}>
              <Text style={styles.infoLabel3D}>No. Pendaftaran</Text>
              <Text style={styles.infoValue3D}>{data?.nomor_pendaftaran || '—'}</Text>
            </View>
          </View>

          <Text style={styles.encourageText3D}>
            Tetap semangat dalam belajar dan terus raih prestasi terbaik di masa depan!
          </Text>
        </View>
      )}
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

  /* ─── Waiting State ─── */
  waitingCard3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 5,
    borderBottomColor: '#CBD5E1',
    marginTop: 20,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 24px -6px rgba(15, 23, 42, 0.08)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  waitingOrb3D: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FDE68A',
    borderBottomWidth: 5,
    borderBottomColor: '#B45309',
    marginBottom: 18,
    position: 'relative',
    overflow: 'hidden',
  },
  waitingTitle3D: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  waitingDesc3D: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  waitingBadge3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  waitingBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    marginLeft: 6,
  },

  /* ─── Graduated Wrapper & Letter Sheet ─── */
  graduatedWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  trophyBanner3D: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderBottomWidth: 5,
    borderBottomColor: '#059669',
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 24px -6px rgba(16, 185, 129, 0.25)',
      },
      default: {
        elevation: 4,
      },
    }),
  },
  letterSheetCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    borderBottomWidth: 5,
    borderBottomColor: '#94A3B8',
    marginBottom: 18,
    ...Platform.select({
      web: {
        boxShadow: '0 16px 32px -8px rgba(15, 23, 42, 0.12)',
      },
      default: {
        elevation: 5,
      },
    }),
  },

  /* ─── Kop Surat Resmi ─── */
  kopHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  kopLogoWrap: {
    width: 60,
    height: 60,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  kopLogoImage: {
    width: 58,
    height: 58,
  },
  kopTextCol: {
    flex: 1,
    alignItems: 'center',
  },
  kopYayasan: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#334155',
    textAlign: 'center',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  kopSekolah: {
    fontSize: 16,
    fontWeight: '900',
    color: '#1E3A8A',
    textAlign: 'center',
    letterSpacing: 0.8,
    marginVertical: 1,
  },
  kopAkreditasi: {
    fontSize: 8,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  kopAlamatLine1: {
    fontSize: 7.8,
    color: '#334155',
    textAlign: 'center',
    marginTop: 1,
  },
  kopAlamatLine2: {
    fontSize: 7.5,
    color: '#334155',
    textAlign: 'center',
    marginTop: 1,
  },

  /* Garis Ganda Kop */
  kopDoubleLineWrap: {
    marginVertical: 8,
  },
  kopLineThick: {
    height: 2.5,
    backgroundColor: '#0F172A',
  },
  kopLineThin: {
    height: 1,
    backgroundColor: '#0F172A',
    marginTop: 1.5,
  },

  /* Judul & Nomor Surat */
  letterTitleSection: {
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 12,
  },
  letterMainTitle: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#0F172A',
    textAlign: 'center',
    letterSpacing: 0.3,
    textDecorationLine: 'underline',
  },
  letterNumberText: {
    fontSize: 10,
    color: '#475569',
    textAlign: 'center',
    marginTop: 2,
    fontWeight: '600',
  },
  letterYearText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#1E3A8A',
    textAlign: 'center',
    marginTop: 1,
  },

  /* Isi Surat */
  letterIntroText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
    textAlign: 'justify',
    marginBottom: 10,
  },
  letterBioTable: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    gap: 6,
  },
  letterTableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  letterTableLabel: {
    width: 120,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  letterTableColon: {
    width: 12,
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  letterTableValue: {
    flex: 1,
    fontSize: 11,
    color: '#0F172A',
    fontWeight: '600',
  },
  boldMonoText: {
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
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
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
    textAlign: 'justify',
    marginBottom: 8,
  },

  /* Verdict Box */
  passVerdictBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#10B981',
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  passVerdictTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#065F46',
    letterSpacing: 0.8,
  },
  passVerdictSub: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#047857',
    marginTop: 2,
    textAlign: 'center',
  },

  letterInstructionText: {
    fontSize: 10,
    color: '#64748B',
    lineHeight: 14.5,
    textAlign: 'justify',
    marginBottom: 14,
  },

  /* Signature */
  letterSignSection: {
    alignItems: 'flex-end',
    marginTop: 4,
  },
  letterSignBox: {
    width: 200,
    alignItems: 'center',
  },
  signPlaceDate: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 2,
  },
  signRoleTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  signAreaWrap: {
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  officialStampBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    borderWidth: 1.5,
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    transform: [{ rotate: '-6deg' }],
  },
  officialStampText: {
    fontSize: 9,
    fontWeight: '900',
    color: '#059669',
    letterSpacing: 0.5,
  },
  signNameText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textDecorationLine: 'underline',
  },
  signNipText: {
    fontSize: 9.5,
    color: '#64748B',
    marginTop: 1,
  },

  /* 3D Action Buttons */
  btnDownloadPdf3D: {
    width: '100%',
    backgroundColor: '#1E3A8A',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    borderBottomWidth: 4,
    borderBottomColor: '#172554',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 20px -4px rgba(30, 58, 138, 0.4)',
        cursor: 'pointer',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  btnDownloadPdfText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardSpecularShine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  trophyOrb3D: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#10B981',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#6EE7B7',
    borderBottomWidth: 5,
    borderBottomColor: '#047857',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 12px 24px rgba(16, 185, 129, 0.4)',
      },
      default: {
        elevation: 6,
      },
    }),
  },
  orbSpecular: {
    position: 'absolute',
    top: 4,
    left: 12,
    right: 12,
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
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
    marginBottom: 10,
  },
  goldenSealText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#92400E',
    marginLeft: 5,
    letterSpacing: 0.5,
  },
  acceptedHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#065F46',
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  schoolSubText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#047857',
    marginTop: 2,
    marginBottom: 16,
  },

  /* ─── Student Info Clay Box ─── */
  studentClayBox3D: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    marginBottom: 18,
    gap: 10,
  },
  infoRow3D: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel3D: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  infoValue3D: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '700',
  },
  infoValueHighlight: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scorePodium3D: {
    marginTop: 6,
    backgroundColor: '#ECFDF5',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderBottomWidth: 3,
    borderBottomColor: '#34D399',
  },
  scorePodiumLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#047857',
    letterSpacing: 0.5,
  },
  scorePodiumNumber: {
    fontSize: 24,
    fontWeight: '900',
    color: '#065F46',
    marginTop: 2,
  },
  notePodium3D: {
    marginTop: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  notePodiumTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  notePodiumText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  /* ─── 3D Buttons ─── */
  btnCetakPdf3D: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#60A5FA',
    borderBottomWidth: 4,
    borderBottomColor: '#1D4ED8',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    position: 'relative',
    overflow: 'hidden',
  },
  btnCetakPdfText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnBayar3D: {
    width: '100%',
    backgroundColor: '#10B981',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderBottomWidth: 4,
    borderBottomColor: '#047857',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  btnBayarText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnSpecularShine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },

  /* ─── Rejected State ─── */
  rejectedCard3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderBottomWidth: 6,
    borderBottomColor: '#DC2626',
    marginTop: 10,
  },
  rejectedOrb3D: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#F87171',
    borderBottomWidth: 5,
    borderBottomColor: '#B91C1C',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  rejectedTitle3D: {
    fontSize: 18,
    fontWeight: '900',
    color: '#991B1B',
    marginBottom: 8,
  },
  rejectedDesc3D: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 16,
  },
  encourageText3D: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    textAlign: 'center',
    marginTop: 8,
  },
});
