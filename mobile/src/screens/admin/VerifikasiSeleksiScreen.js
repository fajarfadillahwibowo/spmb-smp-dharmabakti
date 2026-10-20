import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { COLORS } from '../../config';
import StatusBadge from '../../components/StatusBadge';

export default function VerifikasiSeleksiScreen() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [nilai, setNilai] = useState('');
  const [statusSeleksi, setStatusSeleksi] = useState('diterima');
  const [catatan, setCatatan] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSeleksiList = async () => {
    try {
      const res = await apiClient.get('/admin/verifikasi-seleksi');
      if (res.data.success) {
        setData(res.data.data.data || []);
      }
    } catch (e) {
      console.log('Error fetching seleksi list:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSeleksiList();
  }, []);

  const openScoreModal = (item) => {
    setSelectedItem(item);
    setNilai(item.seleksi?.nilai_seleksi ? String(item.seleksi.nilai_seleksi) : '');
    setStatusSeleksi(item.seleksi?.status_seleksi === 'tidak_diterima' ? 'tidak_diterima' : 'diterima');
    setCatatan(item.seleksi?.catatan || '');
    setModalVisible(true);
  };

  const handleSaveScore = async () => {
    if (!nilai.trim() || isNaN(nilai) || Number(nilai) < 0 || Number(nilai) > 100) {
      Alert.alert('Perhatian', 'Nilai seleksi harus berupa angka 0 - 100.');
      return;
    }

    setSubmitting(true);

    try {
      const res = await apiClient.put(`/admin/verifikasi-seleksi/${selectedItem.id_pendaftaran}`, {
        nilai_seleksi: Number(nilai),
        status_seleksi: statusSeleksi,
        catatan: catatan.trim(),
      });

      if (res.data.success) {
        Alert.alert('Sukses', res.data.message);
        setModalVisible(false);
        fetchSeleksiList();
      }
    } catch (err) {
      Alert.alert('Gagal', err.response?.data?.message || 'Gagal menyimpan penilaian.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.regNumber}>{item.nomor_pendaftaran}</Text>
        <StatusBadge status={item.seleksi?.status_seleksi || 'MENUNGGU'} />
      </View>

      <Text style={styles.studentName}>{item.calon_siswa?.nama_lengkap || 'Belum Mengisi Nama'}</Text>
      <Text style={styles.schoolOrigin}>Asal: {item.asal_sekolah || '-'}</Text>

      <View style={styles.scoreRow}>
        <Text style={styles.scoreLabel}>Nilai Ujian / Seleksi:</Text>
        <Text style={styles.scoreValue}>
          {item.seleksi?.nilai_seleksi !== null && item.seleksi?.nilai_seleksi !== undefined
            ? item.seleksi.nilai_seleksi
            : 'Belum Dinilai'}
        </Text>
      </View>

      <TouchableOpacity style={styles.scoreButton} onPress={() => openScoreModal(item)}>
        <Ionicons name="create-outline" size={16} color={COLORS.white} />
        <Text style={styles.scoreButtonText}>
          {item.seleksi?.nilai_seleksi ? 'Ubah Nilai & Kelulusan' : 'Beri Nilai & Tentukan Lulus'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Memuat data seleksi...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id_pendaftaran)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchSeleksiList();
            }}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="ribbon-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>Tidak ada pendaftar terverifikasi untuk dinilai.</Text>
          </View>
        }
      />

      {/* Modal Input Nilai */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Penilaian Seleksi</Text>
            <Text style={styles.modalSub}>
              {selectedItem?.calon_siswa?.nama_lengkap} ({selectedItem?.nomor_pendaftaran})
            </Text>

            {/* Input Nilai */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nilai Seleksi (0 - 100) *</Text>
              <TextInput
                style={styles.input}
                placeholder="Contoh: 85.5"
                value={nilai}
                onChangeText={setNilai}
                keyboardType="numeric"
              />
            </View>

            {/* Pilihan Kelulusan */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Status Kelulusan *</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    statusSeleksi === 'diterima' && styles.statusOptionAccepted,
                  ]}
                  onPress={() => setStatusSeleksi('diterima')}
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={16}
                    color={statusSeleksi === 'diterima' ? COLORS.white : COLORS.success}
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      statusSeleksi === 'diterima' && styles.statusOptionTextActive,
                    ]}
                  >
                    DITERIMA
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    statusSeleksi === 'tidak_diterima' && styles.statusOptionRejected,
                  ]}
                  onPress={() => setStatusSeleksi('tidak_diterima')}
                >
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={statusSeleksi === 'tidak_diterima' ? COLORS.white : COLORS.danger}
                  />
                  <Text
                    style={[
                      styles.statusOptionText,
                      statusSeleksi === 'tidak_diterima' && styles.statusOptionTextActive,
                    ]}
                  >
                    TIDAK DITERIMA
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Catatan */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Catatan Panitia (Opsional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Catatan hasil wawancara / tes"
                value={catatan}
                onChangeText={setCatatan}
                multiline
              />
            </View>

            {/* Buttons */}
            <View style={styles.modalActionRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalCancelText}>Batal</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalSaveBtn, submitting && styles.btnDisabled]}
                onPress={handleSaveScore}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.modalSaveText}>SIMPAN HASIL</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  schoolOrigin: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    marginVertical: 10,
  },
  scoreLabel: {
    fontSize: 12,
    color: COLORS.textMuted,
  },
  scoreValue: {
    fontSize: 14,
    fontWeight: '800',
    color: COLORS.secondary,
  },
  scoreButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 42,
    borderRadius: 8,
    gap: 6,
  },
  scoreButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 380,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: COLORS.text,
  },
  modalSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    fontSize: 14,
    color: COLORS.text,
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    height: 60,
    textAlignVertical: 'top',
    paddingTop: 8,
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  statusOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    height: 42,
    gap: 6,
    backgroundColor: '#F8FAFC',
  },
  statusOptionAccepted: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  statusOptionRejected: {
    backgroundColor: COLORS.danger,
    borderColor: COLORS.danger,
  },
  statusOptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.text,
  },
  statusOptionTextActive: {
    color: COLORS.white,
  },
  modalActionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  modalCancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#E2E8F0',
  },
  modalCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
  },
  modalSaveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  modalSaveText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  btnDisabled: {
    opacity: 0.5,
  },
});
