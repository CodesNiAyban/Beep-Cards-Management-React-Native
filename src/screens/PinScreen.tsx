import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
import CustomPinKeyboard from '../components/CustomPinKeyboard';
import { MMKV } from 'react-native-mmkv';

interface Props {
    navigation: NavigationProp<any>;
}

const VerifyPinScreen: React.FC<Props> = ({ navigation }) => {
    const [storedPin, setStoredPin] = useState('');
    const mmkv = new MMKV();

    useEffect(() => {
        const getStoredPin = async () => {
            try {
                const pin = mmkv.getString('pin');
                if (pin) {
                    setStoredPin(pin);
                }
            } catch (retrieveError) {
                Toast.error('Error retrieving PIN:', 'top');
                console.error('Error retrieving PIN:', retrieveError);
            }
        };

        getStoredPin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePinInputChange = async (text: string) => {
        if (text.length === 4) {
            try {
                const savedPin = mmkv.getString('pin');
                if (text === savedPin) {
                    console.log('PIN is correct with ');
                    navigation.navigate('Main');
                } else {
                    Toast.error('Incorrect PIN.', 'top');
                }
            } catch (retrieveError) {
                console.error('Error retrieving PIN:', retrieveError);
                Toast.error('Error verifying PIN', 'top');
            }
        }
    };

    const handleDeletePin = async () => {
        try {
            await mmkv.delete('pin');
            console.log('PIN & deviceId deleted successfully');
            navigation.navigate('CreatePin');
        } catch (deleteError) {
            console.error('Error deleting PIN:', deleteError);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>MRT ONLINE BEEP CARD MANAGER</Text>
            </View>
            <CustomPinKeyboard pinLength={4} onInputChange={handlePinInputChange} storedPin={storedPin} />
            <Button title="Delete PIN" onPress={handleDeletePin} color="#FF6F00" />
            <ToastManager />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FF6F00', // Orange background color
        padding: 20,
    },
    titleContainer: {
        backgroundColor: '#FFFFFF', // White background color for the container
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FF6F00', // Orange text color
        textAlign: 'center', // Center align the text
    },
});

export default VerifyPinScreen;
