import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import CustomPinKeyboard from '../components/CustomPinKeyboard';
import Toast from 'react-native-toast-message';

interface Props {
  navigation: NavigationProp<any>;
}

const VerifyPinScreen: React.FC<Props> = ({ navigation }) => {
  const [storedPin, setStoredPin] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const mmkv = new MMKV();

  useEffect(() => {
    const getStoredPin = async () => {
      try {
        const pin = mmkv.getString('pin');
        if (pin) {
          setStoredPin(pin);
        }
      } catch (retrieveError) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error retrieving PIN.',
        });
      }
    };

    getStoredPin();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePinInputChange = async (text: string) => {
    if (text.length === 4) {
      try {
        const savedPin = mmkv.getString('pin');
        if (text === savedPin) {
          console.log('PIN is correct with ');
          navigation.navigate('Main');
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Incorrect PIN',
          });
        }
      } catch (retrieveError) {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Error retrieving PIN' + retrieveError,
        });
      }
    }
  };

  const handleDeletePin = async () => {
    try {
      mmkv.delete('pin');
      console.log('PIN & deviceId deleted successfully');
      navigation.navigate('CreatePin');
    } catch (deleteError) {
      console.error('Error deleting PIN:', deleteError);
    }
  };

  const handleForgotPin = () => {
    setShowConfirmation(true);
  };

  const handleConfirmation = (confirmed: boolean) => {
    if (confirmed) {
      handleDeletePin();
      console.log('Forgot PIN confirmed');
    }
    setShowConfirmation(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome to beep™</Text>
      </View>
      <CustomPinKeyboard pinLength={4} onInputChange={handlePinInputChange} storedPin={storedPin} />
      <TouchableOpacity onPress={handleForgotPin}>
        <Text style={styles.forgotPinText}>Forgot PIN?</Text>
      </TouchableOpacity>
      {/* Confirmation Modal */}
      <Modal visible={showConfirmation} animationType="fade" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>PIN Reset</Text>
            <Text style={styles.modalText}>Are you sure you want to reset your PIN?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButtonNo} onPress={() => handleConfirmation(false)}>
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonYes} onPress={() => handleConfirmation(true)}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#006FB3',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#005D96',
    margin: 30,
    borderRadius: 5,
    padding: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 10,
  },
  logo: {
    width: 50,
    height: 50,
  },
  forgotPinText: {
    color: '#172459',
    marginTop: 20,
    textDecorationLine: 'underline',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButtonYes: {
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF6347',
    borderRadius: 5,
    elevation: 2,
    marginHorizontal: 10,
  },
  modalButtonNo: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    borderRadius: 5,
    elevation: 2,
    marginHorizontal: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default VerifyPinScreen;
