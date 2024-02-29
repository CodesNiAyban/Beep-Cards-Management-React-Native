import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AddBeepCardScreen from '../screens/AddBeepCardScreen';
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
      <Stack.Screen
        name="AddBeepCard"
        component={AddBeepCardScreen}
        options={{
          headerShown: true,
          title: 'Add a beep™ Card',
          headerStyle: {
            backgroundColor: '#172459', // Background color for the header
          },
          headerTitleStyle: {
            color: '#FFFFFF', // Text color for the header title
            fontSize: 20, // Font size for the header title
          },
          headerTitleAlign: 'center', // Center align the header title text
          headerTintColor: '#FFFFFF', // Color of the back button and header icons
          headerBackTitleVisible: false, // Hide the back button text
        }}
      />
    </Stack.Navigator>
  );
};

export default RootStackNavigator;
