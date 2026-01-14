import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useUserInactivity } from './UserActivityDetector';

interface CircleButtonProps {
  onPress: () => void;
}

const CircleButton: React.FC<CircleButtonProps> = ({ onPress }) => {
  const { resetTimer } = useUserInactivity();
  return (
    <TouchableOpacity style={styles.circleButton} onPress={() => {onPress; resetTimer();}}>
      <Image source={require('../assets/circle_button_image.png')} style={styles.circleButtonImage} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  circleButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -20,
  },
  circleButtonImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
});

export default CircleButton;
