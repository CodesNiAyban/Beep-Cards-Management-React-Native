import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomPinView from '../components/PinInputComponent';
import { NavigationProp } from '@react-navigation/native';

interface Props {
    navigation: NavigationProp<any>;
}

const CreatePinScreen: React.FC<Props> = ({ navigation }) => {
    const [pin, setPin] = useState('');
    const [verifyPin, setVerifyPin] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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
        setErrorMessage('');
    };

    const handleVerifyPinInputChange = (text: string) => {
        setVerifyPin(text);
        setErrorMessage('');
    };

    const handlePinCreation = async () => {
        if (pin === verifyPin) {
            try {
                await AsyncStorage.setItem('pin', pin);
                console.log('PIN file created successfully');
                navigation.navigate('Main');
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
            <Text style={styles.title}>Create a New PIN</Text>
            <CustomPinView pinLength={4} onInputChange={handlePinInputChange} />
            <Text style={styles.subtitle}>Verify Your PIN</Text>
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
        backgroundColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
});

export default CreatePinScreen;