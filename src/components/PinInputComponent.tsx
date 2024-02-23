import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface PinInput {
  pinLength: number;
  onInputChange: (inputtedPin: string) => void;
}

const CustomPinView: React.FC<PinInput> = ({ pinLength, onInputChange }) => {
  const inputRefs = useRef<TextInput[]>([]);

  const handleChangeText = (index: number, text: string) => {
    const newTexts = inputRefs.current.map((_, idx) => (idx === index ? text : ''));
    const pin = newTexts.join(''); // Concatenate all input values
    onInputChange(pin); // Pass the complete PIN string to the callback
    // Optionally, you can also set focus or perform other actions based on the complete PIN input
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

export default CustomPinView;
