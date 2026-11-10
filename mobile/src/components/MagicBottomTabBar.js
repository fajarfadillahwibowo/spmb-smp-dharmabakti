import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Konfigurasi Ikon dan Label Tab untuk seluruh Role
 */
const TAB_CONFIG = {
  // ---- SISWA ----
  TabHome: { icon: 'home', iconOutline: 'home-outline', label: 'Home' },
  TabDaftar: { icon: 'document-text', iconOutline: 'document-text-outline', label: 'Daftar' },
  TabDokumen: { icon: 'file-tray-full', iconOutline: 'file-tray-full-outline', label: 'Dokumen' },
  TabSeleksi: { icon: 'checkmark-circle', iconOutline: 'checkmark-circle-outline', label: 'Seleksi' },
  TabInfo: { icon: 'megaphone', iconOutline: 'megaphone-outline', label: 'Info' },
  TabBayar: { icon: 'card', iconOutline: 'card-outline', label: 'Bayar' },

  // ---- ADMIN ----
  TabAdminHome: { icon: 'home', iconOutline: 'home-outline', label: 'Home' },
  TabPendaftar: { icon: 'people', iconOutline: 'people-outline', label: 'Pendaftar' },
  TabBerkas: { icon: 'document-attach', iconOutline: 'document-attach-outline', label: 'Berkas' },
  TabAdminSeleksi: { icon: 'school', iconOutline: 'school-outline', label: 'Seleksi' },
  TabAdminBayar: { icon: 'card', iconOutline: 'card-outline', label: 'Bayar' },
  TabLaporan: { icon: 'bar-chart', iconOutline: 'bar-chart-outline', label: 'Laporan' },

  // ---- KEPALA SEKOLAH ----
  TabKepsekOverview: { icon: 'stats-chart', iconOutline: 'stats-chart-outline', label: 'Overview' },
  TabKepsekPendaftar: { icon: 'people', iconOutline: 'people-outline', label: 'Pendaftar' },
  TabKepsekKeuangan: { icon: 'cash', iconOutline: 'cash-outline', label: 'Keuangan' },
};

/**
 * MagicBottomTabBar
 * Mengimplementasikan "Magic Navigation Menu Indicator" yang viral di TikTok (Code!nk):
 * - Floating dock dengan rounded pill shape & glass shadow
 * - Circular active indicator (bubble) yang meluncur mulus ke tab yang dipilih
 * - Active icon terangkat ke atas (elevated) tepat ke dalam circular bubble
 * - Active text label muncul di bawahnya secara halus (fade + scale)
 * - Transisi spring 60 FPS hardware accelerated
 */
