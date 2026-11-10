import { StyleSheet, Platform } from 'react-native';

/**
 * SPMB 3D Modern Design System Tokens & Style Presets
 * Claymorphic & Neo-Skeuomorphic 3D Aesthetics with Physical Tactile Depth
 */
export const PALETTE_3D = {
  // Vibrant 3D Primary (Sapphire & Electric Cyan)
  blue: {
    base: '#2563EB',
    dark: '#1D4ED8',
    darker: '#1E3A8A',
    light: '#60A5FA',
    soft: '#EFF6FF',
    shadow: 'rgba(37, 99, 235, 0.35)',
    borderBottom: '#1D4ED8',
  },
  // 3D Emerald / Mint (Success & Approval)
  emerald: {
    base: '#10B981',
    dark: '#059669',
    darker: '#065F46',
    light: '#34D399',
    soft: '#ECFDF5',
    shadow: 'rgba(16, 185, 129, 0.35)',
    borderBottom: '#047857',
  },
  // 3D Amber / Sunset (Prestise, Notice, Pending)
  amber: {
    base: '#F59E0B',
    dark: '#D97706',
    darker: '#92400E',
    light: '#FBBF24',
    soft: '#FFFBEB',
    shadow: 'rgba(245, 158, 11, 0.35)',
    borderBottom: '#B45309',
  },
  // 3D Violet / Cyber Orchid (Seleksi & Prestasi)
  violet: {
    base: '#8B5CF6',
    dark: '#7C3AED',
    darker: '#5B21B6',
    light: '#A78BFA',
    soft: '#F5F3FF',
    shadow: 'rgba(139, 92, 246, 0.35)',
    borderBottom: '#6D28D9',
  },
  // 3D Rose / Crimson (Alert & Urgent)
  rose: {
    base: '#EF4444',
    dark: '#DC2626',
    darker: '#991B1B',
    light: '#F87171',
    soft: '#FEF2F2',
    shadow: 'rgba(239, 68, 68, 0.35)',
    borderBottom: '#B91C1C',
  },
  // 3D Cyan / Glacier
  cyan: {
    base: '#06B6D4',
    dark: '#0891B2',
    darker: '#155E75',
    light: '#22D3EE',
    soft: '#ECFEFF',
    shadow: 'rgba(6, 182, 212, 0.35)',
    borderBottom: '#0e7490',
  },
  // 3D Dark Canvas / Slate
  dark: {
    canvas: '#0B0F19',
    surface: '#111827',
    surfaceElevated: '#1F2937',
    surfaceGlass: 'rgba(30, 41, 59, 0.75)',
    border: 'rgba(255, 255, 255, 0.08)',
    borderLight: 'rgba(255, 255, 255, 0.15)',
  },
  // 3D Light Canvas / Neumorphic Clay
  light: {
    canvas: '#F1F5F9',
    card: '#FFFFFF',
    cardElevated: '#FFFFFF',
    border: '#E2E8F0',
    borderBottomExtrude: '#CBD5E1',
    textMain: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
  },
};

export const STYLES_3D = StyleSheet.create({
  // Claymorphic / 3D Extruded Card
  card3D: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderBottomWidth: 4,
    borderBottomColor: '#CBD5E1',
    padding: 20,
    marginBottom: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 12px 24px -6px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.04)',
      },
      default: {
        shadowColor: '#0F172A',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
      },
    }),
  },

  // 3D Hero / Holographic Card (Deep Gradient Look)
  cardHero3D: {
    backgroundColor: '#1E3A8A',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderBottomWidth: 5,
    borderBottomColor: '#172554',
    padding: 22,
    marginBottom: 20,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      web: {
        boxShadow: '0 20px 35px -8px rgba(30, 58, 138, 0.45), 0 6px 12px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: '#1E3A8A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
      },
    }),
  },

  // Specular light bar reflection (Glow top-edge for realistic glass / clay)
  specularHighlight: {
    position: 'absolute',
    top: 0,
    left: 20,
    right: 20,
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
    borderRadius: 999,
  },

  // 3D Spherical Orb Container (for icons & avatars)
  orb3D: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderBottomWidth: 4,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 18px -4px rgba(0, 0, 0, 0.22), inset 0 3px 5px rgba(255, 255, 255, 0.4)',
      },
      default: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
        elevation: 5,
      },
    }),
  },

  // Specular reflection inside orb
  orbShine: {
    position: 'absolute',
    top: 3,
    left: 10,
    right: 10,
    height: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
  },

  // 3D Tactile Push Button Primary
  btnPrimary3D: {
    backgroundColor: '#2563EB',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#60A5FA',
    borderBottomWidth: 4,
    borderBottomColor: '#1D4ED8',
    paddingVertical: 14,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 18px -3px rgba(37, 99, 235, 0.4)',
        cursor: 'pointer',
      },
      default: {
        shadowColor: '#2563EB',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },

  // 3D Tactile Push Button Success
  btnSuccess3D: {
    backgroundColor: '#10B981',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#6EE7B7',
    borderBottomWidth: 4,
    borderBottomColor: '#047857',
    paddingVertical: 14,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 18px -3px rgba(16, 185, 129, 0.4)',
        cursor: 'pointer',
      },
      default: {
        shadowColor: '#10B981',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },

  // 3D Tactile Push Button Amber / Gold
  btnAmber3D: {
    backgroundColor: '#F59E0B',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderBottomWidth: 4,
    borderBottomColor: '#B45309',
    paddingVertical: 14,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 18px -3px rgba(245, 158, 11, 0.4)',
        cursor: 'pointer',
      },
      default: {
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.35,
        shadowRadius: 8,
        elevation: 4,
      },
    }),
  },

  // 3D Pill Badge
  badge3D: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
    borderBottomWidth: 2,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
      },
      default: {
        elevation: 2,
      },
    }),
  },

  // 3D Recessed Input Box (Clay Inset)
  input3D: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderBottomWidth: 3,
    borderBottomColor: '#CBD5E1',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#0F172A',
    ...Platform.select({
      web: {
        outlineStyle: 'none',
        boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.04)',
      },
    }),
  },
});
