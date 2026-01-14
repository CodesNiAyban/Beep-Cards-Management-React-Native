import React, { useRef, useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface PinInputProps {
  pinLength: number;
  onInputChange: (pin: string) => void;
}

const PinInput: React.FC<PinInputProps> = ({ pinLength, onInputChange }) => {
  const [pin, setPin] = useState<string[]>(Array(pinLength).fill(''));
  const inputRefs = useRef<TextInput[]>(Array(pinLength).fill(null));

  const handleChangeText = (index: number, text: string) => {
    // Ensure only numbers are inputted
    if (/^\d*$/.test(text)) {
      const newPin = [...pin];

      // Replace the current existing number
      newPin[index] = text;

      // Update the state with the new PIN
      setPin(newPin);

      // Join the PIN digits to form a string
      const pinString = newPin.join('');

      // Call the callback function with the updated PIN string
      onInputChange(pinString);

      // Calculate the index for the next input
      let nextIndex;

      if (text.length > 0) {
        // Increment to the next box if text is inputted
        nextIndex = Math.min(index + 1, pinLength - 1);
      } else {
        // Decrement to the previous box if text is deleted
        nextIndex = Math.max(index - 1, 0);
      }

      // Focus on the next input box if it exists
      inputRefs.current[nextIndex]?.focus();
    }
  };


  return (
    <View style={styles.container}>
      {Array.from({ length: pinLength }, (_, index) => (
        <TextInput
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref as TextInput;
          }}
          style={styles.input}
          keyboardType="numeric"
          maxLength={1}
          value={pin[index]}
          onChangeText={(text) => handleChangeText(index, text)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: 40,
    height: 40,
    textAlign: 'center',
    margin: 5,
  },
});

export default PinInput;
