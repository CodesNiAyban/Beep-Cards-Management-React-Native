import React, { useRef } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface PinInput {
  pinLength: number;
  onInputChange: (inputtedPin: string) => void;
}

const CustomPinView: React.FC<PinInput> = ({ pinLength, onInputChange }) => {
  const inputRefs = useRef<TextInput[]>([]);

  const handleChangeText = (text: string, index: number) => {
    if (text.length === 1 && index < pinLength - 1 && inputRefs.current[index + 1]) {
      // Move focus to the next input
      inputRefs.current[index + 1].focus();
    }
    onInputChange(text);
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
          onChangeText={(text) => handleChangeText(text, index)}
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
