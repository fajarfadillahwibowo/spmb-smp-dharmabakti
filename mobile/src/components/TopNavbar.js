import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { formatFileUrl } from '../config';

export default function TopNavbar({ navigation, route }) {
  const { user } = useAuth();
  const [notifVisible, setNotifVisible] = useState(false);

  // Ambil inisial nama
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
        {/* Identitas Sekolah & Logo di Sisi Kiri */}
        <View style={styles.brandingContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.navLogo}
            resizeMode="contain"
          />
          <View style={{ alignItems: 'flex-start' }}>
            <Text style={styles.schoolNameText}>SMP DHARMA BAKTI</Text>
            <Text style={styles.portalSubtitle}>
              {user?.role === 'admin'
                ? 'PANEL ADMIN'
                : user?.role === 'kepala_sekolah'
                ? 'PANEL PENGAWAS'
                : 'SPMB ONLINE'}
            </Text>
          </View>
        </View>

        {/* Tombol Kanan: Notifikasi & Avatar Profil */}
        <View style={styles.rightContainer}>
          {/* Tombol Notifikasi */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setNotifVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={20} color="#FFFFFF" />
            <View style={styles.notifBadgeDot} />
          </TouchableOpacity>

          {/* Tombol Avatar Profil -> Langsung ke Layanan Edit Profil */}
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

      {/* Modal Notifikasi */}
      <Modal
        visible={notifVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setNotifVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlayRight}
          activeOpacity={1}
          onPress={() => setNotifVisible(false)}
        >
          <View style={styles.notifModalBox}>
            <View style={styles.modalHeader}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="notifications" size={18} color="#1E3A8A" />
                <Text style={styles.modalTitle}>Notifikasi</Text>
              </View>
              <TouchableOpacity onPress={() => setNotifVisible(false)}>
                <Ionicons name="close-circle" size={22} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <View style={styles.notifItem}>
              <View style={styles.notifDot} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={styles.notifItemTitle}>Pendaftaran SPMB 2025/2026</Text>
                <Text style={styles.notifItemDesc}>
                  Pastikan seluruh dokumen dan biodata pendaftaran terisi dengan valid sebelum penutupan gelombang.
                </Text>
                <Text style={styles.notifItemTime}>Hari ini</Text>
              </View>
            </View>
          </View>
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
    paddingTop: Platform.OS === 'ios' ? 48 : 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  brandingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  navLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    marginRight: 10,
  },
  schoolNameText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  portalSubtitle: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    marginTop: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
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
  notifBadgeDot: {
    position: 'absolute',
    top: 7,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
    borderWidth: 1.5,
    borderColor: '#172554',
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
    backgroundColor: '#F59E0B', // Amber gold accent
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
  modalOverlayRight: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: Platform.OS === 'ios' ? 95 : 60,
    paddingHorizontal: 16,
  },
  notifModalBox: {
    width: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
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
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#172554',
    marginLeft: 6,
  },
  notifItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'flex-start',
  },
  notifDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginTop: 5,
  },
  notifItemTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  notifItemDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    lineHeight: 15,
  },
  notifItemTime: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 4,
  },
});
