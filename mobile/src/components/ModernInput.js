import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, TYPOGRAPHY, SPACING, RADIUS } from '../theme';

/**
 * Modern Input Component
 * Input ergonomis dengan state focus dinamis, toggle password, ikon terintegrasi, dan pesan error jelas.
 */
export default function ModernInput({
  label,
  value,
  onChangeText,
  placeholder,
  icon,
  isPassword = false,
  error,
  helper,
  keyboardType = 'default',
  autoCapitalize = 'none',
  editable = true,
  style,
  inputStyle,
}) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View
        style={[
          styles.inputWrapper,
          isFocused && styles.inputWrapperFocused,
          !!error && styles.inputWrapperError,
          !editable && styles.inputWrapperDisabled,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={20}
            color={isFocused ? COLORS.primary : COLORS.textSubtle}
            style={styles.leadingIcon}
          />
        )}

        <TextInput
          style={[styles.input, inputStyle]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSubtle}
          secureTextEntry={isPassword && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {isPassword && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => setShowPassword(!showPassword)}
            style={styles.trailingAction}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <View style={styles.feedbackRow}>
          <Ionicons name="alert-circle" size={14} color={COLORS.danger} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : helper ? (
        <Text style={styles.helperText}>{helper}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: TYPOGRAPHY.size.sm,
    fontWeight: TYPOGRAPHY.weight.semibold,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs + 2,
    letterSpacing: 0.1,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    minHeight: 50,
    paddingHorizontal: SPACING.md,
  },
  inputWrapperFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  inputWrapperError: {
    borderColor: COLORS.danger,
    backgroundColor: '#FEF2F2',
  },
  inputWrapperDisabled: {
    backgroundColor: '#F1F5F9',
    opacity: 0.7,
  },
  leadingIcon: {
    marginRight: SPACING.sm,
  },
  input: {
    flex: 1,
    fontSize: TYPOGRAPHY.size.base,
    color: COLORS.text,
    paddingVertical: SPACING.sm,
  },
  trailingAction: {
    padding: SPACING.xs,
  },
  feedbackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xs,
    gap: 4,
  },
  errorText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.danger,
    fontWeight: TYPOGRAPHY.weight.medium,
  },
  helperText: {
    fontSize: TYPOGRAPHY.size.xs,
    color: COLORS.textMuted,
    marginTop: SPACING.xs,
  },
});
