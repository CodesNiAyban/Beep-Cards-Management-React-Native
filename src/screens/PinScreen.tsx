import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomPinView from '../components/PinInputComponent';
import { NavigationProp } from '@react-navigation/native';

interface Props {
    navigation: NavigationProp<any>; // Define the type of navigation
}

const VerifyPinScreen: React.FC<Props> = ({ navigation }) => {
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');

    const handlePinInputChange = (text: string) => {
        setPin(text);
        setError(''); // Clear any previous error when pin is being entered
    };

    const handlePinVerification = async () => {
        try {
            const savedPin = await AsyncStorage.getItem('pin');
            console.log(savedPin);
            if (pin === savedPin) {
                console.log('PIN is correct');
                navigation.navigate('Main'); // Navigate to main screen if PIN is correct
            } else {
                setError('Incorrect PIN. Please try again.');
            }
        } catch (retrieveError) {
            console.error('Error retrieving PIN:', retrieveError);
            setError('Error verifying PIN');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Please enter your PIN:</Text>
            <CustomPinView pinLength={4} onInputChange={handlePinInputChange} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Button title="Enter" onPress={handlePinVerification} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default VerifyPinScreen;
