import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, STORAGE_BASE_URL, formatFileUrl } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function VerifikasiPembayaranScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const fetchPembayaranList = async () => {
    try {
      const res = await apiClient.get('/admin/pembayaran');
      if (res.data.success) {
        setData(res.data.data.data || []);
      }
    } catch (e) {
      console.log('Error fetching pembayaran list:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPembayaranList();
  }, []);

  const handleOpenReceipt = async (url) => {
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

  const handleUpdatePayment = (id, newStatus) => {
    const label = newStatus.toUpperCase();

    const doUpdate = async () => {
      setProcessingId(id);
      try {
        const res = await apiClient.put(`/admin/pembayaran/${id}`, {
          status_pembayaran: newStatus,
        });
        if (res.data.success) {
          if (Platform.OS === 'web' && typeof window !== 'undefined') {
            window.alert(res.data.message || 'Status pembayaran berhasil diperbarui.');
          } else {
            Alert.alert('Sukses', res.data.message);
          }
          fetchPembayaranList();
        }
      } catch (err) {
        const msg = err.response?.data?.message || 'Gagal mengubah status.';
        if (Platform.OS === 'web' && typeof window !== 'undefined') {
          window.alert(msg);
        } else {
          Alert.alert('Gagal', msg);
        }
      } finally {
        setProcessingId(null);
      }
    };

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      if (window.confirm(`Konfirmasi Pembayaran: Ubah status pembayaran menjadi ${label}?`)) {
        doUpdate();
      }
      return;
    }

    Alert.alert('Konfirmasi Pembayaran', `Ubah status pembayaran menjadi ${label}?`, [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Ya, Ubah',
        onPress: doUpdate,
      },
    ]);
  };

  const renderItem = ({ item }) => {
    const isProcessing = processingId === item.id_pembayaran;

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.regNumber}>{item.pendaftaran?.nomor_pendaftaran}</Text>
          <StatusBadge status={item.status_pembayaran} />
        </View>

        <Text style={styles.studentName}>
          {item.pendaftaran?.nama_siswa || 'Calon Siswa'}
        </Text>
        <Text style={styles.uploadDate}>Upload: {item.tanggal_upload || '-'}</Text>

        {/* Bukti link */}
        {item.bukti_url && (
          <TouchableOpacity
            style={styles.receiptButton}
            onPress={() => handleOpenReceipt(item.bukti_url)}
          >
            <Ionicons name="image-outline" size={16} color={COLORS.primary} />
            <Text style={styles.receiptButtonText}>Lihat Foto Bukti Transfer</Text>
          </TouchableOpacity>
        )}

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.btnAction, styles.btnReject, isProcessing && styles.btnDisabled]}
            onPress={() => handleUpdatePayment(item.id_pembayaran, 'ditolak')}
            disabled={isProcessing}
          >
            <Ionicons name="close" size={14} color={COLORS.danger} />
            <Text style={styles.btnRejectText}>Tolak</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnAction, styles.btnInstallment, isProcessing && styles.btnDisabled]}
            onPress={() => handleUpdatePayment(item.id_pembayaran, 'cicilan')}
            disabled={isProcessing}
          >
            <Ionicons name="hourglass-outline" size={14} color="#B45309" />
            <Text style={styles.btnInstallmentText}>Cicilan</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.btnAction, styles.btnPaid, isProcessing && styles.btnDisabled]}
            onPress={() => handleUpdatePayment(item.id_pembayaran, 'lunas')}
            disabled={isProcessing}
          >
            <Ionicons name="checkmark" size={14} color={COLORS.white} />
            <Text style={styles.btnPaidText}>Lunas</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat data pembayaran...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id_pembayaran)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchPembayaranList();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="wallet-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>Tidak ada data pembayaran yang menunggu verifikasi.</Text>
          </View>
        }
      />
    </View>
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
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  regNumber: {
    fontSize: 12,
    fontWeight: '800',
    color: COLORS.primary,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
  uploadDate: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
    gap: 6,
  },
  receiptButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  btnAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 8,
    gap: 4,
  },
  btnReject: {
    backgroundColor: '#FEE2E2',
  },
  btnRejectText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.danger,
  },
  btnInstallment: {
    backgroundColor: '#FEF3C7',
  },
  btnInstallmentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B45309',
  },
  btnPaid: {
    backgroundColor: COLORS.success,
  },
  btnPaidText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.white,
  },
  btnDisabled: {
    opacity: 0.5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    fontSize: 13,
    color: COLORS.textMuted,
    marginTop: 10,
  },
});
