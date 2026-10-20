import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS, SHADOWS } from '../theme';

/**
 * Modern Ergonomic Button Component
 * Touch target minimum >= 44pt (standar Apple HIG & Android Material),
 * dukungan micro-interaction, feedback visual, loading spinner terintegrasi, dan varian tema.
 */
export default function ModernButton({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'medium',     // 'small' | 'medium' | 'large'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) {
  const isInteractive = !loading && !disabled;

  // Resolusi Warna Background & Border berdasarkan Variant
  let btnBackground = COLORS.primary;
  let btnBorderColor = 'transparent';
  let btnTextColor = COLORS.white;
  let shadowStyle = SHADOWS.sm;

  switch (variant) {
    case 'secondary':
      btnBackground = COLORS.secondary;
      btnTextColor = COLORS.white;
      break;
    case 'outline':
      btnBackground = 'transparent';
      btnBorderColor = COLORS.border;
      btnTextColor = COLORS.text;
      shadowStyle = SHADOWS.none;
      break;
    case 'ghost':
      btnBackground = 'transparent';
      btnTextColor = COLORS.primary;
      shadowStyle = SHADOWS.none;
      break;
    case 'danger':
      btnBackground = COLORS.danger;
      btnTextColor = COLORS.white;
      break;
    case 'success':
      btnBackground = COLORS.success;
      btnTextColor = COLORS.white;
      break;
    default:
      btnBackground = COLORS.primary;
      btnTextColor = COLORS.white;
      break;
  }

  // Resolusi Ukuran & Touch Target
  let minHeight = 48; // Standar aman di atas 44pt
  let paddingHorizontal = SPACING.xl;
  let fontSize = TYPOGRAPHY.size.base;

  if (size === 'small') {
    minHeight = 44;
    paddingHorizontal = SPACING.lg;
    fontSize = TYPOGRAPHY.size.sm;
  } else if (size === 'large') {
    minHeight = 54;
    paddingHorizontal = SPACING['2xl'];
    fontSize = TYPOGRAPHY.size.md;
  }

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={onPress}
      disabled={!isInteractive}
      style={[
        styles.buttonBase,
        {
          backgroundColor: btnBackground,
          borderColor: btnBorderColor,
          minHeight,
          paddingHorizontal,
        },
        shadowStyle,
        disabled && styles.buttonDisabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={fontSize + 2}
              color={btnTextColor}
              style={styles.iconLeft}
            />
          )}

          <Text
            style={[
              styles.buttonText,
              {
                color: btnTextColor,
                fontSize,
              },
              textStyle,
            ]}
          >
            {title}
          </Text>

          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={fontSize + 2}
              color={btnTextColor}
              style={styles.iconRight}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontWeight: TYPOGRAPHY.weight.bold,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  iconLeft: {
    marginRight: SPACING.sm,
  },
  iconRight: {
    marginLeft: SPACING.sm,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});
