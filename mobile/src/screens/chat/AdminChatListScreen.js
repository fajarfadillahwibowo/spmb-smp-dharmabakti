import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { formatFileUrl } from '../../config';

export default function AdminChatListScreen({ navigation }) {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchConversations = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const res = await apiClient.get('/admin/chat/conversations');
      if (res.data?.success) {
        setConversations(res.data.data || []);
      }
    } catch (e) {
      console.log('Error fetching admin chats:', e.message);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  // Polling tiap 4 detik
  useEffect(() => {
    fetchConversations(true);
    const interval = setInterval(() => {
      fetchConversations(false);
    }, 4000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  const filtered = conversations.filter(c => {
    const q = search.toLowerCase();
    return (
      c.nama.toLowerCase().includes(q) ||
      (c.nomor_pendaftaran && c.nomor_pendaftaran.toLowerCase().includes(q))
    );
  });

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.chatCard}
        activeOpacity={0.75}
        onPress={() => navigation.navigate('AdminChatDetail', {
          siswaId: item.siswa_id,
          siswaNama: item.nama,
          nomorDaftar: item.nomor_pendaftaran,
        })}
      >
        <View style={styles.avatarWrap}>
          {item.foto_profil_url ? (
            <Image source={{ uri: formatFileUrl(item.foto_profil_url) }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>
                {item.nama ? item.nama.charAt(0).toUpperCase() : 'S'}
              </Text>
            </View>
          )}
          {item.unread_count > 0 && <View style={styles.unreadBadgeDot} />}
        </View>

        <View style={styles.chatInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.studentName} numberOfLines={1}>{item.nama}</Text>
            {item.last_time && (
              <Text style={styles.timeText}>{item.last_time}</Text>
            )}
          </View>
          <Text style={styles.regNumber}>{item.nomor_pendaftaran}</Text>
          <Text style={[styles.lastMsg, item.unread_count > 0 && styles.lastMsgUnread]} numberOfLines={1}>
            {item.last_message}
          </Text>
        </View>

        {item.unread_count > 0 && (
          <View style={styles.badgeBox}>
            <Text style={styles.badgeText}>{item.unread_count}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#172554" />

      {/* SEARCH BAR */}
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#94A3B8" style={{ marginRight: 8 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Cari nama calon siswa atau no pendaftaran..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={18} color="#94A3B8" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* LIST OF CONVERSATIONS */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Memuat percakapan calon siswa...</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => String(item.siswa_id)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="chatbubbles-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Belum Ada Percakapan</Text>
              <Text style={styles.emptySub}>
                Belum ada pesan chat yang masuk dari calon siswa.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#172554',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  listContent: {
    padding: 14,
    gap: 10,
  },
  chatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderBottomWidth: 2.5,
    borderBottomColor: '#CBD5E1',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  avatarWrap: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  avatarPlaceholder: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
  unreadBadgeDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
    marginRight: 8,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  studentName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  timeText: {
    fontSize: 10,
    color: '#94A3B8',
    fontWeight: '600',
  },
  regNumber: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '700',
    marginBottom: 3,
  },
  lastMsg: {
    fontSize: 12,
    color: '#64748B',
  },
  lastMsgUnread: {
    color: '#0F172A',
    fontWeight: '700',
  },
  badgeBox: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  emptyBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 10,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
});
