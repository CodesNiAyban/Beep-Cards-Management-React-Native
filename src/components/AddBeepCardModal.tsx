import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import React, { useState } from 'react';
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ToastManager, { Toast } from 'toastify-react-native';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';
import { createNewBeepCardUser } from '../network/BeepCardManagerAPI'; // Import updateBeepCardById function

interface AddBeepCardModalProps {
    isVisible: boolean;
    onClose: () => void;
    beepCards: BeepCardsModel[]; // Pass beepCards as prop from MainTabNavigator
    setBeepCards: React.Dispatch<React.SetStateAction<BeepCardsModel[]>>;
    onSuccess: (newBeepCard: BeepCardsModel) => void; // Callback for successful addition
}

const AddBeepCardModal: React.FC<AddBeepCardModalProps> = ({ isVisible, onClose, beepCards, setBeepCards, onSuccess }) => {
    const [uuid, setUuid] = useState('');

    const handleAddPress = async () => {
        try {
            // Retrieve device ID from AsyncStorage
            const deviceIdCheck = await AsyncStorage.getItem('deviceId');

            if (!deviceIdCheck) {
                // Handle the case where deviceIdCheck is null
                console.error('Device ID is null');
                return;
            }

            // Find the beep card by UUIC input
            const selectedBeepCard = beepCards.find(card => String(card.UUIC) === '637805' + uuid); // Convert uuid to string before comparison

            if (!selectedBeepCard) {
                // Handle the case where the beep card with the specified UUIC is not found
                console.error('Beep card not found');
                return;
            }

            // Call updateBeepCardById to update the beep card by _id
            await createNewBeepCardUser(deviceIdCheck, { _id: selectedBeepCard._id });

            // Replace the old beep card with the new one
            setBeepCards((prevBeepCards) => {
                const updatedBeepCards = prevBeepCards.map((beepCard) => {
                    if (beepCard._id === selectedBeepCard._id) {
                        return selectedBeepCard; // Replace the old beep card with the new one
                    }
                    return beepCard;
                }) as BeepCardsModel[]; // Cast the array to BeepCardsModel[]
                return updatedBeepCards;
            });

            // Close the modal and reset the input
            onSuccess(selectedBeepCard); // Pass the newly added beep card to the onSuccess callback
            onClose();
            setUuid('');

            // Display a success toast
            Toast.success('Beep card ' + selectedBeepCard.UUIC + ' updated successfully!', 'top');
        } catch (error) {
            // Show error notification
            Toast.error('Failed to update beep card. Please try again.', 'top');
            console.error('Error updating beep card:', error);
        }
    };

    const handleClose = () => {
        onClose();
        setUuid('');
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.centeredView}>
                <TouchableOpacity
                    style={styles.modalBackground}
                    activeOpacity={1}
                    onPress={onClose}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Add Beep Card</Text>
                            <View style={styles.inputContainer}>
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>637805</Text>
                                </View>
                                <TextInput
                                    style={[styles.input, styles.inputText]}
                                    editable={true}
                                    placeholder="Enter UUID"
                                    onChangeText={(text) => {
                                        if (/^\d*$/.test(text) || text === '') {
                                            setUuid(text);
                                        }
                                    }}
                                    value={uuid}
                                    maxLength={9}
                                    keyboardType="numeric"
                                />
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
                                    <Text style={styles.addButtonText}>Add</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <ToastManager />
        </Modal>
    );
};
const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBackground: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: '#FFF',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        elevation: 5,
        width: '80%',
    },
    modalContent: {
        opacity: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    badge: {
        backgroundColor: '#FF6F00',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginRight: 10,
    },
    badgeText: {
        color: 'white',
        fontSize: 18,
    },
    input: {
        flex: 1,
        height: 45,
        borderColor: '#FF6F00',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    inputText: {
        fontSize: 16,
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    addButton: {
        backgroundColor: '#FF6F00',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
    },
    closeButton: {
        backgroundColor: '#CCCCCC',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#333',
        fontSize: 16,
        textAlign: 'center',
    },
});

export default AddBeepCardModal;
