import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';
import ConfirmationModal from '../components/ConfirmationModal';
import { fetchBeepCard } from '../network/BeepCardManagerAPI'; // Import the fetchBeepCard function from your API file

const BeepCardsScreen = () => {
  const [beepCards, setBeepCards] = useState<BeepCardsModel[]>([]); // State to store fetched beep cards
  const [selectedBeepCard, setSelectedBeepCard] = useState<BeepCardsModel | null>(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);

  useEffect(() => {
    // Fetch beep cards from API when component mounts
    const fetchBeepCardsData = async () => {
      try {
        const data = await fetchBeepCard();
        setBeepCards(data);
      } catch (error) {
        console.error('Error fetching beep cards:', error);
        // Handle error if needed
      }
    };

    fetchBeepCardsData();

    // Clean up function
    return () => {
      // Perform any cleanup if needed
    };
  }, []); // Empty dependency array ensures the effect runs only once on mount

  const handleTrashPress = (item: BeepCardsModel) => {
    setSelectedBeepCard(item);
    setIsConfirmationModalVisible(true);
  };

  const handleConfirmDelete = () => {
    // Logic to delete the selected beep card
    // Once the deletion is done, you can close the modal and update the beepCards array
    // For demonstration purposes, let's just log the action
    console.log('Beep card deleted:', selectedBeepCard?.UUIC);
    setIsConfirmationModalVisible(false);
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
      {beepCards.length > 0 ? (
        <FlatList
          data={beepCards}
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
