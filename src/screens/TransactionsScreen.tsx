import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

// Sample JSON data for transactions
const transactionsData = [
  {
    UUIC: 637805000000000,
    tapIn: false,
    initialBalance: '5264',
    prevStation: 'Ayala',
    currStation: 'Ayala',
    distance: 0,
    fare: 10,
    currBalance: 5264,
    createdAt: '2024-02-19T14:48:44.693Z',
    updatedAt: '2024-02-19T14:48:44.693Z',
  },
  {
    UUIC: 637805000000001,
    tapIn: true,
    initialBalance: '2000',
    prevStation: 'N/A',
    currStation: 'Ayala',
    distance: 0,
    fare: -10,
    currBalance: 2000,
    createdAt: '2024-02-20T10:30:00.000Z',
    updatedAt: '2024-02-20T10:30:00.000Z',
  },
  // Add more transactions as needed
];

interface TransactionItem {
  UUIC: number;
  tapIn: boolean;
  initialBalance: string;
  prevStation: string;
  currStation: string;
  distance: number;
  fare: number;
  currBalance: number;
  createdAt: string;
  updatedAt: string;
}

const TransactionScreen = () => {
  // Function to group transactions by date
  const groupedTransactions = transactionsData.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as { [key: string]: TransactionItem[] });

  // State to track whether each group is expanded or collapsed
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  // Function to toggle group expansion
  const toggleGroup = (date: string) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  // Render item for FlatList
  const renderItem = ({ item }: { item: TransactionItem }) => (
    <View style={styles.transactionItem}>
      <View style={styles.transactionDetails}>
        <Text style={styles.timeText}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
        <Text style={styles.boldText}>UUIC: {item.UUIC}</Text>
        <Text style={styles.text}>Initial Balance: ${item.initialBalance}</Text>
        {!item.tapIn && <Text style={styles.text}>Previous Station: {item.prevStation}</Text>}
        <Text style={styles.text}>Current Station: {item.currStation}</Text>
        <Text style={styles.text}>Distance between Stations: {item.distance} km</Text>
        <Text style={[styles.text, { color: '#FF0000', fontSize: 18 }]}>Fare: ${item.fare}</Text>
        <Text style={styles.text}>Current Balance: ${item.currBalance}</Text>
      </View>
    </View>
  );

  // Render header for each date
  const renderDateHeader = (date: string) => (
    <TouchableOpacity onPress={() => toggleGroup(date)} style={styles.dateHeaderContainer}>
      <Text style={styles.dateHeaderText}>{date}</Text>
      <FontAwesome5 name={expandedGroups[date] ? 'chevron-up' : 'chevron-down'} size={20} color="black" />
    </TouchableOpacity>
  );

  // Render transactions for each date
  const renderTransactionsForDate = (date: string) => {
    const transactionsForDate = groupedTransactions[date];
    return expandedGroups[date] ? (
      <View>
        {transactionsForDate.map(transaction => (
          <View key={transaction.UUIC}>
            {renderItem({ item: transaction })}
          </View>
        ))}
      </View>
    ) : null;
  };

  return (
    <View style={styles.container}>
      {Object.keys(groupedTransactions).map((date) => (
        <View key={date}>
          {renderDateHeader(date)}
          {renderTransactionsForDate(date)}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1', // Cream background color
    padding: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  timeText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  transactionDetails: {
    flex: 1,
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 10,
  },
  boldText: {
    fontSize: 18,
    color: '#FFFFFF', // White text color
    marginBottom: 5,
    fontWeight: 'bold',
  },
  text: {
    fontSize: 16,
    color: '#FFFFFF', // White text color
    marginBottom: 5,
  },
  dateHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFC107', // Amber color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  dateHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'Roboto', // Use a suitable font family
    color: '#FFFFFF', // White or light color for better visibility
  },
});

export default TransactionScreen;
