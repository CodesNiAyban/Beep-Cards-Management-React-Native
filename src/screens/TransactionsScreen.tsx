import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { ScrollView, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card, Divider, Title } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TransactionItem as TransactionsModel } from '../models/TransactionsModel';
import { BeepCardItem as BeepCardsModel } from '../models/beepCardsModel';
import { fetchBeepCard, getTransactions } from '../network/BeepCardManagerAPI';
import { MMKV } from 'react-native-mmkv';

interface TransactionScreenProps {
  beepCards: BeepCardsModel[];
  setBeepCards: React.Dispatch<React.SetStateAction<BeepCardsModel[]>>;
  transactions: TransactionsModel[]; // Array of transaction objects
  setTransactions: React.Dispatch<React.SetStateAction<TransactionsModel[]>>; // Function to update transactions state
  navigation: NavigationProp<any>;
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TransactionScreen: React.FC<TransactionScreenProps> = ({ beepCards, setBeepCards, transactions, setTransactions, navigation }) => {
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});
  const [refreshing, setRefreshing] = useState(false);
  const mmkv = new MMKV();
  const androidID = mmkv.getString('phoneID');

  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt).toISOString().split('T')[0]; // Extracting only the date part
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as { [key: string]: TransactionsModel[] });

  const toggleGroup = (date: string) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  const onRefresh = async () => {
    console.log('Refresh baby');
    setRefreshing(true);
    try {
      const data = await fetchBeepCard(androidID!);
      const transactionData = await getTransactions(androidID!);
      setBeepCards(data);
      if (transactionData) {
        setTransactions(transactionData);
      } else {
        console.log('Transactions not found');
      }
    } catch (error) {
      console.error('Error fetching beep cards:', error);
    } finally {
      setRefreshing(false);
    }
  };


  const renderItem = ({ item }: { item: TransactionsModel }) => {
    return (
      <>
        {!item.tapIn ? (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <FontAwesome5 name={item.tapIn ? 'arrow-circle-down' : 'arrow-circle-up'} size={24} color="#000" style={styles.icon} />
                <Title style={styles.headerText}>{item.tapIn ? 'TapIn' : 'TapOut'}</Title>
              </View>
              <Text style={styles.headerUUIC}>{item.UUIC}</Text>
              <Divider style={styles.divider} />
              <View style={styles.grid}>
                <View>
                  <Text style={styles.title}>Initial Balance</Text>
                  <Text style={styles.subText}>₱{item.initialBalance}</Text>
                  <Text style={styles.title}>From Station</Text>
                  <Text style={styles.subText}>{item.prevStation}</Text>
                </View>
                <View style={styles.textRight}>
                  <Text style={styles.title}>Current Balance</Text>
                  <Text style={styles.subText}>₱{item.currBalance}</Text>
                  <Text style={styles.title}>To Station</Text>
                  <Text style={styles.subText}>{item.currStation}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.grid}>
                <View>
                  <Text style={styles.title}>Distance Traveled</Text>
                  <Text style={styles.subText}>{item.distance} km</Text>
                </View>
                <View style={styles.textRight}>
                  <Text style={styles.title}>Fare Charged</Text>
                  <Text style={styles.balance}>- ₱{item.fare}</Text>
                </View>
              </View>
              <View style={styles.grid}>
                <View>
                  <Text style={styles.title}>Time</Text>
                  <Text style={styles.date}>{formatTime(item.createdAt.toString())}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.header}>
                <FontAwesome5 name={item.tapIn ? 'arrow-circle-down' : 'arrow-circle-up'} size={24} color="#000" style={styles.icon} />
                <Title style={styles.headerText}>{item.tapIn ? 'TapIn' : 'TapOut'}</Title>
              </View>
              <Text style={styles.headerUUIC}>{item.UUIC}</Text>
              <Divider style={styles.divider} />
              <View style={styles.grid}>
                <View>
                  <Text style={styles.title}>Initial Station</Text>
                  <Text style={styles.subText}>{toTitleCase(item.currStation)}</Text>
                </View>
                <View style={styles.textRight}>
                  <Text style={styles.title}>Current Balance</Text>
                  <Text style={styles.subText}>₱{item.initialBalance}</Text>
                </View>
              </View>
              <Divider style={styles.divider} />
              <View style={styles.grid}>
                <View>
                  <Text style={styles.title}>Time</Text>
                  <Text style={styles.date}>{formatTime(item.createdAt.toString())}</Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}
      </>
    );
  };

  function toTitleCase(str: string) {
    return str.replace(/\b\w/g, function (char: string) {
      return char.toUpperCase();
    });
  }

  const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      month: 'long',
      day: '2-digit',
      year: 'numeric',
    };
    const formattedDate = date.toLocaleDateString('en-US', options);
    return formattedDate;
  };

  const formatTime = (timestamp: string): string => {
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


  const renderDateHeader = (date: string) => {

    return (
      <TouchableOpacity onPress={() => toggleGroup(date)} style={styles.dateHeaderContainer}>
        <FontAwesome5 name="calendar" size={20} color="#fff" style={styles.marginLeft} />
        <Text style={styles.dateHeaderText}>{formatDate(date)}</Text>
        <FontAwesome5 name={expandedGroups[date] ? 'chevron-up' : 'chevron-down'} size={20} color="#fff" />
      </TouchableOpacity>
    );
  };

  const renderTransactionsForDate = (date: string) => {
    const transactionsForDate = groupedTransactions[date];
    return expandedGroups[date] ? (
      <View>
        {transactionsForDate.map(transaction => (
          <View key={transaction._id}>
            {renderItem({ item: transaction })}
            <View style={styles.divider} />
          </View>
        ))}
      </View>
    ) : null;
  };

  const renderEmptyMessage = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No Transactions Found.{'\n'}Click Add Button to Add Transactions.
      </Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
      {transactions.length > 0 ? (
        <View style={styles.container}>
          {Object.keys(groupedTransactions).map((date) => (
            <View key={date}>
              {renderDateHeader(date)}
              {renderTransactionsForDate(date)}
            </View>
          ))}
        </View>
      ) : (
        renderEmptyMessage()
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    backgroundColor: '#EDF3FF',
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#EDF3FF',
    padding: 20,
  },
  card: {
    margin: 5,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerUUIC: {
    fontSize: 14,
    color: '#333', // Change text color to black
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    fontFamily: 'Roboto',
  },
  textRight: {
    alignItems: 'flex-end',
  },
  divider: {
    marginVertical: 8,
  },
  icon: {
    marginRight: 4,
  },
  transactionIcon: {
    backgroundColor: '#FFA726',
    borderRadius: 25,
    marginRight: 5,
  },
  transactionDetails: {
    flex: 1,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#172459',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  marginLeft: {
    marginLeft: 10,
  },
  dateHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
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
    color: '#333',
    lineHeight: 30,
  },
  text: {
    fontSize: 12,
    color: '#333',
    marginBottom: 5,
  },
  subText: {
    fontSize: 12,
    color: '#555',
    fontFamily: 'Roboto',
    marginBottom: 10,
  },
  date: {
    fontSize: 11,
    color: '#898A8F',
    fontFamily: 'Roboto',
  },
  transactionHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'Roboto',
  },
  balance: {
    fontSize: 12,
    color: '#D66062',
    marginLeft: 'auto', // Automatically adjust margin left
    fontFamily: 'Roboto',
  },
});


export default TransactionScreen;
