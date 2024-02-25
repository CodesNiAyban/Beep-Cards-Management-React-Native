import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import CustomPinKeyboard from '../components/CustomPinKeyboard';

interface Props {
    navigation: NavigationProp<any>;
}

const VerifyPinScreen: React.FC<Props> = ({ navigation }) => {
    const [error, setError] = useState('');
    const [storedPin, setStoredPin] = useState('');

    useEffect(() => {

        const getStoredPin = async () => {
            try {
                const pin = await AsyncStorage.getItem('pin');
                if (pin) {
                    setStoredPin(pin);
                }
            } catch (retrieveError) { // Changed variable name from 'error' to 'retrieveError'
                console.error('Error retrieving PIN:', retrieveError);
            }
        };

        getStoredPin();
    }, []);

    const handlePinInputChange = async (text: string) => {
        if (text.length === 4) {
            try {
                const savedPin = await AsyncStorage.getItem('pin');
                if (text === savedPin) {
                    console.log('PIN is correct');
                    navigation.navigate('Main');
                } else {
                    setError('Incorrect PIN. Please try again.');
                }
            } catch (retrieveError) {
                console.error('Error retrieving PIN:', retrieveError);
                setError('Error verifying PIN');
            }
        } else {
            setError('');
        }
    };

    const handleDeletePin = async () => {
        try {
            await AsyncStorage.removeItem('pin');
            console.log('PIN deleted successfully');
        } catch (deleteError) {
            console.error('Error deleting PIN:', deleteError);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Enter Your PIN</Text>
            <CustomPinKeyboard pinLength={4} onInputChange={handlePinInputChange} storedPin={storedPin} />
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <Button title="Delete PIN" onPress={handleDeletePin} />
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
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default VerifyPinScreen;

