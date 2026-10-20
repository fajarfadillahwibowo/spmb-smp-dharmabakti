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
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { COLORS } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function MonitoringKeuanganScreen() {
  const [list, setList] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
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

  const handleOpenReceipt = (url) => {
    if (!url) return;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      setSelectedReceipt(url);
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

      {/* Tombol Lihat Bukti Transfer */}
      {item.bukti_url && (
        <TouchableOpacity
          style={styles.receiptBtn}
          onPress={() => handleOpenReceipt(item.bukti_url)}
          activeOpacity={0.8}
        >
          <Ionicons name="image-outline" size={15} color="#1E3A8A" />
          <Text style={styles.receiptBtnText}>Periksa Foto Bukti Transfer</Text>
        </TouchableOpacity>
      )}
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

      {/* Modal Foto Bukti Mobile */}
      <Modal
        visible={!!selectedReceipt}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedReceipt(null)}
      >
        <View style={styles.imageModalOverlay}>
          <TouchableOpacity style={styles.imageCloseBtn} onPress={() => setSelectedReceipt(null)}>
            <Ionicons name="close-circle" size={32} color="#FFFFFF" />
          </TouchableOpacity>
          {selectedReceipt && (
            <Image source={{ uri: selectedReceipt }} style={styles.receiptImage} resizeMode="contain" />
          )}
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
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
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
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  regNumber: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
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
    gap: 6,
    marginTop: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#64748B',
  },
  adminNoteBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#3B82F6',
  },
  adminNoteLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#64748B',
  },
  adminNoteText: {
    fontSize: 11,
    color: '#1E293B',
    marginTop: 2,
  },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  receiptBtnText: {
    fontSize: 12,
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
  imageModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageCloseBtn: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 10,
  },
  receiptImage: {
    width: '90%',
    height: '80%',
  },
});
