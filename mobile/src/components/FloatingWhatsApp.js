import React from 'react';
import { TouchableOpacity, StyleSheet, Linking, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FloatingWhatsApp({ phoneNumber = '6281234567890' }) {
  const handlePress = () => {
    const text = encodeURIComponent('Halo Panitia SPMB SMP Dharma Bakti, saya ingin bertanya seputar pendaftaran.');
    const url = `https://wa.me/${phoneNumber}?text=${text}`;
    Linking.openURL(url).catch((err) => console.log('Error opening WhatsApp:', err));
  };

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <Ionicons name="logo-whatsapp" size={28} color="#FFFFFF" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: Platform.OS === 'web' ? 86 : (Platform.OS === 'ios' ? 100 : 86),
    right: 18,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#10B981', // Emerald green matching WhatsApp button in image
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    zIndex: 10000,
  },
});
