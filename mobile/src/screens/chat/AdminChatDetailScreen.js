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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiClient from '../../api/client';

export default function AdminChatDetailScreen({ route, navigation }) {
  const { siswaId, siswaNama, nomorDaftar } = route.params || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef(null);

  const fetchMessages = useCallback(async (isInitial = false) => {
    if (!siswaId) return;
    try {
      if (isInitial) setLoading(true);
      const res = await apiClient.get(`/admin/chat/${siswaId}`);
      if (res.data?.success && res.data?.data) {
        setMessages(res.data.data.messages || []);
      }
    } catch (e) {
      console.log('Error fetching admin messages:', e.message);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, [siswaId]);

  // Polling tiap 3 detik
  useEffect(() => {
    fetchMessages(true);
    const interval = setInterval(() => {
      fetchMessages(false);
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  const handleSend = async () => {
    const text = inputText.trim();
    if (!text || sending) return;

    setInputText('');
    setSending(true);

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
      const res = await apiClient.post(`/admin/chat/${siswaId}`, { pesan: text });
      if (res.data?.success && res.data?.data) {
        setMessages(prev => prev.map(m => m.id === tempId ? res.data.data : m));
      }
    } catch (e) {
      console.log('Error sending admin reply:', e.message);
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
            <Ionicons name="person" size={15} color="#FFFFFF" />
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

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarInitial}>
              {siswaNama ? siswaNama.charAt(0).toUpperCase() : 'S'}
            </Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.headerName} numberOfLines={1}>{siswaNama}</Text>
            <Text style={styles.headerSub}>{nomorDaftar || 'Calon Siswa'}</Text>
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

      {/* MESSAGES */}
      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Memuat pesan...</Text>
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
              <Ionicons name="chatbubbles-outline" size={42} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Belum ada pesan</Text>
              <Text style={styles.emptySub}>
                Kirimkan pesan pertama untuk membalas calon siswa ini.
              </Text>
            </View>
          }
        />
      )}

      {/* INPUT BAR */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 88 : 0}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder={`Balas pesan ke ${siswaNama}...`}
            placeholderTextColor="#94A3B8"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={1000}
          />
          <TouchableOpacity
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
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
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#93C5FD',
  },
  avatarInitial: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  headerName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  headerSub: {
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
    backgroundColor: '#64748B',
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
    backgroundColor: '#1E3A8A', // Deep navy for admin bubble
    borderBottomRightRadius: 4,
    borderBottomWidth: 2.5,
    borderBottomColor: '#172554',
    shadowColor: '#1E3A8A',
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
    paddingVertical: 60,
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
