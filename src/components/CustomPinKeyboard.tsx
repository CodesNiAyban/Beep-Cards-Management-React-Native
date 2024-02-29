import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

interface PinInputProps {
  pinLength: number;
  onInputChange: (pin: string) => void;
  storedPin: string;
}

const CustomPinKeyboard: React.FC<PinInputProps> = ({ pinLength, onInputChange, storedPin }) => {
  const [pin, setPin] = useState('');

  const handlePinInput = (digit: string) => {
    if (digit === 'backspace') {
      setPin(pin.slice(0, -1)); // Remove the last character from the pin
    } else {
      const newPin = pin + digit;
      if (newPin.length <= pinLength) {
        setPin(newPin);
        onInputChange(newPin);
      }

      if (newPin.length === pinLength && newPin !== storedPin) {
        setPin('');
      }
    }
  };

  // Function to generate circles based on the PIN length
  const renderCircles = () => {
    const circles = [];
    for (let i = 0; i < pinLength; i++) {
      circles.push(
        <View key={i} style={[styles.circle, pin.length > i ? styles.circleFilled : null, pin.length === i ? styles.activeCircle : null]} />
      );
    }
    return circles;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.title]}>Enter PIN</Text>
      <Text style={[styles.text, styles.message]}>Enter 4-Digit PIN to access</Text>
      <View style={styles.pinContainer}>
        {renderCircles()}
      </View>
      {/* Rows for digit buttons */}
      <View style={styles.row}>
        {[1, 2, 3].map((digit) => (
          <PaperButton key={digit} style={[styles.button, styles.digitButton]} mode="contained" onPress={() => handlePinInput(String(digit))}>
            <Text style={styles.buttonText}>{digit}</Text>
          </PaperButton>
        ))}
      </View>
      <View style={styles.row}>
        {[4, 5, 6].map((digit) => (
          <PaperButton key={digit} style={[styles.button, styles.digitButton]} mode="contained" onPress={() => handlePinInput(String(digit))}>
            <Text style={styles.buttonText}>{digit}</Text>
          </PaperButton>
        ))}
      </View>
      <View style={styles.row}>
        {[7, 8, 9].map((digit) => (
          <PaperButton key={digit} style={[styles.button, styles.digitButton]} mode="contained" onPress={() => handlePinInput(String(digit))}>
            <Text style={styles.buttonText}>{digit}</Text>
          </PaperButton>
        ))}
      </View>
      {/* Last row for '0' button and backspace icon */}
      <View style={styles.row}>
        <PaperButton style={[styles.button, styles.digitButton]} mode="contained" onPress={() => handlePinInput('0')}>
          <Text style={styles.buttonText}>0</Text>
        </PaperButton>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pinContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  circle: {
    width: 30,
    height: 30,
    borderRadius: 20,
    backgroundColor: '#EAEAEA',
    borderWidth: 0.5,
    borderColor: '#000',
    margin: 5,
    transform: [{ scale: 0.5 }],
  },
  circleFilled: {
    backgroundColor: '#172459',
  },
  activeCircle: {
    transform: [{ scale: 0.7 }],
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
    margin: 5,
    borderRadius: 30,
    elevation: 2,
    backgroundColor: '#DDDDDD',
  },
  digitButton: {
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 18,
    color: '#333',
  },
  text: {
    color: '#ffffff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
  },
  message: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 50,
    color: '#fff',
  },
});

export default CustomPinKeyboard;