export default function MagicBottomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const routes = state.routes;
  const numTabs = routes.length;

  // Ukuran indikator proporsional terhadap jumlah tab
  const indicatorSize = numTabs <= 4 ? 54 : 48;
  const iconBaseSize = numTabs <= 4 ? 23 : 21;

  // Lebar dock terukur (diberi nilai awal agar langsung tampil tanpa menunggu onLayout)
  const windowWidth = Dimensions.get('window').width || 390;
  const initialDockWidth = Math.min(windowWidth * 0.94, 480);
  const [dockWidth, setDockWidth] = useState(initialDockWidth);
  const isInitialized = useRef(false);

  // Animasi posisi X indikator bulat
  const initialTabWidth = initialDockWidth / (numTabs || 1);
  const initialTargetX = state.index * initialTabWidth + (initialTabWidth - indicatorSize) / 2;
  const indicatorAnim = useRef(new Animated.Value(initialTargetX)).current;

  // Animasi per-tab (0 = inactive, 1 = active)
  const tabAnims = useRef(
    routes.map((_, i) => new Animated.Value(i === state.index ? 1 : 0))
  ).current;

  // Jalankan animasi saat tab aktif berubah atau lebar dock terukur
  useEffect(() => {
    if (dockWidth > 0) {
      const tabWidth = dockWidth / numTabs;
      const targetX = state.index * tabWidth + (tabWidth - indicatorSize) / 2;

      if (!isInitialized.current) {
        indicatorAnim.setValue(targetX);
        isInitialized.current = true;
      } else {
        Animated.spring(indicatorAnim, {
          toValue: targetX,
          tension: 68,
          friction: 9,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      }

      // Animasi item tabs
      routes.forEach((_, i) => {
        Animated.spring(tabAnims[i], {
          toValue: i === state.index ? 1 : 0,
          tension: 72,
          friction: 10,
          useNativeDriver: Platform.OS !== 'web',
        }).start();
      });
    }
  }, [state.index, dockWidth, numTabs]);

  const onDockLayout = (e) => {
    const { width } = e.nativeEvent.layout;
    if (width > 0 && Math.abs(width - dockWidth) > 1) {
      setDockWidth(width);
    }
  };

  const handleTabPress = (route, index, isFocused) => {
    const event = navigation.emit({
      type: 'tabPress',
      target: route.key,
      canPreventDefault: true,
    });

    if (!isFocused && !event.defaultPrevented) {
      navigation.navigate(route.name);
    }
  };

  const handleTabLongPress = (route) => {
    navigation.emit({
      type: 'tabLongPress',
      target: route.key,
    });
  };

  const bottomPadding = Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : 12;

  return (
    <View style={[styles.outerWrapper, { paddingBottom: bottomPadding }]} pointerEvents="box-none">
      <View
        style={styles.dock}
        onLayout={onDockLayout}
      >
        {/* MAGIC INDICATOR BUBBLE (Sliding Floating Circle) */}
        {dockWidth > 0 && (
          <Animated.View
            style={[
              styles.indicatorWrapper,
              {
                width: indicatorSize,
                height: indicatorSize,
                borderRadius: indicatorSize / 2,
                transform: [{ translateX: indicatorAnim }],
              },
            ]}
            pointerEvents="none"
          >
            {/* Outer Notch Ring (Matches dock bg and screen outline) */}
            <View
              style={[
                styles.indicatorOuterRing,
                {
                  width: indicatorSize,
                  height: indicatorSize,
                  borderRadius: indicatorSize / 2,
                },
              ]}
            >
              {/* Inner Glowing Bubble */}
              <View
                style={[
                  styles.indicatorBubble,
                  {
                    width: indicatorSize - 8,
                    height: indicatorSize - 8,
                    borderRadius: (indicatorSize - 8) / 2,
                  },
                ]}
              >
                {/* Glossy Top Shine Highlight */}
                <View style={styles.bubbleShine} />
              </View>
            </View>
          </Animated.View>
        )}

        {/* TAB BUTTONS */}
        {routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const config = TAB_CONFIG[route.name] || {
            icon: 'ellipse',
            iconOutline: 'ellipse-outline',
            label: options.tabBarLabel || route.name,
          };
          const label = options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : config.label;

          const tabAnim = tabAnims[index] || new Animated.Value(isFocused ? 1 : 0);

          // Icon elevation animation (-20px upwards into the floating bubble)
          const iconTranslateY = tabAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0, -20],
          });

          // Icon scale animation
          const iconScale = tabAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 1.12],
          });

          // Label opacity & slide animation
          const labelOpacity = tabAnim.interpolate({
            inputRange: [0, 0.4, 1],
            outputRange: [0, 0, 1],
          });

          const labelTranslateY = tabAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [8, 0],
          });

          const labelScale = tabAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [0.75, 1],
          });

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => handleTabPress(route, index, isFocused)}
              onLongPress={() => handleTabLongPress(route)}
              style={styles.tabButton}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
            >
              {/* Active / Inactive Animated Icon */}
              <Animated.View
                style={[
                  styles.iconWrap,
                  {
                    transform: [
                      { translateY: iconTranslateY },
                      { scale: iconScale },
                    ],
                  },
                ]}
              >
                <Ionicons
                  name={isFocused ? config.icon : config.iconOutline}
                  size={isFocused ? iconBaseSize + 1 : iconBaseSize}
                  color={isFocused ? '#FFFFFF' : '#94A3B8'}
                />
              </Animated.View>

              {/* Active Label Container */}
              <Animated.View
                style={[
                  styles.labelWrap,
                  {
                    opacity: labelOpacity,
                    transform: [
                      { translateY: labelTranslateY },
                      { scale: labelScale },
                    ],
                  },
                ]}
              >
                <Text
                  style={[
                    styles.labelText,
                    isFocused && styles.activeLabelText,
                  ]}
                  numberOfLines={1}
                >
                  {label}
                </Text>
                <View style={styles.activeDot} />
              </Animated.View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerWrapper: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    backgroundColor: 'transparent',
    paddingTop: 24, // Ruang atas agar indikator bulat tidak terpotong sistem Android
    zIndex: 9999,
    width: '100%',
  },
  dock: {
    width: '94%',
    maxWidth: 480,
    height: 62,
    backgroundColor: '#0F172A', // Royal Midnight Navy
    borderRadius: 30, // Bentuk floating pill modern
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    position: 'relative',
    // 3D Shadow & Glow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 16,
    borderWidth: 1.2,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    ...(Platform.OS === 'web' ? { pointerEvents: 'auto' } : {}),
  },
  indicatorWrapper: {
    position: 'absolute',
    top: -18, // Mengapung 18px di atas dock navbar
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  indicatorOuterRing: {
    backgroundColor: '#0F172A',
    borderWidth: 3.5,
    borderColor: '#F8FAFC', // Notch cutout border
    alignItems: 'center',
    justifyContent: 'center',
    // Halo glow
    shadowColor: '#0284C7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    elevation: 12,
  },
  indicatorBubble: {
    backgroundColor: '#0284C7', // Sky Blue cerah
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bubbleShine: {
    position: 'absolute',
    top: 4,
    width: '60%',
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.38)',
  },
  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 5,
  },
  iconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  labelWrap: {
    position: 'absolute',
    bottom: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.2,
  },
  activeLabelText: {
    color: '#38BDF8', // Cyan cerah untuk teks aktif
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#38BDF8',
    marginTop: 2,
  },
});
