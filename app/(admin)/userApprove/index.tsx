import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const ApproveUsers = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);

  // Fetch pending users
  useEffect(() => {
    // This would normally be an API call to fetch pending users
    // For demo purposes, we'll simulate it with dummy data
    setTimeout(() => {
      const dummyPendingUsers = [
        { id: '1', name: 'John Doe', email: 'john@example.com', apartmentNo: 'A-101', phone: '555-123-4567' },
        { id: '2', name: 'Jane Smith', email: 'jane@example.com', apartmentNo: 'B-205', phone: '555-987-6543' },
        { id: '3', name: 'Robert Johnson', email: 'robert@example.com', apartmentNo: 'C-310', phone: '555-456-7890' },
        { id: '4', name: 'Emily Davis', email: 'emily@example.com', apartmentNo: 'A-404', phone: '555-234-5678' },
        { id: '5', name: 'Michael Wilson', email: 'michael@example.com', apartmentNo: 'D-102', phone: '555-345-6789' },
      ];
      setPendingUsers(dummyPendingUsers);
      setLoading(false);
    }, 1000);
  }, []);

  // Toggle user selection for approval
  const toggleUserSelection = (userId) => {
    // Make sure user isn't in the rejected list
    if (rejectedUsers.includes(userId)) {
      setRejectedUsers(rejectedUsers.filter(id => id !== userId));
    }
    
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Toggle user rejection
  const toggleUserRejection = (userId) => {
    // Make sure user isn't in the selected list
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
    
    if (rejectedUsers.includes(userId)) {
      setRejectedUsers(rejectedUsers.filter(id => id !== userId));
    } else {
      setRejectedUsers([...rejectedUsers, userId]);
    }
  };

  // Approve selected users
  const approveUsers = () => {
    if (selectedUsers.length === 0 && rejectedUsers.length === 0) {
      Alert.alert('Action Required', 'Please select users to approve or reject');
      return;
    }

    // This would normally be an API call to update user statuses
    Alert.alert(
      'Confirm Action',
      `Approve ${selectedUsers.length} user(s) and reject ${rejectedUsers.length} user(s)?`,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: () => {
            // Here you would call your API to update user statuses
            Alert.alert(
              'Success', 
              `${selectedUsers.length} user(s) approved and ${rejectedUsers.length} user(s) rejected`
            );
            router.back(); // Navigate back to admin panel
          }
        }
      ]
    );
  };

  // Render each pending user item
  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
        <View style={styles.userDetails}>
          <View style={styles.detailItem}>
            <Ionicons name="home-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.apartmentNo}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{item.phone}</Text>
          </View>
        </View>
      </View>
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.approveButton,
            selectedUsers.includes(item.id) && styles.selectedApproveButton
          ]}
          onPress={() => toggleUserSelection(item.id)}
        >
          <Ionicons 
            name={selectedUsers.includes(item.id) ? "checkmark-circle" : "checkmark-circle-outline"} 
            size={24} 
            color={selectedUsers.includes(item.id) ? "#fff" : "#4CAF50"} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[
            styles.actionButton, 
            styles.rejectButton,
            rejectedUsers.includes(item.id) && styles.selectedRejectButton
          ]}
          onPress={() => toggleUserRejection(item.id)}
        >
          <Ionicons 
            name={rejectedUsers.includes(item.id) ? "close-circle" : "close-circle-outline"} 
            size={24} 
            color={rejectedUsers.includes(item.id) ? "#fff" : "#F44336"} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor="#3F51B5" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Approve Society Users</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsText}>
          Review and approve new users requesting to join the society.
          Tap the green check to approve or red cross to reject.
        </Text>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: '#E8F5E9' }]}>
          <Text style={[styles.statNumber, { color: '#4CAF50' }]}>{selectedUsers.length}</Text>
          <Text style={styles.statLabel}>To Approve</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: '#FFEBEE' }]}>
          <Text style={[styles.statNumber, { color: '#F44336' }]}>{rejectedUsers.length}</Text>
          <Text style={styles.statLabel}>To Reject</Text>
        </View>
      </View>

      {/* User List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3F51B5" />
          <Text style={styles.loadingText}>Loading pending users...</Text>
        </View>
      ) : (
        <>
          <FlatList
            data={pendingUsers}
            renderItem={renderUserItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="people" size={60} color="#ccc" />
                <Text style={styles.emptyStateText}>No pending user requests</Text>
              </View>
            }
          />

          {/* Submit Button */}
          <View style={styles.submitContainer}>
            <TouchableOpacity 
              style={[
                styles.submitButton, 
                (selectedUsers.length === 0 && rejectedUsers.length === 0) && styles.disabledButton
              ]} 
              onPress={approveUsers}
            >
              <Ionicons name="save-outline" size={24} color="#fff" />
              <Text style={styles.buttonText}>
                Submit Approval Decisions
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default ApproveUsers;

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
    marginBottom: 5,
    borderRadius: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#3F51B5',
  },
  instructionsText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    marginBottom: 5,
  },
  statCard: {
    padding: 15,
    borderRadius: 10,
    width: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 16,
    color: '#666',
    marginTop: 2,
  },
  listContainer: {
    padding: 15,
  },
  userItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  userInfo: {
    flex: 1,
    paddingRight: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  userEmail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  userDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 4,
  },
  approveButton: {
    backgroundColor: '#E8F5E9',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  selectedApproveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FFEBEE',
    borderWidth: 1,
    borderColor: '#F44336',
  },
  selectedRejectButton: {
    backgroundColor: '#F44336',
  },
  submitContainer: {
    padding: 15,
    paddingBottom: 25,
  },
  submitButton: {
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