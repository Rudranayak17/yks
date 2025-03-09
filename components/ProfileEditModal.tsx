
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";



import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  X,
  Camera,
  Calendar,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useUpdate_profileMutation } from '@/store/api/auth';
import { storage } from "@/utils/config";
import { setCredentials } from "@/store/reducer/auth";
import { useDispatch } from "react-redux";

// Validation schema
const profileSchema = yup.object().shape({
  name: yup
    .string()
    .required('Name is required')
    .max(50, 'Name must be less than 50 characters'),
  bio: yup.string().max(150, 'Bio must be less than 150 characters'),
  instagram: yup.string().url('Please enter a valid URL').nullable(),
  twitter: yup.string().url('Please enter a valid URL').nullable(),
  facebook: yup.string().url('Please enter a valid URL').nullable(),
  linkedin: yup.string().url('Please enter a valid URL').nullable(),
});

type ProfileFormData = {
  name: string;
  bio: string;
  instagram: string | null;
  twitter: string | null;
  facebook: string | null;
  linkedin: string | null;
};

interface ProfileEditModalProps {
  isVisible: boolean;
  onClose: () => void;
  data: {
    username?: string;
    bio?: string;
    profile_URL?: string;
    birthdate?: string;
    anniversary?: string;
    instagram?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

// BottomSheet Component
const BottomSheet: React.FC<{
  isVisible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isVisible, onClose, title, children }) => (
  <Modal
    visible={isVisible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
  >
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#333" />
          </TouchableOpacity>
        </View>
        {children}
      </View>
    </View>
  </Modal>
);

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isVisible,
  onClose,
  data,
}) => {
  const [profileImage, setProfileImage] = useState<string | null>(
    data?.profile_URL || null
  );
  const [showBirthdatePicker, setShowBirthdatePicker] = useState(false);
  const [showAnniversaryPicker, setShowAnniversaryPicker] = useState(false);
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    data?.birthdate ? new Date(data.birthdate) : undefined
  );
  const [anniversary, setAnniversary] = useState<Date | undefined>(
    data?.anniversary ? new Date(data.anniversary) : undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [update_profile] = useUpdate_profileMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: data?.username || '',
      bio: data?.bio || '',
      instagram: data?.instagram || null,
      twitter: data?.twitter || null,
      facebook: data?.facebook || null,
      linkedin: data?.linkedin || null,
    },
  });
