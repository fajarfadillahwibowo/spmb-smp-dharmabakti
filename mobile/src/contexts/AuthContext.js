import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient, { loadSavedBaseUrl, setCustomBaseUrl } from '../api/client';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiUrl, setApiUrl] = useState('');

  // Cek token tersimpan saat aplikasi pertama kali dibuka
  useEffect(() => {
    const bootstrapAsync = async () => {
      // Timeout fallback agar tidak stuck di loading (terutama di web)
      const timeoutId = setTimeout(() => {
        setIsLoading(false);
      }, 3000);

      try {
        await loadSavedBaseUrl();
        const savedUrl = await AsyncStorage.getItem('custom_api_url');
        if (savedUrl) setApiUrl(savedUrl);

        const savedToken = await AsyncStorage.getItem('auth_token');
        const savedUserStr = await AsyncStorage.getItem('auth_user');

        if (savedToken && savedUserStr) {
          setToken(savedToken);
          setUser(JSON.parse(savedUserStr));

          // Verifikasi ke server
          try {
            const res = await apiClient.get('/auth/me');
            if (res.data.success) {
              setUser(res.data.data);
              await AsyncStorage.setItem('auth_user', JSON.stringify(res.data.data));
            }
          } catch (err) {
            console.log('Token verification failed, clearing session.');
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('auth_user');
            setToken(null);
            setUser(null);
          }
        }
      } catch (e) {
        console.log('Failed to restore token:', e);
      } finally {
        clearTimeout(timeoutId);
        setIsLoading(false);
      }
    };

    bootstrapAsync();
  }, []);


  // Fungsi Login
  const login = async (username, password) => {
    const res = await apiClient.post('/auth/login', { username, password });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      await AsyncStorage.setItem('auth_token', receivedToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(receivedUser));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  // Fungsi Register
  const register = async (username, email, password, password_confirmation) => {
    const res = await apiClient.post('/auth/register', {
      username,
      email,
      password,
      password_confirmation,
    });
    return res.data;
  };

  // Fungsi Verifikasi OTP
  const verifyOtp = async (email, otp_code) => {
    const res = await apiClient.post('/auth/verify-otp', { email, otp_code });
    if (res.data.success) {
      const { token: receivedToken, user: receivedUser } = res.data.data;
      setToken(receivedToken);
      setUser(receivedUser);
      await AsyncStorage.setItem('auth_token', receivedToken);
      await AsyncStorage.setItem('auth_user', JSON.stringify(receivedUser));
      return { success: true };
    }
    return { success: false, message: res.data.message };
  };

  // Fungsi Resend OTP
  const resendOtp = async (email) => {
    const res = await apiClient.post('/auth/resend-otp', { email });
    return res.data;
  };

  // Fungsi Logout
  const logout = async () => {
    try {
      if (token) {
        await apiClient.post('/auth/logout');
      }
    } catch (e) {
      console.log('Logout error on server:', e);
    } finally {
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('auth_user');
      setToken(null);
      setUser(null);
    }
  };

  // Update profil user di context
  const refreshUser = async () => {
    try {
      const res = await apiClient.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.data);
        await AsyncStorage.setItem('auth_user', JSON.stringify(res.data.data));
      }
    } catch (e) {
      console.log('Failed to refresh user:', e);
    }
  };

  // Fungsi Update Profil (Nama, Email, Password, Foto Profil)
  const updateProfile = async (formData) => {
    const res = await apiClient.post('/auth/profile', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res.data.success) {
      setUser(res.data.data);
      await AsyncStorage.setItem('auth_user', JSON.stringify(res.data.data));
    }
    return res.data;
  };

  // Fungsi Hapus Foto Profil
  const deleteProfilePhoto = async () => {
    const res = await apiClient.delete('/auth/profile/photo');
    if (res.data.success) {
      setUser((prev) => ({
        ...prev,
        foto_profil: null,
        foto_profil_url: null,
      }));
      const stored = await AsyncStorage.getItem('auth_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.foto_profil = null;
        parsed.foto_profil_url = null;
        await AsyncStorage.setItem('auth_user', JSON.stringify(parsed));
      }
    }
    return res.data;
  };

  // Update Server URL
  const updateServerUrl = async (newUrl) => {
    await setCustomBaseUrl(newUrl);
    setApiUrl(newUrl);
  };

  // Fungsi Lupa Password (Kirim OTP ke email terdaftar)
  const forgotPassword = async (identifier) => {
    const res = await apiClient.post('/auth/forgot-password', { identifier });
    return res.data;
  };

  // Fungsi Reset Password Baru
  const resetPassword = async (email, otpCode, password, passwordConfirmation) => {
    const res = await apiClient.post('/auth/reset-password', {
      email,
      otp_code: otpCode,
      password,
      password_confirmation: passwordConfirmation,
    });
    return res.data;
  };

  // Fungsi Kirim Ulang OTP Reset Password
  const resendResetOtp = async (email) => {
    const res = await apiClient.post('/auth/resend-reset-otp', { email });
    return res.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        apiUrl,
        login,
        register,
        verifyOtp,
        resendOtp,
        forgotPassword,
        resetPassword,
        resendResetOtp,
        logout,
        refreshUser,
        updateProfile,
        deleteProfilePhoto,
        updateServerUrl,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
