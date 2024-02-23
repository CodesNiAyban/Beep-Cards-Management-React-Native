import React, { useState, useEffect } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomPinView from '../components/PinInputComponent';

interface PinScreenProps {
  navigation: any;
}

const PinScreen: React.FC<PinScreenProps> = () => {
  const [pin, setPin] = useState('0000');
  const [enteredPin, setEnteredPin] = useState('');
  const [pinExists, setPinExists] = useState(false);

  useEffect(() => {
    // Check if PIN exists in AsyncStorage
    AsyncStorage.getItem('pin').then((value) => {
      if (value !== null) {
        // If PIN exists, set it to state and indicate that it exists
        setPin(value);
        setPinExists(true);
      }
    });
  }, []);

  // Function to handle pin input change
  const handlePinInputChange = (inputtedPin: string) => {
    setEnteredPin(inputtedPin);
  };

  // Function to verify the pin
  const verifyPin = () => {
    if (enteredPin === pin) {
      console.log('Pin is correct');
      // Navigate to the main screen if pin is correct
      // Example: navigation.navigate('Main');
    } else {
      console.log('Incorrect PIN');
      // Optionally, you can clear the entered pin or display an error message
      setEnteredPin('');
    }
  };

  const createPinFile = async () => {
    try {
      // Save PIN to AsyncStorage
      await AsyncStorage.setItem('pin', pin);
      console.log('PIN file created successfully');
    } catch (error) {
      console.error('Error creating PIN file:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Enter your PIN:</Text>
      {/* Use the CustomPinView component with the custom onInputChange handler */}
      <CustomPinView
        pinLength={pin.length}
        onInputChange={handlePinInputChange}
      />
      {/* Button to verify the pin */}
      <Button title="Verify PIN" onPress={verifyPin} />
      {/* Button to create PIN file if it doesn't exist */}
      {!pinExists && <Button title="Create PIN File" onPress={createPinFile} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PinScreen;
