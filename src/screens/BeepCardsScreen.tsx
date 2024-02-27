import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ConfirmationModal from '../components/ConfirmationModal';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';
import { deleteUser } from '../network/BeepCardManagerAPI';
import AddBeepCardModal from '../components/AddBeepCardModal'; // Import the AddBeepCardModal component
import { Toast } from 'toastify-react-native';


interface BeepCardsScreenProps {
  beepCards: BeepCardsModel[];
  setBeepCards: React.Dispatch<React.SetStateAction<BeepCardsModel[]>>;
}

const BeepCardsScreen: React.FC<BeepCardsScreenProps> = ({ beepCards, setBeepCards }) => {
  const [selectedBeepCard, setSelectedBeepCard] = useState<BeepCardsModel | null>(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [deviceID, setDeviceID] = useState<string | null>(null); // State to store device ID
  const [filteredBeepCards, setFilteredBeepCards] = useState<BeepCardsModel[]>([]); // State to store filtered beep cards
  const [isBeepCardModalVisible, setIsBeepCardModalVisible] = useState(false);

  const openBeepCardModal = () => {
    setIsBeepCardModalVisible(true);
  };

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

  const handleBeepCardSaved = (newBeepCard: BeepCardsModel) => {
    Toast.success('Beep card ' + newBeepCard.UUIC + ' replaced successfully!', 'top');
  };

  // Function to handle deletion of the selected beep card
  const handleConfirmDelete = async () => {
    if (selectedBeepCard) {
      try {
        // Call the deleteUser function from the API file to delete the selected beep card
        await deleteUser(selectedBeepCard._id);

        // Update the beepCards state by filtering out the deleted card
        const updatedBeepCards = beepCards.filter(card => card._id !== selectedBeepCard._id);
        setBeepCards(updatedBeepCards);

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

  // Function to get onboarded status
  const getOnboardStatus = (isActive: boolean): string => {
    return isActive ? 'OnBoarded' : 'Not Onboarded';
  };

  const renderGradientCard = () => (
    <LinearGradient colors={['#C6E2FA', '#C6E2FA', '#FFFFFF']} style={styles.addBeepCardContainer}>
      <View style={styles.cardDetails}>
        <Text style={styles.addBeepCardText}>Add a beep™ Card</Text>
        <Text style={styles.cardNumberText}>The Card Number is Found at the Back of your beep™ card.</Text>
        <TouchableOpacity style={styles.addButton} onPress={openBeepCardModal}>
          <Text style={styles.addButtonLabel}>Add Card</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderItem = ({ item, index }: { item: BeepCardsModel; index: number }) => {
    const isLastItem = index + 1 === filteredBeepCards.length;

    const latestTimestamp = item.updatedAt > item.createdAt ? item.updatedAt : item.createdAt;
    const timestampText = latestTimestamp === item.createdAt ? 'Created On' : 'Available Balance as of';

    // Calculate valid until date (5 years from creation date)
    const validUntilDate = new Date(item.createdAt);
    validUntilDate.setFullYear(validUntilDate.getFullYear() + 5);
    const validUntilDateString = validUntilDate.toISOString().split('T')[0]; // Format: yyyy-mm-dd

    return (
      <>
        <ImageBackground
          source={require('../assets/beepCardImage.png')} // Replace '../assets/card_background.jpg' with your image source
          style={styles.cardContainer}
          // eslint-disable-next-line react-native/no-inline-styles
          imageStyle={{ borderRadius: 10 }} // Apply borderRadius to the image background
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardHeaderText}>{item.UUIC}</Text>
            <TouchableOpacity onPress={() => handleTrashPress(item)}>
              <FontAwesome5 name="trash" size={18} color="#FD9A00" style={styles.trashIcon} />
            </TouchableOpacity>
          </View>
          <View style={styles.cardDetails}>
            <View style={styles.row}>
              <Text style={styles.validUntilText}>Valid Until {validUntilDateString}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.timestamp}>
                {timestampText} {formatDate(latestTimestamp)}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.cardBalance}>₱{item.balance.toFixed(2)}</Text>
            </View>
            <View style={styles.nestedBadge}>
              <View
                style={[styles.badge, { backgroundColor: item.isActive ? '#00E676' : '#FF1744' }]}
              />
              <Text style={styles.badgeText}>{getOnboardStatus(item.isActive)}</Text>
            </View>
          </View>
        </ImageBackground>
        {isLastItem && renderGradientCard()}
      </>
    );
  };

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
        <><View style={styles.list}>{renderGradientCard()}</View></>
      )}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible}
        onClose={() => setIsConfirmationModalVisible(false)}
        onConfirm={handleConfirmDelete}
        title={'Delete Beep Card'}
        message={'Do you want to remove the following beep card from your list of beep cards?'}
        beepCardDetails={selectedBeepCard ? `UUID: ${selectedBeepCard.UUIC}` : ''}
      />
      <AddBeepCardModal
        isVisible={isBeepCardModalVisible}
        onClose={() => setIsBeepCardModalVisible(false)}
        beepCards={beepCards}
        setBeepCards={setBeepCards}
        onSuccess={handleBeepCardSaved}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF3FF',
  },
  addBeepCardText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  cardNumberText: {
    fontSize: 12,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  addButtonContainer: {
    marginTop: 20, // Adjust as needed
  },
  addButton: {
    backgroundColor: '#172459',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: 110,
    alignSelf: 'center', // Align the button horizontally center within its container
  },
  addButtonLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: '#FFF',
    fontFamily: 'Roboto',
  },
  list: {
    flexGrow: 1,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  cardContainer: {
    backgroundColor: '#FFA726',
    padding: 18,
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 10,
  },
  addBeepCardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 151, // Adjust the height as needed
    borderRadius: 10,
    borderWidth: 1, // Border width for the outline
    borderColor: '#233253',
    borderStyle: 'dashed',
    paddingTop: 15,
    paddingLeft: 30,
    paddingRight: 30,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHeaderText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  trashIcon: {
    marginLeft: 'auto',
  },
  cardDetails: {
    flex: 1,
  },
  cardBalance: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Roboto',
  },
  validUntilText: {
    fontSize: 10,
    color: '#FFFFFF',
    marginBottom: 15,
    fontFamily: 'Roboto',
  },
  timestamp: {
    fontSize: 10,
    color: '#A2ADCB',
    fontFamily: 'Roboto',
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
  },
  badgeText: {
    fontSize: 10,
    color: '#FFFFFF', // White text color
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
    color: '#555',
    lineHeight: 30,
    fontFamily: 'Roboto',
  },
  row: {
    flexDirection: 'row',
  },
});

export default BeepCardsScreen;
