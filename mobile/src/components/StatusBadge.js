import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, TYPOGRAPHY, RADIUS, SPACING } from '../theme';

/**
 * Modern Status Badge Component
 * Pill modern dengan dot indicator, warna semantik lembut, dan tipografi tegas.
 */
export default function StatusBadge({ status, label, size = 'medium' }) {
  let bg = '#F1F5F9';
  let textColor = '#475569';
  let dotColor = '#94A3B8';
  let displayLabel = label;

  switch (status?.toLowerCase()) {
    case 'terverifikasi':
    case 'diterima':
    case 'lunas':
    case 'sudah_lengkap':
    case 'aktif':
      bg = '#DCFCE7';      // Green 100
      textColor = '#15803D'; // Green 700
      dotColor = '#16A34A';  // Green 600
      displayLabel = displayLabel || (status === 'sudah_lengkap' ? 'SUDAH LENGKAP' : status.toUpperCase());
      break;

    case 'menunggu_verifikasi':
    case 'menunggu':
    case 'proses':
    case 'cicilan':
      bg = '#FEF3C7';      // Amber 100
      textColor = '#B45309'; // Amber 700
      dotColor = '#D97706';  // Amber 600
      displayLabel = displayLabel || (status === 'menunggu_verifikasi' ? 'MENUNGGU VERIFIKASI' : status.toUpperCase());
      break;

    case 'ditolak':
    case 'tidak_diterima':
    case 'belum_lengkap':
    case 'gagal':
      bg = '#FEE2E2';      // Red 100
      textColor = '#B91C1C'; // Red 700
      dotColor = '#DC2626';  // Red 600
      displayLabel = displayLabel || (status === 'belum_lengkap' ? 'BELUM LENGKAP' : status.toUpperCase());
      break;

    case 'draft':
    case 'baru':
      bg = '#EFF6FF';      // Blue 50
      textColor = '#1D4ED8'; // Blue 700
      dotColor = '#2563EB';
      displayLabel = displayLabel || status.toUpperCase();
      break;

    default:
      displayLabel = displayLabel || status || '-';
  }

  const isSmall = size === 'small';

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: bg,
          paddingHorizontal: isSmall ? 8 : 10,
          paddingVertical: isSmall ? 3 : 5,
        },
      ]}
    >
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text
        style={[
          styles.badgeText,
          {
            color: textColor,
            fontSize: isSmall ? TYPOGRAPHY.size.xs - 1 : TYPOGRAPHY.size.xs,
          },
        ]}
      >
        {displayLabel?.replace(/_/g, ' ')}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: RADIUS.full,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  badgeText: {
    fontWeight: TYPOGRAPHY.weight.bold,
    letterSpacing: 0.5,
  },
});
