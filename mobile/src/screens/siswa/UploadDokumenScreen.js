import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
  Modal,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as WebBrowser from 'expo-web-browser';
import apiClient from '../../api/client';
import { COLORS, formatFileUrl, PALETTE_3D, STYLES_3D } from '../../config';

export default function UploadDokumenScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [submittingAjukan, setSubmittingAjukan] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  // Status berkas yang sudah tersimpan di server
  const [serverDocs, setServerDocs] = useState({});

  // File yang baru dipilih lokal sebelum diupload
  const [selectedFiles, setSelectedFiles] = useState({
    pasfoto: null,
    akte_kelahiran: null,
    kartu_keluarga: null,
    ijazah: null,
  });

  const docTypes = [
    {
      key: 'pasfoto',
      title: 'Pasfoto Berwarna 3x4',
      desc: 'Format JPG/PNG, latar belakang merah/biru, max 2MB',
      icon: 'camera',
      color: '#2563EB',
      lightColor: '#60A5FA',
      darkColor: '#1D4ED8',
      imageOnly: true,
    },
    {
      key: 'akte_kelahiran',
      title: 'Akta Kelahiran',
      desc: 'Format PDF/JPG/PNG, scan dokumen asli yang jelas, max 2MB',
      icon: 'document-text',
      color: '#8B5CF6',
      lightColor: '#A78BFA',
      darkColor: '#6D28D9',
    },
    {
      key: 'kartu_keluarga',
      title: 'Kartu Keluarga (KK)',
      desc: 'Format PDF/JPG/PNG, scan dokumen asli yang jelas, max 2MB',
      icon: 'people',
      color: '#06B6D4',
      lightColor: '#22D3EE',
      darkColor: '#0891B2',
    },
    {
      key: 'ijazah',
      title: 'Ijazah / SKL SD',
      desc: 'Format PDF/JPG/PNG, scan dokumen asli/legalisir, max 2MB',
      icon: 'school',
      color: '#F59E0B',
      lightColor: '#FBBF24',
      darkColor: '#D97706',
    },
  ];

  useEffect(() => {
    fetchDocStatus();
  }, []);

  const fetchDocStatus = async () => {
    try {
      const res = await apiClient.get('/siswa/dokumen');
      if (res.data.success) {
        setServerDocs(res.data.data);
      }
    } catch (e) {
      console.log('Error fetching doc status:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDoc = (url, title = 'Dokumen Persyaratan') => {
    if (url) {
      const fullUrl = formatFileUrl(url);
      const isImg = /\.(jpg|jpeg|png|webp|gif)($|\?)/i.test(fullUrl);
      setPreviewDoc({
        title,
        url,
        fullUrl,
        isImage: isImg,
      });
    }
  };

  const handlePickFile = async (key, imageOnly = false) => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = imageOnly ? 'image/jpeg,image/png,image/jpg' : 'application/pdf,image/jpeg,image/png,image/jpg';
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            Alert.alert('Ukuran Terlalu Besar', 'Ukuran file maksimal adalah 2MB.');
            return;
          }
          setSelectedFiles((prev) => ({
            ...prev,
            [key]: {
              uri: URL.createObjectURL(file),
              name: file.name,
              type: file.type || (file.name.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
              file: file,
            },
          }));
        }
      };
      input.click();
      return;
    }

    try {
      if (imageOnly) {
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [3, 4],
          quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
          const asset = result.assets[0];
          setSelectedFiles((prev) => ({
            ...prev,
            [key]: {
              uri: asset.uri,
              name: asset.fileName || asset.name || `${key}_${Date.now()}.jpg`,
              type: asset.mimeType || 'image/jpeg',
              file: asset.file || null,
            },
          }));
        }
      } else {
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'image/*'],
          copyToCacheDirectory: true,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
          const asset = result.assets[0];
          setSelectedFiles((prev) => ({
            ...prev,
            [key]: {
              uri: asset.uri,
              name: asset.name || `${key}_${Date.now()}.pdf`,
              type: asset.mimeType || (asset.name?.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
              file: asset.file || null,
            },
          }));
        }
      }
    } catch (err) {
      console.log('Error picking file:', err);
    }
  };

  const handleUploadAll = async () => {
    const hasFiles = Object.values(selectedFiles).some((f) => f !== null);
    if (!hasFiles) {
      Alert.alert('Perhatian', 'Pilih minimal satu file dokumen untuk diunggah.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();

      for (const key of Object.keys(selectedFiles)) {
        const file = selectedFiles[key];
        if (file) {
          if (Platform.OS === 'web') {
            if (file.file instanceof File || file.file instanceof Blob) {
              formData.append(key, file.file, file.name);
            } else if (file.uri) {
              const response = await fetch(file.uri);
              const blob = await response.blob();
              formData.append(key, blob, file.name);
            }
          } else {
            formData.append(key, {
              uri: file.uri,
              name: file.name,
              type: file.type || 'application/octet-stream',
            });
          }
        }
      }

      const res = await apiClient.post('/siswa/dokumen', formData, {
        headers: Platform.OS === 'web' ? {} : { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setSelectedFiles({
          pasfoto: null,
          akte_kelahiran: null,
          kartu_keluarga: null,
          ijazah: null,
        });
        await fetchDocStatus();

        if (serverDocs?.status_pendaftaran === 'ditolak') {
          Alert.alert(
            'Dokumen Tersimpan!',
            'File perbaikan berhasil diunggah. Kirimkan pengajuan perbaikan sekarang ke panitia agar dapat diverifikasi ulang?',
            [
              { text: 'Nanti', style: 'cancel' },
              { text: 'Kirim Sekarang', onPress: () => handleAjukanUlang() },
            ]
          );
        } else {
          setShowSuccessModal(true);
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Gagal mengunggah dokumen.';
      Alert.alert('Gagal Upload', msg);
    } finally {
      setUploading(false);
    }
  };

  const handleAjukanUlang = async () => {
    Alert.alert(
      'Kirim Berkas Perbaikan',
      'Apakah Anda sudah memastikan dokumen perbaikan telah diunggah dan siap diverifikasi ulang oleh Panitia SPMB?',
      [
        { text: 'Periksa Lagi', style: 'cancel' },
        {
          text: 'Ya, Kirim Sekarang',
          onPress: async () => {
            setSubmittingAjukan(true);
            try {
              const res = await apiClient.post('/siswa/ajukan-ulang');
              if (res.data.success) {
                Alert.alert('Berhasil!', 'Pengajuan berkas perbaikan berhasil dikirim ke Panitia SPMB.');
                await fetchDocStatus();
              }
            } catch (err) {
              Alert.alert('Gagal', err.response?.data?.message || 'Gagal mengajukan ulang berkas.');
            } finally {
              setSubmittingAjukan(false);
            }
          },
        },
      ]
    );
  };

  const countUploaded = docTypes.filter((d) => !!serverDocs[d.key]).length;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <View style={styles.loadingOrb3D}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
        <Text style={styles.loadingText}>Memuat Berkas...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* 3D Hero Header Banner */}
      <View style={styles.hero3DCard}>
        <View style={styles.heroSpecularShine} />
        <View style={styles.heroRow}>
          <View style={styles.heroTextCol}>
            <View style={styles.badge3D}>
              <Ionicons name="shield-checkmark" size={12} color="#6EE7B7" />
              <Text style={styles.badge3DText}>VERIFIKASI DIGITAL</Text>
            </View>
            <Text style={styles.heroTitle}>Dokumen Persyaratan</Text>
            <Text style={styles.heroSubtitle}>
              {countUploaded === 4
                ? 'Semua 4 dokumen persyaratan telah lengkap'
                : `${countUploaded} dari 4 dokumen terunggah`}
            </Text>
          </View>

          <View style={styles.heroOrb3D}>
            <View style={styles.orbSpecular} />
            <Ionicons name="folder-open" size={28} color="#FFFFFF" />
          </View>
        </View>

        {/* 3D Progress Bar */}
        <View style={styles.progressTrack3D}>
          <View style={[styles.progressFill3D, { width: `${(countUploaded / 4) * 100}%` }]} />
        </View>
      </View>

      {/* ═══════════════════════════════════════
          ALERT BANNERS 3D
      ═══════════════════════════════════════ */}
      {serverDocs?.status_pendaftaran === 'ditolak' ? (
        <View style={styles.alertCardRed3D}>
          <View style={styles.alertRow3D}>
            <View style={styles.alertOrbRed}>
              <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.alertTitleRed}>Berkas Perlu Diperbaiki</Text>
              <Text style={styles.alertDescRed}>
                {serverDocs.catatan_verifikasi || 'Beberapa dokumen belum memenuhi kriteria panitia.'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.alertActionBtn3D}
            activeOpacity={0.85}
            onPress={handleAjukanUlang}
            disabled={submittingAjukan}
          >
            {submittingAjukan ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Text style={styles.alertActionBtnText}>KIRIM PENGAJUAN PERBAIKAN</Text>
                <Ionicons name="paper-plane" size={14} color="#FFFFFF" style={{ marginLeft: 6 }} />
              </>
            )}
          </TouchableOpacity>
        </View>
      ) : serverDocs?.status_pendaftaran === 'terverifikasi' ? (
        <View style={styles.alertCardGreen3D}>
          <View style={styles.alertRow3D}>
            <View style={styles.alertOrbGreen}>
              <Ionicons name="checkmark-circle" size={22} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.alertTitleGreen}>Berkas Terverifikasi Valid</Text>
              <Text style={styles.alertDescGreen}>
                Seluruh dokumen telah disetujui Panitia SPMB. Silakan cek menu Seleksi untuk jadwal tes.
              </Text>
            </View>
          </View>
        </View>
      ) : null}

      {/* ═══════════════════════════════════════
          DOCUMENT CARDS LIST 3D
      ═══════════════════════════════════════ */}
      {docTypes.map((doc) => {
        const isUploadedOnServer = !!serverDocs[doc.key];
        const isSelectedLocal = !!selectedFiles[doc.key];

        return (
          <View key={doc.key} style={styles.docClayCard3D}>
            <View style={styles.docTopRow}>
              {/* 3D Orb Icon */}
              <View
                style={[
                  styles.docOrb3D,
                  {
                    backgroundColor: doc.color,
                    borderColor: doc.lightColor,
                    borderBottomColor: doc.darkColor,
                  },
                ]}
              >
                <View style={styles.orbSpecular} />
                <Ionicons name={doc.icon} size={22} color="#FFFFFF" />
              </View>

              <View style={styles.docInfoCol}>
                <Text style={styles.docTitle3D}>{doc.title}</Text>
                <Text style={styles.docDesc3D}>{doc.desc}</Text>
              </View>
            </View>

            {/* 3D Status Pill */}
            <View style={styles.statusRow3D}>
              {isSelectedLocal ? (
                <View style={styles.badgeLocal3D}>
                  <Ionicons name="attach" size={14} color="#D97706" />
                  <Text style={styles.badgeLocalText} numberOfLines={1}>
                    Dipilih: {selectedFiles[doc.key].name}
                  </Text>
                </View>
              ) : isUploadedOnServer ? (
                <View style={styles.badgeUploaded3D}>
                  <Ionicons name="checkmark-circle" size={14} color="#059669" />
                  <Text style={styles.badgeUploadedText}>Tersimpan di Server</Text>
                </View>
              ) : (
                <View style={styles.badgeMissing3D}>
                  <Ionicons name="close-circle" size={14} color="#DC2626" />
                  <Text style={styles.badgeMissingText}>Belum Ada Berkas</Text>
                </View>
              )}
            </View>

            {/* 3D Action Buttons */}
            <View style={styles.docActionRow}>
              {isUploadedOnServer && (
                <TouchableOpacity
                  style={styles.btnSecondary3D}
                  activeOpacity={0.8}
                  onPress={() => handleOpenDoc(serverDocs[doc.key], doc.title)}
                >
                  <Ionicons name="eye-outline" size={15} color="#2563EB" style={{ marginRight: 5 }} />
                  <Text style={styles.btnSecondaryText}>Lihat Berkas</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[
                  styles.btnPick3D,
                  isUploadedOnServer && { backgroundColor: '#F8FAFC', borderColor: '#CBD5E1', borderBottomColor: '#94A3B8' },
                ]}
                activeOpacity={0.8}
                onPress={() => handlePickFile(doc.key, doc.imageOnly)}
              >
                <Ionicons
                  name="cloud-upload"
                  size={15}
                  color={isUploadedOnServer ? '#334155' : '#FFFFFF'}
                  style={{ marginRight: 6 }}
                />
                <Text style={[styles.btnPickText, isUploadedOnServer && { color: '#334155' }]}>
                  {isUploadedOnServer ? 'Ganti File' : 'Pilih File'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {/* ═══════════════════════════════════════
          TOMBOL SIMPAN SEMUA (3D Extruded)
      ═══════════════════════════════════════ */}
      <TouchableOpacity
        style={[styles.btnUploadAll3D, uploading && styles.btnDisabled]}
        onPress={handleUploadAll}
        disabled={uploading}
        activeOpacity={0.85}
      >
        <View style={styles.btnShine3D} />
        {uploading ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <>
            <Ionicons name="cloud-done" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.btnUploadAllText}>SIMPAN & UNGGAH BERKAS</Text>
          </>
        )}
      </TouchableOpacity>

      {/* ═══════════════════════════════════════
          3D MODAL SUKSES UPLOAD
      ═══════════════════════════════════════ */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard3D}>
            <View style={styles.modalOrb3D}>
              <View style={styles.orbSpecular} />
              <Ionicons name="checkmark-done-circle" size={42} color="#FFFFFF" />
            </View>

            <Text style={styles.modalTitle3D}>Dokumen Berhasil Diunggah!</Text>
            <Text style={styles.modalDesc3D}>
              Berkas Anda telah tersimpan dan siap diproses oleh Panitia SPMB. Pantau pengumuman kelulusan dan seleksi di menu Seleksi.
            </Text>

            <TouchableOpacity
              style={styles.modalBtn3D}
              activeOpacity={0.85}
              onPress={() => {
                setShowSuccessModal(false);
                navigation.navigate('TabSeleksi');
              }}
            >
              <Text style={styles.modalBtnText3D}>Cek Status Seleksi</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" style={{ marginLeft: 6 }} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCloseBtn}
              activeOpacity={0.7}
              onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ═══════════════════════════════════════
          IN-APP DOCUMENT PREVIEW MODAL 3D
      ═══════════════════════════════════════ */}
      <Modal
        visible={!!previewDoc}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setPreviewDoc(null)}
      >
        <View style={styles.previewModalOverlay}>
          <View style={styles.previewModalCard3D}>
            {/* Header */}
            <View style={styles.previewModalHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewModalBadge}>PREVIEW BERKAS RESMI</Text>
                <Text style={styles.previewModalTitle}>{previewDoc?.title}</Text>
              </View>
              <TouchableOpacity
                style={styles.previewModalCloseBtn}
                onPress={() => setPreviewDoc(null)}
              >
                <Ionicons name="close" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Content Preview */}
            <View style={styles.previewModalBody}>
              {previewDoc?.isImage ? (
                <Image
                  source={{ uri: previewDoc.fullUrl }}
                  style={styles.previewModalImage}
                  resizeMode="contain"
                />
              ) : (
                <View style={styles.previewPdfCard}>
                  <View style={styles.previewPdfOrb}>
                    <Ionicons name="document-text" size={44} color="#EF4444" />
                  </View>
                  <Text style={styles.previewPdfTitle}>Dokumen Berkas PDF</Text>
                  <Text style={styles.previewPdfDesc}>
                    Berkas ini tersimpan dalam format PDF. Ketuk tombol di bawah untuk membuka berkas asli di Chrome.
                  </Text>
                </View>
              )}
            </View>

            {/* Actions */}
            <View style={styles.previewModalFooter}>
              <TouchableOpacity
                style={styles.previewOpenBtn3D}
                activeOpacity={0.82}
                onPress={() => {
                  if (previewDoc?.fullUrl) {
                    if (Platform.OS === 'web' && typeof window !== 'undefined') {
                      window.open(previewDoc.fullUrl, '_blank');
                    } else {
                      WebBrowser.openBrowserAsync(previewDoc.fullUrl);
                    }
                  }
                }}
              >
                <Ionicons name="open-outline" size={17} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.previewOpenBtnText}>Buka di Tab Baru / Download</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.previewDismissBtn}
                activeOpacity={0.7}
                onPress={() => setPreviewDoc(null)}
              >
                <Text style={styles.previewDismissText}>Tutup Preview</Text>
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

  /* ─── Hero 3D Card ─── */
  hero3DCard: {
    backgroundColor: '#1E3A8A',
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderBottomWidth: 5,
    borderBottomColor: '#172554',
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 16px 32px -8px rgba(30, 58, 138, 0.4)',
      },
      default: {
        elevation: 6,
      },
    }),
  },
  heroSpecularShine: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 999,
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextCol: {
    flex: 1,
    paddingRight: 10,
  },
  badge3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    alignSelf: 'flex-start',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
  },
  badge3DText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
    marginLeft: 5,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    fontSize: 12,
    color: '#93C5FD',
    marginTop: 3,
    fontWeight: '500',
  },
  heroOrb3D: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderBottomWidth: 4,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
    position: 'relative',
    overflow: 'hidden',
  },
  orbSpecular: {
    position: 'absolute',
    top: 3,
    left: 10,
    right: 10,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },
  progressTrack3D: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 999,
    marginTop: 18,
    overflow: 'hidden',
  },
  progressFill3D: {
    height: '100%',
    backgroundColor: '#38BDF8',
    borderRadius: 999,
  },

  /* ─── Alerts 3D ─── */
  alertCardRed3D: {
    backgroundColor: '#FEF2F2',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    borderBottomWidth: 4,
    borderBottomColor: '#F87171',
    marginBottom: 16,
  },
  alertCardGreen3D: {
    backgroundColor: '#ECFDF5',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    borderBottomWidth: 4,
    borderBottomColor: '#34D399',
    marginBottom: 16,
  },
  alertRow3D: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertOrbRed: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderBottomWidth: 3,
    borderBottomColor: '#B91C1C',
  },
  alertOrbGreen: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderBottomWidth: 3,
    borderBottomColor: '#047857',
  },
  alertTitleRed: {
    fontSize: 14,
    fontWeight: '800',
    color: '#991B1B',
  },
  alertDescRed: {
    fontSize: 12,
    color: '#B91C1C',
    marginTop: 2,
    lineHeight: 17,
  },
  alertTitleGreen: {
    fontSize: 14,
    fontWeight: '800',
    color: '#065F46',
  },
  alertDescGreen: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
    lineHeight: 17,
  },
  alertActionBtn3D: {
    marginTop: 12,
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#991B1B',
  },
  alertActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },

  /* ─── Claymorphic Doc Card 3D ─── */
  docClayCard3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    marginBottom: 14,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 16px -4px rgba(15, 23, 42, 0.05)',
      },
      default: {
        elevation: 3,
      },
    }),
  },
  docTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  docOrb3D: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderBottomWidth: 3.5,
    position: 'relative',
    overflow: 'hidden',
  },
  docInfoCol: {
    flex: 1,
    marginLeft: 12,
  },
  docTitle3D: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  docDesc3D: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  statusRow3D: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  badgeLocal3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  badgeLocalText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B45309',
    marginLeft: 5,
  },
  badgeUploaded3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignSelf: 'flex-start',
  },
  badgeUploadedText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#047857',
    marginLeft: 5,
  },
  badgeMissing3D: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#FECACA',
    alignSelf: 'flex-start',
  },
  badgeMissingText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#B91C1C',
    marginLeft: 5,
  },
  docActionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  btnSecondary3D: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    borderBottomWidth: 3,
    borderBottomColor: '#93C5FD',
    paddingVertical: 10,
  },
  btnSecondaryText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#2563EB',
  },
  btnPick3D: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderBottomWidth: 3,
    borderBottomColor: '#1D4ED8',
    paddingVertical: 10,
  },
  btnPickText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  /* ─── Submit All 3D ─── */
  btnUploadAll3D: {
    backgroundColor: '#10B981',
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#6EE7B7',
    borderBottomWidth: 5,
    borderBottomColor: '#047857',
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    marginTop: 8,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 24px -6px rgba(16, 185, 129, 0.45)',
        cursor: 'pointer',
      },
      default: {
        elevation: 5,
      },
    }),
  },
  btnShine3D: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  btnUploadAllText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  btnDisabled: {
    opacity: 0.6,
  },

  /* ─── Modal 3D ─── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard3D: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderBottomWidth: 6,
    borderBottomColor: '#CBD5E1',
    ...Platform.select({
      web: {
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      },
      default: {
        elevation: 10,
      },
    }),
  },
  modalOrb3D: {
    width: 76,
    height: 76,
    borderRadius: 38,
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
  },
  modalTitle3D: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc3D: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  modalBtn3D: {
    width: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderBottomWidth: 4,
    borderBottomColor: '#1D4ED8',
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  modalBtnText3D: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  modalCloseBtn: {
    paddingVertical: 8,
  },
  modalCloseText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94A3B8',
  },

  /* ─── Preview Modal 3D ─── */
  previewModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  previewModalCard3D: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '90%',
    backgroundColor: '#1E293B',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    borderBottomWidth: 5,
    borderBottomColor: '#0284C7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 16,
    overflow: 'hidden',
  },
  previewModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  previewModalBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#38BDF8',
    letterSpacing: 0.8,
  },
  previewModalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 2,
  },
  previewModalCloseBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewModalBody: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 240,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  previewModalImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
  },
  previewPdfCard: {
    alignItems: 'center',
    padding: 24,
  },
  previewPdfOrb: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  previewPdfTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F8FAFC',
    marginBottom: 6,
  },
  previewPdfDesc: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 18,
  },
  previewModalFooter: {
    padding: 16,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.15)',
  },
  previewOpenBtn3D: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderBottomWidth: 4,
    borderBottomColor: '#1D4ED8',
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewOpenBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  previewDismissBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  previewDismissText: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '600',
  },
});
