import { MMKV } from 'react-native-mmkv'
import { NavigationProp } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';

interface Props {
    navigation: NavigationProp<any>;
}

const CreatePinScreen: React.FC<Props> = ({ navigation }) => {
    const [pin, setPin] = useState('');
    const [verifyPin, setVerifyPin] = useState('');
    const mmkv = new MMKV();

    useEffect(() => {
        const checkPinExists = async () => {
            try {
                const pinCheck = mmkv.getString('pin');
                console.log(pinCheck)
                if (pinCheck) {
                    navigation.navigate('Pin'); // Navigate to PinScreen if PIN exists
                }
            } catch (error) {
                console.error('Error checking if PIN exists:', error);
            }
        };

        checkPinExists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handlePinInputChange = (text: string) => {
        // Ensure only numbers are allowed and limit input to 4 characters
        setPin(text.replace(/[^0-9]/g, '').slice(0, 4));
    };

    const handleVerifyPinInputChange = (text: string) => {
        // Ensure only numbers are allowed and limit input to 4 characters
        setVerifyPin(text.replace(/[^0-9]/g, '').slice(0, 4));
    };

    const handlePinCreation = async () => {
        if (pin === verifyPin) {
            try {
                mmkv.set('pin', pin);
                console.log('pin', pin);
                navigation.navigate('Main');
            } catch (error) {
                console.error('Error creating PIN file:', error);
                Toast.error('Error creating PIN file', 'top');
            }
        } else {
            Toast.error('Pins do not match', 'top');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome to MRT ONLINE BEEP CARD MANAGER</Text>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Create a New PIN</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Enter PIN"
                    onChangeText={handlePinInputChange}
                    value={pin}
                    maxLength={4}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Verify Your PIN</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Verify PIN"
                    onChangeText={handleVerifyPinInputChange}
                    value={verifyPin}
                    maxLength={4}
                    keyboardType="numeric"
                />
            </View>
            <TouchableOpacity style={styles.button} onPress={handlePinCreation}>
                <Text style={styles.buttonText}>Create PIN</Text>
            </TouchableOpacity>
            <ToastManager />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDF3FF', // Orange base color
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333', // White text color
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
        width: '100%',
    },
    label: {
        fontSize: 18,
        marginBottom: 5,
        color: '#333', // White text color
    },
    input: {
        borderWidth: 1,
        borderColor: '#333', // White border color
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        color: '#333', // White text color
        fontSize: 16,
    },
    button: {
        backgroundColor: '#333', // White button background color
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FF6F00', // Orange text color
        textAlign: 'center',
    },
});

export default CreatePinScreen;
