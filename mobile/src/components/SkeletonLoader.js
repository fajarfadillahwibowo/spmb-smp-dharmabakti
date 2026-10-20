import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../theme';

/**
 * Skeleton Loader Component
 * Menghasilkan efek pulsing loading modern yang halus dan natural tanpa dependency pihak ketiga.
 */
export default function SkeletonLoader({ width = '100%', height = 20, borderRadius = RADIUS.sm, style }) {
  const opacityAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.85,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.35,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
}

/**
 * Skeleton Card Preset untuk simulasi pemuatan kartu data
 */
export function SkeletonCard({ height = 120, style }) {
  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.cardHeader}>
        <SkeletonLoader width={44} height={44} borderRadius={RADIUS.md} />
        <View style={styles.cardHeaderTexts}>
          <SkeletonLoader width="65%" height={16} borderRadius={RADIUS.xs} />
          <SkeletonLoader width="40%" height={12} borderRadius={RADIUS.xs} style={{ marginTop: 8 }} />
        </View>
      </View>
      <SkeletonLoader width="90%" height={12} borderRadius={RADIUS.xs} style={{ marginTop: SPACING.md }} />
    </View>
  );
}

/**
 * Skeleton Dashboard Preset untuk halaman utama
 */
export function SkeletonDashboard() {
  return (
    <View style={styles.dashboardContainer}>
      {/* Header Banner Skeleton */}
      <View style={styles.heroSkeleton}>
        <SkeletonLoader width="50%" height={22} borderRadius={RADIUS.sm} />
        <SkeletonLoader width="70%" height={16} borderRadius={RADIUS.xs} style={{ marginTop: 8 }} />
        <SkeletonLoader width="100%" height={80} borderRadius={RADIUS.lg} style={{ marginTop: SPACING.lg }} />
      </View>

      {/* Steps List Skeletons */}
      <View style={styles.sectionContainer}>
        <SkeletonLoader width="45%" height={18} borderRadius={RADIUS.xs} style={{ marginBottom: SPACING.sm }} />
        <SkeletonLoader width="75%" height={13} borderRadius={RADIUS.xs} style={{ marginBottom: SPACING.lg }} />

        <SkeletonCard style={{ marginBottom: SPACING.md }} />
        <SkeletonCard style={{ marginBottom: SPACING.md }} />
        <SkeletonCard style={{ marginBottom: SPACING.md }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: '#E2E8F0',
  },
  cardContainer: {
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardHeaderTexts: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  dashboardContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroSkeleton: {
    backgroundColor: COLORS.primaryDark,
    paddingTop: 54,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
    borderBottomLeftRadius: RADIUS.xl,
    borderBottomRightRadius: RADIUS.xl,
  },
  sectionContainer: {
    padding: SPACING.xl,
  },
});
