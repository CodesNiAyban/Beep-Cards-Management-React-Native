import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { linkBeepCard } from '../network/BeepCardManagerAPI';
import DeviceInfo from 'react-native-device-info';
import Toast from 'react-native-toast-message';
import { NavigationProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BeepCardsScreenProps {
  navigation: NavigationProp<any>;
}

const AddBeepCardScreen: React.FC<BeepCardsScreenProps> = ({ navigation }) => {
  const [beepCardNumber, setBeepCardNumber] = useState('637805');
  const [cardLabel, setCardLabel] = useState('');
  const theme = useTheme();

  const handleSave = async () => {
    try {
      const androidID = await DeviceInfo.getAndroidId();
      const userID = androidID;
      const beepCard = { UUIC: beepCardNumber };
      const linkedBeepCard = await linkBeepCard(userID, beepCard.UUIC);
      await AsyncStorage.setItem(beepCardNumber, JSON.stringify({ label: cardLabel, UUIC: beepCardNumber }));

      if (linkedBeepCard) {
        console.log('Beep card linked:', linkedBeepCard);
        navigation.goBack();
      } else {
        console.log('Beep card not found.');
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Beep card not found',
        });
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
  };

  const handleCardLabelChange = (text: string) => {
    setCardLabel(text);
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
                value={cardLabel}
                onChangeText={handleCardLabelChange}
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
        <Button mode="contained" onPress={handleSave} style={styles.button}>
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
