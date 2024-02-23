import React, { useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomPinView from '../components/PinInputComponent';
import { NavigationProp } from '@react-navigation/native'; // Import NavigationProp type

interface Props {
    navigation: NavigationProp<any>; // Define the type of navigation
}

const CreatePinScreen: React.FC<Props> = ({ navigation }) => { // Use the defined Props interface
    const [pin, setPin] = useState('');
    const [verifyPin, setVerifyPin] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handlePinInputChange = (text: string) => { // Correct the type of text to string
        setPin(text);
        setErrorMessage(''); // Clear any previous error message when pin is being entered
    };

    const handleVerifyPinInputChange = (text: string) => { // Correct the type of text to string
        setVerifyPin(text);
        setErrorMessage(''); // Clear any previous error message when verify pin is being entered
    };

    const handlePinCreation = async () => {
        if (pin === verifyPin) {
            try {
                await AsyncStorage.setItem('pin', pin);
                console.log('PIN file created successfully');
                navigation.navigate('PinVerified');
            } catch (error) {
                console.error('Error creating PIN file:', error);
                setErrorMessage('Error creating PIN file');
            }
        } else {
            setErrorMessage('Pins do not match');
        }
    };

    return (
        <View style={styles.container}>
            <Text>Enter your new PIN:</Text>
            <CustomPinView pinLength={4} onInputChange={handlePinInputChange} />
            <Text>Verify your new PIN:</Text>
            <CustomPinView pinLength={4} onInputChange={handleVerifyPinInputChange} />
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
            <Button title="Create PIN" onPress={handlePinCreation} />
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

export default CreatePinScreen;
