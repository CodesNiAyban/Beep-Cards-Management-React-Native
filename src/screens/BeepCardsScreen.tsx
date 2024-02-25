import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';

// Sample JSON data for beep cards
const beepCardsData: BeepCardsModel[] = [
  {
    UUIC: 637805000000000,
    balance: 4914,
    isActive: false,
    createdAt: '2024-02-06T20:46:23.172Z',
    updatedAt: '2024-02-06T20:46:23.172Z',
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

// Function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString();
};

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
  const renderItem = ({ item }: { item: BeepCardsModel}) => {
    const latestTimestamp = getLatestTimestamp(item.createdAt, item.updatedAt);
    const timestampText = latestTimestamp === item.createdAt ? 'Created at' : 'Last Updated';

    return (
      <TouchableOpacity style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <FontAwesome5 name="credit-card" size={18} color="#333" style={styles.icon} />
          <Text style={styles.cardHeaderText}>Card Details</Text>
          <FontAwesome5 name="trash" size={18} color="#999" style={styles.trashIcon} />
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.row}>
            <FontAwesome5 name="id-card" size={16} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.cardName}>UUID: {item.UUIC}</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome5 name="dollar-sign" size={20} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.cardBalance}>Balance: ${item.balance}</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome5 name="calendar-alt" size={16} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.timestamp}>
              {timestampText}: {formatDate(latestTimestamp)}
            </Text>
          </View>
          <View style={styles.nestedBadge}>
            <View
              // eslint-disable-next-line react-native/no-inline-styles
              style={[styles.badge, { backgroundColor: item.isActive ? '#00E676' : '#FF1744' }]}
            />
            <Text style={styles.badgeText}>{getOnboardStatus(item.isActive)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render message when no beep cards are found
  const renderEmptyMessage = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No Beep Cards Found.{'\n'}Click Add Button to Add Beep Cards.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {beepCardsData.length > 0 ? (
        <FlatList
          data={beepCardsData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.list}
        />
      ) : (
        renderEmptyMessage()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1', // Cream background color
  },
  list: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  cardContainer: {
    backgroundColor: '#FFA726', // Orange lighter shade background color
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dark text color
  },
  trashIcon: {
    marginLeft: 'auto', // Push the trash icon to the right
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    color: '#FFFFFF', // White text color
    marginBottom: 5,
  },
  cardBalance: {
    fontSize: 16,
    color: '#FFFFFF', // White text color
    marginBottom: 5,
  },
  timestamp: {
    fontSize: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 24,
    textAlign: 'center',
    color: '#555', // Dark gray text color
    lineHeight: 30, // Increase line height for better readability
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
});

export default BeepCardsScreen;
