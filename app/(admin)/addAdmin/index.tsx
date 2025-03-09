import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AddAdmin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [nonAdminUsers, setNonAdminUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  // Fetch non-admin users
  useEffect(() => {
    // This would normally be an API call to fetch users
    // For demo purposes, we'll simulate it with dummy data
    setTimeout(() => {
      const dummyUsers = [
        { id: '1', name: 'John Doe', email: 'john@example.com' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com' },
        { id: '3', name: 'Robert Johnson', email: 'robert@example.com' },
        { id: '4', name: 'Emily Davis', email: 'emily@example.com' },
        { id: '5', name: 'Michael Wilson', email: 'michael@example.com' },
      ];
      setNonAdminUsers(dummyUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Toggle user selection
  const toggleUserSelection = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Approve selected users as admins
  const approveAdmins = () => {
    if (selectedUsers.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one user to make admin');
      return;
    }

    // This would normally be an API call to update user roles
    Alert.alert(
      'Confirm Action',
      `Make ${selectedUsers.length} user(s) admins?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Approve',
          onPress: () => {
            // Here you would call your API to update user roles
            Alert.alert('Success', `${selectedUsers.length} user(s) have been made admins`);
            router.back(); // Navigate back to admin panel
          }
        }
      ]
    );
  };

  // Render each user item
  const renderUserItem = ({ item }) => (
    <TouchableOpacity 
      style={[
        styles.userItem, 
        selectedUsers.includes(item.id) && styles.selectedUserItem
      ]}
      onPress={() => toggleUserSelection(item.id)}
    >
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={styles.checkboxContainer}>
        {selectedUsers.includes(item.id) ? (
          <Ionicons name="checkbox" size={24} color="#3F51B5" />
        ) : (
          <Ionicons name="square-outline" size={24} color="#3F51B5" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#3F51B5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Admin</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Select users from the list below to grant admin privileges.
        </Text>
      </View>

      {/* User List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3F51B5" />
          <Text style={styles.loadingText}>Loading users...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={nonAdminUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="people" size={60} color="#ccc" />
                <Text style={styles.emptyStateText}>No non-admin users found</Text>
              </View>
            }
          />

          {/* Action Buttons */}
          <View style={styles.actionContainer}>
            <TouchableOpacity 
              style={[
                styles.actionButton, 
                selectedUsers.length === 0 && styles.disabledButton
              ]} 
              onPress={approveAdmins}
            >
              <Ionicons name="shield" size={24} color="#fff" />
              <Text style={styles.buttonText}>
                Make Admin ({selectedUsers.length})
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default AddAdmin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    backgroundColor: '#3F51B5',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  instructionsContainer: {
    padding: 15,
    backgroundColor: '#E8EAF6',
    margin: 15,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3F51B5',
  },
  instructionsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  listContainer: {
    padding: 15,
  },
  userItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedUserItem: {
    backgroundColor: '#E8EAF6',
    borderWidth: 1,
    borderColor: '#3F51B5',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginTop: 3,
  },
  checkboxContainer: {
    marginLeft: 10,
  },
  actionContainer: {
    padding: 15,
    paddingBottom: 25,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3F51B5',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: '#9FA8DA',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 10,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  emptyStateText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});