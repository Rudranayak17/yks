import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  Image, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Custom hook to fetch posts
const useGetPostsQuery = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      // Replace with your actual API endpoint
      // const response = await fetch('https://your-api-endpoint.com/posts');
      // const data = await response.json();
      
      // Using the sample data for demonstration
      const data = {
        "success": true,
        "count": 10,
        "data": [
          {
            "_id": "67cde7a6aa8f1dd6cd6dfb63",
            "imageUrl": "https://firebasestorage.googleapis.com/v0/b/autocare-c1756.appspot.com/o/posts%2F1741547426562_7ny0wn.jpg?alt=media&token=60056683-c1df-4ac2-b0a7-acc65d23cfa0",
            "title": "Hi",
            "description": "Pune",
            "user": "67cc8956869a27e523a0fd5c",
            "createdAt": "2025-03-09T19:10:30.205Z",
            "updatedAt": "2025-03-09T19:10:30.205Z",
            "__v": 0
          },
          {
            "_id": "67cde5f1aa8f1dd6cd6dfabc",
            "imageUrl": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "title": "hello every one",
            "description": "dasdsadada dasdasdsa asdsadsa",
            "user": "67cc8956869a27e523a0fd5c",
            "createdAt": "2025-03-09T19:03:13.548Z",
            "updatedAt": "2025-03-09T19:03:13.548Z",
            "__v": 0
          },
          {
            "_id": "67cc9658127ca07ed6d32e2b",
            "imageUrl": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "title": "hello every one",
            "description": "dasdsadada dasdasdsa asdsadsa",
            "user": "67cc8956869a27e523a0fd5c",
            "createdAt": "2025-03-08T19:11:20.801Z",
            "updatedAt": "2025-03-08T19:11:20.801Z",
            "__v": 0
          },
          {
            "_id": "67cc9640127ca07ed6d32e14",
            "imageUrl": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "title": "hello every one",
            "description": "dasdsadada dasdasdsa asdsadsa",
            "user": "67cc8956869a27e523a0fd5c",
            "createdAt": "2025-03-08T19:10:56.613Z",
            "updatedAt": "2025-03-08T19:10:56.613Z",
            "__v": 0
          },
          {
            "_id": "67cc963e127ca07ed6d32dfd",
            "imageUrl": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "title": "hello every one",
            "description": "dasdsadada dasdasdsa asdsadsa",
            "user": "67cc8956869a27e523a0fd5c",
            "createdAt": "2025-03-08T19:10:54.480Z",
            "updatedAt": "2025-03-08T19:10:54.480Z",
            "__v": 0
          },
          {
            "_id": "67cc963a127ca07ed6d32de6",
            "imageUrl": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "title": "hello every one",
            "description": "dasdsadada dasdasdsa asdsadsa",
            "user": "67cc8956869a27e523a0fd5c",
            "createdAt": "2025-03-08T19:10:50.430Z",
            "updatedAt": "2025-03-08T19:10:50.430Z",
            "__v": 0
          },
          {
            "_id": "67cc9476805a11cee234d70e",
            "imageUrl": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "title": "hello every one",
            "description": "dasdsadada dasdasdsa asdsadsa",
            "user": "67cc8956869a27e523a0fd5c",
            "createdAt": "2025-03-08T19:03:18.205Z",
            "updatedAt": "2025-03-08T19:03:18.205Z",
            "__v": 0
          },
          {
            "_id": "67cc9474805a11cee234d70b",
            "imageUrl": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "title": "hello every one",
            "description": "dasdsadada dasdasdsa asdsadsa",
            "user": "67cc8956869a27e523a0fd5c",
            "createdAt": "2025-03-08T19:03:16.659Z",
            "updatedAt": "2025-03-08T19:03:16.659Z",
            "__v": 0
          },
          {
            "_id": "67cc9474805a11cee234d708",
            "imageUrl": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "title": "hello every one",
            "description": "dasdsadada dasdasdsa asdsadsa",
            "user": "67cc8956869a27e523a0fd5c",
            "createdAt": "2025-03-08T19:03:16.117Z",
            "updatedAt": "2025-03-08T19:03:16.117Z",
            "__v": 0
          },
          {
            "_id": "67cc9472805a11cee234d705",
            "imageUrl": "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=620&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "title": "hello every one",
            "description": "dasdsadada dasdasdsa asdsadsa",
            "user": "67cc8956869a27e523a0fd5c",
            "createdAt": "2025-03-08T19:03:14.017Z",
            "updatedAt": "2025-03-08T19:03:14.017Z",
            "__v": 0
          }
        ]
      };

      if (data.success && data.data) {
        setPosts(data.data);
      } else {
        setError('Failed to fetch posts');
      }
      
    } catch (err) {
      setError('Error fetching posts: ' + err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return { posts, loading, error, refreshing, onRefresh };
};

// Format date to a readable format
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  
  const diffTime = Math.abs(now - date);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

// Post Item Component
const PostItem = ({ item }) => {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.userAvatar}>
            <Text style={styles.avatarText}>
              {item.title.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <Text style={styles.userName}>{item.title}</Text>
            <Text style={styles.postTime}>{formatDate(item.createdAt)}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Ionicons name="ellipsis-vertical" size={20} color="#262626" />
        </TouchableOpacity>
      </View>

      <Image
        source={{ uri: item.imageUrl }}
        style={styles.postImage}
        resizeMode="cover"
      />

      <View style={styles.postActions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={() => setLiked(!liked)} style={styles.actionButton}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color={liked ? "#ED4956" : "#262626"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={24} color="#262626" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="paper-plane-outline" size={24} color="#262626" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => setSaved(!saved)}>
          <Ionicons
            name={saved ? "bookmark" : "bookmark-outline"}
            size={24}
            color="#262626"
          />
        </TouchableOpacity>
      </View>

      <View style={styles.postContent}>
        <Text style={styles.likesCount}>123 likes</Text>
        <View style={styles.captionContainer}>
          <Text style={styles.userName}>{item.title}</Text>
          <Text style={styles.caption}>{item.description}</Text>
        </View>
        <Text style={styles.viewComments}>View all 14 comments</Text>
      </View>
    </View>
  );
};

// Main Component
const InstagramFeed = () => {
  const { posts, loading, error, refreshing, onRefresh } = useGetPostsQuery();

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={onRefresh}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Instagram</Text>
        <TouchableOpacity>
          <Ionicons name="paper-plane-outline" size={24} color="#262626" />
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#0095f6" />
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => <PostItem item={item} />}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={styles.feedContainer}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ED4956',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#0095f6',
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#DBDBDB',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  feedContainer: {
    paddingBottom: 20,
  },
  postContainer: {
    marginBottom: 16,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0095f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  userName: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  postTime: {
    fontSize: 12,
    color: '#8e8e8e',
  },
  postImage: {
    width: '100%',
    height: 400,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 16,
  },
  postContent: {
    paddingHorizontal: 12,
  },
  likesCount: {
    fontWeight: 'bold',
    marginBottom: 6,
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  caption: {
    flex: 1,
    marginLeft: 6,
  },
  viewComments: {
    color: '#8e8e8e',
    marginBottom: 8,
  },
});

export default InstagramFeed;