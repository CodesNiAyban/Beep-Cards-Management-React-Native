// CircleButton.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface CircleButtonProps {
  onPress: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.circleButton} onPress={onPress}>
      <Text style={styles.circleButtonText}>+</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circleButton: {
    backgroundColor: 'blue',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  circleButtonText: {
    color: 'white',
    fontSize: 24,
  },
});

export default CircleButton;
