import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, STORAGE_BASE_URL, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function MonitoringPendaftarScreen() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal Detail Pendaftar
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const fetchPendaftar = async (query = search, status = filterStatus) => {
    try {
      let url = `/kepala-sekolah/pendaftar?page=1`;
      if (query) url += `&search=${encodeURIComponent(query)}`;
      if (status) url += `&status=${status}`;

      const res = await apiClient.get(url);
      if (res.data.success) {
        setList(res.data.data.data || []);
      }
    } catch (err) {
      console.log('Error fetching pendaftar list:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPendaftar();
  }, [filterStatus]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPendaftar(search, filterStatus);
  }, [search, filterStatus]);

  const openDetail = async (item) => {
    setSelectedItem(item);
    setDetailLoading(true);
    try {
      const res = await apiClient.get(`/kepala-sekolah/pendaftar/${item.id_pendaftaran}`);
      if (res.data.success) {
        setDetailData(res.data.data);
      }
    } catch (e) {
      console.log('Error fetching detail:', e);
    } finally {
      setDetailLoading(false);
    }
  };

  const closeDetail = () => {
    setSelectedItem(null);
    setDetailData(null);
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

  const statusFilters = [
    { label: 'Semua', value: '' },
    { label: 'Menunggu', value: 'menunggu_verifikasi' },
    { label: 'Terverifikasi', value: 'terverifikasi' },
    { label: 'Belum Lengkap', value: 'belum_lengkap' },
    { label: 'Ditolak', value: 'ditolak' },
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => openDetail(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.regNumber}>{item.nomor_pendaftaran}</Text>
        <StatusBadge status={item.status_pendaftaran} />
      </View>
      <Text style={styles.studentName}>{item.nama_lengkap}</Text>
      <View style={styles.metaRow}>
        <Ionicons name="business-outline" size={13} color="#64748B" />
        <Text style={styles.metaText}>{item.asal_sekolah || '-'}</Text>
      </View>
      <View style={styles.metaRow}>
        <Ionicons name="card-outline" size={13} color="#64748B" />
        <Text style={styles.metaText}>Status Bayar: {item.status_pembayaran?.toUpperCase()}</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>Daftar: {item.tanggal_daftar}</Text>
        <View style={styles.detailLink}>
          <Text style={styles.detailLinkText}>Lihat Berkas</Text>
          <Ionicons name="chevron-forward" size={13} color={COLORS.primary} />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Banner Pintasan Laporan Rekapan Akhir */}
      <TouchableOpacity
        style={styles.laporanBannerMini}
        onPress={() => navigation.navigate('TabKepsekLaporan')}
        activeOpacity={0.85}
      >
        <Ionicons name="document-text" size={17} color="#15803D" />
        <Text style={styles.laporanBannerMiniText}>
          Pratinjau & Unduh Laporan Rekapitulasi Akhir (PDF)
        </Text>
        <Ionicons name="chevron-forward" size={15} color="#15803D" />
      </TouchableOpacity>

      {/* Search & Filter Bar */}
      <View style={styles.filterSection}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama, NISN, atau asal sekolah..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={(t) => {
              setSearch(t);
              fetchPendaftar(t, filterStatus);
            }}
          />
          {search ? (
            <TouchableOpacity onPress={() => { setSearch(''); fetchPendaftar('', filterStatus); }}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Horizontal Status Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {statusFilters.map((f) => {
            const isActive = filterStatus === f.value;
            return (
              <TouchableOpacity
                key={f.value}
                style={[styles.chip, isActive && styles.activeChip]}
                onPress={() => setFilterStatus(f.value)}
              >
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List Pendaftar */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat data pendaftar...</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id_pendaftaran.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="folder-open-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>Tidak ada data pendaftar</Text>
              <Text style={styles.emptyDesc}>Coba ubah kata kunci atau filter status pendaftaran.</Text>
            </View>
          }
        />
      )}

      {/* Modal Detail Pendaftar Read-Only */}
      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="slide"
        onRequestClose={closeDetail}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalSub}>DETAIL CALON SISWA (READ-ONLY)</Text>
                <Text style={styles.modalTitle}>{detailData?.calon_siswa?.nama_lengkap || selectedItem?.nama_lengkap}</Text>
              </View>
              <TouchableOpacity style={styles.closeBtn} onPress={closeDetail}>
                <Ionicons name="close" size={20} color="#1E293B" />
              </TouchableOpacity>
            </View>

            {detailLoading ? (
              <View style={styles.modalCenter}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text style={styles.loadingText}>Memuat detail berkas...</Text>
              </View>
            ) : (
              <ScrollView style={styles.modalBody}>
                {/* Status Pendaftaran & Nomor */}
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nomor Pendaftaran</Text>
                    <Text style={styles.infoValue}>{detailData?.pendaftaran?.nomor_pendaftaran}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status Berkas</Text>
                    <StatusBadge status={detailData?.pendaftaran?.status_pendaftaran} />
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Asal Sekolah</Text>
                    <Text style={styles.infoValue}>{detailData?.pendaftaran?.asal_sekolah}</Text>
                  </View>
                </View>

                {/* Data Peserta Didik (Kolom 1 - 7 & 11) */}
                <Text style={styles.groupTitle}>1. BIODATA PESERTA DIDIK (KOLOM 1 - 7 & 11)</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>1. Nama Peserta Didik</Text>
                    <Text style={[styles.infoValue, { fontWeight: '700', color: '#1E3A8A' }]}>
                      {detailData?.calon_siswa?.nama_lengkap || '-'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>2. Tempat, Tanggal Lahir</Text>
                    <Text style={styles.infoValue}>
                      {[
                        detailData?.calon_siswa?.tempat_lahir,
                        detailData?.calon_siswa?.tanggal_lahir ? String(detailData?.calon_siswa?.tanggal_lahir).split('T')[0] : ''
                      ].filter(Boolean).join(', ') || '-'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>3. No. Kartu Keluarga (KK)</Text>
                    <Text style={[styles.infoValue, { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }]}>
                      {detailData?.calon_siswa?.no_kk || '-'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>4. NIK Siswa</Text>
                    <Text style={[styles.infoValue, { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }]}>
                      {detailData?.calon_siswa?.nik || '-'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>5. NISN</Text>
                    <Text style={[styles.infoValue, { fontWeight: '700', color: '#1D4ED8', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' }]}>
                      {detailData?.calon_siswa?.nisn || '-'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Jenis Kelamin</Text>
                    <Text style={styles.infoValue}>{detailData?.calon_siswa?.jenis_kelamin || '-'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>6. Agama</Text>
                    <Text style={styles.infoValue}>{detailData?.calon_siswa?.agama || '-'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>7. Alamat Peserta Didik</Text>
                    <Text style={styles.infoValue}>{detailData?.calon_siswa?.alamat || '-'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>11. Ukuran Pakaian Seragam</Text>
                    <View style={styles.sizeBadgeMini}>
                      <Text style={styles.sizeBadgeMiniText}>Ukuran {detailData?.calon_siswa?.ukuran_pakaian || 'M'}</Text>
                    </View>
                  </View>
                </View>

                {/* Data Orang Tua / Wali (Kolom 8 & 10) */}
                <Text style={styles.groupTitle}>2. DATA ORANG TUA / WALI (KOLOM 8 & 10)</Text>
                <View style={styles.infoCard}>
                  {/* Data Ayah */}
                  <View style={styles.subParentBox}>
                    <Text style={styles.subParentTitle}>Data Ayah Kandung</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Nama Ayah</Text>
                      <Text style={styles.infoValue}>{detailData?.calon_siswa?.nama_ayah || detailData?.calon_siswa?.nama_ortu_wali || '-'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Pekerjaan Ayah</Text>
                      <Text style={styles.infoValue}>{detailData?.calon_siswa?.pekerjaan_ayah || '-'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Alamat Ayah</Text>
                      <Text style={styles.infoValue}>{detailData?.calon_siswa?.alamat_ayah || '-'}</Text>
                    </View>
                  </View>

                  {/* Data Ibu */}
                  <View style={[styles.subParentBox, { marginTop: 8 }]}>
                    <Text style={[styles.subParentTitle, { color: '#BE185D' }]}>Data Ibu Kandung</Text>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Nama Ibu</Text>
                      <Text style={styles.infoValue}>{detailData?.calon_siswa?.nama_ibu || '-'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Pekerjaan Ibu</Text>
                      <Text style={styles.infoValue}>{detailData?.calon_siswa?.pekerjaan_ibu || '-'}</Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Alamat Ibu</Text>
                      <Text style={styles.infoValue}>{detailData?.calon_siswa?.alamat_ibu || '-'}</Text>
                    </View>
                  </View>

                  <View style={[styles.infoRow, { marginTop: 10, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F1F5F9' }]}>
                    <Text style={styles.infoLabel}>10. No. HP / WhatsApp Ortu</Text>
                    <Text style={[styles.infoValue, { fontWeight: '700', color: '#059669' }]}>
                      {detailData?.calon_siswa?.no_hp_ortu || '-'}
                    </Text>
                  </View>
                </View>

                {/* Asal Sekolah (Kolom 9) */}
                <Text style={styles.groupTitle}>3. ASAL SEKOLAH (KOLOM 9)</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>9. Asal Sekolah (SD/MI)</Text>
                    <Text style={[styles.infoValue, { fontWeight: '700' }]}>{detailData?.pendaftaran?.asal_sekolah || '-'}</Text>
                  </View>
                </View>

                {/* Berkas Persyaratan */}
                <Text style={styles.groupTitle}>4. BERKAS PERSYARATAN (4 BERKAS RESMI)</Text>
                <View style={styles.infoCard}>
                  {[
                    { label: 'Pasfoto 3x4', url: detailData?.dokumen?.pasfoto },
                    { label: 'Akta Kelahiran', url: detailData?.dokumen?.akte_kelahiran },
                    { label: 'Kartu Keluarga', url: detailData?.dokumen?.kartu_keluarga },
                    { label: 'Ijazah / SKL', url: detailData?.dokumen?.ijazah },
                  ].map((doc, idx) => (
                    <View key={idx} style={styles.docRow}>
                      <Text style={styles.docLabel}>{doc.label}</Text>
                      {doc.url ? (
                        <TouchableOpacity
                          style={styles.viewDocBtn}
                          onPress={() => handleOpenDoc(doc.url)}
                        >
                          <Ionicons name="eye-outline" size={14} color="#1E3A8A" />
                          <Text style={styles.viewDocText}>Lihat Berkas</Text>
                        </TouchableOpacity>
                      ) : (
                        <Text style={styles.emptyDocText}>Belum Ada</Text>
                      )}
                    </View>
                  ))}
                </View>

                {/* Status Seleksi */}
                <Text style={styles.groupTitle}>STATUS SELEKSI AKADEMIK</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status Seleksi</Text>
                    <Text style={styles.infoValue}>{detailData?.seleksi?.status_seleksi?.toUpperCase() || 'Belum Ada'}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Nilai Ujian</Text>
                    <Text style={[styles.infoValue, { fontWeight: '800', color: '#1E3A8A' }]}>
                      {detailData?.seleksi?.nilai_seleksi ?? '-'}
                    </Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Hasil Kelulusan</Text>
                    <Text style={[styles.infoValue, { fontWeight: '800', color: detailData?.seleksi?.hasil_pengumuman === 'Diterima' ? '#059669' : '#DC2626' }]}>
                      {detailData?.seleksi?.hasil_pengumuman || 'Belum Diumumkan'}
                    </Text>
                  </View>
                </View>

                {/* Status Pembayaran */}
                <Text style={styles.groupTitle}>STATUS PEMBAYARAN BIAYA</Text>
                <View style={styles.infoCard}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Status Pembayaran</Text>
                    <StatusBadge status={detailData?.pembayaran?.status_pembayaran || 'belum_bayar'} />
                  </View>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Tanggal Transfer</Text>
                    <Text style={styles.infoValue}>{detailData?.pembayaran?.tanggal_upload || '-'}</Text>
                  </View>
                  {detailData?.pembayaran?.catatan_admin ? (
                    <View style={styles.infoRow}>
                      <Text style={styles.infoLabel}>Catatan Admin</Text>
                      <Text style={styles.infoValue}>{detailData?.pembayaran?.catatan_admin}</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.noticeBox}>
                  <Ionicons name="shield-checkmark" size={16} color="#059669" />
                  <Text style={styles.noticeText}>
                    Akun Pengawas Kepala Sekolah bersifat Read-Only (Hanya Lihat) demi integritas data pendaftaran.
                  </Text>
                </View>
                <View style={{ height: 30 }} />
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  filterSection: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    padding: 0,
  },
  chipRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 6,
  },
  activeChip: {
    backgroundColor: '#1E3A8A',
  },
  chipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 14,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#172554',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  regNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  dateText: {
    fontSize: 10,
    color: '#94A3B8',
  },
  detailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  detailLinkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 10,
  },
  emptyBox: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 10,
  },
  emptyDesc: {
    fontSize: 12,
    color: '#94A3B8',
    marginTop: 4,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalSub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#3B82F6',
    letterSpacing: 0.8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    marginTop: 14,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#64748B',
    letterSpacing: 0.8,
    marginTop: 14,
    marginBottom: 6,
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'right',
    maxWidth: '60%',
  },
  noticeBox: {
    flexDirection: 'row',
    backgroundColor: '#ECFDF5',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  noticeText: {
    fontSize: 11,
    color: '#065F46',
    flex: 1,
    lineHeight: 15,
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  docLabel: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '500',
  },
  viewDocBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    gap: 4,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  viewDocText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1E3A8A',
  },
  emptyDocText: {
    fontSize: 11,
    color: '#DC2626',
    fontWeight: '600',
  },
  sizeBadgeMini: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  sizeBadgeMiniText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669',
  },
  subParentBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  subParentTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1D4ED8',
    marginBottom: 6,
    paddingBottom: 2,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  laporanBannerMini: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 10,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  laporanBannerMiniText: {
    flex: 1,
    fontSize: 12,
    fontWeight: '700',
    color: '#15803D',
  },
});
