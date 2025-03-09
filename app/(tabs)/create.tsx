import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Camera, X } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useCreate_postMutation } from '@/store/api/post';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/utils/config';

const postSchema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string(),
});

type PostFormData = {
  title: string;
  description: string;
};

export default function CreatePostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [create_post] = useCreate_postMutation();

  const { control, handleSubmit, formState: { errors }, reset } = useForm<PostFormData>({
    resolver: yupResolver(postSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const uploadImageToFirebase = async (imageUri: string) => {
    try {
      setIsUploading(true);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileName = `posts/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
      const storageRef = ref(storage, fileName);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (data: PostFormData) => {
    if (!image) {
      alert('Please select an image');
      return;
    }

    try {
      setIsLoading(true);
      
      const imageUrl = await uploadImageToFirebase(image);

      const postData = {
        imageUrl: imageUrl,
        title: data.title,
        description: data.description || ''
      };

      await create_post(postData).unwrap();

      reset();
      setImage(null);
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Post creation error:', error);
      alert('Failed to create post');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Create New Post</Text>
        </View>

        <Animated.View entering={FadeIn.duration(500)} style={styles.imageContainer}>
          {image ? (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: image }} style={styles.selectedImage} />
              <TouchableOpacity 
                style={styles.removeImageButton} 
                onPress={removeImage}
                disabled={isLoading || isUploading}
              >
                <X size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity 
              style={styles.imagePicker} 
              onPress={pickImage}
              disabled={isLoading || isUploading}
            >
              <Camera size={40} color="#5271FF" />
              <Text style={styles.imagePickerText}>Select Image</Text>
            </TouchableOpacity>
          )}
        </Animated.View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Write a title..."
                  multiline
                  numberOfLines={4}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isLoading && !isUploading}
                />
                {errors.title && <Text style={styles.errorText}>{errors.title.message}</Text>}
              </View>
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Description (optional)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Add description"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isLoading && !isUploading}
                />
              </View>
            )}
          />

          <TouchableOpacity
            style={[
              styles.button, 
              (!image || isLoading || isUploading) && styles.buttonDisabled
            ]}
            onPress={handleSubmit(onSubmit)}
            disabled={!image || isLoading || isUploading}
          >
            {isUploading ? (
              <ActivityIndicator color="#fff" />
            ) : isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Share Post</Text>
            )}
          </TouchableOpacity>

          {(isUploading || isLoading) && (
            <View style={styles.loadingOverlay}>
              <Text style={styles.loadingText}>
                {isUploading ? 'Uploading Image...' : 'Creating Post...'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  imageContainer: {
    marginBottom: 20,
  },
  imagePicker: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  imagePickerText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#5271FF',
  },
  selectedImageContainer: {
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: 300,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 20,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#5271FF',
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#a0aee8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 5,
  },
});