import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ExecutiveMetricCard({
  title,
  value,
  subtitle,
  icon,
  iconColor = '#1E3A8A',
  bgColor = '#EFF6FF',
}) {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.titleText}>{title}</Text>
        <View style={[styles.iconCircle, { backgroundColor: bgColor }]}>
          <Ionicons name={icon} size={20} color={iconColor} />
        </View>
      </View>
      <Text style={styles.valueText}>{value}</Text>
      {subtitle ? <Text style={styles.subtitleText}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginVertical: 6,
    shadowColor: '#172554',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitleText: {
    fontSize: 11,
    color: '#059669',
    fontWeight: '600',
    marginTop: 4,
  },
});
