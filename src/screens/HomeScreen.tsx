import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

export default function Component() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hello, User</Text>
        <FontAwesome5 name="microscope" color={'#3498DB'} size={24} />
      </View>
      <View style={styles.buttonContainer}>
        <Button mode="contained" style={styles.button}>
          beep™ card
        </Button>
        <Button mode="contained" style={styles.button}>
          beep™ Rewards
        </Button>
      </View>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>beep™ card</Text>
        <Text style={styles.cardNumber}>637805XXXXXXXXX</Text>
        <View style={styles.cardOptions}>
          <OptionIcon name="wallet" label="Buy beep™ Load" />
          <OptionIcon name="download" label="Fetch beep™ Load" />
          <OptionIcon name="check-circle" label="Check Balance" />
          <OptionIcon name="credit-card" label="Enroll beep™ Card" />
        </View>
      </View>
      <View style={styles.gridContainer}>
        <OptionIcon name="ticket-alt" label="beep™ QR Tickets" />
        <OptionIcon name="wallet" label="Buy beep™ Load" />
        <OptionIcon name="download" label="Fetch beep™ Load" />
        <OptionIcon name="handshake" label="beep™ Partners" />
        <OptionIcon name="check-circle" label="Check Balance" />
        <OptionIcon name="tag" label="Promos" />
        <OptionIcon name="gift" label="beep™ Rewards" />
        <OptionIcon name="ellipsis-h" label="View all" />
      </View>
    </View>
  );
}

interface OptionIconProps {
  name: string;
  label: string;
}


const OptionIcon: React.FC<OptionIconProps> = ({ name, label }) => (
  <View style={styles.option}>
    <FontAwesome5 name={name} style={styles.optionIcon} />
    <Text style={styles.optionLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF3FF',
    padding: 20,
    color: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  icon: {
    fontSize: 24,
    color: 'white',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#34495E',
    borderRadius: 4,
  },
  card: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    backgroundColor: '#333',
  },
  cardNumber: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 8,
  },
  cardOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    marginTop: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    alignItems: 'center',
    marginBottom: 20,
  },
  optionIcon: {
    fontSize: 24,
    color: '#3498DB',
  },
  optionLabel: {
    fontSize: 10,
    color: '#3498DB',
    padding: 4,
  },
});
