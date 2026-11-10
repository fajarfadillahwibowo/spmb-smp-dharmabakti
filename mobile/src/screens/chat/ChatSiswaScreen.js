import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';
import { formatFileUrl } from '../../config';

const SUGGESTIONS = [
  'Halo Panitia, bagaimana cara verifikasi berkas?',
  'Kapan jadwal tes seleksi keluar?',
  'Bagaimana konfirmasi pembayaran uang pendaftaran?',
  'Apakah berkas saya sudah lengkap?',
];

export default function ChatSiswaScreen({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [adminInfo, setAdminInfo] = useState({ name: 'Panitia SPMB', role: 'Panitia Penerimaan' });
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef(null);

  // Ambil percakapan dari API
  const fetchMessages = useCallback(async (isInitial = false) => {
    try {
      if (isInitial) setLoading(true);
      const res = await apiClient.get('/siswa/chat');
      if (res.data?.success && res.data?.data) {
        setMessages(res.data.data.messages || []);
        if (res.data.data.admin) {
          setAdminInfo(res.data.data.admin);
        }
      }
    } catch (e) {
      console.log('Error fetching chat:', e.message);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  // Polling chat tiap 3 detik untuk realtime chat update
  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // Kirim pesan
  const handleSend = async (textToSend = null) => {
    const text = (textToSend || inputText).trim();
    if (!text || sending) return;

    setInputText('');
    setSending(true);

    // Optimistic message update
    const tempId = Date.now();
    const optimisticMsg = {
      id: tempId,
      pesan: text,
      is_me: true,
      is_read: false,
      waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const res = await apiClient.post('/siswa/chat', { pesan: text });
      if (res.data?.success && res.data?.data) {
        // Ganti optimistic message dengan respon asli
        setMessages(prev => prev.map(m => m.id === tempId ? res.data.data : m));
      }
    } catch (e) {
      console.log('Error sending message:', e.message);
      // Hapus optimistic jika gagal
      setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally {
      setSending(false);
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const renderItem = ({ item }) => {
    const isMe = item.is_me;
    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowOther]}>
        {!isMe && (
          <View style={styles.senderAvatarBox}>
            <Ionicons name="school" size={16} color="#FFFFFF" />
          </View>
        )}
        <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}>
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
            {item.pesan}
          </Text>
          <View style={styles.bubbleFooter}>
            <Text style={[styles.timeText, isMe ? styles.timeTextMe : styles.timeTextOther]}>
              {item.waktu}
            </Text>
            {isMe && (
              <Ionicons
                name={item.is_read ? 'checkmark-done' : 'checkmark'}
                size={14}
                color="rgba(255, 255, 255, 0.75)"
                style={{ marginLeft: 3 }}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#172554" />

      {/* HEADER CHAT */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.adminAvatarBox}>
            <Ionicons name="school" size={20} color="#FFFFFF" />
            <View style={styles.onlineBadge} />
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.adminNameText}>{adminInfo.name}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={styles.onlineDot} />
              <Text style={styles.adminStatusText}>Online • Panitia SPMB</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.refreshBtn}
          onPress={() => fetchMessages(false)}
          activeOpacity={0.7}
        >
          <Ionicons name="refresh" size={18} color="#93C5FD" />
        </TouchableOpacity>
      </View>

      {/* BODY CHAT */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Menghubungkan ke Panitia SPMB...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="chatbubbles" size={38} color="#2563EB" />
              </View>
              <Text style={styles.emptyTitle}>Mulai Chat dengan Panitia</Text>
              <Text style={styles.emptySub}>
                Tanyakan pertanyaan seputar formulir, berkas, jadwal tes, atau biaya pendaftaran.
              </Text>
            </View>
          }
        />
      )}

      {/* QUICK SUGGESTIONS CHIPS */}
      <View style={styles.suggestionsContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={SUGGESTIONS}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.suggestionChip}
              onPress={() => handleSend(item)}
              activeOpacity={0.75}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}
        />
      </View>

      {/* INPUT BAR */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Ketik pesan untuk panitia..."
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={() => handleSend()}
            disabled={!inputText.trim() || sending}
            activeOpacity={0.8}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Ionicons name="send" size={18} color="#FFFFFF" style={{ marginLeft: 2 }} />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#172554',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingTop: Platform.OS === 'ios' ? 48 : (Platform.OS === 'android' ? (StatusBar.currentHeight || 24) + 8 : 14),
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    padding: 8,
    marginRight: 4,
    borderRadius: 8,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  adminAvatarBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: '#38BDF8',
  },
  onlineBadge: {
    position: 'absolute',
    bottom: -1,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#172554',
  },
  adminNameText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  adminStatusText: {
    color: '#93C5FD',
    fontSize: 11,
    fontWeight: '600',
  },
  refreshBtn: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  messagesList: {
    paddingHorizontal: 14,
    paddingVertical: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowOther: {
    justifyContent: 'flex-start',
  },
  senderAvatarBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 4,
    borderBottomWidth: 2.5,
    borderBottomColor: '#1D4ED8',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  bubbleOther: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 4,
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
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  messageTextMe: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  messageTextOther: {
    color: '#1E293B',
    fontWeight: '500',
  },
  bubbleFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  timeTextMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  timeTextOther: {
    color: '#94A3B8',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    paddingHorizontal: 24,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#BFDBFE',
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
  },
  suggestionsContainer: {
    paddingVertical: 6,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  suggestionChip: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },
  suggestionText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E40AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    gap: 8,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 13,
    color: '#0F172A',
  },
  sendButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: '#1D4ED8',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 4,
  },
  sendButtonDisabled: {
    backgroundColor: '#94A3B8',
    borderBottomColor: '#64748B',
    shadowOpacity: 0,
    elevation: 0,
  },
});
