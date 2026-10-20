import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';
import ModernButton from './ModernButton';

/**
 * Empty State Component
 * Ditampilkan saat data kosong, belum ada pengumuman, atau belum ada dokumen.
 */
export default function EmptyState({
  icon = 'folder-open-outline',
  title = 'Belum Ada Data',
  description = 'Data yang Anda cari saat ini belum tersedia atau belum diinput.',
  actionText,
  onActionPress,
  style,
}) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={42} color={COLORS.primary} />
      </View>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionText && onActionPress ? (
        <ModernButton
          title={actionText}
          onPress={onActionPress}
          variant="primary"
          size="medium"
          style={styles.actionBtn}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: SPACING['2xl'],
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.xl,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    marginVertical: SPACING.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.size.lg,
    fontWeight: TYPOGRAPHY.weight.bold,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 280,
  },
  actionBtn: {
    marginTop: SPACING.xl,
    minWidth: 160,
  },
});
