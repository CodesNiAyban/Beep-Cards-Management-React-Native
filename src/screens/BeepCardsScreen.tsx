// BeepCardsScreen.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';
import ConfirmationModal from '../components/ConfirmationModal';

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
  const [selectedBeepCard, setSelectedBeepCard] = useState<BeepCardsModel | null>(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  const handleTrashPress = (item: BeepCardsModel) => {
    setSelectedBeepCard(item);
    setIsConfirmationModalVisible(true);
  };

  const handleConfirmDelete = () => {
    // Logic to delete the selected beep card
    // Once the deletion is done, you can close the modal and update the beepCardsData array
    // For demonstration purposes, let's just log the action
    console.log('Beep card deleted:', selectedBeepCard?.UUIC);
    setIsConfirmationModalVisible(false);
  };

  // Function to determine the latest timestamp
  const getLatestTimestamp = (createdAt: string, updatedAt: string): string => {
    return new Date(updatedAt) > new Date(createdAt) ? updatedAt : createdAt;
  };

  // Function to get onboarded status
  const getOnboardStatus = (isActive: boolean): string => {
    return isActive ? 'Onboarded' : 'Not Onboarded';
  };

  // Render item for FlatList
  const renderItem = ({ item }: { item: BeepCardsModel }) => {
    const latestTimestamp = getLatestTimestamp(item.createdAt, item.updatedAt);
    const timestampText = latestTimestamp === item.createdAt ? 'Created at' : 'Last Updated';

    return (
      <TouchableOpacity style={styles.cardContainer}>
        <View style={styles.cardHeader}>
          <FontAwesome5 name="credit-card" size={18} color="#333" style={styles.icon} />
          <Text style={styles.cardHeaderText}>Beep Card Details</Text>
          <TouchableOpacity onPress={() => handleTrashPress(item)}>
            <FontAwesome5 name="trash" size={18} color="#999" style={styles.trashIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardDetails}>
          <View style={styles.row}>
            <FontAwesome5 name="id-card" size={16} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.cardName}>UUID: {item.UUIC}</Text>
          </View>
          <View style={styles.row}>
            <FontAwesome5 name="money-bill-alt" size={16} color="#FFFFFF" style={styles.icon} />
            <Text style={styles.cardBalance}>Balance: PhP {item.balance}</Text>
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
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        onClose={() => setIsConfirmationModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title={'Delete Beep Card'}
        message={'Do you want to remove the following beep card from your list of beep cards?'}
        beepCardDetails={selectedBeepCard ? `UUID: ${selectedBeepCard.UUIC}` : ''}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFEBCD',
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10, // Added paddingHorizontal for consistent padding
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333', // Dark text color
    fontFamily: 'Roboto', // Changed font to Roboto
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
    fontFamily: 'Roboto', // Changed font to Roboto
    paddingHorizontal: 10, // Added paddingHorizontal for consistent padding
  },
  cardBalance: {
    fontSize: 16,
    color: '#FFFFFF', // White text color
    marginBottom: 5,
    fontFamily: 'Roboto', // Changed font to Roboto
    paddingHorizontal: 10, // Added paddingHorizontal for consistent padding
  },
  timestamp: {
    fontSize: 16,
    color: '#FFFFFF', // White text color
    marginBottom: 5,
    fontFamily: 'Roboto', // Changed font to Roboto
    paddingHorizontal: 10, // Added paddingHorizontal for consistent padding
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
    fontFamily: 'Roboto', // Changed font to Roboto
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
    fontFamily: 'Roboto', // Changed font to Roboto
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10, // Added paddingHorizontal for consistent padding
  },
  icon: {
    marginRight: 5,
  },
});

export default BeepCardsScreen;
