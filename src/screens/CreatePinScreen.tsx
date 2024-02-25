import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomPinView from '../components/PinInputComponent';
import { NavigationProp } from '@react-navigation/native';
import ToastManager, { Toast } from 'toastify-react-native';

interface Props {
    navigation: NavigationProp<any>;
}

const CreatePinScreen: React.FC<Props> = ({ navigation }) => {
    const [pin, setPin] = useState('');
    const [verifyPin, setVerifyPin] = useState('');

    useEffect(() => {
        const checkPinExists = async () => {
            try {
                const pinCheck = await AsyncStorage.getItem('pin');
                if (pinCheck) {
                    navigation.navigate('Pin'); // Navigate to PinScreen if PIN exists
                }
            } catch (error) {
                console.error('Error checking if PIN exists:', error);
            }
        };

        checkPinExists();
    }, [navigation]);

    const handlePinInputChange = (text: string) => {
        setPin(text);
    };

    const handleVerifyPinInputChange = (text: string) => {
        setVerifyPin(text);
    };

    const handlePinCreation = async () => {
        if (pin === verifyPin) {
            try {
                await AsyncStorage.setItem('pin', pin);
                console.log('PIN file created successfully');
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
            <Text style={styles.title}>Create a New PIN</Text>
            <CustomPinView pinLength={4} onInputChange={handlePinInputChange} />
            <Text style={styles.subtitle}>Verify Your PIN</Text>
            <CustomPinView pinLength={4} onInputChange={handleVerifyPinInputChange} />
            <Button title="Create PIN" onPress={handlePinCreation} />
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
        padding: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
        fontSize: 16,
    },
});

export default CreatePinScreen;
