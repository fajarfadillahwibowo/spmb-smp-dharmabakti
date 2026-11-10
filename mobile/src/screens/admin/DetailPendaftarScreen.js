import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Platform,
  Image,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, STORAGE_BASE_URL, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';
import { downloadPhotoFile } from '../../utils/downloadHelper';

export default function DetailPendaftarScreen({ route }) {
  const { id } = route.params || {};
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [previewModalVisible, setPreviewModalVisible] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

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

      {/* ═══════════════════════════════════════
          1. DATA PESERTA DIDIK (Kolom 1 - 7 & 11)
      ═══════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithIcon}>
          <Ionicons name="person-circle-outline" size={18} color={COLORS.primary} />
          <Text style={styles.cardTitle}>1. Data Peserta Didik (Kolom 1 - 7 & 11)</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>1. Nama Peserta Didik:</Text>
          <Text style={[styles.val, styles.valHighlight]}>{cs?.nama_lengkap || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>2. Tempat, Tanggal Lahir:</Text>
          <Text style={styles.val}>{formatTTL(cs?.tempat_lahir, cs?.tanggal_lahir)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>3. No. Kartu Keluarga (KK):</Text>
          <Text style={[styles.val, styles.valMono]}>{cs?.no_kk || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>4. NIK Siswa:</Text>
          <Text style={[styles.val, styles.valMono]}>{cs?.nik || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>5. NISN:</Text>
          <Text style={[styles.val, styles.valMono, styles.valHighlight]}>{cs?.nisn || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Jenis Kelamin:</Text>
          <Text style={styles.val}>{cs?.jenis_kelamin || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>6. Agama:</Text>
          <Text style={styles.val}>{cs?.agama || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>7. Alamat Peserta Didik:</Text>
          <Text style={styles.val}>{cs?.alamat || '-'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>11. Ukuran Pakaian Seragam:</Text>
          <View style={styles.sizeBadge}>
            <Text style={styles.sizeBadgeText}>{cs?.ukuran_pakaian || 'M'}</Text>
          </View>
        </View>
      </View>

      {/* ═══════════════════════════════════════
          2. DATA ORANG TUA / WALI (Kolom 8 & 10)
      ═══════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithIcon}>
          <Ionicons name="people-outline" size={18} color={COLORS.primary} />
          <Text style={styles.cardTitle}>2. Data Orang Tua / Wali (Kolom 8 & 10)</Text>
        </View>

        {/* Sub-card Ayah */}
        <View style={styles.subCard}>
          <View style={styles.subCardHeader}>
            <Ionicons name="man-outline" size={15} color="#1D4ED8" />
            <Text style={styles.subCardTitle}>Data Ayah Kandung</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nama Ayah:</Text>
            <Text style={styles.val}>{cs?.nama_ayah || cs?.nama_ortu_wali || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Pekerjaan:</Text>
            <Text style={styles.val}>{cs?.pekerjaan_ayah || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Alamat:</Text>
            <Text style={styles.val}>{cs?.alamat_ayah || '-'}</Text>
          </View>
        </View>

        {/* Sub-card Ibu */}
        <View style={[styles.subCard, { marginTop: 10 }]}>
          <View style={styles.subCardHeader}>
            <Ionicons name="woman-outline" size={15} color="#BE185D" />
            <Text style={[styles.subCardTitle, { color: '#BE185D' }]}>Data Ibu Kandung</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nama Ibu:</Text>
            <Text style={styles.val}>{cs?.nama_ibu || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Pekerjaan:</Text>
            <Text style={styles.val}>{cs?.pekerjaan_ibu || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Alamat:</Text>
            <Text style={styles.val}>{cs?.alamat_ibu || '-'}</Text>
          </View>
        </View>

        {/* No. HP WhatsApp */}
        <View style={[styles.infoRow, { marginTop: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}>
          <Text style={styles.label}>10. No. HP / WhatsApp Ortu:</Text>
          <Text style={[styles.val, styles.valHighlight]}>{cs?.no_hp_ortu || '-'}</Text>
        </View>
      </View>

      {/* ═══════════════════════════════════════
          3. ASAL SEKOLAH (Kolom 9)
      ═══════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithIcon}>
          <Ionicons name="school-outline" size={18} color={COLORS.primary} />
          <Text style={styles.cardTitle}>3. Asal Sekolah (Kolom 9)</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>9. Asal Sekolah (SD/MI):</Text>
          <Text style={[styles.val, styles.valHighlight]}>{pendaftaran?.asal_sekolah || '-'}</Text>
        </View>
      </View>

      {/* ═══════════════════════════════════════
          4. BERKAS DOKUMEN PERSYARATAN (4 Berkas)
      ═══════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithIcon}>
          <Ionicons name="documents-outline" size={18} color={COLORS.primary} />
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>4. Berkas Persyaratan (4 Berkas Resmi)</Text>
            <Text style={{ fontSize: 11, color: '#64748B' }}>Admin dapat memeriksa dan mengunduh berkas foto</Text>
          </View>
        </View>
        {[
          { label: 'Pasfoto Berwarna 3x4', icon: 'camera-outline', url: docs?.pasfoto, key: 'pasfoto' },
          { label: 'Akta Kelahiran', icon: 'document-text-outline', url: docs?.akte_kelahiran, key: 'akta_kelahiran' },
          { label: 'Kartu Keluarga (KK)', icon: 'people-outline', url: docs?.kartu_keluarga, key: 'kartu_keluarga' },
          { label: 'Ijazah / SKL SD', icon: 'school-outline', url: docs?.ijazah, key: 'ijazah' },
        ].map((item, i) => (
          <View key={i} style={styles.docRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
              <Ionicons name={item.icon} size={16} color={item.url ? '#1E3A8A' : '#94A3B8'} />
              <Text style={styles.docLabel}>{item.label}</Text>
            </View>
            {item.url ? (
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity style={styles.docBtn} onPress={() => handleOpenDoc(item.url)}>
                  <Ionicons name="eye-outline" size={14} color={COLORS.primary} />
                  <Text style={styles.docBtnText}>Buka</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.docBtn, { backgroundColor: '#ECFDF5', borderColor: '#86EFAC' }]}
                  onPress={() =>
                    downloadPhotoFile(
                      item.url,
                      `${item.key}_${pendaftaran?.nomor_pendaftaran}_${cs?.nama_lengkap}`
                    )
                  }
                >
                  <Ionicons name="download-outline" size={14} color="#059669" />
                  <Text style={[styles.docBtnText, { color: '#059669', fontWeight: '700' }]}>Unduh</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.emptyBadge}>
                <Ionicons name="close-circle-outline" size={12} color="#DC2626" />
                <Text style={styles.docEmpty}>Belum Diunggah</Text>
              </View>
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

      {/* ═══════════════════════════════════════
          5. HASIL & JADWAL SELEKSI
      ═══════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithIcon}>
          <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
          <Text style={styles.cardTitle}>5. Penjadwalan & Penilaian Seleksi</Text>
        </View>
        <View style={styles.infoRow}><Text style={styles.label}>Tanggal Seleksi:</Text><Text style={styles.valBold}>{seleksi?.tanggal_seleksi ? String(seleksi.tanggal_seleksi).split('T')[0] : 'Belum Ditetapkan'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Waktu / Jam:</Text><Text style={styles.val}>{seleksi?.waktu_seleksi || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Tempat / Ruang:</Text><Text style={styles.val}>{seleksi?.tempat_seleksi || '-'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Nilai Seleksi:</Text><Text style={styles.valBold}>{seleksi?.nilai_seleksi ?? 'Belum Dinilai'}</Text></View>
        <View style={styles.infoRow}><Text style={styles.label}>Status Seleksi:</Text><StatusBadge status={seleksi?.status_seleksi || 'MENUNGGU'} /></View>
        {seleksi?.catatan && (
          <View style={styles.infoRow}><Text style={styles.label}>Catatan Panitia:</Text><Text style={styles.val}>{seleksi.catatan}</Text></View>
        )}
      </View>

      {/* ═══════════════════════════════════════
          6. BUKTI PEMBAYARAN & DAFTAR ULANG
      ═══════════════════════════════════════ */}
      <View style={styles.card}>
        <View style={styles.cardHeaderWithIcon}>
          <Ionicons name="wallet-outline" size={18} color={COLORS.primary} />
          <Text style={styles.cardTitle}>6. Pembayaran Biaya Masuk</Text>
        </View>
        <View style={styles.infoRow}><Text style={styles.label}>Status Pembayaran:</Text><StatusBadge status={bayar?.status_pembayaran || 'MENUNGGU'} /></View>
        <View style={styles.infoRow}><Text style={styles.label}>Tgl Upload:</Text><Text style={styles.val}>{bayar?.tanggal_upload || '-'}</Text></View>
        {bayar?.catatan_admin ? (
          <View style={styles.infoRow}><Text style={styles.label}>Catatan:</Text><Text style={styles.val}>{bayar.catatan_admin}</Text></View>
        ) : null}

        {bayar?.bukti_url ? (
          <View style={{ marginTop: 10 }}>
            <TouchableOpacity
              style={styles.detailReceiptThumbWrap}
              activeOpacity={0.88}
              onPress={() => {
                setPreviewUrl(formatFileUrl(bayar.bukti_url));
                setPreviewModalVisible(true);
              }}
            >
              <Image
                source={{ uri: formatFileUrl(bayar.bukti_url) }}
                style={styles.detailReceiptThumbImage}
                resizeMode="cover"
              />
              <View style={styles.detailReceiptThumbBadge}>
                <Ionicons name="scan-outline" size={13} color="#FFFFFF" />
                <Text style={styles.detailReceiptThumbText}>Ketuk untuk Perbesar</Text>
              </View>
            </TouchableOpacity>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
              <TouchableOpacity
                style={styles.docBtn}
                onPress={() => {
                  setPreviewUrl(formatFileUrl(bayar.bukti_url));
                  setPreviewModalVisible(true);
                }}
              >
                <Ionicons name="eye" size={14} color={COLORS.primary} />
                <Text style={styles.docBtnText}>Periksa Bukti</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.docBtn, { backgroundColor: '#ECFDF5', borderColor: '#86EFAC' }]}
                onPress={() =>
                  downloadPhotoFile(
                    bayar.bukti_url,
                    `bukti_transfer_${pendaftaran?.nomor_pendaftaran}_${cs?.nama_lengkap}`
                  )
                }
              >
                <Ionicons name="download-outline" size={14} color="#059669" />
                <Text style={[styles.docBtnText, { color: '#059669', fontWeight: '700' }]}>Unduh Bukti</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={[styles.emptyBadge, { marginTop: 8, alignSelf: 'flex-start' }]}>
            <Ionicons name="close-circle-outline" size={12} color="#DC2626" />
            <Text style={styles.docEmpty}>Belum Ada Bukti Transfer</Text>
          </View>
        )}
      </View>

      {/* Modal Preview Bukti */}
      <Modal
        visible={previewModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPreviewModalVisible(false)}
      >
        <View style={styles.previewModalOverlay}>
          <View style={styles.previewModalContainer}>
            <View style={styles.previewModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewModalTitle}>Bukti Pembayaran Pendaftaran</Text>
                <Text style={styles.previewModalSub}>{cs?.nama_lengkap || 'Calon Siswa'}</Text>
              </View>
              <TouchableOpacity
                style={styles.previewModalCloseBtn}
                onPress={() => setPreviewModalVisible(false)}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.previewImageContainer}>
              {previewUrl && (
                <Image
                  source={{ uri: previewUrl }}
                  style={styles.previewModalImage}
                  resizeMode="contain"
                />
              )}
            </View>

            <View style={styles.previewModalFooter}>
              <TouchableOpacity
                style={styles.previewBtnSecondary}
                onPress={() => setPreviewModalVisible(false)}
              >
                <Text style={styles.previewBtnSecondaryText}>Tutup</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.previewBtnPrimary, { backgroundColor: '#15803D' }]}
                onPress={() =>
                  downloadPhotoFile(
                    bayar?.bukti_url,
                    `bukti_transfer_${pendaftaran?.nomor_pendaftaran}_${cs?.nama_lengkap}`
                  )
                }
              >
                <Ionicons name="download-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.previewBtnPrimaryText}>Unduh Gambar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.previewBtnPrimary}
                onPress={() => handleOpenDoc(bayar?.bukti_url)}
              >
                <Ionicons name="open-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.previewBtnPrimaryText}>Buka Asli</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  cardHeaderWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.primaryDark,
  },
  subCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  subCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1D4ED8',
  },
  valHighlight: {
    color: '#1E3A8A',
    fontWeight: '700',
  },
  valMono: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    letterSpacing: 0.5,
  },
  sizeBadge: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 2,
  },
  sizeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#059669',
  },
  emptyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
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

  /* ─── Receipt Thumbnail & Modal Preview ─── */
  detailReceiptThumbWrap: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  detailReceiptThumbImage: {
    width: '100%',
    height: '100%',
  },
  detailReceiptThumbBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16,
  },
  detailReceiptThumbText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  previewModalContainer: {
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#334155',
    ...Platform.select({
      web: { boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' },
      default: { elevation: 12 },
    }),
  },
  previewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  previewModalTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  previewModalSub: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 2,
  },
  previewModalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImageContainer: {
    width: '100%',
    height: 380,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModalImage: {
    width: '100%',
    height: '100%',
  },
  previewModalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    padding: 14,
    backgroundColor: '#F8FAFC',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  previewBtnSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBtnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#475569',
  },
  previewBtnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1E3A8A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewBtnPrimaryText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
