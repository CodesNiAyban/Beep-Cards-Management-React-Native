import React, { useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import BeepCardsScreen from '../screens/BeepCardsScreen'; // Import BeepCardsScreen component
import TransactionsScreen from '../screens/TransactionsScreen'; // Import TransactionsScreen component
import AddBeepCardModal from '../components/AddBeepCardModal'; // Import AddBeepCardModal component

const Tab = createBottomTabNavigator();

const screenContainerStyle = { flex: 1 }; // Style for the container view

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 1,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6F00', // Orange background color
    justifyContent: 'center',
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
});

// Define the type for the onPress prop
interface AddBeepCardButtonProps {
  onPress: () => void;
}

const AddBeepCardButton: React.FC<AddBeepCardButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.addButtonContainer} onPress={onPress}>
    <View style={styles.addButton}>
      <FontAwesome5 name="plus" size={24} color={'white'} />
    </View>
  </TouchableOpacity>
);

const MainTabNavigator = () => {
  const [isModalVisible, setIsModalVisible] = useState(false); // State to manage modal visibility

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible); // Toggle modal visibility
  };
  return (
    <View style={screenContainerStyle}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }) => {
            let iconName = '';
            if (route.name === 'BeepCards') {
              iconName = 'credit-card';
            } else if (route.name === 'Transactions') {
              iconName = 'exchange-alt';
            }
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF6F00', // Orange active icon color
          tabBarInactiveTintColor: '#757575', // Gray inactive icon color
          tabBarStyle: {
            backgroundColor: '#ffffff', // White background color
            borderTopWidth: 1,
            borderTopColor: '#eeeeee',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
          },
        })}
      >
        <Tab.Screen
          name="BeepCards"
          component={BeepCardsScreen}
          options={{
            tabBarLabel: 'Beep Cards',
            headerShown: false, // Hide header
          }}
        />
        <Tab.Screen
          name="Transactions"
          component={TransactionsScreen}
          options={{
            tabBarLabel: 'Transactions',
            headerShown: false, // Hide header
          }}
        />
      </Tab.Navigator>
      <AddBeepCardButton onPress={toggleModal} />
      <AddBeepCardModal isVisible={isModalVisible} onClose={toggleModal} />
    </View>
  );
};

export default MainTabNavigator;
