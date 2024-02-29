import React from 'react';
import { StyleSheet, View, Animated } from 'react-native';
import { Button, Modal, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface SuccessModalProps {
  visible: boolean;
  onClose: () => void;
  linkedBeepCard: string;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ visible, onClose, linkedBeepCard }) => {
  const scaleValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, scaleValue]);

  return (
    <Modal visible={visible} onDismiss={onClose} contentContainerStyle={styles.modalContent}>
      <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
        <View style={styles.iconContainer}>
          <Icon name="check-circle" size={64} color={'#172459'} />
        </View>
        <Text style={styles.title}>Success!</Text>
        <Text style={styles.message}>Your beep card {linkedBeepCard} has been linked successfully.</Text>
        <Button mode="contained" onPress={onClose} style={styles.button}>
          OK
        </Button>
      </Animated.View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContent: {
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  iconContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#172459',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    width: '50%',
    borderRadius: 10,
    backgroundColor: '#172459',
    marginTop: 10,
  },
});

export default SuccessModal;
