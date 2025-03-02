import React, { useCallback, useRef, useMemo, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  Image, 
  TouchableOpacity, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ActivityIndicator,
  Dimensions
} from 'react-native';
import { Send, ThumbsUp, X } from 'lucide-react-native';
import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Animated, { FadeInRight } from 'react-native-reanimated';

const { height, width } = Dimensions.get('window');

interface CommentBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  post: any;
  comments: any[];
  user: any;
  newComment: string;
  setNewComment: (text: string) => void;
  isSubmitting: boolean;
  handleAddComment: () => void;
  toggleLikeComment: (commentId: string) => void;
}

export const CommentBottomSheet: React.FC<CommentBottomSheetProps> = ({
  isVisible,
  onClose,
  post,
  comments,
  user,
  newComment,
  setNewComment,
  isSubmitting,
  handleAddComment,
  toggleLikeComment
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['70%', '90%'], []);

  useEffect(() => {
    if (isVisible) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [isVisible]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
      />
    ),
    []
  );

  const renderComment = ({ item, index }: { item: any, index: number }) => (
    <Animated.View 
    key={index}
      entering={FadeInRight.delay(index * 50).duration(300)}
      style={styles.commentContainer}
    >
      <Image source={{ uri: item.user.avatar }} style={styles.commentAvatar} />
      <View style={styles.commentContent}>
        <View style={styles.commentHeader}>
          <Text style={styles.commentUserName}>{item.user.name}</Text>
          <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
        </View>
        <Text style={styles.commentText}>{item.text}</Text>
        <View style={styles.commentActions}>
          <TouchableOpacity 
            style={styles.commentLikeButton} 
            onPress={() => toggleLikeComment(item.id)}
          >
            <ThumbsUp 
              size={16} 
              color={item.isLiked ? '#5271FF' : '#999'} 
              fill={item.isLiked ? '#5271FF' : 'transparent'} 
            />
            <Text 
              style={[
                styles.commentLikeCount, 
                item.isLiked && styles.commentLikedText
              ]}
            >
              {item.likes > 0 ? item.likes : ''} {item.likes === 1 ? 'Like' : item.likes > 1 ? 'Likes' : 'Like'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.commentReplyButton}>
            <Text style={styles.commentReplyText}>Reply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={isVisible ? 0 : -1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      enablePanDownToClose
      backdropComponent={renderBackdrop}
      handleIndicatorStyle={styles.indicator}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Comments</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <X size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 30 : 0}
      >
        <View style={styles.commentsContainer}>
          {post && (
            <View style={styles.originalPost}>
              <View style={styles.originalPostHeader}>
                <Image source={{ uri: post.user.avatar }} style={styles.commentAvatar} />
                <Text style={styles.commentUserName}>{post.user.name}</Text>
              </View>
              <Text style={styles.originalPostCaption}>{post.caption}</Text>
              <Text style={styles.originalPostTimestamp}>{post.timestamp}</Text>
            </View>
          )}
          
          <View style={styles.commentsDivider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Comments</Text>
            <View style={styles.dividerLine} />
          </View>

          {comments.length === 0 ? (
            <View style={styles.noCommentsContainer}>
              <Text style={styles.noCommentsText}>No comments yet</Text>
              <Text style={styles.noCommentsSubtext}>Be the first to comment!</Text>
            </View>
          ) : (
            <BottomSheetScrollView contentContainerStyle={styles.commentsListContent}>
              {comments.map((comment, index) => renderComment({ item: comment, index }))}
            </BottomSheetScrollView>
          )}
        </View>
        
        <View style={styles.addCommentContainer}>
          <Image 
            source={{ 
              uri: user?.profilePicture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1760&q=80'
            }} 
            style={styles.commentInputAvatar} 
          />
          <View style={styles.commentInputContainer}>
            <TextInput
              style={styles.commentInput}
              placeholder="Add a comment..."
              value={newComment}
              onChangeText={setNewComment}
              multiline
              maxLength={500}
            />
            {isSubmitting ? (
              <ActivityIndicator size="small" color="#5271FF" style={styles.sendButtonLoader} />
            ) : (
              <TouchableOpacity 
                style={[
                  styles.sendButton, 
                  !newComment.trim() && styles.sendButtonDisabled
                ]} 
                onPress={handleAddComment}
                disabled={!newComment.trim() || isSubmitting}
              >
                <Send size={20} color={newComment.trim() ? "#5271FF" : "#ccc"} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    alignSelf: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  commentsContainer: {
    flex: 1,
  },
  commentsListContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  commentContainer: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUserName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
  },
  commentTimestamp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
  },
  commentText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
    marginBottom: 6,
    lineHeight: 20,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  commentLikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  commentLikeCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
    marginLeft: 4,
  },
  commentLikedText: {
    color: '#5271FF',
  },
  commentReplyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentReplyText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
  },
  originalPost: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    margin: 15,
    marginBottom: 0,
  },
  originalPostHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  originalPostCaption: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 20,
  },
  originalPostTimestamp: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: '#999',
  },
  commentsDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    paddingHorizontal: 15,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#eee',
  },
  dividerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#666',
    marginHorizontal: 10,
  },
  noCommentsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  noCommentsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  noCommentsSubtext: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#999',
  },
  addCommentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  commentInputAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 10,
  },
  commentInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    maxHeight: 80,
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    padding: 8,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonLoader: {
    padding: 8,
  },
});