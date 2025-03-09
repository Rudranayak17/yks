import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  Image, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { ArrowLeft, Send, Mic, Image as ImageIcon, Smile, Paperclip } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInRight } from 'react-native-reanimated';


const { width } = Dimensions.get('window');

// Mock data for the chat user
const CHAT_USERS = {
  '2': {
    id: '2',
    name: 'Jane Smith',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    online: true,
    lastSeen: 'Online',
  },
  '3': {
    id: '3',
    name: 'Robert Johnson',
    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    online: false,
    lastSeen: 'Last seen 2 hours ago',
  },
  '4': {
    id: '4',
    name: 'Emily Wilson',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    online: true,
    lastSeen: 'Online',
  },
  '5': {
    id: '5',
    name: 'Michael Brown',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    online: false,
    lastSeen: 'Last seen yesterday',
  },
  '6': {
    id: '6',
    name: 'Sarah Davis',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    online: true,
    lastSeen: 'Online',
  },
};

// Mock data for messages
const INITIAL_MESSAGES = {
  '2': [
    {
      id: '1',
      text: 'Hey, how are you doing?',
      sender: '2',
      timestamp: '10:30 AM',
      status: 'read',
    },
    {
      id: '2',
      text: 'I\'m good, thanks! How about you?',
      sender: '1',
      timestamp: '10:32 AM',
      status: 'read',
    },
    {
      id: '3',
      text: 'Pretty good. Did you check out that new restaurant downtown?',
      sender: '2',
      timestamp: '10:33 AM',
      status: 'read',
    },
    {
      id: '4',
      text: 'Not yet, but I heard it\'s amazing. Want to go this weekend?',
      sender: '1',
      timestamp: '10:35 AM',
      status: 'read',
    },
    {
      id: '5',
      text: 'Sounds great! How about Saturday at 7?',
      sender: '2',
      timestamp: '10:36 AM',
      status: 'read',
    },
  ],
  '3': [
    {
      id: '1',
      text: 'Thanks for the help yesterday!',
      sender: '3',
      timestamp: '9:15 AM',
      status: 'read',
    },
    {
      id: '2',
      text: 'No problem at all. Did everything work out?',
      sender: '1',
      timestamp: '9:20 AM',
      status: 'read',
    },
    {
      id: '3',
      text: 'Yes, it worked perfectly. You saved me hours of troubleshooting.',
      sender: '3',
      timestamp: '9:22 AM',
      status: 'read',
    },
  ],
  '4': [
    {
      id: '1',
      text: 'Are we still meeting tomorrow?',
      sender: '4',
      timestamp: 'Yesterday',
      status: 'read',
    },
    {
      id: '2',
      text: 'Yes, 2 PM at the coffee shop, right?',
      sender: '1',
      timestamp: 'Yesterday',
      status: 'read',
    },
    {
      id: '3',
      text: 'Perfect! See you then.',
      sender: '4',
      timestamp: 'Yesterday',
      status: 'read',
    },
  ],
  '5': [
    {
      id: '1',
      text: 'I sent you the files you requested.',
      sender: '5',
      timestamp: 'Monday',
      status: 'read',
    },
    {
      id: '2',
      text: 'Got them, thanks! I\'ll take a look and get back to you.',
      sender: '1',
      timestamp: 'Monday',
      status: 'read',
    },
  ],
  '6': [
    {
      id: '1',
      text: 'Let me know when you\'re free to talk.',
      sender: '6',
      timestamp: 'Monday',
      status: 'read',
    },
    {
      id: '2',
      text: 'I should be free around 4 PM today. Does that work?',
      sender: '1',
      timestamp: 'Monday',
      status: 'read',
    },
    {
      id: '3',
      text: 'That works for me!',
      sender: '6',
      timestamp: 'Monday',
      status: 'read',
    },
  ],
};

