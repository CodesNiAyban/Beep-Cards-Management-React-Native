import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import CreatePinScreen from '../screens/CreatePinScreen';
import PinScreen from '../screens/PinScreen';
import MainTabNavigator from './MainTabNavigator'; // Corrected import

const Stack = createStackNavigator();

const RootStackNavigator = () => {


  return (
    <Stack.Navigator initialRouteName={'CreatePin'}>
      <Stack.Screen name="CreatePin" component={CreatePinScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Pin" component={PinScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Main" component={MainTabNavigator} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
