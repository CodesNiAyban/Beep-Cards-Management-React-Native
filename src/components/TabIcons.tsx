// TabIcons.tsx

import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface TabIconProps {
  color: string;
  size: number;
}

const styles = StyleSheet.create({
  addButtonContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export const BeepCardsIcon: React.FC<TabIconProps> = ({ color, size }) => (
  <FontAwesome5 name="credit-card" size={size} color={color} />
);

export const AddBeepCardButton: React.FC<TabIconProps> = ({ size }) => (
  <TouchableOpacity style={styles.addButtonContainer}>
    <View style={styles.addButtonContainer}>
      <FontAwesome5 name="plus" size={size * 1.5} color={'white'} />
    </View>
  </TouchableOpacity>
);

export const TransactionsIcon: React.FC<TabIconProps> = ({ color, size }) => (
  <FontAwesome5 name="exchange-alt" size={size} color={color} />
);
