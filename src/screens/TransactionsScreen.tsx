/* eslint-disable react-native/no-inline-styles */
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TransactionItem as TransactionModel } from '../models/TransactionsModel';

const jsonData = [
  {
    UUIC: Math.floor(Math.random() * 1000000000000000), // Generating a random UUIC
    tapIn: Math.random() < 0.5, // Randomly assigning true or false
    initialBalance: String(Math.floor(Math.random() * 10000)), // Generating a random initial balance
    prevStation: 'Station1', // Dummy station name
    currStation: 'Station2', // Dummy station name
    distance: Math.floor(Math.random() * 100), // Generating a random distance
    fare: Math.floor(Math.random() * 50), // Generating a random fare
    currBalance: Math.floor(Math.random() * 10000), // Generating a random current balance
    createdAt: randomDate(new Date(2020, 0, 1), new Date()), // Setting random date
    updatedAt: randomDate(new Date(2020, 0, 1), new Date()), // Setting random date
  },
  {
    UUIC: Math.floor(Math.random() * 1000000000000000), // Generating a random UUIC
    tapIn: Math.random() < 0.5, // Randomly assigning true or false
    initialBalance: String(Math.floor(Math.random() * 10000)), // Generating a random initial balance
    prevStation: 'Station1', // Dummy station name
    currStation: 'Station2', // Dummy station name
    distance: Math.floor(Math.random() * 100), // Generating a random distance
    fare: Math.floor(Math.random() * 50), // Generating a random fare
    currBalance: Math.floor(Math.random() * 10000), // Generating a random current balance
    createdAt: randomDate(new Date(2020, 0, 1), new Date()), // Setting random date
    updatedAt: randomDate(new Date(2020, 0, 1), new Date()), // Setting random date
  },
  {
    UUIC: Math.floor(Math.random() * 1000000000000000), // Generating a random UUIC
    tapIn: Math.random() < 0.5, // Randomly assigning true or false
    initialBalance: String(Math.floor(Math.random() * 10000)), // Generating a random initial balance
    prevStation: 'Station1', // Dummy station name
    currStation: 'Station2', // Dummy station name
    distance: Math.floor(Math.random() * 100), // Generating a random distance
    fare: Math.floor(Math.random() * 50), // Generating a random fare
    currBalance: Math.floor(Math.random() * 10000), // Generating a random current balance
    createdAt: randomDate(new Date(2020, 0, 1), new Date()), // Setting random date
    updatedAt: randomDate(new Date(2020, 0, 1), new Date()), // Setting random date
  },
  {
    UUIC: Math.floor(Math.random() * 1000000000000000), // Generating a random UUIC
    tapIn: Math.random() < 0.5, // Randomly assigning true or false
    initialBalance: String(Math.floor(Math.random() * 10000)), // Generating a random initial balance
    prevStation: 'Station1', // Dummy station name
    currStation: 'Station2', // Dummy station name
    distance: Math.floor(Math.random() * 100), // Generating a random distance
    fare: Math.floor(Math.random() * 50), // Generating a random fare
    currBalance: Math.floor(Math.random() * 10000), // Generating a random current balance
    createdAt: randomDate(new Date(2020, 0, 1), new Date()), // Setting random date
    updatedAt: randomDate(new Date(2020, 0, 1), new Date()), // Setting random date
  },
  {
    UUIC: Math.floor(Math.random() * 1000000000000000), // Generating a random UUIC
    tapIn: Math.random() < 0.5, // Randomly assigning true or false
    initialBalance: String(Math.floor(Math.random() * 10000)), // Generating a random initial balance
    prevStation: 'Station1', // Dummy station name
    currStation: 'Station2', // Dummy station name
    distance: Math.floor(Math.random() * 100), // Generating a random distance
    fare: Math.floor(Math.random() * 50), // Generating a random fare
    currBalance: Math.floor(Math.random() * 10000), // Generating a random current balance
    createdAt: randomDate(new Date(2020, 0, 1), new Date()), // Setting random date
    updatedAt: randomDate(new Date(2020, 0, 1), new Date()), // Setting random date
  },
];


function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const TransactionScreen = () => {
  // State to hold transactions data
  const [transactionsData, setTransactionsData] = useState<TransactionModel[]>([]);

  // Fetch transactions data
  useEffect(() => {
    // Simulating data fetching with setTimeout
    setTimeout(() => {
      setTransactionsData(jsonData);
    }, 1000); // Simulating delay for fetching data
  }, []);

  // Function to group transactions by date
  const groupedTransactions = transactionsData.reduce((acc, transaction) => {
    const date = new Date(transaction.createdAt).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {} as { [key: string]: TransactionModel[] });

  // State to track whether each group is expanded or collapsed
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  // Function to toggle group expansion
  const toggleGroup = (date: string) => {
    setExpandedGroups((prevState) => ({
      ...prevState,
      [date]: !prevState[date],
    }));
  };

  const renderItem = ({ item }: { item: TransactionModel }) => (
    <View style={styles.transactionItem}>
      <FontAwesome5 name={item.tapIn ? 'arrow-circle-up' : 'arrow-circle-down'} size={24} color="#333" style={styles.icon} />
      <View style={styles.transactionDetails}>
        <Text style={[styles.text, { color: '#416D19', fontSize: 18 }]}>
          <FontAwesome5 name="clock" size={16} color="#416D19" /> {new Date(item.createdAt).toLocaleTimeString()}
        </Text>
        <Text style={[styles.text, { color: '#638889', fontSize: 18 }]}>
          <FontAwesome5 name="id-card" size={16} color="#638889" /> UUIC: {item.UUIC}
        </Text>
        <Text style={[styles.text, { color: '#4F6F52', fontSize: 18 }]}>
          <FontAwesome5 name="coins" size={16} color="#4F6F52" /> Initial Balance: ${item.initialBalance}
        </Text>
        {!item.tapIn && (
          <Text style={[styles.text, { color: '#3E3232', fontSize: 18 }]}>
            <FontAwesome5 name="train" size={16} color="#3E3232" /> Previous Station: {item.prevStation}
          </Text>
        )}
        <Text style={[styles.text, { color: '#116D6E', fontSize: 18 }]}>
          <FontAwesome5 name="train" size={16} color="#116D6E" /> Current Station: {item.currStation}
        </Text>
        <Text style={[styles.text, { color: '#638889', fontSize: 18 }]}>
          <FontAwesome5 name="road" size={16} color="#333" /> Distance between Stations: {item.distance} km
        </Text>
        <Text style={[styles.text, { color: '#FF0000', fontSize: 18 }]}>
          <FontAwesome5 name="money-bill-alt" size={16} color="#FF0000" /> Fare: -${item.fare}
        </Text>
        <Text style={[styles.text, { color: '#FFF6E9', fontSize: 18 }]}>
          <FontAwesome5 name="wallet" size={16} color="#FFF6E9" /> Current Balance: ${item.currBalance}
        </Text>
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
            <View style={styles.divider} />
          </View>
        ))}
      </View>
    ) : null;
  };

  // Render message when no transactions are found
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
    backgroundColor: '#FFF8E1',
    flexGrow: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  icon: {
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
    backgroundColor: '#FFA726',
    padding: 15,
    borderRadius: 10,
  },
  text: {
    fontSize: 16,
    color: '#333', // Dark text color
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
    color: '#333', // Dark text color
  },
  divider: {
    borderBottomColor: '#333',
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
    color: '#555', // Dark gray text color
    lineHeight: 30, // Increase line height for better readability
  },
});

export default TransactionScreen;
