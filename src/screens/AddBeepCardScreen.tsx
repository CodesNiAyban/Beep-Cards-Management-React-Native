import { NavigationProp } from '@react-navigation/native';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { linkBeepCard } from '../network/BeepCardManagerAPI';
import SimpleToast from 'react-native-simple-toast'; // Import SimpleToast
import { useUserInactivity } from '../components/UserActivityDetector';

interface BeepCardsScreenProps {
  navigation: NavigationProp<any>;
}

const AddBeepCardScreen: React.FC<BeepCardsScreenProps> = ({ navigation }) => {
  const [beepCardNumber, setBeepCardNumber] = useState('637805');
  const [cardLabel, setCardLabel] = useState('');
  const [beepCardNumberError, setBeepCardNumberError] = useState('');
  const [cardLabelError, setCardLabelError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [showFrontCamera, setShowFrontCamera] = useState(false); // State for toggling front/back camera
  const { hasPermission, requestPermission } = useCameraPermission();
  const mmkv = new MMKV();
  const androidID = mmkv.getString('phoneID');
  const theme = useTheme();
  const [cameraVisible, setCameraVisible] = useState(false); // State for toggling camera visibility
  const { resetTimer } = useUserInactivity();

  const device = useCameraDevice(showFrontCamera ? 'front' : 'back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: (codes) => {
      const { value } = codes[0];
      const scannedValue = value;

      let corners = codes[0].corners;

      // Define the coordinates defining the scan region
      const scanRegionCoordinates = {
        minX: 494,
        minY: 240,
        maxX: 733,
        maxY: 497,
      };

      // Check if all corners of the code are within the scan region
      const allCornersWithinRegion = corners!.every(corner => {
        return (
          corner.x >= scanRegionCoordinates.minX &&
          corner.y >= scanRegionCoordinates.minY &&
          corner.x <= scanRegionCoordinates.maxX &&
          corner.y <= scanRegionCoordinates.maxY
        );
      });
      if (isValidBeepCard(scannedValue!) && allCornersWithinRegion) {
        setBeepCardNumber(scannedValue!);
        setIsButtonDisabled(false);
        // Close camera after successful scan
        setCameraVisible(false);
      } else {
        console.log('Invalid beep™ card number: ', scannedValue);
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

  const toggleCamera = async () => {
    if (!hasPermission) {
      if (await requestPermission()) {
        setCameraVisible(!cameraVisible); // Ensure the camera is shown when toggling
      }
    } else if (hasPermission) {
      setCameraVisible(!cameraVisible); // Ensure the camera is shown when toggling
    }
  };

  const handleSave = async () => {
    try {
      const beepCard = { UUIC: beepCardNumber };
      const linkedBeepCard = await linkBeepCard(androidID!, beepCard.UUIC);
      mmkv.set(beepCardNumber, cardLabel);

      if (linkedBeepCard) {
        console.log('Beep card linked:', linkedBeepCard);
        SimpleToast.show('beep™ card ' + linkedBeepCard.UUIC + ' added', SimpleToast.SHORT, {tapToDismissEnabled: true, backgroundColor: '#172459'}); // Show error toast
        navigation.goBack();
      } else {
        console.log('Beep card not found.');
        setBeepCardNumberError('beep™ card not found.');
        setIsButtonDisabled(true);
      }
    } catch (error) {
      SimpleToast.show('Failed to link beep™ card', SimpleToast.SHORT, {tapToDismissEnabled: true, backgroundColor: '#172459'}); // Show error toast
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
              <TouchableOpacity style={styles.qrButton} onPress={() => {toggleCamera(); resetTimer();}}>
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
                style={styles.textInput}
                mode="outlined"
                maxLength={10}
                // eslint-disable-next-line react-native/no-inline-styles
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
              <TouchableOpacity style={styles.toggleCameraContainer} onPress={() => {switchCamera(); resetTimer();}}>
                <Icon name="exchange-alt" size={23} color="#172459" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={() => {handleSave(); resetTimer();}}
          style={[styles.button, isButtonDisabled ? styles.disabledButton : null]}
          disabled={isButtonDisabled}
        >
          Save Card
        </Button>
      </View>
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
    borderColor: 'transparent',
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
    opacity: 0.8,
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
    width: 250,
    height: 250,
    borderWidth: 3.5, // Adjust the border width as desired
    borderColor: '#FFFFFF',
    borderRadius: 60, // Set to 0 to remove border radius
    borderStyle: 'dashed', // Use solid border style for a clear rectangle
    opacity: 0.5, // Adjust the opacity as desired
  },
  toggleCameraContainer: {
    position: 'absolute',
    top: 20, // Align to the top
    right: 20, // Align to the right
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    backgroundColor: '#EDF3FF',
    borderColor: '#172459',
  },
  qrButton: {
    position: 'absolute',
    right: 10,
    top: '50%',
    transform: [{ translateY: -12 }], // Center the button vertically
  },
  inverseContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the opacity as desired
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1, // Ensure the container is above the camera view
  },
});

export default AddBeepCardScreen;
