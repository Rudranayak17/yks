import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import React from 'react';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router'; // Updated to use useRouter and useLocalSearchParams

// Sample data with address instead of units
const societyData = [
  { 
    id: '1', 
    name: 'Sunrise Society', 
    owner: 'John Doe', 
    phone: '555-0101',
    address: '123 Morning Avenue, Sunnyville',
    rating: 4.5 
  },
  { 
    id: '2', 
    name: 'Moonlight Residency', 
    owner: 'Jane Smith', 
    phone: '555-0102',
    address: '456 Evening Street, Moontown',
    rating: 4.2
  },
  { 
    id: '3', 
    name: 'Starview Apartments', 
    owner: 'Mike Johnson', 
    phone: '555-0103',
    address: '789 Galaxy Road, Starfield',
    rating: 4.8
  },
  { 
    id: '4', 
    name: 'Green Valley', 
    owner: 'Sarah Williams', 
    phone: '555-0104',
    address: '101 Forest Lane, Greenfield',
    rating: 4.0
  },
  { 
    id: '5', 
    name: 'Blue Horizon', 
    owner: 'Robert Brown', 
    phone: '555-0105',
    address: '202 Ocean View Drive, Coastville',
    rating: 4.7
  },
];

const SocietyList = () => {
  // Using useRouter from expo-router
  const router = useRouter();
  
  // Using useLocalSearchParams to get parameters
  const params = useLocalSearchParams();
  
  // Function to render stars based on rating
  const renderRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    
    return (
      <View style={styles.ratingContainer}>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name={
              i < fullStars 
                ? 'star' 
                : i === fullStars && halfStar 
                  ? 'star-half' 
                  : 'star-outline'
            }
            size={16}
            color="#FFD700"
            style={styles.starIcon}
          />
        ))}
        <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      </View>
    );
  };

  // Navigate to society details
  const navigateToDetails = (society) => {
    router.push({
      pathname: "/(tabs)/admin/[id]",
      params: { id: society.id, name: society.name }
    });
  };

  // Render item for each society
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.itemHeader}>
        <View style={styles.societyInitial}>
          <Text style={styles.initialText}>{item.name.charAt(0)}</Text>
        </View>
        <View style={styles.headerRight}>
          <Text style={styles.societyName}>{item.name}</Text>
          {renderRatingStars(item.rating)}
        </View>
      </View>
      
      <View style={styles.divider} />
      
      <View style={styles.itemContent}>
        <View style={styles.detailRow}>
          <Ionicons name="person" size={18} color="#5C6BC0" />
          <Text style={styles.detailText}>Owner: <Text style={styles.detailValue}>{item.owner}</Text></Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="call" size={18} color="#5C6BC0" />
          <Text style={styles.detailText}>Phone: <Text style={styles.detailValue}>{item.phone}</Text></Text>
        </View>
        
        <View style={styles.detailRow}>
          <Ionicons name="location" size={18} color="#5C6BC0" />
          <Text style={styles.detailText}>Address: <Text style={styles.detailValue}>{item.address}</Text></Text>
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

  // Go back function
  const goBack = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#3F51B5" />
      
      {/* Header with back button */}
      <View style={styles.header}>
        <View style={styles.headerContent}>

          <Text style={styles.headerTitle}>{params.title || "Societies"}</Text>
          <View style={styles.rightPlaceholder} />
        </View>
      </View>
      
      {/* Subtitle */}
      <View style={styles.subtitleContainer}>
        <Text style={styles.subtitle}>Featured Societies</Text>
        <Text style={styles.subtitleCount}>{societyData.length} listings</Text>
      </View>
      
      {/* FlashList */}
      <FlashList
        data={societyData}
        renderItem={renderItem}
        estimatedItemSize={150}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

export default SocietyList;

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
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    marginRight: 2,
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
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
});