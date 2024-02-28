import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { FlatList, ImageBackground, StyleSheet, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Text } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import ConfirmationModal from '../components/ConfirmationModal';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';
import { deleteUser } from '../network/BeepCardManagerAPI';
import DeviceInfo from 'react-native-device-info';

interface BeepCardsScreenProps {
  beepCards: BeepCardsModel[];
  setBeepCards: React.Dispatch<React.SetStateAction<BeepCardsModel[]>>;
}

const BeepCardsScreen: React.FC<BeepCardsScreenProps> = ({ beepCards, setBeepCards }) => {
  const [selectedBeepCard, setSelectedBeepCard] = useState<BeepCardsModel | null>(null);
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [showTransactionsMap, setShowTransactionsMap] = useState<{ [key: string]: boolean }>({});
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const openBeepCardScreen = () => {
    navigation.navigate('AddBeepCard');
  };

  const handleTrashPress = (item: BeepCardsModel) => {
    setSelectedBeepCard(item);
    setIsConfirmationModalVisible(true);
  };

  // Function to handle deletion of the selected beep card
  const handleConfirmDelete = async () => {
    if (selectedBeepCard) {
      try {
        // Call the deleteUser function from the API file to delete the selected beep card
        const androidID = await DeviceInfo.getAndroidId();
        await deleteUser(androidID, selectedBeepCard.UUIC);

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
        <TouchableOpacity style={styles.addButton} onPress={openBeepCardScreen}>
          <Text style={styles.addButtonLabel}>Add Card</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );

  const renderItem = ({ item, index }: { item: BeepCardsModel; index: number }) => {
    const isLastItem = index + 1 === beepCards.length;

    const latestTimestamp = item.updatedAt > item.createdAt ? item.updatedAt : item.createdAt;
    const timestampText = latestTimestamp === item.createdAt ? 'Created On' : 'Available Balance as of';

    // Calculate valid until date (5 years from creation date)
    const validUntilDate = new Date(item.createdAt);
    validUntilDate.setFullYear(validUntilDate.getFullYear() + 5);
    const validUntilDateString = validUntilDate.toISOString().split('T')[0]; // Format: yyyy-mm-dd

    const formatTransactionTimestamp = (timestamp: string): string => {
      const date = new Date(timestamp); // Assuming timestamp is in BSON format
      const options: Intl.DateTimeFormatOptions = {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: 'UTC',
      };
      const formattedDate = date.toLocaleDateString('en-US', options);
      return formattedDate;
    };

    const toggleDetails = () => {
      setShowTransactionsMap(prevState => ({
        ...prevState,
        [item._id]: !prevState[item._id], // Toggle transactions visibility for the current card
      }));
    };

    return (
      <>
        <TouchableOpacity onPress={toggleDetails}>
          <View>
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
                  <View style={[styles.badge, { backgroundColor: item.isActive ? '#00E676' : '#FF1744' }]} />
                  <Text style={styles.badgeText}>{getOnboardStatus(item.isActive)}</Text>
                </View>
              </View>
            </ImageBackground>
          </View>
          {showTransactionsMap[item._id] && (
            <View style={styles.transactionDatesAndContainer}>
              <Text style={styles.transactionHeaderText}>Latest Transactions</Text>
              <Text style={styles.transactionTimestamp}>as of {formatTransactionTimestamp(latestTimestamp)}</Text>
              <View style={styles.transactionContainer}>
                <View style={styles.transactionContainer}>
                  <View style={styles.transactionDetails}>
                    <View style={styles.circle}>
                      <FontAwesome5 name="exchange-alt" size={30} color="#1B2646" />
                    </View>
                    <View style={styles.transactionContainer}>
                      <Text style={styles.title}>MRT3 Rail Service Provider</Text>
                      <View style={styles.transactionDetails}>
                        <Text style={styles.date}>{formatTransactionTimestamp(latestTimestamp)}</Text>
                        <Text style={styles.balance}>- ₱{item.balance.toFixed(2)}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
        {isLastItem && renderGradientCard()}
      </>
    );
  };

  return (
    <View style={styles.container}>
      {beepCards.length > 0 ? (
        <FlatList
          data={beepCards}
          renderItem={renderItem}
          keyExtractor={(_item, index) => index.toString()}
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
    backgroundColor: '#FFFFF',
    padding: 18,
    borderRadius: 10,
    marginTop: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 10,
  },
  transactionIcon: {
    marginRight: 10,
  },
  transactionDatesAndContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 5,
    padding: 18,
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 3,
  },
  transactionDetails: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
    fontFamily: 'Roboto',
  },
  date: {
    fontSize: 11,
    color: '#555',
    fontFamily: 'Roboto',
  },
  balance: {
    fontSize: 12,
    color: 'red',
    marginLeft: 'auto', // Automatically adjust margin left
    fontFamily: 'Roboto',
  },
  transactionText: {
    flex: 1,
    color: '#333',
    fontFamily: 'Roboto',
  },
  transactionContainer: {
    borderRadius: 10,
    marginBottom: 5,
    paddingTop: 5,
    flex: 1,
    justifyContent: 'center', // Center vertically
  },
  trashIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    width: 50,
    height: 50,
    borderRadius: 25, // Change the radius to make it a perfect circle
    marginRight: 10, // Adjust as needed
    backgroundColor: '#EDF3FF', // Change color as needed
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    marginTop: 5, // Adjust vertical position
  },
  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  transactionHeaderText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
  },
  transactionTimestamp: {
    fontSize: 11,
    color: '#555',
    fontFamily: 'Roboto',
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
    marginTop: 5,
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
