import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_API_URL } from '../config';

// Inisialisasi instance Axios
const apiClient = axios.create({
  baseURL: DEFAULT_API_URL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 15000,
});

// Update dynamic base URL jika disimpan di settings
export const setCustomBaseUrl = async (url) => {
  if (url) {
    apiClient.defaults.baseURL = url;
    await AsyncStorage.setItem('custom_api_url', url);
  }
};

// Ambil dynamic base URL saat startup
export const loadSavedBaseUrl = async () => {
  try {
    const savedUrl = await AsyncStorage.getItem('custom_api_url');
    // Jika di web browser, sinkronkan dengan window.location.hostname agar tidak tertahan IP WiFi lama
    if (typeof window !== 'undefined' && window.location && window.location.hostname) {
      if (!savedUrl || !savedUrl.includes(window.location.hostname)) {
        apiClient.defaults.baseURL = DEFAULT_API_URL;
        return;
      }
    }
    if (savedUrl) {
      apiClient.defaults.baseURL = savedUrl;
    } else {
      apiClient.defaults.baseURL = DEFAULT_API_URL;
    }
  } catch (e) {
    console.log('Error loading base URL:', e);
  }
};

// Request Interceptor: Menambahkan Authorization Header Bearer Token jika ada
apiClient.interceptors.request.use(
  async (config) => {
    try {
      if (typeof window !== 'undefined' && window.location && window.location.hostname) {
        if (!config.baseURL || !config.baseURL.includes(window.location.hostname)) {
          config.baseURL = DEFAULT_API_URL;
        }
      }
      const token = await AsyncStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      if (config.data instanceof FormData) {
        delete config.headers['Content-Type'];
      }
    } catch (e) {
      console.log('Error retrieving token:', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Tangani error global
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Token kadaluarsa atau unauthorized
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
