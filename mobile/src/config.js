import { Platform } from 'react-native';
export * from './theme';

// IP laptop saat terhubung ke hotspot HP (update jika IP berubah)
// Cek IP terbaru dengan: ipconfig (cari IPv4 di bagian Wi-Fi/hotspot)
const WIFI_IP = '10.22.181.184';

const getHost = () => {
  // Di browser (web mode): gunakan hostname dari URL yang sedang diakses
  // Ini otomatis benar saat HP buka http://[IP_LAPTOP]:8081
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    // Jangan gunakan localhost, gunakan IP asli
    if (hostname && hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return hostname;
    }
  }
  return WIFI_IP;
};

export const DEFAULT_API_URL = `http://${getHost()}:8000/api`;

export const STORAGE_BASE_URL = `http://${getHost()}:8000`;

/**
 * Format URL dokumen/berkas agar selalu mengarah ke IP host yang benar,
 * bukan 127.0.0.1 / localhost saat diakses dari HP.
 */
export const formatFileUrl = (url) => {
  if (!url) return '';
  const host = getHost();
  if (url.includes('127.0.0.1:8000') || url.includes('localhost:8000')) {
    return url.replace(/http:\/\/(localhost|127\.0\.0\.1):8000/g, `http://${host}:8000`);
  }
  if (!url.startsWith('http')) {
    return `${STORAGE_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url;
};
