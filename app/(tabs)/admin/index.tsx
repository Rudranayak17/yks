import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useGet_societyQuery } from '@/store/api/society';

const SocietyList = () => {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Fetch society data using the query hook
  const { data, isLoading, error } = useGet_societyQuery({});

  // Navigate to society details
  const navigateToDetails = (society) => {
    router.push({
      pathname: '/(tabs)/admin/[id]',
      params: { id: society._id, name: society.name },
    });
  };

  // Render item for each society
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.societyInitial}>
          <Text style={styles.initialText}>
            {item.name ? item.name.charAt(0) : 'N/A'}
          </Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.societyName}>{item.name || 'Unnamed Society'}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.itemContent}>
        <View style={styles.detailRow}>
          <Ionicons name="person" size={18} color="#5C6BC0" />
          <Text style={styles.detailText}>
            Owner: <Text style={styles.detailValue}>{item.ownerName || 'N/A'}</Text>
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="call" size={18} color="#5C6BC0" />
          <Text style={styles.detailText}>
            Phone: <Text style={styles.detailValue}>{item.phoneNumber || 'N/A'}</Text>
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Ionicons name="location" size={18} color="#5C6BC0" />
          <Text style={styles.detailText}>
            Address: <Text style={styles.detailValue}>{item.address || 'N/A'}</Text>
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.cardFooter}
        onPress={() => navigateToDetails(item)}
      >
        <View style={styles.exploreButton}>
          <Ionicons name="compass-outline" size={18} color="#FFF" />
          <Text style={styles.actionText}>Explore</Text>
        </View>
      </TouchableOpacity>
    </View>
  );

  // Handle loading state
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Error: {error.message || 'Failed to load societies'}
        </Text>
      </View>
    );
  }

  // Extract society data from API response with a fallback
  const societyData = data?.data || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3F51B5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>{params.title || 'Societies'}</Text>
          <View style={styles.rightPlaceholder} />
        </View>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Featured Societies</Text>
        <Text style={styles.subtitleCount}>{societyData.length} listings</Text>
      </View>

      {/* FlashList with real data */}
      <FlashList
        data={societyData}
        renderItem={renderItem}
        estimatedItemSize={150}
        keyExtractor={(item) => item._id || Math.random().toString()} // Fallback for key
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />

      {/* Add Society Button */}
      <TouchableOpacity style={styles.addButtonContainer} onPress={() => router.navigate('/(admin)/AddSociety')}>
        <AntDesign
          name="pluscircle"
          size={60}
          color="#3F51B5"
          style={styles.addButton}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SocietyList;

// Styles remain unchanged
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
  headerTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightPlaceholder: {
    width: 24,
  },
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  subtitleCount: {
    fontSize: 14,
    color: '#666',
  },
  listContent: {
    padding: 15,
    paddingBottom: 30,
  },
  itemContainer: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    padding: 15,
    alignItems: 'center',
  },
  societyInitial: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#5C6BC0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  initialText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flex: 1,
  },
  societyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 15,
  },
  itemContent: {
    padding: 15,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 10,
  },
  detailValue: {
    color: '#333',
    fontWeight: '500',
  },
  cardFooter: {
    height: 45,
  },
  exploreButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  actionText: {
    color: '#FFF',
    marginLeft: 8,
    fontWeight: '500',
    fontSize: 16,
  },
  addButton: {
    position: 'absolute',
    bottom: 5,
    right: 15,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginTop: 20,
  },
  addButtonContainer: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 80,  // Wider than the icon
    height: 80, // Taller than the icon
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  errorText: {
    fontSize: 18,
    color: '#D32F2F',
    textAlign: 'center',
    marginTop: 20,
  },
});