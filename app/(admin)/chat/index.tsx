import { StyleSheet, Text, View, TouchableOpacity, FlatList, TextInput, KeyboardAvoidingView, Platform, StatusBar, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ChatScreen = () => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({
    id: '123',
    name: 'Admin',
    isAdmin: true
  });
  const [chatPartner, setChatPartner] = useState({
    id: '456',
    name: 'John Doe',
    apartmentNo: 'A-101',
    avatar: null
  });
  
  const flatListRef = useRef(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  // Load messages (simulated)
  useEffect(() => {
    // This would be an API call in a real app
    setTimeout(() => {
      const dummyMessages = [
        {
          id: '1',
          text: 'Hello, I have a question about maintenance fees.',
          sender: '456',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        },
        {
          id: '2',
          text: 'Sure, I can help you with that. What would you like to know?',
          sender: '123',
          timestamp: new Date(Date.now() - 3600000 * 1.9).toISOString(),
        },
        {
          id: '3',
          text: 'When is the next payment due? And has there been any change to the payment process?',
          sender: '456',
          timestamp: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        },
        {
          id: '4',
          text: 'The next payment is due on the 15th of this month. We now accept payments through the new mobile app as well.',
          sender: '123',
          timestamp: new Date(Date.now() - 3600000 * 1.4).toISOString(),
        },
        {
          id: '5',
          text: 'Great, thank you for the information!',
          sender: '456',
          timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
        },
      ];
      setMessages(dummyMessages);
      setLoading(false);
    }, 1000);
  }, []);

  // Format timestamp
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Check if message is from logged-in user
  const isOwnMessage = (senderId) => {
    return senderId === user.id;
  };

  // Send new message
  const sendMessage = () => {
    if (message.trim() === '') return;
    
    const newMessage = {
      id: Date.now().toString(),
      text: message.trim(),
      sender: user.id,
      timestamp: new Date().toISOString(),
    };
    
    setMessages([...messages, newMessage]);
    setMessage('');
    
    // Here you would typically call an API to save the message
  };

  // Render a single message
  const renderMessage = ({ item }) => {
    const own = isOwnMessage(item.sender);
    
    return (
      <View style={[
        styles.messageContainer,
        own ? styles.ownMessageContainer : styles.otherMessageContainer
      ]}>
        <View style={[
          styles.messageBubble,
          own ? styles.ownMessageBubble : styles.otherMessageBubble
        ]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{formatTime(item.timestamp)}</Text>
        </View>
      </View>
    );
  };

  // Render separator between messages
  const renderSeparator = () => (
    <View style={{ height: 8 }} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#3F51B5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        
        <View style={styles.headerProfile}>
          {chatPartner.avatar ? (
            <Image source={{ uri: chatPartner.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{chatPartner.name.charAt(0)}</Text>
            </View>
          )}
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{chatPartner.name}</Text>
            <Text style={styles.headerDetail}>{chatPartner.apartmentNo}</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.headerIcon}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Chat Messages */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3F51B5" />
          <Text style={styles.loadingText}>Loading conversation...</Text>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          ItemSeparatorComponent={renderSeparator}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Ionicons name="chatbubble-ellipses-outline" size={60} color="#ccc" />
              <Text style={styles.emptyStateText}>No messages yet</Text>
              <Text style={styles.emptyStateSubText}>Send a message to start the conversation</Text>
            </View>
          }
        />
      )}

      {/* Message Input */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.attachButton}>
            <Ionicons name="attach" size={24} color="#666" />
          </TouchableOpacity>
          
          <TextInput
            style={styles.textInput}
            placeholder="Type a message..."
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
          />
          
          <TouchableOpacity 
            style={[
              styles.sendButton,
              !message.trim() && styles.disabledSendButton
            ]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={22} color={message.trim() ? "#fff" : "#ccc"} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#3F51B5',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  backButton: {
    padding: 5,
  },
  headerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#C5CAE9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerDetail: {
    color: '#E8EAF6',
    fontSize: 14,
  },
  headerIcon: {
    padding: 5,
  },
  messagesList: {
    padding: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  ownMessageContainer: {
    justifyContent: 'flex-end',
  },
  otherMessageContainer: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  ownMessageBubble: {
    backgroundColor: '#3F51B5',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
  },
  ownMessageBubble: {
    backgroundColor: '#3F51B5',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  ownMessageBubble: {
    backgroundColor: '#3F51B5',
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageBubble: {
    backgroundColor: '#3F51B5',
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageBubble: {
    backgroundColor: '#3F51B5',
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageBubble: {
    backgroundColor: '#3F51B5',
    borderBottomRightRadius: 4,
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
  },
  ownMessageBubble: {
    backgroundColor: '#3F51B5',
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: '#000',
  },
  ownMessageBubble: {
    backgroundColor: '#3F51B5',
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageBubble: {
    backgroundColor: '#3F51B5',
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  ownMessageText: {
    color: '#fff',
  },
  otherMessageText: {
    color: '#333',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    color: props => (isOwnMessage(props.sender) ? '#fff' : '#333'),
  },
  messageTime: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  attachButton: {
    padding: 10,
  },
  textInput: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#3F51B5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledSendButton: {
    backgroundColor: '#E0E0E0',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
  },
  emptyStateSubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
});