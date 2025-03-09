import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // You need to install this package
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const AdminPanel = () => {
  // Sample state for demonstration
  const [admins, setAdmins] = React.useState(0);
  const [users, setUsers] = React.useState(0);
  const router = useRouter();
  // Handler functions
  const handleAddAdmin = () => {
    router.navigate('/(admin)/addAdmin');
  };

  const handleAddUser = () => {
    router.navigate('/(admin)/userApprove');
  };

  const handleViewChats = () => {
    router.navigate('/(admin)/chat');
  };

  const handleDownloadExcel = () => {
    Alert.alert('Download', 'Downloading Excel sheet');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* StatusBar */}
      <StatusBar barStyle="light-content" backgroundColor="#3F51B5" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <Ionicons name="person-circle-outline" size={30} color="#fff" />
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{admins}</Text>
          <Text style={styles.statLabel}>Admins</Text>
          <View style={styles.statIconContainer}>
            <Ionicons name="shield-outline" size={24} color="#3F51B5" />
          </View>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{users}</Text>
          <Text style={styles.statLabel}>Users</Text>
          <View style={styles.statIconContainer}>
            <Ionicons name="people-outline" size={24} color="#3F51B5" />
          </View>
        </View>
      </View>

      {/* Main Actions */}
      <ScrollView style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#3F51B5' }]}
          onPress={handleAddAdmin}
        >
          <Ionicons name="person-add-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#5C6BC0' }]}
          onPress={handleAddUser}
        >
          <Ionicons name="people-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#7986CB' }]}
          onPress={handleViewChats}
        >
          <Ionicons name="chatbubbles-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>See Chats</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: '#9FA8DA' }]}
          onPress={handleDownloadExcel}
        >
          <Ionicons name="download-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Download Excel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AdminPanel;

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
  headerTitle: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    marginTop: 10,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    width: '45%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
    paddingBottom: 30,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#3F51B5',
  },
  statLabel: {
    fontSize: 18,
    color: '#666',
    marginTop: 5,
  },
  statIconContainer: {
    position: 'absolute',
    bottom: -15,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionsContainer: {
    padding: 20,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    marginLeft: 15,
    fontWeight: '500',
  },
});
