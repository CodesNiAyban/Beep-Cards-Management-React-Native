import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { linkBeepCard } from '../network/BeepCardManagerAPI';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-toast-message';
import { NavigationProp } from '@react-navigation/native';
import { MMKV } from 'react-native-mmkv';
import Icon from 'react-native-vector-icons/FontAwesome';

interface BeepCardsScreenProps {
  navigation: NavigationProp<any>;
}

const AddBeepCardScreen: React.FC<BeepCardsScreenProps> = ({ navigation }) => {
  const [beepCardNumber, setBeepCardNumber] = useState('637805');
  const [cardLabel, setCardLabel] = useState('');
  const [beepCardNumberError, setBeepCardNumberError] = useState('');
  const [cardLabelError, setCardLabelError] = useState('');
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const mmkv = new MMKV();
  const theme = useTheme();

  const handleSave = async () => {
    try {
      const androidID = await DeviceInfo.getAndroidId();
      const userID = androidID;
      const beepCard = { UUIC: beepCardNumber };
      const linkedBeepCard = await linkBeepCard(userID, beepCard.UUIC);
      mmkv.set(beepCardNumber, cardLabel);

      if (linkedBeepCard) {
        console.log('Beep card linked:', linkedBeepCard);
        navigation.goBack();
      } else {
        console.log('Beep card not found.');
        setBeepCardNumberError('Beep card not found.');
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
    } else {
      setCardLabel('');
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
});

export default AddBeepCardScreen;
