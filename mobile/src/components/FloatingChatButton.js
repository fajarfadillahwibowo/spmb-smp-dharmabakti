import React, { useState, useEffect, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/client';

export default function FloatingChatButton() {
  const navigation = useNavigation();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchUnread = useCallback(async () => {
    if (!user) return;
    try {
      const endpoint = user.role === 'admin'
        ? '/admin/chat/unread-count'
        : '/siswa/chat/unread-count';
      const res = await apiClient.get(endpoint);
      if (res.data?.success) {
        setUnreadCount(res.data.unread_count || 0);
      }
    } catch (e) {
      // ignore background poll error
    }
  }, [user]);

  useEffect(() => {
    fetchUnread();
    // Poll unread chat setiap 30 detik
    const interval = setInterval(fetchUnread, 30000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  const handlePress = () => {
    if (user?.role === 'admin') {
      navigation.navigate('AdminChatList');
    } else {
      navigation.navigate('ChatSiswa');
    }
  };

  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={handlePress}
      activeOpacity={0.85}
      accessibilityLabel="Menu Chat Interaktif"
    >
      {/* 3D Specular Shine */}
      <View style={styles.fabShine} />

      <Ionicons name="chatbubble-ellipses" size={26} color="#FFFFFF" />

      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    bottom: Platform.OS === 'web' ? 86 : (Platform.OS === 'ios' ? 100 : 86),
    right: 18,
    width: 56,
    height: 56,
    borderRadius: 28, // Bulat 3D
    backgroundColor: '#2563EB', // Royal Blue cerah
    alignItems: 'center',
    justifyContent: 'center',
    position: Platform.OS === 'web' ? 'fixed' : 'absolute',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(255, 255, 255, 0.55)',
    borderBottomWidth: 4,
    borderBottomColor: '#1D4ED8', // Bevel 3D
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 10000,
  },
  fabShine: {
    position: 'absolute',
    top: 3,
    width: '60%',
    height: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});
