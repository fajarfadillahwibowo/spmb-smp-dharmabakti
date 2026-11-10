import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Image,
  Modal,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function MonitoringKeuanganScreen() {
  const [list, setList] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const fetchKeuangan = async (status = filterStatus) => {
    try {
      let url = '/kepala-sekolah/keuangan?page=1';
      if (status) url += `&status=${status}`;

      const res = await apiClient.get(url);
      if (res.data.success) {
        setList(res.data.data.data || []);
        setSummary(res.data.summary);
      }
    } catch (err) {
      console.log('Error fetching keuangan:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchKeuangan();
  }, [filterStatus]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchKeuangan(filterStatus);
  }, [filterStatus]);

  const handleOpenBrowser = async (url) => {
    if (!url) return;
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
  };

  const statusFilters = [
    { label: 'Semua Transaksi', value: '' },
    { label: 'Lunas', value: 'lunas' },
    { label: 'Menunggu', value: 'menunggu' },
    { label: 'Cicilan', value: 'cicilan' },
    { label: 'Ditolak', value: 'ditolak' },
  ];

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.regNumber}>{item.pendaftaran?.nomor_pendaftaran || '-'}</Text>
          <Text style={styles.studentName}>{item.pendaftaran?.nama_siswa || 'Calon Siswa'}</Text>
        </View>
        <StatusBadge status={item.status_pembayaran} />
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={13} color="#64748B" />
        <Text style={styles.metaText}>Upload: {item.tanggal_upload || '-'}</Text>
      </View>

      {item.catatan_admin ? (
        <View style={styles.adminNoteBox}>
          <Text style={styles.adminNoteLabel}>Catatan Verifikator:</Text>
          <Text style={styles.adminNoteText}>{item.catatan_admin}</Text>
        </View>
      ) : null}

      {/* Pratinjau Foto Bukti Transfer */}
      {item.bukti_url ? (
        <View style={styles.receiptSection}>
          <TouchableOpacity
            style={styles.receiptThumbWrap}
            activeOpacity={0.88}
            onPress={() => setSelectedItem(item)}
          >
            <Image
              source={{ uri: formatFileUrl(item.bukti_url) }}
              style={styles.receiptThumbImage}
              resizeMode="cover"
            />
            <View style={styles.receiptThumbBadge}>
              <Ionicons name="scan-outline" size={13} color="#FFFFFF" />
              <Text style={styles.receiptThumbText}>Ketuk untuk Perbesar</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.receiptBtn}
            onPress={() => setSelectedItem(item)}
            activeOpacity={0.8}
          >
            <Ionicons name="eye-outline" size={15} color="#1E3A8A" />
            <Text style={styles.receiptBtnText}>Periksa Foto Bukti Transfer</Text>
            <Ionicons name="expand-outline" size={14} color="#1E3A8A" style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header Finansial Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summarySub}>TOTAL KAS TERKUMPUL (LUNAS)</Text>
        <Text style={styles.summaryAmount}>{summary?.format_rupiah || 'Rp 0'}</Text>
        <View style={styles.metricMiniRow}>
          <View style={styles.miniMetric}>
            <Text style={styles.miniMetricVal}>{summary?.lunas || 0}</Text>
            <Text style={styles.miniMetricLbl}>Lunas</Text>
          </View>
          <View style={styles.miniMetric}>
            <Text style={[styles.miniMetricVal, { color: '#D97706' }]}>{summary?.menunggu || 0}</Text>
            <Text style={styles.miniMetricLbl}>Pending</Text>
          </View>
          <View style={styles.miniMetric}>
            <Text style={[styles.miniMetricVal, { color: '#2563EB' }]}>{summary?.cicilan || 0}</Text>
            <Text style={styles.miniMetricLbl}>Cicilan</Text>
          </View>
          <View style={styles.miniMetric}>
            <Text style={[styles.miniMetricVal, { color: '#DC2626' }]}>{summary?.ditolak || 0}</Text>
            <Text style={styles.miniMetricLbl}>Ditolak</Text>
          </View>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterSection}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={statusFilters}
          keyExtractor={(item) => item.value}
          renderItem={({ item }) => {
            const isActive = filterStatus === item.value;
            return (
              <TouchableOpacity
                style={[styles.chip, isActive && styles.activeChip]}
                onPress={() => setFilterStatus(item.value)}
              >
                <Text style={[styles.chipText, isActive && styles.activeChipText]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Transaction List */}
      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Memuat arus keuangan...</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={(item) => item.id_pembayaran.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="card-outline" size={48} color="#94A3B8" />
              <Text style={styles.emptyTitle}>Tidak ada transaksi pembayaran</Text>
              <Text style={styles.emptyDesc}>Belum ada siswa yang mengunggah bukti transfer untuk status ini.</Text>
            </View>
          }
        />
      )}

      {/* ═══════════════════════════════════════════
          MODAL LIGHTBOX FOTO BUKTI KEPALA SEKOLAH
      ═══════════════════════════════════════════ */}
      <Modal
        visible={!!selectedItem}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedItem(null)}
      >
        <View style={styles.previewModalOverlay}>
          <View style={styles.previewModalContainer}>
            {/* Header */}
            <View style={styles.previewModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewModalTitle}>
                  {selectedItem?.pendaftaran?.nama_siswa || 'Calon Siswa'}
                </Text>
                <Text style={styles.previewModalSub}>
                  No: {selectedItem?.pendaftaran?.nomor_pendaftaran || '-'} • Upload: {selectedItem?.tanggal_upload || '-'}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.previewModalCloseBtn}
                onPress={() => setSelectedItem(null)}
              >
                <Ionicons name="close" size={22} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Image Box */}
            <View style={styles.previewImageContainer}>
              {selectedItem?.bukti_url && (
                <Image
                  source={{ uri: formatFileUrl(selectedItem.bukti_url) }}
                  style={styles.previewModalImage}
                  resizeMode="contain"
                />
              )}
            </View>

            {/* Footer */}
            <View style={styles.previewModalFooter}>
              <TouchableOpacity
                style={styles.previewBtnSecondary}
                onPress={() => setSelectedItem(null)}
              >
                <Text style={styles.previewBtnSecondaryText}>Tutup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.previewBtnPrimary}
                onPress={() => handleOpenBrowser(selectedItem?.bukti_url)}
              >
                <Ionicons name="open-outline" size={15} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.previewBtnPrimaryText}>Buka Gambar Penuh</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  summaryCard: {
    backgroundColor: '#172554',
    padding: 18,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  summarySub: {
    fontSize: 10,
    fontWeight: '800',
    color: '#93C5FD',
    letterSpacing: 0.8,
  },
  summaryAmount: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  metricMiniRow: {
    flexDirection: 'row',
    marginTop: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 12,
    padding: 10,
  },
  miniMetric: {
    flex: 1,
    alignItems: 'center',
  },
  miniMetricVal: {
    fontSize: 15,
    fontWeight: '800',
    color: '#34D399',
  },
  miniMetricLbl: {
    fontSize: 10,
    color: '#E2E8F0',
    marginTop: 2,
  },
  filterSection: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  activeChip: {
    backgroundColor: '#1E3A8A',
  },
  chipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  activeChipText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    ...Platform.select({
      web: { boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
      default: { elevation: 2 },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  regNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 10,
  },
  metaText: {
    fontSize: 11,
    color: '#64748B',
  },
  adminNoteBox: {
    backgroundColor: '#F8FAFC',
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  adminNoteLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#475569',
    textTransform: 'uppercase',
  },
  adminNoteText: {
    fontSize: 12,
    color: '#1E293B',
    marginTop: 2,
  },
  receiptSection: {
    marginTop: 8,
  },
  receiptThumbWrap: {
    width: '100%',
    height: 140,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 8,
  },
  receiptThumbImage: {
    width: '100%',
    height: '100%',
  },
  receiptThumbBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  receiptThumbText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },
  receiptBtnText: {
    fontSize: 12,
    color: '#1E3A8A',
    fontWeight: '700',
  },
  centerBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
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

  /* ─── Lightbox Modal ─── */
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
