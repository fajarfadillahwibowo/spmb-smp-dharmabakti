import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { View, Text, ActivityIndicator, StyleSheet, Platform, Image } from 'react-native';

// Top Navbar & FAB Component
import TopNavbar from '../components/TopNavbar';
import FloatingChatButton from '../components/FloatingChatButton';
import MagicBottomTabBar from '../components/MagicBottomTabBar';

// Screens Chat
import ChatSiswaScreen from '../screens/chat/ChatSiswaScreen';
import AdminChatListScreen from '../screens/chat/AdminChatListScreen';
import AdminChatDetailScreen from '../screens/chat/AdminChatDetailScreen';

// Screens Auth
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import ProfileScreen from '../screens/auth/ProfileScreen';

// Screens Siswa
import SiswaDashboard from '../screens/siswa/SiswaDashboard';
import FormulirScreen from '../screens/siswa/FormulirScreen';
import UploadDokumenScreen from '../screens/siswa/UploadDokumenScreen';
import SeleksiScreen from '../screens/siswa/SeleksiScreen';
import PengumumanScreen from '../screens/siswa/PengumumanScreen';
import CetakBuktiScreen from '../screens/siswa/CetakBuktiScreen';
import PembayaranScreen from '../screens/siswa/PembayaranScreen';

// Screens Admin
import AdminDashboard from '../screens/admin/AdminDashboard';
import DataPendaftarScreen from '../screens/admin/DataPendaftarScreen';
import DetailPendaftarScreen from '../screens/admin/DetailPendaftarScreen';
import VerifikasiBerkasScreen from '../screens/admin/VerifikasiBerkasScreen';
import VerifikasiSeleksiScreen from '../screens/admin/VerifikasiSeleksiScreen';
import VerifikasiPembayaranScreen from '../screens/admin/VerifikasiPembayaranScreen';
import LaporanScreen from '../screens/admin/LaporanScreen';
// Screens Kepala Sekolah
import KepalaSekolahDashboard from '../screens/kepala_sekolah/KepalaSekolahDashboard';
import MonitoringPendaftarScreen from '../screens/kepala_sekolah/MonitoringPendaftarScreen';
import MonitoringKeuanganScreen from '../screens/kepala_sekolah/MonitoringKeuanganScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ============================================================
// Konfigurasi Header Stack Global (untuk sub-screen detail)
// ============================================================
const stackScreenOptions = {
  headerStyle: {
    backgroundColor: '#172554', // Dark royal navy blue
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTintColor: '#FFFFFF',
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 16,
  },
  headerBackTitleVisible: false,
};

// ============================================================
// Konfigurasi Bottom Tab Navigator
// ============================================================
const tabBarStyle = {
  backgroundColor: '#172554', // Dark royal navy blue
  borderTopWidth: 1,
  borderTopColor: 'rgba(255, 255, 255, 0.08)',
  height: Platform.OS === 'ios' ? 78 : 62,
  paddingBottom: Platform.OS === 'ios' ? 20 : 6,
  paddingTop: 6,
  elevation: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.2,
  shadowRadius: 10,
};

