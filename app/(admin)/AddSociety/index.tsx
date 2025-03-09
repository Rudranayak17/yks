import { 
    StyleSheet, 
    Text, 
    View, 
    StatusBar, 
    TouchableOpacity, 
    TextInput, 
    ScrollView, 
    Alert, 
    ActivityIndicator 
  } from 'react-native';
  import React, { useState } from 'react';
  import { Ionicons } from '@expo/vector-icons';
  import { useRouter } from 'expo-router';
  import { useCreate_societyMutation } from '@/store/api/society';
  
  const AddSociety = () => {
    const router = useRouter();
    
    // State for form fields and loading
    const [societyName, setSocietyName] = useState('');
    const [ownerName, setOwnerName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [createSociety] = useCreate_societyMutation();
  
    // Form validation
    const isFormValid = () => {
      return societyName.trim() !== '' && 
             ownerName.trim() !== '' && 
             phoneNumber.trim() !== '' && 
             address.trim() !== '';
    };
    
    // Handle form submission
    const handleSubmit = async () => {
      if (!isFormValid()) {
        Alert.alert('Error', 'Please fill all the fields');
        return;
      }
    
      setIsLoading(true);
    
      const societyData = {
        name: societyName,
        address: address,
        ownerName: ownerName,
        phoneNumber: phoneNumber,
      };
    
      try {
        const response = await createSociety(societyData).unwrap();
        
        Alert.alert(
          'Success',
          'Society added successfully!',
          [{
            text: 'OK',
            onPress: () => router.back(),
          }]
        );
      } catch (error: any) {
        console.error('Error creating society:', error);
        Alert.alert(
          'Error',
          error?.data?.message || 'Failed to add society. Please try again.',
        );
      } finally {
        setIsLoading(false);
      }
    };
    
    // Go back function
    const goBack = () => {
      router.back();
    };
    
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#3F51B5" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add New Society</Text>
            <View style={styles.rightPlaceholder} />
          </View>
        </View>
        
        <ScrollView 
          style={styles.formContainer}
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Society Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Society Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="business" size={20} color="#5C6BC0" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter society name"
                value={societyName}
                onChangeText={setSocietyName}
              />
            </View>
          </View>
          
          {/* Owner Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Owner Name</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="person" size={20} color="#5C6BC0" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter owner name"
                value={ownerName}
                onChangeText={setOwnerName}
              />
            </View>
          </View>
          
          {/* Phone Number Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="call" size={20} color="#5C6BC0" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>
          
          {/* Address Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Address</Text>
            <View style={styles.inputWrapper}>
              <Ionicons name="location" size={20} color="#5C6BC0" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter full address"
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                value={address}
                onChangeText={setAddress}
              />
            </View>
          </View>
          
          {/* Submit Button */}
          <TouchableOpacity 
            style={[
              styles.submitButton,
              (!isFormValid() || isLoading) && styles.submitButtonDisabled
            ]}
            onPress={handleSubmit}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="add-circle" size={20} color="#FFF" />
                <Text style={styles.submitButtonText}>Add Society</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  };
  
  export default AddSociety;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F5F7FA',
    },
    header: {
      backgroundColor: '#3F51B5',
      paddingTop: 50,
      paddingBottom: 15,
      elevation: 4,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
    },
    backButton: {
      padding: 5,
    },
    headerTitle: {
      color: '#FFF',
      fontSize: 20,
      fontWeight: 'bold',
    },
    rightPlaceholder: {
      width: 24,
    },
    formContainer: {
      flex: 1,
    },
    formContent: {
      padding: 20,
    },
    inputGroup: {
      marginBottom: 20,
    },
    inputLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFF',
      borderRadius: 10,
      paddingHorizontal: 15,
      paddingVertical: 5,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    inputIcon: {
      marginRight: 10,
    },
    textInput: {
      flex: 1,
      paddingVertical: 12,
      fontSize: 16,
      color: '#333',
    },
    submitButton: {
      backgroundColor: '#4CAF50',
      borderRadius: 10,
      paddingVertical: 15,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 40,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    submitButtonDisabled: {
      backgroundColor: '#A5D6A7',
      opacity: 0.7,
    },
    submitButtonText: {
      color: '#FFF',
      fontWeight: '600',
      fontSize: 18,
      marginLeft: 10,
    },
  });