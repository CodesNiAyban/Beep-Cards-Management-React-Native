import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PinScreen from '../screens/PinScreen';
import MainTabNavigator from './MainTabNavigator'; // Corrected import

const Stack = createStackNavigator();

const RootStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Pin">
      <Stack.Screen name="Pin" component={PinScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
