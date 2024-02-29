import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Card, Title, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function Component() {
  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Icon name="receipt" size={24} color="#000" style={styles.icon} />
          <Title style={styles.headerText}>Transaction ID</Title>
        </View>
        <Text style={styles.subText}>65cb960b0cada9cebb49b7dd</Text>
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text>Tap In</Text>
          </View>
          <View style={styles.gridItem}>
            <Text>Fare Charged</Text>
          </View>
        </View>
        <View style={styles.grid}>
          <View>
            <Text style={styles.boldText}>Initial Balance</Text>
            <Text>3391</Text>
            <Text>alabang</Text>
          </View>
          <View style={styles.textRight}>
            <Text style={styles.boldText}>Current Balance</Text>
            <Text>3389</Text>
            <Text>ayala</Text>
          </View>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.grid}>
          <View>
            <Text style={styles.boldText}>Distance Traveled</Text>
            <Text>0.0 km</Text>
          </View>
          <View style={styles.textRight}>
            <Text style={styles.boldText}>Fare Charged</Text>
            <Text>$2.75</Text>
          </View>
        </View>
        <View style={styles.grid}>
          <View>
            <Text style={styles.boldText}>Creation Date</Text>
            <Text>2024-02-13, 12:00AM</Text>
          </View>
          <View style={styles.textRight}>
            <Text style={styles.boldText}>Update Date</Text>
            <Text>2024-02-13, 12:00AM</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    borderRadius: 10,
    backgroundColor: '#333',
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  gridItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
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
});
