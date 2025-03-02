import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Dimensions, TextInput, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Heart, MessageCircle, Share2, MoveHorizontal as MoreHorizontal, Bookmark, Send, ThumbsUp } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { CommentBottomSheet } from '../../components/CommentBottomSheet';

const { width } = Dimensions.get('window');

// Mock data for posts
const POSTS = [
  {
    id: '1',
    user: {
      id: '1',
      name: 'John Doe',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    },
    image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=1974&auto=format&fit=crop',
    caption: 'Enjoying a beautiful day at the beach! 🏖️ #summer #vacation',
    likes: 120,
    comments: 24,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    user: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    },
    image: 'https://images.unsplash.com/photo-1682687220063-4742bd7fd538?q=80&w=2070&auto=format&fit=crop',
    caption: 'Just finished this amazing book! Highly recommend it to everyone who loves mystery novels. 📚 #booklover #reading',
    likes: 85,
    comments: 12,
    timestamp: '5 hours ago',
  },
  {
    id: '3',
    user: {
      id: '3',
      name: 'Robert Johnson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    },
    image: 'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?q=80&w=2070&auto=format&fit=crop',
    caption: 'Morning hike with the best view! Nature always has a way of making you feel small yet significant. 🏔️ #hiking #nature #mountains',
    likes: 210,
    comments: 32,
    timestamp: '1 day ago',
  },
];

// Mock data for comments
const COMMENTS = [
  {
    id: '1',
    user: {
      id: '2',
      name: 'Jane Smith',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    },
    text: 'This looks amazing! Where exactly is this?',
    timestamp: '1 hour ago',
    likes: 5,
  },
  {
    id: '2',
    user: {
      id: '3',
      name: 'Robert Johnson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    },
    text: 'I was there last summer! Such a beautiful place.',
    timestamp: '45 minutes ago',
    likes: 3,
  },
  {
    id: '3',
    user: {
      id: '4',
      name: 'Emily Wilson',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    },
    text: 'The colors in this photo are stunning! What camera did you use?',
    timestamp: '30 minutes ago',
    likes: 2,
  },
  {
    id: '4',
    user: {
      id: '5',
      name: 'Michael Brown',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
    },
    text: 'Adding this to my travel bucket list!',
    timestamp: '15 minutes ago',
    likes: 1,
  },
];

export default function HomeScreen() {
  const { user } = useAuth();
  const [likedPosts, setLikedPosts] = useState<Record<string, boolean>>({});
  const [savedPosts, setSavedPosts] = useState<Record<string, boolean>>({});
  const [selectedPost, setSelectedPost] = useState<typeof POSTS[0] | null>(null);
  const [isCommentsVisible, setIsCommentsVisible] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [postComments, setPostComments] = useState<(typeof COMMENTS[0] & { isLiked?: boolean })[]>(
    COMMENTS.map(comment => ({ ...comment, isLiked: false }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleLike = (postId: string) => {
    setLikedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const toggleSave = (postId: string) => {
    setSavedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const openComments = (post: typeof POSTS[0]) => {
    setSelectedPost(post);
    setIsCommentsVisible(true);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !user || !selectedPost) return;

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const newCommentObj = {
      id: `comment-${Date.now()}`,
      user: {
        id: user.id,
        name: user.name,
        avatar: user.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80',
      },
      text: newComment.trim(),
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setPostComments(prev => [newCommentObj, ...prev]);
    setNewComment('');
    setIsSubmitting(false);
  };

  const toggleLikeComment = (commentId: string) => {
    setPostComments(prev => 
      prev.map(comment => {
        if (comment.id === commentId) {
          const isCurrentlyLiked = comment.isLiked || false;
          return {
            ...comment,
            likes: isCurrentlyLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !isCurrentlyLiked
          };
        }
        return comment;
      })
    );
  };

  const renderPost = ({ item, index }: { item: typeof POSTS[0], index: number }) => {
    const isLiked = likedPosts[item.id] || false;
    const isSaved = savedPosts[item.id] || false;

    return (
      <Animated.View 
        entering={FadeInDown.delay(index * 100).duration(400)}
        style={styles.postContainer}
      >
        <View style={styles.postHeader}>
          <View style={styles.userInfo}>
            <Image source={{ uri: item.user.avatar }} style={styles.avatar} />
            <Text style={styles.userName}>{item.user.name}</Text>
          </View>
          <TouchableOpacity>
            <MoreHorizontal size={24} color="#333" />
          </TouchableOpacity>
        </View>

        <Image source={{ uri: item.image }} style={styles.postImage} />

        <View style={styles.postActions}>
          <View style={styles.leftActions}>
            <TouchableOpacity onPress={() => toggleLike(item.id)} style={styles.actionButton}>
              <Heart size={24} color={isLiked ? '#FF4D67' : '#333'} fill={isLiked ? '#FF4D67' : 'transparent'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => openComments(item)} style={styles.actionButton}>
              <MessageCircle size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Share2 size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => toggleSave(item.id)}>
            <Bookmark size={24} color="#333" fill={isSaved ? '#333' : 'transparent'} />
          </TouchableOpacity>
        </View>

        <View style={styles.postContent}>
          <Text style={styles.likesCount}>{isLiked ? item.likes + 1 : item.likes} likes</Text>
          <View style={styles.captionContainer}>
            <Text style={styles.captionName}>{item.user.name}</Text>
            <Text style={styles.caption}>{item.caption}</Text>
          </View>
          <TouchableOpacity onPress={() => openComments(item)}>
            <Text style={styles.viewComments}>View all {item.comments} comments</Text>
          </TouchableOpacity>
          <Text style={styles.timestamp}>{item.timestamp}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={POSTS}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />

      {isCommentsVisible && selectedPost && (
        <CommentBottomSheet
          isVisible={isCommentsVisible}
          onClose={() => setIsCommentsVisible(false)}
          post={selectedPost}
          comments={postComments}
          user={user}
          newComment={newComment}
          setNewComment={setNewComment}
          isSubmitting={isSubmitting}
          handleAddComment={handleAddComment}
          toggleLikeComment={toggleLikeComment}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  postContainer: {
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
  },
  postImage: {
    width: width,
    height: width,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  leftActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginRight: 15,
  },
  postContent: {
    paddingHorizontal: 15,
  },
  likesCount: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    marginBottom: 5,
  },
  captionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  captionName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    marginRight: 5,
  },
  caption: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    flex: 1,
  },
  viewComments: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  timestamp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  }
});