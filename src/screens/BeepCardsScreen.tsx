import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ConfirmationModal from '../components/ConfirmationModal';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { deleteUser } from '../network/BeepCardManagerAPI';

const BeepCardsScreen = ({ beepCards }: { beepCards: BeepCardsModel[] }) => {
  const [selectedBeepCard, setSelectedBeepCard] = useState<BeepCardsModel | null>(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [deviceID, setDeviceID] = useState<string | null>(null); // State to store device ID
  const [filteredBeepCards, setFilteredBeepCards] = useState<BeepCardsModel[]>([]); // State to store filtered beep cards

  // Fetch the deviceId from AsyncStorage on component mount
  useEffect(() => {
    const getDeviceId = async () => {
      const id = await AsyncStorage.getItem('deviceId');
      setDeviceID(id);
    };
    getDeviceId();
  }, []);

  // Filter beepCards based on the userId matching deviceId
  useEffect(() => {
    const filterBeepCards = async () => {
      if (deviceID) {
        const filteredResults = await Promise.all(beepCards.map(async beepCard => {
          if (await beepCard.userID === deviceID) {
            return beepCard;
          }
          return null; // Ensure we return null for non-matching cards
        }));
        const filteredCards = filteredResults.filter(card => card !== null) as BeepCardsModel[]; // Filter out null values
        setFilteredBeepCards(filteredCards);
      }
    };
    filterBeepCards();
  }, [deviceID, beepCards]);


  const handleTrashPress = (item: BeepCardsModel) => {
    setSelectedBeepCard(item);
    setIsConfirmationModalVisible(true);
  };

  // Function to handle deletion of the selected beep card
  const handleConfirmDelete = async () => {
    if (selectedBeepCard) {
      try {
        // Call the deleteUser function from the API file to delete the selected beep card
        await deleteUser(selectedBeepCard._id);
        console.log('Beep card deleted:', selectedBeepCard?.UUIC);
        setIsConfirmationModalVisible(false);
        // Assuming you have a function to fetch updated beep cards, you can call it here to update the list
      } catch (error) {
        console.error('Error deleting beep card:', error);
        // Handle error as needed
      }
    }
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const renderItem = ({ item }: { item: BeepCardsModel }) => {
    const latestTimestamp = item.updatedAt > item.createdAt ? item.updatedAt : item.createdAt;
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
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyMessage = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No Beep Cards Found.{'\n'}Click Add Button to Add Beep Cards.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {filteredBeepCards.length > 0 ? (
        <FlatList
          data={filteredBeepCards}
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
    backgroundColor: '#FFA726',
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
    paddingHorizontal: 10,
  },
  cardHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
  },
  trashIcon: {
    marginLeft: 'auto',
  },
  cardDetails: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
    fontFamily: 'Roboto',
    paddingHorizontal: 10,
  },
  cardBalance: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
    fontFamily: 'Roboto',
    paddingHorizontal: 10,
  },
  timestamp: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 5,
    fontFamily: 'Roboto',
    paddingHorizontal: 10,
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
    color: '#555',
    lineHeight: 30,
    fontFamily: 'Roboto',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  icon: {
    marginRight: 5,
  },
});

export default BeepCardsScreen;
