import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BeepCardsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Beep Cards Screen</Text>
      {/* Add your beep card content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

export default BeepCardsScreen;
