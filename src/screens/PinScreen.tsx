import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
import CustomPinKeyboard from '../components/CustomPinKeyboard';

interface Props {
    navigation: NavigationProp<any>;
}

const VerifyPinScreen: React.FC<Props> = ({ navigation }) => {
    const [storedPin, setStoredPin] = useState('');

    useEffect(() => {
        const getStoredPin = async () => {
            try {
                const pin = await AsyncStorage.getItem('pin');
                if (pin) {
                    setStoredPin(pin);
                }
            } catch (retrieveError) {
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
                    Toast.error('Incorrect PIN. Please try again.', 'top');
                }
            } catch (retrieveError) {
                console.error('Error retrieving PIN:', retrieveError);
                Toast.error('Error verifying PIN', 'top');
            }
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
            <CustomPinKeyboard pinLength={4} onInputChange={handlePinInputChange} storedPin={storedPin} />
            <Button title="Delete PIN" onPress={handleDeletePin} />
            <ToastManager />
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
});

export default VerifyPinScreen;
