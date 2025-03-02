import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Settings, Grid2x2 as Grid, Bookmark, CreditCard as Edit3 } from 'lucide-react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { ProfileEditModal } from '../../components/ProfileEditModal';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

// Mock data for user posts
const USER_POSTS = [
  {
    id: '1',
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1974&auto=format&fit=crop',
    likes: 120,
    comments: 24,
  },
  {
    id: '2',
    image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=2070&auto=format&fit=crop',
    likes: 85,
    comments: 12,
  },
  {
    id: '3',
    image: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?q=80&w=2070&auto=format&fit=crop',
    likes: 210,
    comments: 32,
  },
  {
    id: '4',
    image: 'https://images.unsplash.com/photo-1682686581484-a2d3e7a2bff7?q=80&w=2070&auto=format&fit=crop',
    likes: 150,
    comments: 18,
  },
  {
    id: '5',
    image: 'https://images.unsplash.com/photo-1682687220208-22d7a2543e88?q=80&w=2070&auto=format&fit=crop',
    likes: 95,
    comments: 8,
  },
  {
    id: '6',
    image: 'https://images.unsplash.com/photo-1682687220923-c58b9a4592ea?q=80&w=2070&auto=format&fit=crop',
    likes: 180,
    comments: 22,
  },
];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const renderPost = ({ item }) => (
    <TouchableOpacity style={styles.postItem}>
      <Image source={{ uri: item.image }} style={styles.postImage} />
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Bookmark size={50} color="#ccc" />
      <Text style={styles.emptyStateText}>No saved posts yet</Text>
    </View>
  );

  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <TouchableOpacity>
          <Settings size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Animated.View entering={FadeIn.duration(500)} style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image 
            source={{ uri: user?.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80' }} 
            style={styles.profileImage} 
          />
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Edit3 size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user?.name || 'User Name'}</Text>
        <Text style={styles.userBio}>{user?.bio || 'No bio yet'}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{USER_POSTS.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1.2K</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>350</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={() => setIsEditModalVisible(true)}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.tabsContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <Grid size={24} color={activeTab === 'posts' ? '#5271FF' : '#999'} />
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'saved' && styles.activeTab]}
          onPress={() => setActiveTab('saved')}
        >
          <Bookmark size={24} color={activeTab === 'saved' ? '#5271FF' : '#999'} />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderFooter = () => (
    <TouchableOpacity style={styles.logoutButton} onPress={logout}>
      <Text style={styles.logoutButtonText}>Logout</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activeTab === 'posts' ? USER_POSTS : []}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={activeTab === 'saved' ? renderEmptyState : null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={activeTab === 'saved' && USER_POSTS.length === 0 ? { flex: 1 } : null}
      />

      <ProfileEditModal 
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        userData={user}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#5271FF',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  userName: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#333',
    marginBottom: 5,
  },
  userBio: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666',
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#5271FF',
  },
  postsGrid: {
    width: '100%',
  },
  postItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    padding: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  emptyStateContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
    flex: 1,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#999',
  },
  logoutButton: {
    marginVertical: 30,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  logoutButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FF4D67',
  },
});