const dispatch=useDispatch()
  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access gallery was denied');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        setError(null);
      }
    } catch (err) {
      setError('Failed to pick image');
    }
  };

  const uploadImageToFirebase = async (imageUri: string) => {
    try {
      setIsUploading(true);
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileName = `profile_images/${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
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

  const onSubmit = async (formData: ProfileFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      let profileImageUrl = profileImage;
      
      // Upload image if it exists and is a local URI
      if (profileImage && profileImage.startsWith('file://')) {
        profileImageUrl = await uploadImageToFirebase(profileImage);
      }

      const updatedProfile = {
        username: formData.name,
        bio: formData.bio,
        profile_URL: profileImageUrl,
        birthdate: birthdate?.toISOString(),
        anniversary: anniversary?.toISOString(),
        instagram: formData.instagram,
        twitter: formData.twitter,
        facebook: formData.facebook,
        linkedin: formData.linkedin,
      };

      const resp = await update_profile(updatedProfile).unwrap();
      console.log(resp);
   

      onClose();
    } catch (err) {
      setError('Failed to save changes');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'Not set';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const onBirthdateChange = (event: any, selectedDate?: Date) => {
    setShowBirthdatePicker(false);
    if (selectedDate) {
      setBirthdate(selectedDate);
    }
  };

  const onAnniversaryChange = (event: any, selectedDate?: Date) => {
    setShowAnniversaryPicker(false);
    if (selectedDate) {
      setAnniversary(selectedDate);
    }
  };

  const LoadingOverlay = () => (
    <Modal
      visible={isUploading || isLoading}
      transparent
      animationType="fade"
    >
      <View style={styles.loadingOverlay}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {isUploading ? 'Uploading image...' : 'Saving changes...'}
          </Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} title="Edit Profile">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri:
                  profileImage ||
                  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity
              style={styles.changePhotoButton}
              onPress={pickImage}
              disabled={isLoading || isUploading}
            >
              <Camera size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.changePhotoText}>Change Profile Photo</Text>
        </View>

        <View style={styles.formContainer}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your name"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isLoading && !isUploading}
                />
                {errors.name && (
                  <Text style={styles.errorText}>{errors.name.message}</Text>
                )}
              </View>
            )}
          />

          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={styles.textArea}
                  placeholder="Tell us about yourself"
                  multiline
                  numberOfLines={4}
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  editable={!isLoading && !isUploading}
                />
                {errors.bio && (
                  <Text style={styles.errorText}>{errors.bio.message}</Text>
                )}
              </View>
            )}
          />

          <View style={styles.dateContainer}>
            <Text style={styles.inputLabel}>Birthdate</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowBirthdatePicker(true)}
              disabled={isLoading || isUploading}
            >
              <Calendar size={20} color="#666" style={styles.dateIcon} />
              <Text style={styles.dateText}>{formatDate(birthdate)}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateContainer}>
            <Text style={styles.inputLabel}>Anniversary</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowAnniversaryPicker(true)}
              disabled={isLoading || isUploading}
            >
              <Calendar size={20} color="#666" style={styles.dateIcon} />
              <Text style={styles.dateText}>{formatDate(anniversary)}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Social Media Links</Text>

          {[
            { name: 'instagram', Icon: Instagram, color: '#E1306C' },
            { name: 'twitter', Icon: Twitter, color: '#1DA1F2' },
            { name: 'facebook', Icon: Facebook, color: '#4267B2' },
            { name: 'linkedin', Icon: Linkedin, color: '#0077B5' },
          ].map(({ name, Icon, color }) => (
            <Controller
              key={name}
              control={control}
              name={name as keyof ProfileFormData}
              render={({ field: { onChange, value, onBlur } }) => (
                <View style={styles.socialInputContainer}>
                  <Icon size={20} color={color} style={styles.socialIcon} />
                  <TextInput
                    style={styles.socialInput}
                    placeholder={`${
                      name.charAt(0).toUpperCase() + name.slice(1)
                    } URL`}
                    value={value || ''}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    editable={!isLoading && !isUploading}
                  />
                  {errors[name as keyof ProfileFormData] && (
                    <Text style={styles.errorText}>
                      {errors[name as keyof ProfileFormData]?.message}
                    </Text>
                  )}
                </View>
              )}
            />
          ))}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              disabled={isLoading || isUploading}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.saveButton,
                (isLoading || isUploading) && styles.disabledButton,
              ]}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading || isUploading}
            >
              <Text style={styles.saveButtonText}>
                {isUploading
                  ? 'Uploading...'
                  : isLoading
                  ? 'Saving...'
                  : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {showBirthdatePicker && (
        <DateTimePicker
          value={birthdate || new Date()}
          mode="date"
          display="default"
          onChange={onBirthdateChange}
          maximumDate={new Date()}
        />
      )}

      {showAnniversaryPicker && (
        <DateTimePicker
          value={anniversary || new Date()}
          mode="date"
          display="default"
          onChange={onAnniversaryChange}
        />
      )}

      <LoadingOverlay />
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  scrollContainer: { padding: 20 },
  profileImageSection: { alignItems: 'center', marginBottom: 20 },
  profileImageContainer: { position: 'relative', marginBottom: 10 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  changePhotoButton: {
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
  changePhotoText: { fontSize: 14, color: '#5271FF' },
  formContainer: { marginBottom: 20 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, color: '#333', marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  errorText: { color: 'red', fontSize: 12, marginTop: 5 },
  dateContainer: { marginBottom: 20 },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
  },
  dateIcon: { marginRight: 10 },
  dateText: { fontSize: 14, color: '#333' },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  socialInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  socialIcon: { marginRight: 10 },
  socialInput: { flex: 1, fontSize: 14 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#5271FF',
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelButtonText: { color: '#5271FF', fontSize: 16 },
  saveButton: {
    flex: 1,
    backgroundColor: '#5271FF',
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: { backgroundColor: '#999' },
  saveButtonText: { color: '#fff', fontSize: 16 },
  loadingOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#333',
  },
});