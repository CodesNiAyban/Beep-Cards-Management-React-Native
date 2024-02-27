
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';
import { TransactionItem as TransactionModel } from '../models/TransactionsModel';

// Sample JSON data for transactions
const jsonData = [
  {
    _id: '1', // Unique identifier for the transaction
    UUIC: Math.floor(Math.random() * 1000000000000000),
    tapIn: Math.random() < 0.5,
    initialBalance: String(Math.floor(Math.random() * 10000)),
    prevStation: 'Station1',
    currStation: 'Station2',
    distance: Math.floor(Math.random() * 100),
    fare: Math.floor(Math.random() * 50),
    currBalance: Math.floor(Math.random() * 10000),
    createdAt: randomDate(new Date(2020, 0, 1), new Date()),
    updatedAt: randomDate(new Date(2020, 0, 1), new Date()),
  },
  // Add more transaction objects here with unique _id values
];

function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

interface TransactionScreenProps {
  beepCards: BeepCardsModel[];
  setBeepCards: React.Dispatch<React.SetStateAction<BeepCardsModel[]>>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TransactionScreen : React.FC<TransactionScreenProps> = ({ beepCards, setBeepCards }) => {
  const [transactionsData, setTransactionsData] = useState<TransactionModel[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    setTimeout(() => {
      setTransactionsData(jsonData);
    }, 1000);
  }, []);

  const groupedTransactions = transactionsData.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as { [key: string]: TransactionModel[] });

  const toggleGroup = (date: string) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  const renderItem = ({ item }: { item: TransactionModel }) => {
    // Get transaction time with hours, minutes, and seconds
    const transactionTime = new Date(item.createdAt);
    const transactionTimeFormatted = `${transactionTime.getHours().toString().padStart(2, '0')}:${transactionTime.getMinutes().toString().padStart(2, '0')}:${transactionTime.getSeconds().toString().padStart(2, '0')}`;

    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionIcon}>
          <FontAwesome5 name={item.tapIn ? 'arrow-circle-up' : 'arrow-circle-down'} size={24} color="#FFF" />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.text}>UUIC: {item.UUIC}</Text>
          <Text style={styles.text}>Initial Balance: PhP {item.initialBalance}</Text>
          <Text style={styles.text}>From: {item.prevStation}</Text>
          <Text style={styles.text}>To: {item.currStation}</Text>
          <Text style={styles.text}>Distance: {item.distance} km</Text>
          <Text style={styles.text}>Fare: -PhP {item.fare}</Text>
          <Text style={styles.text}>Current Balance: PhP {item.currBalance}</Text>
          <Text style={styles.text}>Time: {transactionTimeFormatted}</Text>
        </View>
      </View>
    );
  };

  const renderDateHeader = (date: string) => (
    <TouchableOpacity onPress={() => toggleGroup(date)} style={styles.dateHeaderContainer}>
      <FontAwesome5 name="calendar" size={20} color="black" style={styles.marginLeft} />
      <Text style={styles.dateHeaderText}>{date}</Text>
      <FontAwesome5 name={expandedGroups[date] ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
    </TouchableOpacity>
  );

  const renderTransactionsForDate = (date: string) => {
    const transactionsForDate = groupedTransactions[date];
    return expandedGroups[date] ? (
      <View>
        {transactionsForDate.map(transaction => (
          <View key={transaction.UUIC}>
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {transactionsData.length > 0 ? (
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
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  transactionIcon: {
    backgroundColor: '#FFA726',
    borderRadius: 25,
    padding: 10,
    marginRight: 15,
  },
  transactionDetails: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FF6F00',
    paddingVertical: 15,
    paddingHorizontal: 20,
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
  marginLeft: {
    marginLeft: 10,
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  divider: {
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
    marginVertical: 10,
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
  },
});

export default TransactionScreen;
