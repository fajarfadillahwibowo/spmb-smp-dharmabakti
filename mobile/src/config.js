import { Platform } from 'react-native';
export * from './theme';
export * from './theme3d';

// IP laptop saat terhubung ke Wi-Fi / Hotspot (IP saat ini: 10.240.214.184)
const WIFI_IP = '10.240.214.184';

const getHost = () => {
  // Di browser (web mode): gunakan hostname dari URL yang sedang diakses
  // Ini otomatis benar saat HP / laptop buka via IP ataupun localhost
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    const hostname = window.location.hostname;
    if (hostname) {
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
  if (!url.startsWith('http')) {
    return `${STORAGE_BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  }
  return url.replace(/https?:\/\/[^/:]+(:\d+)?/i, `http://${host}:8000`);
};
