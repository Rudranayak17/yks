import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Platform, Modal } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { X, Camera, Calendar, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '../context/AuthContext';

const profileSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  bio: yup.string(),
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
  userData: any;
}

// Placeholder BottomSheet component (replace with your actual BottomSheet implementation)
const BottomSheet: React.FC<{ isVisible: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({
  isVisible,
  onClose,
  title,
  children,
}) => (
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
  userData,
}) => {
  const { updateProfile } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(userData?.profilePicture || null);
  const [showBirthdatePicker, setShowBirthdatePicker] = useState(false);
  const [showAnniversaryPicker, setShowAnniversaryPicker] = useState(false);
  const [birthdate, setBirthdate] = useState<Date | undefined>(userData?.birthdate ? new Date(userData.birthdate) : undefined);
  const [anniversary, setAnniversary] = useState<Date | undefined>(userData?.anniversary ? new Date(userData.anniversary) : undefined);

  const { control, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      name: userData?.name || '',
      bio: userData?.bio || '',
      instagram: userData?.socialLinks?.instagram || null,
      twitter: userData?.socialLinks?.twitter || null,
      facebook: userData?.socialLinks?.facebook || null,
      linkedin: userData?.socialLinks?.linkedin || null,
    },
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const onSubmit = (data: ProfileFormData) => {
    updateProfile({
      name: data.name,
      bio: data.bio,
      profilePicture: profileImage,
      birthdate,
      anniversary,
      socialLinks: {
        instagram: data.instagram,
        twitter: data.twitter,
        facebook: data.facebook,
        linkedin: data.linkedin,
      },
    });
    onClose();
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
    const currentDate = selectedDate || birthdate;
    setShowBirthdatePicker(false); // Close picker after selection
    if (currentDate) {
      setBirthdate(currentDate);
    }
  };

  const onAnniversaryChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || anniversary;
    setShowAnniversaryPicker(false); // Close picker after selection
    if (currentDate) {
      setAnniversary(currentDate);
    }
  };

  return (
    <BottomSheet isVisible={isVisible} onClose={onClose} title="Edit Profile">
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profileImageSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{
                uri: profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1760&q=80',
              }}
              style={styles.profileImage}
            />
            <TouchableOpacity style={styles.changePhotoButton} onPress={pickImage}>
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
                />
                {errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
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
                />
              </View>
            )}
          />

          <View style={styles.dateContainer}>
            <Text style={styles.inputLabel}>Birthdate</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowBirthdatePicker(true)}
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
            >
              <Calendar size={20} color="#666" style={styles.dateIcon} />
              <Text style={styles.dateText}>{formatDate(anniversary)}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Social Media Links</Text>

          <Controller
            control={control}
            name="instagram"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.socialInputContainer}>
                <Instagram size={20} color="#E1306C" style={styles.socialIcon} />
                <TextInput
                  style={styles.socialInput}
                  placeholder="Instagram URL"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </View>
            )}
          />
          {errors.instagram && <Text style={styles.errorText}>{errors.instagram.message}</Text>}

          <Controller
            control={control}
            name="twitter"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.socialInputContainer}>
                <Twitter size={20} color="#1DA1F2" style={styles.socialIcon} />
                <TextInput
                  style={styles.socialInput}
                  placeholder="Twitter URL"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </View>
            )}
          />
          {errors.twitter && <Text style={styles.errorText}>{errors.twitter.message}</Text>}

          <Controller
            control={control}
            name="facebook"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.socialInputContainer}>
                <Facebook size={20} color="#4267B2" style={styles.socialIcon} />
                <TextInput
                  style={styles.socialInput}
                  placeholder="Facebook URL"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </View>
            )}
          />
          {errors.facebook && <Text style={styles.errorText}>{errors.facebook.message}</Text>}

          <Controller
            control={control}
            name="linkedin"
            render={({ field: { onChange, value, onBlur } }) => (
              <View style={styles.socialInputContainer}>
                <Linkedin size={20} color="#0077B5" style={styles.socialIcon} />
                <TextInput
                  style={styles.socialInput}
                  placeholder="LinkedIn URL"
                  value={value || ''}
                  onChangeText={onChange}
                  onBlur={onBlur}
                />
              </View>
            )}
          />
          {errors.linkedin && <Text style={styles.errorText}>{errors.linkedin.message}</Text>}

          <TouchableOpacity style={styles.saveButton} onPress={handleSubmit(onSubmit)}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {showBirthdatePicker && (
        <DateTimePicker
          value={birthdate || new Date()}
          mode="date"
          display="default"
          onChange={onBirthdateChange}
          maximumDate={new Date()} // Optional: restrict to past dates
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
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#333',
  },
  scrollContainer: {
    padding: 20,
  },
  profileImageSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
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
  changePhotoText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#5271FF',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
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
  dateContainer: {
    marginBottom: 20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
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
  socialIcon: {
    marginRight: 10,
  },
  socialInput: {
    flex: 1,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#5271FF',
    borderRadius: 10,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
  },
});