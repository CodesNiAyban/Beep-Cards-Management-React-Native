import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

const Tab = createBottomTabNavigator();

const HomeScreen = () => <Text>Home Screen</Text>;

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* Add more screens as needed */}
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
