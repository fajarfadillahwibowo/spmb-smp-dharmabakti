import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/client';
import { formatFileUrl } from '../config';

const TIPE_CONFIG = {
  info:       { color: '#2563EB', bg: '#EFF6FF', icon: 'information-circle' },
  peringatan: { color: '#D97706', bg: '#FFFBEB', icon: 'warning'            },
  sukses:     { color: '#059669', bg: '#ECFDF5', icon: 'checkmark-circle'   },
  penting:    { color: '#DC2626', bg: '#FEF2F2', icon: 'alert-circle'       },
};

export default function TopNavbar({ navigation, route }) {
  const { user } = useAuth();

  const [notifVisible, setNotifVisible]       = useState(false);
  const [notifikasi, setNotifikasi]           = useState([]);
  const [unreadCount, setUnreadCount]         = useState(0);
  const [unreadChatCount, setUnreadChatCount] = useState(0);
  const [loading, setLoading]                 = useState(false);

  // ─── Ambil Notifikasi & Chat Unread dari Backend ───────────────────────────
  const fetchNotifikasi = useCallback(async () => {
    if (user?.role !== 'siswa') return;
    try {
      setLoading(true);
      const res = await apiClient.get('/siswa/notifikasi');
      if (res.data?.success) {
        setNotifikasi(res.data.data || []);
        setUnreadCount(res.data.unread_count || 0);
      }
    } catch (e) {
      console.log('Gagal mengambil notifikasi:', e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const fetchUnreadChat = useCallback(async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'admin'
        ? '/admin/chat/unread-count'
        : '/siswa/chat/unread-count';
      const res = await apiClient.get(endpoint);
      if (res.data?.success) {
        setUnreadChatCount(res.data.unread_count || 0);
      }
    } catch (e) {
      // ignore
    }
  }, [user]);

  // Polling tiap 30 detik agar notifikasi & chat baru muncul tanpa membebani memori
  useEffect(() => {
    fetchNotifikasi();
    fetchUnreadChat();
    const interval = setInterval(() => {
      fetchNotifikasi();
      fetchUnreadChat();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifikasi, fetchUnreadChat]);

  // ─── Tandai 1 notifikasi sudah dibaca ────────────────────────────────────
  const handleMarkRead = async (id) => {
    try {
      await apiClient.post(`/siswa/notifikasi/${id}/read`);
      setNotifikasi(prev =>
        prev.map(n => n.id === id ? { ...n, is_read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.log('Gagal tandai baca:', e.message);
    }
  };

  // ─── Tandai semua sudah dibaca ────────────────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await apiClient.post('/siswa/notifikasi/read-all');
      setNotifikasi(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.log('Gagal tandai semua baca:', e.message);
    }
  };

  // ─── Buka modal notifikasi ────────────────────────────────────────────────
  const handleOpenNotif = () => {
    setNotifVisible(true);
    fetchNotifikasi(); // Refresh saat dibuka
  };

  // ─── Ambil inisial nama ───────────────────────────────────────────────────
  const getInitial = () => {
    if (user?.name) return user.name.trim().charAt(0).toUpperCase();
    if (user?.calon_siswa?.nama_lengkap) return user.calon_siswa.nama_lengkap.trim().charAt(0).toUpperCase();
    if (user?.admin?.nama_admin) return user.admin.nama_admin.trim().charAt(0).toUpperCase();
    if (user?.username) return user.username.trim().charAt(0).toUpperCase();
    if (user?.role === 'admin') return 'A';
    if (user?.role === 'kepala_sekolah') return 'K';
    return 'U';
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#172554" />
      <View style={styles.headerContainer}>
        {/* Identitas Sekolah & Logo */}
        <View style={styles.brandingContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.navLogo}
            resizeMode="contain"
          />
          <View style={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
            <Text style={styles.schoolNameText} numberOfLines={1}>SMP DHARMA BAKTI</Text>
            <Text style={styles.portalSubtitle} numberOfLines={1}>
              {user?.role === 'admin'
                ? 'PANEL ADMIN'
                : user?.role === 'kepala_sekolah'
                ? 'PANEL PENGAWAS'
                : 'SPMB ONLINE'}
            </Text>
          </View>
        </View>

        {/* Tombol Kanan: Notifikasi, Chat & Avatar */}
        <View style={styles.rightContainer}>
          {/* Tombol Chat Interaktif (Siswa & Admin) */}
          {(user?.role === 'siswa' || user?.role === 'admin') && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => {
                if (user?.role === 'admin') {
                  navigation.navigate('AdminChatList');
                } else {
                  navigation.navigate('ChatSiswa');
                }
              }}
              activeOpacity={0.7}
              accessibilityLabel="Buka Chat"
            >
              <Ionicons name="chatbubbles-outline" size={19} color="#FFFFFF" />
              {unreadChatCount > 0 && (
                <View style={[styles.notifBadge, { backgroundColor: '#3B82F6' }]}>
                  <Text style={styles.notifBadgeText}>
                    {unreadChatCount > 9 ? '9+' : unreadChatCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Tombol Notifikasi — hanya tampil untuk siswa */}
          {user?.role === 'siswa' && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={handleOpenNotif}
              activeOpacity={0.7}
              accessibilityLabel="Buka Notifikasi"
            >
              <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
              {unreadCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {/* Avatar Profil */}
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <View style={styles.avatarCircle}>
              {user?.foto_profil_url ? (
                <Image
                  source={{ uri: formatFileUrl(user.foto_profil_url) }}
                  style={styles.avatarImage}
                />
              ) : (
                <Text style={styles.avatarText}>{getInitial()}</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ═══════════════════════════════════════════
          MODAL NOTIFIKASI
      ═══════════════════════════════════════════ */}
      <Modal
        visible={notifVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNotifVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setNotifVisible(false)}
        >
          <TouchableOpacity
            style={styles.notifModalBox}
            activeOpacity={1}
            onPress={() => {}} // Cegah modal tutup saat klik isi
          >
            {/* Header Modal */}
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="notifications" size={18} color="#1E3A8A" />
                <Text style={styles.modalTitle}>Notifikasi</Text>
                {unreadCount > 0 && (
                  <View style={styles.unreadPill}>
                    <Text style={styles.unreadPillText}>{unreadCount} baru</Text>
                  </View>
                )}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                {unreadCount > 0 && (
                  <TouchableOpacity onPress={handleMarkAllRead}>
                    <Text style={styles.readAllText}>Baca semua</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => setNotifVisible(false)}>
                  <Ionicons name="close-circle" size={22} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Isi Notifikasi */}
            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="small" color="#2563EB" />
                <Text style={styles.loadingText}>Memuat notifikasi...</Text>
              </View>
            ) : notifikasi.length === 0 ? (
              <View style={styles.emptyBox}>
                <Ionicons name="notifications-off-outline" size={36} color="#CBD5E1" />
                <Text style={styles.emptyText}>Belum ada notifikasi dari admin</Text>
              </View>
            ) : (
              <ScrollView
                style={styles.notifScroll}
                showsVerticalScrollIndicator={false}
              >
                {notifikasi.map((item) => {
                  const cfg = TIPE_CONFIG[item.tipe] || TIPE_CONFIG.info;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.notifItem,
                        !item.is_read && styles.notifItemUnread,
                      ]}
                      activeOpacity={0.75}
                      onPress={() => !item.is_read && handleMarkRead(item.id)}
                    >
                      {/* Ikon tipe */}
                      <View style={[styles.notifIconBox, { backgroundColor: cfg.bg }]}>
                        <Ionicons name={cfg.icon} size={20} color={cfg.color} />
                      </View>

                      {/* Konten */}
                      <View style={styles.notifContent}>
                        <View style={styles.notifTitleRow}>
                          <Text style={styles.notifItemTitle} numberOfLines={1}>
                            {item.judul}
                          </Text>
                          {!item.is_read && <View style={styles.unreadDot} />}
                        </View>
                        <Text style={styles.notifItemDesc} numberOfLines={3}>
                          {item.pesan}
                        </Text>
                        <Text style={styles.notifItemTime}>{item.waktu}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#172554',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 48 : (Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 14),
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
    zIndex: 1000,
  },
  brandingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    marginRight: 10,
  },
  navLogo: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: 10,
    flexShrink: 0,
  },
  schoolNameText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  portalSubtitle: {
    color: '#93C5FD',
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginTop: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 0,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#172554',
  },
  notifBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  avatarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    padding: 2,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  avatarText: {
    color: '#172554',
    fontWeight: '800',
    fontSize: 14,
  },

  /* ─── MODAL ─── */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 95 : 60,
    paddingHorizontal: 16,
  },
  notifModalBox: {
    width: 320,
    maxHeight: 480,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172554',
  },
  unreadPill: {
    backgroundColor: '#EFF6FF',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  unreadPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#2563EB',
  },
  readAllText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },

  /* Loading & Empty */
  loadingBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 10,
  },
  emptyText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },

  /* Scroll list */
  notifScroll: {
    maxHeight: 400,
  },
  notifItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F8FAFC',
    gap: 10,
  },
  notifItemUnread: {
    backgroundColor: '#F0F9FF',
  },
  notifIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  notifContent: {
    flex: 1,
  },
  notifTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  notifItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  unreadDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    flexShrink: 0,
  },
  notifItemDesc: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 4,
  },
  notifItemTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
