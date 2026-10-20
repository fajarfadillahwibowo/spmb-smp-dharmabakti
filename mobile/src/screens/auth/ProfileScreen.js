import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../contexts/AuthContext';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS, formatFileUrl } from '../../config';

export default function ProfileScreen({ navigation }) {
  const { user, updateProfile, deleteProfilePhoto, logout } = useAuth();

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // Avatar state
  const [avatarUri, setAvatarUri] = useState(null);
  const [selectedImageFile, setSelectedImageFile] = useState(null);
  const [modalPickerVisible, setModalPickerVisible] = useState(false);

  // Live Camera Viewfinder State (Khusus Web/Laptop/Browser agar kamera live terbuka, bukan File Explorer)
  const [webCameraVisible, setWebCameraVisible] = useState(false);
  const [webCameraStream, setWebCameraStream] = useState(null);
  const [capturedPhotoUrl, setCapturedPhotoUrl] = useState(null);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [webCameraError, setWebCameraError] = useState('');
  const [facingMode, setFacingMode] = useState('user'); // 'user' (selfie) atau 'environment' (belakang)
  const videoElementRef = useRef(null);

  // Status
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name || user.calon_siswa?.nama_lengkap || user.admin?.nama_admin || user.username || '');
      setEmail(user.email || '');
      if (user.foto_profil_url) {
        setAvatarUri(formatFileUrl(user.foto_profil_url));
      }
    }
  }, [user]);

  // Bersihkan stream kamera web jika komponen di-unmount
  useEffect(() => {
    return () => {
      if (webCameraStream) {
        webCameraStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [webCameraStream]);

  // Ambil inisial nama
  const getInitial = () => {
    if (name.trim()) return name.trim().charAt(0).toUpperCase();
    if (user?.username) return user.username.charAt(0).toUpperCase();
    return 'U';
  };

  // ============================================================
  // KAMERA LANGSUNG
  // ============================================================
  const startWebCamera = async (mode = 'user') => {
    setWebCameraError('');
    setCapturedPhotoUrl(null);
    setCapturedBlob(null);
    setFacingMode(mode);
    setWebCameraVisible(true);

    if (
      typeof navigator === 'undefined' ||
      !navigator.mediaDevices ||
      !navigator.mediaDevices.getUserMedia
    ) {
      // Fallback jika getUserMedia dibatasi oleh browser
      setWebCameraError('Browser tidak mengizinkan akses stream kamera langsung.');
      return;
    }

    try {
      // Hentikan stream sebelumnya jika ada (misal saat ganti kamera depan/belakang)
      if (webCameraStream) {
        webCameraStream.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 720 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setWebCameraStream(stream);

      if (videoElementRef.current) {
        videoElementRef.current.srcObject = stream;
        videoElementRef.current.play().catch((err) => console.log('Video play error:', err));
      }
    } catch (err) {
      console.log('Error accessing webcam:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setWebCameraError(
          'Izin kamera diblokir oleh browser. Harap klik ikon gembok/kamera di sebelah kiri alamat URL browser Anda lalu pilih "Izinkan" (Allow).'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setWebCameraError('Perangkat kamera/webcam tidak terdeteksi pada komputer/laptop Anda.');
      } else {
        setWebCameraError('Gagal membuka kamera: ' + (err.message || 'Periksa izin kamera.'));
      }
    }
  };

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    startWebCamera(nextMode);
  };

  const closeWebCamera = () => {
    if (webCameraStream) {
      webCameraStream.getTracks().forEach((track) => track.stop());
      setWebCameraStream(null);
    }
    setWebCameraVisible(false);
    setCapturedPhotoUrl(null);
    setCapturedBlob(null);
    setWebCameraError('');
  };

  // Jepret foto dari stream video web
  const handleSnapPhoto = () => {
    const video = videoElementRef.current;
    if (!video) return;

    try {
      const canvas = document.createElement('canvas');
      const vWidth = video.videoWidth || 640;
      const vHeight = video.videoHeight || 480;
      const cropSize = Math.min(vWidth, vHeight);

      // Ukuran persegi hasil foto
      const outSize = 600;
      canvas.width = outSize;
      canvas.height = outSize;

      const ctx = canvas.getContext('2d');
      const startX = (vWidth - cropSize) / 2;
      const startY = (vHeight - cropSize) / 2;

      // Cerminkan jika kamera depan agar foto sama seperti saat bercermin
      if (facingMode === 'user') {
        ctx.translate(outSize, 0);
        ctx.scale(-1, 1);
      }

      ctx.drawImage(video, startX, startY, cropSize, cropSize, 0, 0, outSize, outSize);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setCapturedPhotoUrl(dataUrl);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCapturedBlob(blob);
          }
        },
        'image/jpeg',
        0.88
      );
    } catch (e) {
      console.log('Error capturing photo:', e);
      Alert.alert('Gagal Mengambil Foto', 'Terjadi kesalahan saat memproses gambar kamera.');
    }
  };

  // Konfirmasi gunakan foto hasil jepretan kamera web
  const handleConfirmUsePhoto = () => {
    if (!capturedPhotoUrl) return;

    setAvatarUri(capturedPhotoUrl);

    let fileObj = null;
    if (typeof File !== 'undefined' && capturedBlob) {
      fileObj = new File([capturedBlob], `camera_${Date.now()}.jpg`, { type: 'image/jpeg' });
    }

    setSelectedImageFile({
      uri: capturedPhotoUrl,
      name: fileObj ? fileObj.name : `camera_${Date.now()}.jpg`,
      type: 'image/jpeg',
      file: fileObj,
    });

    closeWebCamera();
  };

  // Opsi 1: Panggil Kamera (Otomatis deteksi Web Live Camera vs Native Expo)
  const handleTakePhoto = async () => {
    setModalPickerVisible(false);

    // Platform Web / Browser (Laptop atau Browser HP) -> Tampilkan Live Camera Viewfinder Langsung!
    if (Platform.OS === 'web') {
      startWebCamera('user');
      return;
    }

    // Platform Native (Android / iOS di Expo Go) -> Buka Kamera Ponsel
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin Dibutuhkan', 'Izin akses kamera diperlukan untuk mengambil foto profil.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        cameraType: ImagePicker.CameraType.front,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setAvatarUri(asset.uri);
        setSelectedImageFile({
          uri: asset.uri,
          name: asset.fileName || `camera_${Date.now()}.jpg`,
          type: asset.mimeType || 'image/jpeg',
          file: asset.file || null,
        });
      }
    } catch (err) {
      console.log('Error launching native camera:', err);
      Alert.alert('Gagal Membuka Kamera', 'Terjadi kesalahan saat membuka kamera: ' + (err.message || ''));
    }
  };

  // ============================================================
  // OPSI 2: PILIH FOTO DARI GALERI / FILE
  // ============================================================
  const handlePickFromGallery = async () => {
    setModalPickerVisible(false);

    // Di browser web -> Membuka File Explorer untuk memilih foto yang sudah ada
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/jpeg,image/png,image/jpg,image/webp';
      input.onchange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (file) {
          if (file.size > 4 * 1024 * 1024) {
            Alert.alert('File Terlalu Besar', 'Maksimal ukuran foto adalah 4MB.');
            return;
          }
          const objectUrl = URL.createObjectURL(file);
          setAvatarUri(objectUrl);
          setSelectedImageFile({
            uri: objectUrl,
            name: file.name,
            type: file.type || 'image/jpeg',
            file: file,
          });
        }
      };
      input.click();
      return;
    }

    // Di Native Ponsel -> Membuka Galeri Foto
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Izin Dibutuhkan', 'Izin akses galeri diperlukan untuk memilih foto profil.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        setAvatarUri(asset.uri);
        setSelectedImageFile({
          uri: asset.uri,
          name: asset.fileName || asset.name || `photo_${Date.now()}.jpg`,
          type: asset.mimeType || 'image/jpeg',
          file: asset.file || null,
        });
      }
    } catch (err) {
      console.log('Error picking image:', err);
      Alert.alert('Gagal Membuka Galeri', 'Terjadi kesalahan saat memilih gambar.');
    }
  };

  // Opsi 3: Hapus Foto Profil
  const handleDeletePhoto = async () => {
    setModalPickerVisible(false);
    try {
      setSaving(true);
      await deleteProfilePhoto();
      setAvatarUri(null);
      setSelectedImageFile(null);
      setSuccessMsg('Foto profil berhasil dihapus.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (e) {
      Alert.alert('Gagal', 'Gagal menghapus foto profil.');
    } finally {
      setSaving(false);
    }
  };

  // ============================================================
  // SIMPAN PERUBAHAN PROFIL
  // ============================================================
  const handleSaveProfile = async () => {
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Nama lengkap tidak boleh kosong.');
      return;
    }

    if (!email.trim()) {
      setErrorMsg('Alamat email tidak boleh kosong.');
      return;
    }

    if (newPassword) {
      if (!currentPassword) {
        setErrorMsg('Harap masukkan Password Saat Ini untuk mengonfirmasi penggantian kata sandi.');
        return;
      }
      if (newPassword.length < 8) {
        setErrorMsg('Password baru minimal harus 8 karakter.');
        return;
      }
      if (newPassword !== confirmPassword) {
        setErrorMsg('Konfirmasi password baru tidak cocok.');
        return;
      }
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim());

      if (newPassword) {
        formData.append('current_password', currentPassword);
        formData.append('new_password', newPassword);
        formData.append('new_password_confirmation', confirmPassword);
      }

      if (selectedImageFile) {
        if (Platform.OS === 'web' && selectedImageFile.file) {
          formData.append('foto_profil', selectedImageFile.file);
        } else {
          formData.append('foto_profil', {
            uri: selectedImageFile.uri,
            name: selectedImageFile.name || 'avatar.jpg',
            type: selectedImageFile.type || 'image/jpeg',
          });
        }
      }

      const res = await updateProfile(formData);
      if (res.success) {
        setSuccessMsg('Profil Anda berhasil diperbarui!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSelectedImageFile(null);
        if (res.data?.foto_profil_url) {
          setAvatarUri(formatFileUrl(res.data.foto_profil_url));
        }
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) {
      console.log('Update profile error:', err);
      const msg =
        err.response?.data?.errors?.current_password?.[0] ||
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.errors?.new_password?.[0] ||
        err.response?.data?.message ||
        'Gagal menyimpan perubahan profil. Periksa data kembali.';
      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Apakah Anda yakin ingin keluar dari akun ini?')) {
        logout();
      }
    } else {
      Alert.alert('Konfirmasi Keluar', 'Apakah Anda yakin ingin keluar dari akun ini?', [
        { text: 'Batal', style: 'cancel' },
        { text: 'Keluar', style: 'destructive', onPress: logout },
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#172554" />

      {/* Top Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pengaturan Profil</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar Showcase Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarWrapper}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarInitialText}>{getInitial()}</Text>
              </View>
            )}

            {/* Camera badge trigger */}
            <TouchableOpacity
              style={styles.cameraBadge}
              onPress={() => setModalPickerVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName} numberOfLines={1}>
            {name || user?.username || 'Pengguna'}
          </Text>
          <Text style={styles.profileUsername}>@{user?.username}</Text>

          <View style={styles.roleBadgeContainer}>
            <View style={styles.roleBadge}>
              <Ionicons
                name={
                  user?.role === 'admin'
                    ? 'shield-checkmark'
                    : user?.role === 'kepala_sekolah'
                    ? 'ribbon'
                    : 'school'
                }
                size={13}
                color="#1E3A8A"
                style={{ marginRight: 4 }}
              />
              <Text style={styles.roleBadgeText}>
                {user?.role === 'admin'
                  ? 'ADMINISTRATOR'
                  : user?.role === 'kepala_sekolah'
                  ? 'KEPALA SEKOLAH'
                  : 'CALON SISWA'}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.changePhotoBtn}
            onPress={() => setModalPickerVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={16} color={COLORS.primary} />
            <Text style={styles.changePhotoBtnText}>Ganti Foto Profil</Text>
          </TouchableOpacity>
        </View>

        {/* Notifikasi Error / Sukses */}
        {errorMsg ? (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={18} color="#DC2626" />
            <Text style={styles.errorBannerText}>{errorMsg}</Text>
          </View>
        ) : null}

        {successMsg ? (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={18} color="#15803D" />
            <Text style={styles.successBannerText}>{successMsg}</Text>
          </View>
        ) : null}

        {/* Form Biodata Akun */}
        <View style={styles.formCard}>
          <Text style={styles.sectionTitle}>Data Akun</Text>
          <Text style={styles.sectionSubtitle}>
            Perbarui nama lengkap dan alamat email aktif Anda
          </Text>

          {/* Username (Permanen) */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Username (ID Akun)</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <Ionicons name="at-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { color: '#64748B' }]}
                value={user?.username || ''}
                editable={false}
              />
              <View style={styles.lockedTag}>
                <Ionicons name="lock-closed" size={11} color="#64748B" />
                <Text style={styles.lockedTagText}>Tetap</Text>
              </View>
            </View>
          </View>

          {/* Nama Lengkap */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nama Lengkap *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Masukkan nama lengkap Anda"
                placeholderTextColor="#94A3B8"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Alamat Email *</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="mail-outline" size={18} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="nama@email.com"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>
        </View>

        {/* Section Keamanan & Password */}
        <View style={styles.formCard}>
          <TouchableOpacity
            style={styles.passwordAccordionHeader}
            onPress={() => setShowPasswordSection(!showPasswordSection)}
            activeOpacity={0.7}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
              <View style={styles.passwordIconBox}>
                <Ionicons name="key-outline" size={20} color="#1E3A8A" />
              </View>
              <View style={{ marginLeft: 12, flex: 1 }}>
                <Text style={styles.sectionTitle}>Ubah Kata Sandi</Text>
                <Text style={styles.sectionSubtitle}>
                  {showPasswordSection ? 'Tutup form kata sandi' : 'Ketuk untuk mengganti password'}
                </Text>
              </View>
            </View>
            <Ionicons
              name={showPasswordSection ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#64748B"
            />
          </TouchableOpacity>

          {showPasswordSection && (
            <View style={styles.passwordFormContent}>
              <View style={styles.passwordTip}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#0284C7" />
                <Text style={styles.passwordTipText}>
                  Masukkan password saat ini untuk memverifikasi keamanan sebelum membuat password baru.
                </Text>
              </View>

              {/* Password Saat Ini */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password Saat Ini *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-closed-outline" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan password saat ini"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showCurrentPass}
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowCurrentPass(!showCurrentPass)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showCurrentPass ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Password Baru */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password Baru (Min. 8 Karakter) *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="lock-open-outline" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Masukkan password baru"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showNewPass}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowNewPass(!showNewPass)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showNewPass ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Konfirmasi Password Baru */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Ulangi Password Baru *</Text>
                <View style={styles.inputWrapper}>
                  <Ionicons name="checkmark-done-outline" size={18} color="#64748B" style={styles.inputIcon} />
                  <TextInput
                    style={styles.textInput}
                    placeholder="Ketik ulang password baru"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry={!showConfirmPass}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPass(!showConfirmPass)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showConfirmPass ? 'eye-off-outline' : 'eye-outline'}
                      size={18}
                      color="#64748B"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={[styles.saveButton, saving && styles.btnDisabled]}
            onPress={handleSaveProfile}
            disabled={saving}
            activeOpacity={0.8}
          >
            {saving ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="save-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.saveButtonText}>Simpan Perubahan</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={18} color="#DC2626" style={{ marginRight: 6 }} />
            <Text style={styles.logoutButtonText}>Keluar dari Akun</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Pilihan Sumber Foto (Kamera vs Galeri) */}
      <Modal
        visible={modalPickerVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalPickerVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalPickerVisible(false)}
        >
          <View style={styles.modalSheet}>
            <View style={styles.modalIndicator} />
            <Text style={styles.modalTitle}>Ubah Foto Profil</Text>
            <Text style={styles.modalSubtitle}>Pilih cara untuk memperbarui foto profil Anda</Text>

            {/* Opsi 1: Kamera Langsung */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleTakePhoto}
              activeOpacity={0.7}
            >
              <View style={[styles.modalOptionIcon, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="camera" size={22} color="#2563EB" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.modalOptionTitle}>Ambil Foto dengan Kamera</Text>
                <Text style={styles.modalOptionDesc}>Buka kamera langsung dan ambil foto wajah</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Opsi 2: Galeri / File */}
            <TouchableOpacity
              style={styles.modalOption}
              onPress={handlePickFromGallery}
              activeOpacity={0.7}
            >
              <View style={[styles.modalOptionIcon, { backgroundColor: '#F0FDF4' }]}>
                <Ionicons name="images" size={22} color="#16A34A" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.modalOptionTitle}>Pilih dari Galeri / File</Text>
                <Text style={styles.modalOptionDesc}>Upload file foto yang ada di memori perangkat</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
            </TouchableOpacity>

            {/* Opsi 3: Hapus Foto (jika sudah ada foto) */}
            {avatarUri ? (
              <TouchableOpacity
                style={styles.modalOption}
                onPress={handleDeletePhoto}
                activeOpacity={0.7}
              >
                <View style={[styles.modalOptionIcon, { backgroundColor: '#FEF2F2' }]}>
                  <Ionicons name="trash" size={22} color="#DC2626" />
                </View>
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text style={[styles.modalOptionTitle, { color: '#DC2626' }]}>
                    Hapus Foto Profil
                  </Text>
                  <Text style={styles.modalOptionDesc}>Gunakan kembali avatar inisial nama</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
              </TouchableOpacity>
            ) : null}

            {/* Batal */}
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={() => setModalPickerVisible(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelBtnText}>Batal</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Kamera Interaktif (Live Viewfinder Kamera) Khusus Web/Browser */}
      {Platform.OS === 'web' && (
        <Modal
          visible={webCameraVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeWebCamera}
        >
          <View style={styles.webCameraOverlay}>
            <View style={styles.webCameraBox}>
              {/* Header Modal Kamera */}
              <View style={styles.webCameraHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Ionicons name="camera" size={20} color="#1E3A8A" />
                  <Text style={styles.webCameraTitle}>Kamera Profil</Text>
                </View>
                <TouchableOpacity onPress={closeWebCamera} style={styles.webCameraCloseBtn}>
                  <Ionicons name="close" size={20} color="#64748B" />
                </TouchableOpacity>
              </View>

              {webCameraError ? (
                <View style={styles.webCameraErrorBox}>
                  <Ionicons name="alert-circle" size={28} color="#DC2626" />
                  <Text style={styles.webCameraErrorText}>{webCameraError}</Text>
                  <TouchableOpacity
                    style={styles.webCameraRetryBtn}
                    onPress={() => startWebCamera(facingMode)}
                  >
                    <Text style={styles.webCameraRetryText}>Coba Lagi</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  {/* Viewport Kamera Video / Pratinjau Foto */}
                  <View style={styles.webCameraViewport}>
                    {capturedPhotoUrl ? (
                      <Image
                        source={{ uri: capturedPhotoUrl }}
                        style={styles.webCameraPreviewImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <>
                        {React.createElement('video', {
                          ref: (el) => {
                            videoElementRef.current = el;
                            if (el && webCameraStream && el.srcObject !== webCameraStream) {
                              el.srcObject = webCameraStream;
                              el.play().catch(() => {});
                            }
                          },
                          autoPlay: true,
                          playsInline: true,
                          muted: true,
                          style: {
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: facingMode === 'user' ? 'scaleX(-1)' : 'none',
                          },
                        })}
                        {/* Lingkaran Panduan Wajah (Face Guide) */}
                        <View style={styles.faceGuideCircle} pointerEvents="none" />
                      </>
                    )}
                  </View>

                  <Text style={styles.webCameraHintText}>
                    {capturedPhotoUrl
                      ? 'Apakah Anda puas dengan foto ini?'
                      : 'Posisikan wajah Anda tepat di dalam lingkaran'}
                  </Text>

                  {/* Kontrol Kamera */}
                  <View style={styles.webCameraControls}>
                    {capturedPhotoUrl ? (
                      <View style={styles.webCameraActionRow}>
                        <TouchableOpacity
                          style={styles.retakeBtn}
                          onPress={() => {
                            setCapturedPhotoUrl(null);
                            setCapturedBlob(null);
                            if (videoElementRef.current && webCameraStream) {
                              videoElementRef.current.play().catch(() => {});
                            }
                          }}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="refresh" size={18} color="#64748B" />
                          <Text style={styles.retakeBtnText}>Foto Ulang</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          style={styles.usePhotoBtn}
                          onPress={handleConfirmUsePhoto}
                          activeOpacity={0.8}
                        >
                          <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                          <Text style={styles.usePhotoBtnText}>Gunakan Foto Ini</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.webCameraShutterRow}>
                        {/* Tombol Balik Kamera (Depan/Belakang) */}
                        <TouchableOpacity
                          style={styles.toggleCameraBtn}
                          onPress={handleToggleFacingMode}
                          activeOpacity={0.7}
                        >
                          <Ionicons name="camera-reverse-outline" size={22} color="#1E3A8A" />
                        </TouchableOpacity>

                        {/* Tombol Shutter Ambil Foto */}
                        <TouchableOpacity
                          style={styles.shutterBtn}
                          onPress={handleSnapPhoto}
                          activeOpacity={0.85}
                        >
                          <View style={styles.shutterInner} />
                        </TouchableOpacity>

                        <View style={{ width: 44 }} />
                      </View>
                    )}
                  </View>
                </>
              )}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  headerBar: {
    backgroundColor: '#172554',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 16,
    ...SHADOWS.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  avatarCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 16,
    ...SHADOWS.md,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarImage: {
    width: 104,
    height: 104,
    borderRadius: 52,
    borderWidth: 3,
    borderColor: '#3B82F6',
  },
  avatarFallback: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: '#1E3A8A',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#60A5FA',
  },
  avatarInitialText: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '800',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#2563EB',
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    ...SHADOWS.md,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
  },
  profileUsername: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 10,
  },
  roleBadgeContainer: {
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#1E3A8A',
    letterSpacing: 0.5,
  },
  changePhotoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  changePhotoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: COLORS.primary,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
    gap: 8,
  },
  errorBannerText: {
    color: '#B91C1C',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#16A34A',
    gap: 8,
  },
  successBannerText: {
    color: '#15803D',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    ...SHADOWS.sm,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    height: '100%',
  },
  lockedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  lockedTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  eyeBtn: {
    padding: 6,
  },
  passwordAccordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passwordFormContent: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 16,
  },
  passwordTip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 10,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#BAE6FD',
    gap: 8,
  },
  passwordTipText: {
    fontSize: 11,
    color: '#0369A1',
    flex: 1,
    lineHeight: 16,
  },
  actionContainer: {
    marginTop: 8,
    gap: 12,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1E3A8A',
    height: 50,
    borderRadius: 14,
    ...SHADOWS.md,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '700',
  },

  // Modal Sheet Styles (Pilihan Sumber Foto)
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    ...SHADOWS.lg,
  },
  modalIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 2,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalOptionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalOptionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  modalOptionDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  modalCancelBtn: {
    marginTop: 16,
    height: 46,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#475569',
  },

  // Modal Kamera Interaktif (Web Viewfinder)
  webCameraOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  webCameraBox: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    ...SHADOWS.lg,
  },
  webCameraHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  webCameraTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#172554',
    marginLeft: 8,
  },
  webCameraCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webCameraViewport: {
    width: 280,
    height: 280,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  webCameraPreviewImage: {
    width: 280,
    height: 280,
    borderRadius: 20,
  },
  faceGuideCircle: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.75)',
    borderStyle: 'dashed',
  },
  webCameraHintText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
    marginTop: 14,
    textAlign: 'center',
  },
  webCameraControls: {
    width: '100%',
    marginTop: 16,
  },
  webCameraShutterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 16,
  },
  toggleCameraBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterBtn: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#BFDBFE',
    ...SHADOWS.md,
  },
  shutterInner: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
  },
  webCameraActionRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  retakeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
  },
  usePhotoBtn: {
    flex: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
    ...SHADOWS.sm,
  },
  usePhotoBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  webCameraErrorBox: {
    padding: 20,
    alignItems: 'center',
    width: '100%',
  },
  webCameraErrorText: {
    color: '#DC2626',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
  webCameraRetryBtn: {
    marginTop: 14,
    backgroundColor: '#EFF6FF',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  webCameraRetryText: {
    color: '#2563EB',
    fontWeight: '700',
    fontSize: 13,
  },
});
