import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PinInputProps {
  pinLength: number;
  onInputChange: (pin: string) => void;
  storedPin: string;
}

const CustomPinKeyboard: React.FC<PinInputProps> = ({ pinLength, onInputChange, storedPin }) => {
  const [pin, setPin] = useState('');

  useEffect(() => {
    // Reset pin input if the stored pin is updated
    setPin('');
  }, [storedPin]);

  const handlePinInput = (digit: string) => {
    const newPin = pin + digit;
    if (newPin.length <= pinLength) {
      setPin(newPin);
      onInputChange(newPin);
    }

    if (newPin.length === pinLength) {
      if (!(newPin === storedPin)) {
        setPin('');
      }
    }
  };

  // Function to generate circles based on the PIN length
  const renderCircles = () => {
    const circles = [];
    for (let i = 0; i < pinLength; i++) {
      circles.push(
        <View key={i} style={[styles.circle, pin.length > i ? styles.circleFilled : null]} />
      );
    }
    return circles;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your PIN</Text>
      <View style={styles.pinContainer}>
        {renderCircles()}
      </View>
      <View style={styles.row}>
        {[1, 2, 3].map((digit) => (
          <TouchableOpacity key={digit} style={styles.button} onPress={() => handlePinInput(String(digit))}>
            <Text style={styles.buttonText}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {[4, 5, 6].map((digit) => (
          <TouchableOpacity key={digit} style={styles.button} onPress={() => handlePinInput(String(digit))}>
            <Text style={styles.buttonText}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        {[7, 8, 9].map((digit) => (
          <TouchableOpacity key={digit} style={styles.button} onPress={() => handlePinInput(String(digit))}>
            <Text style={styles.buttonText}>{digit}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.row}>
        <TouchableOpacity style={styles.button} onPress={() => handlePinInput('0')}>
          <Text style={styles.buttonText}>0</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  pinContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DDDDDD', // Default color for empty circle
    borderWidth: 1,
    borderColor: '#000',
    margin: 5,
  },
  circleFilled: {
    backgroundColor: '#000', // Change color to indicate filled circle
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    width: 80,
    height: 80,
    margin: 5,
    borderRadius: 40,
  },
  buttonText: {
    fontSize: 24,
  },
});

export default CustomPinKeyboard;
