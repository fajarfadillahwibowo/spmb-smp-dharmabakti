import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { COLORS } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function DataPendaftarScreen({ navigation }) {
  const [pendaftarans, setPendaftarans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filterOptions = [
    { label: 'Semua', value: '' },
    { label: 'Menunggu', value: 'menunggu_verifikasi' },
    { label: 'Terverifikasi', value: 'terverifikasi' },
    { label: 'Belum Lengkap', value: 'belum_lengkap' },
    { label: 'Ditolak', value: 'ditolak' },
  ];

  const fetchPendaftar = async () => {
    try {
      const res = await apiClient.get('/admin/pendaftar', {
        params: {
          search: search || undefined,
          status: statusFilter || undefined,
        },
      });
      if (res.data.success) {
        setPendaftarans(res.data.data.data || []);
      }
    } catch (e) {
      console.log('Error fetching pendaftar list:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchPendaftar();
  }, [statusFilter]);

  const handleSearch = () => {
    setLoading(true);
    fetchPendaftar();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('DetailPendaftar', { id: item.id_pendaftaran })}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.regNumber}>{item.nomor_pendaftaran}</Text>
        <StatusBadge status={item.status_pendaftaran} />
      </View>

      <Text style={styles.studentName}>
        {item.calon_siswa?.nama_lengkap || 'Belum Mengisi Nama'}
      </Text>

      <View style={styles.infoRow}>
        <Ionicons name="school-outline" size={14} color={COLORS.textMuted} />
        <Text style={styles.infoText}>{item.asal_sekolah || '-'}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>Daftar: {item.tanggal_daftar || '-'}</Text>
        <Ionicons name="chevron-forward" size={16} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchWrapper}>
          <Ionicons name="search" size={18} color={COLORS.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama, NISN, no. pendaftaran..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search ? (
            <TouchableOpacity onPress={() => { setSearch(''); fetchPendaftar(); }}>
              <Ionicons name="close-circle" size={18} color={COLORS.textMuted} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterScroll}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={filterOptions}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.filterChip,
                statusFilter === item.value && styles.filterChipActive,
              ]}
              onPress={() => setStatusFilter(item.value)}
            >
              <Text
                style={[
                  styles.filterChipText,
                  statusFilter === item.value && styles.filterChipTextActive,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* List */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <FlatList
          data={pendaftarans}
          keyExtractor={(item) => String(item.id_pendaftaran)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                fetchPendaftar();
              }}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>Tidak ada data pendaftar ditemukan.</Text>
            </View>
          }
        />
      )}
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
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
    backgroundColor: COLORS.white,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: COLORS.text,
  },
  filterScroll: {
    backgroundColor: COLORS.white,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  filterChipTextActive: {
    color: COLORS.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 12,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 14,
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
    marginBottom: 6,
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
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 8,
  },
  dateText: {
    fontSize: 11,
    color: COLORS.textMuted,
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
