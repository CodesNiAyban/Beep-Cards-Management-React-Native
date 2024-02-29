import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { linkBeepCard } from '../network/BeepCardManagerAPI';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-toast-message';
import { NavigationProp } from '@react-navigation/native';
import { MMKV } from 'react-native-mmkv';
import Icon from 'react-native-vector-icons/FontAwesome5';
import SuccessModal from '../components/SuccessModal';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';

interface BeepCardsScreenProps {
  navigation: NavigationProp<any>;
}

const AddBeepCardScreen: React.FC<BeepCardsScreenProps> = ({ navigation }) => {
  const [beepCardNumber, setBeepCardNumber] = useState('637805');
  const [cardLabel, setCardLabel] = useState('');
  const [beepCardNumberError, setBeepCardNumberError] = useState('');
  const [cardLabelError, setCardLabelError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [successModalVisible, setSuccessModalVisible] = useState(false); // State for success modal
  const [showFrontCamera, setShowFrontCamera] = useState(false); // State for toggling front/back camera
  const { hasPermission, requestPermission } = useCameraPermission();
  const mmkv = new MMKV();
  const theme = useTheme();
  const [cameraVisible, setCameraVisible] = useState(false); // State for toggling camera visibility

  const device = useCameraDevice(showFrontCamera ? 'front' : 'back');

  useEffect(() => {
    if (hasPermission) {
      requestPermission();
    }
  }, [hasPermission, requestPermission, showFrontCamera]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      const scannedValues = codes.map(code => code.value);
      const scannedValue = scannedValues.toString();
      if (isValidBeepCard(scannedValue)) {
        setBeepCardNumber(scannedValue);
        setIsButtonDisabled(false);
        // Close camera after successful scan
        setCameraVisible(false);
      } else {
        console.log('Invalid beep card number:', scannedValue);
      }
    },
  });

  const isValidBeepCard = (value: string) => {
    const regex = /^637805\d{9}$/;
    return regex.test(value);
  };

  const switchCamera = () => {
    setShowFrontCamera(prevState => !prevState);
  };

  const toggleCamera = () => {
    setCameraVisible(!cameraVisible); // Ensure the camera is shown when toggling
  };

  const handleSave = async () => {
    try {
      const androidID = await DeviceInfo.getAndroidId();
      const userID = androidID;
      const beepCard = { UUIC: beepCardNumber };
      const linkedBeepCard = await linkBeepCard(userID, beepCard.UUIC);
      mmkv.set(beepCardNumber, cardLabel);

      if (linkedBeepCard) {
        setSuccessModalVisible(true);
        console.log('Beep card linked:', linkedBeepCard);
      } else {
        console.log('Beep card not found.');
        setBeepCardNumberError('Beep card not found.');
        setIsButtonDisabled(true);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to link beep card',
      });
    }
  };

  const handleBeepCardNumberChange = (newText: string) => {
    const newValue = newText.replace(/\D/g, '');
    const formattedValue = newValue.startsWith('637805') ? newValue : '637805';
    const maxLength = 15;
    const truncatedValue = formattedValue.slice(0, maxLength);
    setBeepCardNumber(truncatedValue);
    setBeepCardNumberError('');
    setIsButtonDisabled(truncatedValue.length !== maxLength || !!cardLabelError);
  };

  const handleCardLabelChange = (text: string) => {
    // Regular expression to allow emojis and alphabetic characters only
    const regex = /^[a-zA-Z\s\p{Emoji}]+$/u;
    if (text.trim() !== '' && regex.test(text)) {
      setCardLabel(text);
      setCardLabelError('');
    } else if (text === '') {
      setCardLabel('');
    } else {
      setCardLabelError('Please enter a valid label.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.cardContainer}>
          <View style={styles.content}>
            <Text style={styles.label}>beep™ Card Number (last 9 digits)</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value={beepCardNumber}
                onChangeText={handleBeepCardNumberChange}
                style={[styles.textInput, { borderColor: 'transparent' }]}
                mode="outlined"
                maxLength={15}
                outlineStyle={{ borderRadius: 10, borderColor: '#EAEAEA' }}
                theme={{ ...theme, colors: { secondary: '#EAEAEA', outline: '#EAEAEA' } }}
                keyboardType="numeric"
              />
              <TouchableOpacity style={styles.qrButton} onPress={toggleCamera}>
                <Icon name="qrcode" size={24} color="#172459" />
              </TouchableOpacity>
            </View>
            {beepCardNumberError ? (
              <View style={styles.errorContainer}>
                <Icon name="exclamation-circle" size={16} color="red" style={styles.icon} />
                <Text style={styles.error}>{beepCardNumberError}</Text>
              </View>
            ) : null}
            <Text style={styles.label}>Card Label (optional)</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value={cardLabel}
                onChangeText={handleCardLabelChange}
                style={[styles.textInput, { borderColor: 'transparent' }]}
                mode="outlined"
                maxLength={10}
                outlineStyle={{ borderRadius: 10, borderColor: '#EAEAEA' }}
                theme={{ ...theme, colors: { secondary: '#EAEAEA', outline: '#EAEAEA' } }}
                placeholder="e.g. Beep"
              />
            </View>
            {cardLabelError ? (
              <View style={styles.errorContainer}>
                <Icon name="exclamation-circle" size={16} color="red" style={styles.icon} />
                <Text style={styles.error}>{cardLabelError}</Text>
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.cameraContainer}>
          {cameraVisible && (
            <>
              <Camera
                style={styles.camera}
                device={device!}
                isActive={true}
                codeScanner={codeScanner}
              />
              <View style={styles.qrLabel}>
                <Text style={styles.qrLabelText}>beep™ QR</Text>
              </View>
              <View style={styles.scanRegion} />
              <TouchableOpacity style={styles.toggleCameraContainer} onPress={switchCamera}>
                <Icon name="exchange-alt" size={24} color="#172459" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={handleSave}
          style={[styles.button, isButtonDisabled ? styles.disabledButton : null]}
          disabled={isButtonDisabled}
        >
          Save Card
        </Button>
      </View>
      <SuccessModal
        visible={successModalVisible}
        linkedBeepCard={beepCardNumber} // Pass linkedBeepCard to the SuccessModal
        onClose={() => {
          setSuccessModalVisible(false);
          navigation.goBack(); // Navigate back when modal is closed
        }}
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF3FF',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    height: 220,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    elevation: 3,
  },
  contentContainer: {
    flex: 1,
  },
  content: {
    padding: 15,
  },
  label: {
    paddingTop: 5,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  textInput: {
    borderRadius: 20,
    flex: 1,
    marginLeft: 5,
    fontSize: 16,
    height: 45,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#172459',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    width: 350,
    alignSelf: 'center',
  },
  disabledButton: {
    backgroundColor: '#CCCCCC', // Greyed out background color
    color: '#999999', // Adjusted text color
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  error: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
  },
  icon: {
    marginRight: 5,
    marginLeft: 10,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
    overflow: 'hidden', // Ensure the scan region is contained within this container
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  qrLabel: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    backgroundColor: '#172459',
    borderRadius: 5,
  },
  qrLabelText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  scanRegion: {
    position: 'absolute',
    left: 69.5, // Adjust to position the scan region box at the center horizontally
    top: 90, // Adjust to position the scan region box at the center vertically
    width: '65%',
    height: '50%',
    borderWidth: 2, // Adjust the border width as desired
    borderColor: '#FFFFFF',
    borderRadius: 0, // Set to 0 to remove border radius
    borderStyle: 'dashed', // Use solid border style for a clear rectangle
    opacity: 0.5, // Adjust the opacity as desired
  },
  toggleCameraContainer: {
    position: 'absolute',
    top: 20, // Align to the top
    right: 20, // Align to the right
  },
  qrButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }], // Center the button vertically
  },
});

export default AddBeepCardScreen;
