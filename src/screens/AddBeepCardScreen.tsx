import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

// Import the linkBeepCard function
import { linkBeepCard } from '../network/BeepCardManagerAPI';
import DeviceInfo from 'react-native-device-info';

const AddBeepCardScreen: React.FC = () => {
  const [beepCardNumber, setBeepCardNumber] = useState('637805');
  const theme = useTheme();

  const handleSave = async () => {
    try {
      // Call the linkBeepCard function with userID and beepCard details
      const androidID = await DeviceInfo.getAndroidId();
      const userID = androidID; // Replace 'yourUserID' with the actual userID
      const beepCard = { UUIC: beepCardNumber }; // Assuming beepCard object structure
      const linkedBeepCard = await linkBeepCard(userID, beepCard.UUIC);

      if (linkedBeepCard) {
        // Successfully linked beep card
        console.log('Beep card linked:', linkedBeepCard);
        // Optionally, you can navigate to another screen or perform any other action upon success
      } else {
        // Beep card not found
        console.log('Beep card not found.');
        // Optionally, you can display an error message or perform any other action upon failure
      }
    } catch (error) {
      // Handle error
      console.error('Error linking beep card:', error);
      // Optionally, you can display an error message or perform any other action upon failure
    }
  };

  const handleBeepCardNumberChange = (newText: string) => {
    // Limit input to numbers only
    const newValue = newText.replace(/\D/g, '');
    // Ensure the input starts with '637805'
    const formattedValue = newValue.startsWith('637805') ? newValue : '637805';
    // Limit input to maximum of 15 characters
    const maxLength = 15;
    const truncatedValue = formattedValue.slice(0, maxLength);
    setBeepCardNumber(truncatedValue);
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
            </View>
            <Text style={styles.label}>Card Label (optional)</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                style={[styles.textInput, { borderColor: 'transparent' }]}
                mode="outlined"
                outlineStyle={{ borderRadius: 10, borderColor: '#EAEAEA' }}
                theme={{ ...theme, colors: { secondary: '#EAEAEA', outline: '#EAEAEA' } }}
                placeholder="e.g. Beep"
              />
            </View>
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        {/* Call handleSave function when the button is pressed */}
        <Button mode="contained" onPress={handleSave} style={styles.button}>
          Save Card
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF3FF', // Added background color for the whole screen
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    elevation: 1, // Add elevation for shadow effect
    height: 220, // Set a fixed height
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    elevation: 3, // Add elevation for shadow effect
  },
  contentContainer: {
    height: '100%',
  },
  content: {
    height: '100%',
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
    marginBottom: 16,
  },
  textInput: {
    borderRadius: 20,
    flex: 1,
    marginLeft: 5,
    fontSize: 14,
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
});

export default AddBeepCardScreen;
