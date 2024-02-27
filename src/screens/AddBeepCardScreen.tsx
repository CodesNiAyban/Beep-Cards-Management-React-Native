import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';

const AddBeepCardScreen: React.FC = () => {
  const theme = useTheme();

  const handleSave = () => {
    // Handle save functionality here
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={[styles.cardContainer, styles.topCard]}>
          <View style={styles.content}>
            <Text style={styles.label}>beep™ Card Number (last 9 digits)</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value=""
                style={[styles.textInput, { borderColor: theme.colors.primary }]}
                mode="outlined"
              />
            </View>
            <Text style={styles.label}>Card Label (optional)</Text>
            <View style={styles.textInputContainer}>
              <TextInput
                value=""
                style={[styles.textInput, { borderColor: theme.colors.primary }]}
                mode="outlined"
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
  },
  topCard: {
    flex: 0.33, // Adjust height of top card
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
    flex: 1,
  },
  content: {
    flex: 1,
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
    flex: 1,
    marginLeft: 5,
    fontSize: 14,
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