const getTabScreenOptions = ({ route }) => ({
  header: (props) => <TopNavbar {...props} />,
  tabBarIcon: ({ focused, color }) => {
    let iconName;
    const iconSize = 22;

    // ---- Siswa Tabs ----
    if (route.name === 'TabHome') iconName = focused ? 'home' : 'home-outline';
    else if (route.name === 'TabDaftar') iconName = focused ? 'document-text' : 'document-text-outline';
    else if (route.name === 'TabDokumen') iconName = focused ? 'file-tray-full' : 'file-tray-full-outline';
    else if (route.name === 'TabSeleksi') iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
    else if (route.name === 'TabInfo') iconName = focused ? 'megaphone' : 'megaphone-outline';
    else if (route.name === 'TabBayar') iconName = focused ? 'card' : 'card-outline';

    // ---- Admin Tabs ----
    else if (route.name === 'TabAdminHome') iconName = focused ? 'home' : 'home-outline';
    else if (route.name === 'TabPendaftar') iconName = focused ? 'people' : 'people-outline';
    else if (route.name === 'TabBerkas') iconName = focused ? 'document-attach' : 'document-attach-outline';
    else if (route.name === 'TabAdminSeleksi') iconName = focused ? 'school' : 'school-outline';
    else if (route.name === 'TabAdminBayar') iconName = focused ? 'card' : 'card-outline';
    else if (route.name === 'TabLaporan') iconName = focused ? 'bar-chart' : 'bar-chart-outline';

    // ---- Kepala Sekolah Tabs ----
    else if (route.name === 'TabKepsekOverview') iconName = focused ? 'stats-chart' : 'stats-chart-outline';
    else if (route.name === 'TabKepsekPendaftar') iconName = focused ? 'people' : 'people-outline';
    else if (route.name === 'TabKepsekKeuangan') iconName = focused ? 'cash' : 'cash-outline';
    else if (route.name === 'TabKepsekLaporan') iconName = focused ? 'document-text' : 'document-text-outline';

    return (
      <View style={focused ? styles.activeIconWrap : styles.iconWrap}>
        <Ionicons name={iconName} size={iconSize} color={color} />
      </View>
    );
  },
  tabBarActiveTintColor: '#38BDF8', // Vibrant Sky Blue active highlight
  tabBarInactiveTintColor: '#94A3B8', // Inactive slate grey
  tabBarLabelStyle: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  tabBarStyle: tabBarStyle,
});

// ============================================================
// SISWA: Bottom Tab Navigator
// ============================================================
function SiswaTabNavigator() {
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Tab.Navigator
        initialRouteName="TabHome"
        tabBar={(props) => <MagicBottomTabBar {...props} />}
        sceneContainerStyle={{ paddingBottom: 84 }}
        screenOptions={getTabScreenOptions}
      >
        <Tab.Screen
          name="TabHome"
          component={SiswaDashboard}
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen
          name="TabDaftar"
          component={FormulirScreen}
          options={{ tabBarLabel: 'Daftar' }}
        />
        <Tab.Screen
          name="TabDokumen"
          component={UploadDokumenScreen}
          options={{ tabBarLabel: 'Dokumen' }}
        />
        <Tab.Screen
          name="TabSeleksi"
          component={SeleksiScreen}
          options={{ tabBarLabel: 'Seleksi' }}
        />
        <Tab.Screen
          name="TabInfo"
          component={PengumumanScreen}
          options={{ tabBarLabel: 'Info' }}
        />
        <Tab.Screen
          name="TabBayar"
          component={PembayaranScreen}
          options={{ tabBarLabel: 'Bayar' }}
        />
      </Tab.Navigator>
      <FloatingChatButton />
    </View>
  );
}

// ============================================================
// ADMIN: Bottom Tab Navigator
// ============================================================
function AdminTabNavigator() {
  return (
    <View style={{ flex: 1, position: 'relative' }}>
      <Tab.Navigator
        tabBar={(props) => <MagicBottomTabBar {...props} />}
        sceneContainerStyle={{ paddingBottom: 84 }}
        screenOptions={getTabScreenOptions}
      >
        <Tab.Screen
          name="TabAdminHome"
          component={AdminDashboard}
          options={{ tabBarLabel: 'Home' }}
        />
        <Tab.Screen
          name="TabPendaftar"
          component={DataPendaftarScreen}
          options={{ tabBarLabel: 'Pendaftar' }}
        />
        <Tab.Screen
          name="TabBerkas"
          component={VerifikasiBerkasScreen}
          options={{ tabBarLabel: 'Berkas' }}
        />
        <Tab.Screen
          name="TabAdminSeleksi"
          component={VerifikasiSeleksiScreen}
          options={{ tabBarLabel: 'Seleksi' }}
        />
        <Tab.Screen
          name="TabAdminBayar"
          component={VerifikasiPembayaranScreen}
          options={{ tabBarLabel: 'Bayar' }}
        />
        <Tab.Screen
          name="TabLaporan"
          component={LaporanScreen}
          options={{ tabBarLabel: 'Laporan' }}
        />
      </Tab.Navigator>
      <FloatingChatButton />
    </View>
  );
}

