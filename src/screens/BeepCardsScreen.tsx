import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Define the type for beep card items
interface BeepCardItem {
  UUIC: number;
  balance: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Sample JSON data for beep cards
const beepCardsData: BeepCardItem[] = [
  {
    UUIC: 637805000000000,
    balance: 4914,
    isActive: false,
    createdAt: '2024-02-06T20:46:23.172Z',
    updatedAt: '2024-02-19T16:52:30.917Z',
  },
  {
    UUIC: 637805000000001,
    balance: 2000,
    isActive: true,
    createdAt: '2024-02-10T10:00:00.000Z',
    updatedAt: '2024-02-20T12:30:00.000Z',
  },
  {
    UUIC: 637805000000002,
    balance: 3000,
    isActive: true,
    createdAt: '2024-02-15T15:30:00.000Z',
    updatedAt: '2024-02-21T14:45:00.000Z',
  },
  // Add more beep cards as needed
];

const BeepCardsScreen = () => {
  // Function to determine the latest timestamp
  const getLatestTimestamp = (createdAt: string, updatedAt: string): string => {
    return new Date(updatedAt) > new Date(createdAt) ? updatedAt : createdAt;
  };

  // Function to get onboarded status
  const getOnboardStatus = (isActive: boolean): string => {
    return isActive ? 'Onboarded' : 'Not Onboarded';
  };

  // Render item for FlatList
  const renderItem = ({ item }: { item: BeepCardItem }) => (
    <TouchableOpacity style={styles.cardContainer}>
      <FontAwesome5 name="credit-card" size={24} color="#FFFFFF" style={styles.icon} />
      <View style={styles.cardDetails}>
        <Text style={styles.cardName}>{item.UUIC}</Text>
        <Text style={styles.cardBalance}>Balance: ${item.balance}</Text>
        <Text style={styles.timestamp}>Last Updated: {getLatestTimestamp(item.createdAt, item.updatedAt)}</Text>
        <View style={styles.nestedBadge}>
          <View style={[styles.badge, { backgroundColor: item.isActive ? '#00E676' : '#FF1744' }]} />
          <Text style={styles.badgeText}>{getOnboardStatus(item.isActive)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={beepCardsData}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1', // Cream background color
  },
  list: {
    padding: 20,
  },
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFA726', // Orange lighter shade background color
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  icon: {
    marginRight: 15,
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF', // White text color
    marginBottom: 5,
  },
  cardBalance: {
    fontSize: 16,
    color: '#FFFFFF', // White text color
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 14,
    color: '#FFFFFF', // White text color
    marginBottom: 5,
  },
  badge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 5,
  },
  nestedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC55C', // Nested badge background color
    borderRadius: 20, // Make it a circle by setting half of the width and height
    paddingHorizontal: 10, // Add padding horizontally to make it larger
    paddingVertical: 5, // Add padding vertically to make it larger
  },
  badgeText: {
    color: '#FFFFFF', // White text color
    fontWeight: 'bold',
    marginLeft: 5, // Add margin to separate text from circle
  },
});

export default BeepCardsScreen;
