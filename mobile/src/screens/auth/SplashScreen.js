import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { COLORS } from '../../config';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.iconCircle}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>SPMB ONLINE</Text>
        <Text style={styles.subtitle}>SMP DHARMA BAKTI</Text>
      </View>
      <View style={styles.footer}>
        <ActivityIndicator size="large" color={COLORS.secondary} />
        <Text style={styles.loadingText}>Memuat aplikasi...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 80,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    overflow: 'hidden',
  },
  logoImage: {
    width: 90,
    height: 90,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.white,
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 6,
    letterSpacing: 1.5,
  },
  footer: {
    alignItems: 'center',
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    marginTop: 12,
  },
});
