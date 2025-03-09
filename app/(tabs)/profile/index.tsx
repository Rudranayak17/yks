import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from 'react-native';
import {
  Settings,
  Grid2x2 as Grid,
  Bookmark,
  CreditCard as Edit3,
} from 'lucide-react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/reducer/auth';
import { useGet_postQuery } from '@/store/api/post';
import { ProfileEditModal } from '../../../components/ProfileEditModal';
import { useRouter } from 'expo-router'; // Import the router

// Skeleton Loading Component
const SkeletonPost = () => (
  <View style={[styles.postItem, styles.skeletonPost]}>
    <View style={styles.skeletonImage} />
  </View>
);

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3;

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const user = useSelector(selectCurrentUser);
  const { data: postsData, isLoading } = useGet_postQuery({});
  const router = useRouter(); // Initialize the router

  // Transform API data to match required format
  const USER_POSTS = postsData?.data?.map(post => ({
    id: post._id,
    image: post.imageUrl,
  })) || [];

  // Navigate to post detail page with post ID
  const handlePostPress = (postId) => {
    router.push(`/profile/${postId}`);
  };

  const renderPost = ({ item }) => (
    <TouchableOpacity 
      style={styles.postItem}
      onPress={() => handlePostPress(item.id)}
    >
      <Image 
        source={{ uri: item.image }} 
        style={styles.postImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );

  const renderSkeletonGrid = () => (
    <FlatList
      data={Array(6).fill({})}
      renderItem={SkeletonPost}
      numColumns={3}
      keyExtractor={(_, index) => `skeleton-${index}`}
    />
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
        <TouchableOpacity onPress={() => router.push('/settings')}>
          <Settings size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <Animated.View
        entering={FadeIn.duration(500)}
        style={styles.profileSection}
      >
        <View style={styles.profileImageContainer}>
          <Image
            source={{
              uri: user?.profile_URL || 'https://via.placeholder.com/100',
            }}
            style={styles.profileImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => setIsEditModalVisible(true)}
          >
            <Edit3 size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.userName}>{user?.username || "No name"}</Text>
        <Text style={styles.userBio}>{user?.bio || 'No bio yet'}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{USER_POSTS.length}</Text>
            <Text style={styles.statLabel}>Posts</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setIsEditModalVisible(true)}
        >
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
          <Bookmark
            size={24}
            color={activeTab === 'saved' ? '#5271FF' : '#999'}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  const renderFooter = () => (
    <TouchableOpacity
      style={styles.logoutButton}
      onPress={() => {
        console.log('logout');
        router.push('/login');
      }}
    >
      <Text style={styles.logoutButtonText}>Logout</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={activeTab === 'posts' ? USER_POSTS : []}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={3}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          activeTab === 'saved'
            ? renderEmptyState
            : isLoading
            ? renderSkeletonGrid
            : null
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={
          (activeTab === 'saved' && USER_POSTS.length === 0) || isLoading
            ? { flexGrow: 1 }
            : null
        }
      />

      <ProfileEditModal
        isVisible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        data={user}
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
    backgroundColor: '#f0f0f0',
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
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    marginHorizontal: 20,
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
  postItem: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    padding: 1,
  },
  postImage: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
  },
  skeletonPost: {
    backgroundColor: '#f0f0f0',
  },
  skeletonImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
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