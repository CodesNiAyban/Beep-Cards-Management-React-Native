import { MMKV } from 'react-native-mmkv';
import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import SimpleToast from 'react-native-simple-toast'; // Import react-native-simple-toast
import DeviceInfo from 'react-native-device-info';

interface Props {
  navigation: NavigationProp<any>;
}

const CreatePinScreen: React.FC<Props> = ({ navigation }) => {
  const [pin, setPin] = useState('');
  const [verifyPin, setVerifyPin] = useState('');
  const mmkv = new MMKV();

  useEffect(() => {
    const checkPinExists = async () => {
      try {
        const pinCheck = mmkv.getString('pin');
        const androidID = mmkv.getString('phoneID');
        console.log(pinCheck && androidID);
        if (pinCheck && androidID) {
          navigation.navigate('Pin'); // Navigate to PinScreen if PIN exists
        }
      } catch (error) {
        SimpleToast.show('Unknown error has occured.' || 'Failed to fetch PIN. ' + error, SimpleToast.SHORT, {tapToDismissEnabled: true, backgroundColor: '#172459'}); // Use SimpleToast instead of Toast
      }
    };

    checkPinExists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePinInputChange = (text: string) => {
    // Ensure only numbers are allowed and limit input to 4 characters
    setPin(text.replace(/[^0-9]/g, '').slice(0, 4));
  };

  const handleVerifyPinInputChange = (text: string) => {
    // Ensure only numbers are allowed and limit input to 4 characters
    setVerifyPin(text.replace(/[^0-9]/g, '').slice(0, 4));
  };

  const handlePinCreation = async () => {
    if (pin === verifyPin) {
      try {
        mmkv.set('pin', pin);
        mmkv.set('phoneID', (await DeviceInfo.getAndroidId()).toString());
        console.log('pin', pin);
        navigation.navigate('Pin');
      } catch (error) {
        SimpleToast.show('Unknown error has occured.' || 'PIN creation failed. ' + error, SimpleToast.SHORT, {tapToDismissEnabled: true, backgroundColor: '#172459'}); // Use SimpleToast instead of Toast
      }
    } else {
      SimpleToast.show('PIN does not match', SimpleToast.SHORT, {tapToDismissEnabled: true, backgroundColor: '#172459'}); // Use SimpleToast instead of Toast
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to beep™</Text>
      <Text style={styles.subtitle}>Enter your new 4-digit PIN.</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Create a New PIN</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Enter PIN"
          onChangeText={handlePinInputChange}
          value={pin}
          maxLength={4}
          keyboardType="numeric"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Verify Your PIN</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="Verify PIN"
          onChangeText={handleVerifyPinInputChange}
          value={verifyPin}
          maxLength={4}
          keyboardType="numeric"
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handlePinCreation}>
        <Text style={styles.buttonText}>Create PIN</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#006FB3', // Orange base color
    padding: 20,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff', // White text color
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 80,
    color: '#fff', // White text color
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#fff', // White text color
  },
  input: {
    borderWidth: 1,
    borderColor: '#fff', // White border color
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 8,
    color: '#fff', // White text color
    fontSize: 16,
  },
  button: {
    backgroundColor: '#fff', // White button background color
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#172459', // Orange text color
    textAlign: 'center',
  },
});

export default CreatePinScreen;