export default function ChatDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [chatUser, setChatUser] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Get chat user data
    if (id && typeof id === 'string') {
      setChatUser(CHAT_USERS[id as keyof typeof CHAT_USERS]);
      
      // Get messages for this chat
      const chatMessages = INITIAL_MESSAGES[id as keyof typeof INITIAL_MESSAGES] || [];
      setMessages(chatMessages);
    }
  }, [id]);

  const sendMessage = async () => {
    if (!message.trim()  || !chatUser) return;

    setIsSending(true);
    
    // Create new message
    const newMessage = {
      id: `msg-${Date.now()}`,
      text: message.trim(),
      sender: 1,
      timestamp: 'Just now',
      status: 'sent',
    };

    // Add message to state
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update message status to delivered
    setMessages(prev => 
      prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
      )
    );
    
    setIsSending(false);
    
    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const renderMessage = ({ item, index }: { item: any, index: number }) => {
    const isUser = item.sender === 1;
    const showAvatar = !isUser && (index === 0 || messages[index - 1]?.sender !== item.sender);
    
    return (
      <Animated.View 
        entering={isUser ? FadeInUp.delay(index * 50).duration(300) : FadeInRight.delay(index * 50).duration(300)}
        style={[
          styles.messageContainer,
          isUser ? styles.userMessageContainer : styles.otherMessageContainer
        ]}
      >
        {!isUser && showAvatar && (
          <Image source={{ uri: chatUser?.avatar }} style={styles.messageAvatar} />
        )}
        
        {!isUser && !showAvatar && <View style={styles.avatarPlaceholder} />}
        
        <View 
          style={[
            styles.messageBubble,
            isUser ? styles.userMessageBubble : styles.otherMessageBubble
          ]}
        >
          <Text style={styles.messageText}>{item.text}</Text>
          <View style={styles.messageFooter}>
            <Text style={styles.messageTimestamp}>{item.timestamp}</Text>
            {isUser && (
              <Text style={styles.messageStatus}>
                {item.status === 'sent' ? '✓' : item.status === 'delivered' ? '✓✓' : '✓✓'}
              </Text>
            )}
          </View>
        </View>
      </Animated.View>
    );
  };

  if (!chatUser) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#5271FF" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: true,
          headerTitle: () => (
            <View style={styles.headerTitle}>
              <Image source={{ uri: chatUser.avatar }} style={styles.headerAvatar} />
              <View>
                <Text style={styles.headerName}>{chatUser.name}</Text>
                <Text style={styles.headerStatus}>{chatUser.lastSeen}</Text>
              </View>
            </View>
          ),
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#333" />
            </TouchableOpacity>
          ),
          headerStyle: {
            height: 100,
          },
          headerShadowVisible: false,
        }}
      />
      
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.container}>
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            showsVerticalScrollIndicator={false}
            onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
          />
          
          <View style={styles.inputContainer}>
            <TouchableOpacity style={styles.attachButton}>
              <Paperclip size={22} color="#666" />
            </TouchableOpacity>
            
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Type a message..."
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity style={styles.emojiButton}>
                <Smile size={22} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageButton}>
                <ImageIcon size={22} color="#666" />
              </TouchableOpacity>
            </View>
            
            {message.trim() ? (
              <TouchableOpacity 
                style={[styles.sendButton, isSending && styles.sendingButton]} 
                onPress={sendMessage}
                disabled={isSending}
              >
                {isSending ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Send size={20} color="#fff" />
                )}
              </TouchableOpacity>
            ) : (
              <TouchableOpacity 
                style={[styles.micButton, isRecording && styles.recordingButton]} 
                onPress={toggleRecording}
              >
                <Mic size={20} color={isRecording ? "#fff" : "#666"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333',
  },
  headerStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#666',
  },
  backButton: {
    padding: 5,
  },
  messagesList: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    maxWidth: '80%',
  },
  userMessageContainer: {
    alignSelf: 'flex-end',
  },
  otherMessageContainer: {
    alignSelf: 'flex-start',
  },
  messageAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 8,
    alignSelf: 'flex-end',
    marginBottom: 15,
  },
  avatarPlaceholder: {
    width: 30,
    marginRight: 8,
  },
  messageBubble: {
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '100%',
  },
  userMessageBubble: {
    backgroundColor: '#5271FF',
  },
  otherMessageBubble: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
  },
  messageText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 2,
  },
  messageTimestamp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#999',
    marginRight: 4,
  },
  messageStatus: {
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    color: '#999',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  attachButton: {
    padding: 8,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 12,
    marginHorizontal: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    maxHeight: 100,
    paddingVertical: 8,
  },
  emojiButton: {
    padding: 5,
  },
  imageButton: {
    padding: 5,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#5271FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendingButton: {
    backgroundColor: '#a0aee8',
  },
  micButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingButton: {
    backgroundColor: '#FF4D67',
  },
});