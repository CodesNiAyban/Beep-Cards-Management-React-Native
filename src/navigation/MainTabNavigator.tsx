import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

const BeepCardsScreen = () => <Text>Beep Cards Screen</Text>;
const TransactionsScreen = () => <Text>Transactions Screen</Text>;

interface TabIconProps {
  color: string;
  size: number;
}

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    top: -30,
    alignSelf: 'center',
    zIndex: 1,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#ff6f00',
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



const AddBeepCardButton: React.FC<TabIconProps> = ({ size }) => (
  <TouchableOpacity style={styles.addButtonContainer}>
    <View style={styles.addButton}>
      <FontAwesome5 name="plus" size={size * 1.5} color={'white'} />
    </View>
  </TouchableOpacity>
);

const MainTabNavigator = () => {
  return (
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
        tabBarActiveTintColor: '#ff6f00',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#ffffff',
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
        }}
      />
      <Tab.Screen
        name="AddBeepCard"
        component={TransactionsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <AddBeepCardButton color={color} size={size} />,
          tabBarLabel: () => null,
        }}
      />
      <Tab.Screen
        name="Transactions"
        component={TransactionsScreen}
        options={{
          tabBarLabel: 'Transactions',
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