// ============================================================
// KEPALA SEKOLAH: Bottom Tab Navigator (Supervisory / Read-Only)
// ============================================================
function KepalaSekolahTabNavigator() {
  return (
    <View style={{ flex: 1 }}>
      <Tab.Navigator
        tabBar={(props) => <MagicBottomTabBar {...props} />}
        sceneContainerStyle={{ paddingBottom: 76 }}
        screenOptions={getTabScreenOptions}
      >
        <Tab.Screen
          name="TabKepsekOverview"
          component={KepalaSekolahDashboard}
          options={{ tabBarLabel: 'Overview' }}
        />
        <Tab.Screen
          name="TabKepsekPendaftar"
          component={MonitoringPendaftarScreen}
          options={{ tabBarLabel: 'Pendaftar' }}
        />
        <Tab.Screen
          name="TabKepsekKeuangan"
          component={MonitoringKeuanganScreen}
          options={{ tabBarLabel: 'Keuangan' }}
        />
        <Tab.Screen
          name="TabKepsekLaporan"
          component={LaporanScreen}
          options={{ tabBarLabel: 'Laporan Rekap' }}
        />
      </Tab.Navigator>
    </View>
  );
}

// ============================================================
// NAVIGATOR UTAMA
// ============================================================
export default function AppNavigator() {
  const { user, token, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={loadingStyles.container}>
        <View style={loadingStyles.iconCircle}>
          <Image
            source={require('../../assets/logo.png')}
            style={loadingStyles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={loadingStyles.title}>SPMB ONLINE</Text>
        <Text style={loadingStyles.subtitle}>SMP DHARMA BAKTI</Text>
        <ActivityIndicator size="large" color="#F59E0B" style={{ marginTop: 40 }} />
        <Text style={loadingStyles.loadingText}>Memuat aplikasi...</Text>
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={stackScreenOptions}>
        {!token ? (
          // ==========================================
          // AUTH STACK (Belum Login)
          // ==========================================
          <>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Register"
              component={RegisterScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Otp"
              component={OtpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="ForgotPassword"
              component={ForgotPasswordScreen}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            {user?.role === 'admin' ? (
              // ==========================================
              // ADMIN: Tab Navigator + Detail Sub-screens
              // ==========================================
              <>
                <Stack.Screen
                  name="AdminTabs"
                  component={AdminTabNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="DetailPendaftar"
                  component={DetailPendaftarScreen}
                  options={{ title: 'Rincian Pendaftar' }}
                />
                <Stack.Screen
                  name="AdminChatList"
                  component={AdminChatListScreen}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="AdminChatDetail"
                  component={AdminChatDetailScreen}
                  options={{ headerShown: false }}
                />
              </>
            ) : user?.role === 'kepala_sekolah' ? (
              // ==========================================
              // KEPALA SEKOLAH: Tab Navigator (Read-Only)
              // ==========================================
              <>
                <Stack.Screen
                  name="KepsekTabs"
                  component={KepalaSekolahTabNavigator}
                  options={{ headerShown: false }}
                />
              </>
            ) : (
              // ==========================================
              // SISWA: Tab Navigator + Detail Sub-screens
              // ==========================================
              <>
                <Stack.Screen
                  name="SiswaTabs"
                  component={SiswaTabNavigator}
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="CetakBukti"
                  component={CetakBuktiScreen}
                  options={{ title: 'Cetak Bukti Penerimaan' }}
                />
                <Stack.Screen
                  name="ChatSiswa"
                  component={ChatSiswaScreen}
                  options={{ headerShown: false }}
                />
              </>
            )}

            {/* Profile Screen (Dapat diakses oleh semua role) */}
            <Stack.Screen
              name="Profile"
              component={ProfileScreen}
              options={{ headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  activeIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#172554',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100%',
    width: '100%',
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    overflow: 'hidden',
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#F59E0B',
    marginTop: 6,
    letterSpacing: 1.5,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginTop: 12,
  },
});
