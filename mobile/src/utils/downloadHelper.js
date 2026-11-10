import { Platform, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { formatFileUrl } from '../config';

/**
 * Helper untuk mengunduh laporan PDF resmi SMP Dharma Bakti
 */
export const downloadPdfReport = async () => {
  const downloadUrl = formatFileUrl('/api/laporan/download-pdf');
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'REKAPITULASI_DATA_DIRI_CALON_SISWA_2026-2027.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    return;
  }
  try {
    await WebBrowser.openBrowserAsync(downloadUrl);
  } catch (e) {
    Alert.alert('Gagal', 'Tidak dapat membuka tautan unduh PDF.');
  }
};

/**
 * Helper untuk pratinjau PDF laporan resmi SMP Dharma Bakti di tab/viewer
 */
export const previewPdfReport = async () => {
  const previewUrl = formatFileUrl('/api/laporan/preview-pdf');
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    window.open(previewUrl, '_blank');
    return;
  }
  try {
    await WebBrowser.openBrowserAsync(previewUrl);
  } catch (e) {
    Alert.alert('Gagal', 'Tidak dapat membuka pratinjau PDF.');
  }
};

/**
 * Helper untuk mengunduh berkas foto pendaftar (Pasfoto, Akte, KK, Ijazah, Bukti Bayar)
 */
export const downloadPhotoFile = async (filePath, customName) => {
  if (!filePath) {
    Alert.alert('Perhatian', 'Berkas belum diunggah oleh calon siswa.');
    return;
  }

  const cleanName = (customName || 'dokumen_pendaftar').replace(/[^a-zA-Z0-9_\-\.]/g, '_');
  const downloadUrl = formatFileUrl(
    `/api/admin/download-file?path=${encodeURIComponent(filePath)}&name=${encodeURIComponent(cleanName)}`
  );

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    try {
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = cleanName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      return;
    } catch (e) {
      window.open(downloadUrl, '_blank');
      return;
    }
  }

  try {
    await WebBrowser.openBrowserAsync(downloadUrl);
  } catch (e) {
    Alert.alert('Gagal', 'Tidak dapat mengunduh berkas foto.');
  }
};

