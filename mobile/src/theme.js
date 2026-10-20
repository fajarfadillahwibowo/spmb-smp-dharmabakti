import { Platform } from 'react-native';

/**
 * SPMB Modern Design System Tokens
 * Clean UI, Modern Rounded Geometry, Diffused Shadows, and Ergonomic Accessibility
 */
export const COLORS = {
  // Brand Primary (Modern Vibrant Indigo & Royal Slate)
  primary: '#2563EB',        // Blue 600 - Main action, links, key accents
  primaryDark: '#1E3A8A',    // Blue 900 - Deep headers, emphasis
  primaryHover: '#1D4ED8',   // Blue 700
  primaryLight: '#60A5FA',   // Blue 400
  primarySoft: '#EFF6FF',    // Blue 50 - Background accents, active tabs
  primarySurface: '#DBEAFE', // Blue 100

  // Secondary / Golden Amber (Prestise & Akreditasi)
  secondary: '#F59E0B',      // Amber 500
  secondaryDark: '#B45309',  // Amber 700
  secondarySoft: '#FFFBEB',  // Amber 50
  gold: '#D97706',

  // Status & Feedback Semantics
  success: '#10B981',        // Emerald 500
  successDark: '#047857',    // Emerald 700
  successSoft: '#ECFDF5',    // Emerald 50
  
  danger: '#EF4444',         // Red 500
  dangerDark: '#B91C1C',     // Red 700
  dangerSoft: '#FEF2F2',     // Red 50

  warning: '#F59E0B',        // Amber 500
  warningDark: '#B45309',    // Amber 700
  warningSoft: '#FFFBEB',    // Amber 50

  info: '#0EA5E9',           // Sky 500
  infoDark: '#0369A1',       // Sky 700
  infoSoft: '#F0F9FF',       // Sky 50

  // Surface & Layout
  background: '#F8FAFC',     // Slate 50 - Clean airy canvas
  card: '#FFFFFF',           // Pure White card
  cardSubtle: '#F1F5F9',     // Slate 100
  surface: '#FFFFFF',

  // Borders & Dividers
  border: '#E2E8F0',         // Slate 200
  borderLight: '#F1F5F9',    // Slate 100
  borderFocus: '#93C5FD',    // Blue 300

  // Typography Scale Colors
  text: '#0F172A',           // Slate 900 - Highest contrast
  textSecondary: '#334155',  // Slate 700 - Body readability
  textMuted: '#64748B',      // Slate 500 - Secondary info, captions
  textSubtle: '#94A3B8',     // Slate 400 - Placeholders, disabled icons
  white: '#FFFFFF',
};

export const TYPOGRAPHY = {
  size: {
    xs: 11,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 28,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extraBold: '800',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
};

export const RADIUS = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
  '2xl': 32,
  full: 9999,
};

export const SHADOWS = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  md: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 14,
    elevation: 4,
  },
  lg: {
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.1,
    shadowRadius: 24,
    elevation: 8,
  },
  card: {
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
};
