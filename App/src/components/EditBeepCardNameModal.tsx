import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { Text, TextInput, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface EditBeepCardNameModalProps {
    isVisible: boolean;
    onClose: () => void;
    beepCardNumber: string;
}

const EditBeepCardNameModal: React.FC<EditBeepCardNameModalProps> = ({ isVisible, onClose, beepCardNumber }) => {
    const mmkv = new MMKV();
    const [newCardLabel, setNewCardLabel] = useState('');
    const [cardLabelError, setCardLabelError] = useState('');
    const theme = useTheme();

    useEffect(() => {
        const fetchCardLabel = async () => {
            const beepCardName = mmkv.getString(beepCardNumber); // Retrieve the current label from MMKV
            if (beepCardName) {
                setNewCardLabel(beepCardName); // Set the initial value of newCardLabel to the current beep card label
            }
        };

        fetchCardLabel();

        return () => {
            // Reset beepCardName on unmount
            setNewCardLabel(''); // Reset newCardLabel to an empty string
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isVisible]);

    const handleSave = () => {
        mmkv.set(beepCardNumber, newCardLabel!);
        onClose();
    };

    const handleCardLabelChange = (text: string) => {
        // Regular expression to allow emojis and alphabetic characters only
        const regex = /^[a-zA-Z\s\p{Emoji}]+$/u;
        if (text.trim() !== '' && regex.test(text)) {
            setNewCardLabel(text);
            setCardLabelError('');
        } else if (text === '') {
            setNewCardLabel('');
        } else {
            setCardLabelError('Please enter a valid label.');
        }
    };

    return (
        <Modal visible={isVisible} animationType="fade" transparent>
            <View style={styles.centeredView}>
                <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPress={onClose}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Edit Beep Card Name</Text>
                            <View style={styles.textInputContainer}>
                                <TextInput
                                    value={newCardLabel}
                                    onChangeText={handleCardLabelChange}
                                    style={styles.textInput}
                                    mode="outlined"
                                    maxLength={20}
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    outlineStyle={{ borderRadius: 10, borderColor: '#EAEAEA' }}
                                    theme={{ ...theme, colors: { secondary: '#EAEAEA', outline: '#EAEAEA' } }}
                                    placeholder="e.g. Beep"
                                />
                            </View>
                            {cardLabelError ? (
                                <View style={styles.errorContainer}>
                                    <Icon name="exclamation-circle" size={16} color="red" style={styles.icon} />
                                    <Text style={styles.error}>{cardLabelError}</Text>
                                </View>
                            ) : null}
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
                                    <Text style={styles.buttonText}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
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
        padding: 30,
        alignItems: 'center',
        elevation: 5,
        width: '60%',
    },
    modalContent: {
        opacity: 1,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    input: {
        marginBottom: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        // justifyContent: 'flex-end',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
        padding: 10,
    },
    cancelButton: {
        backgroundColor: '#CCC',
    },
    saveButton: {
        backgroundColor: '#172459',
    },
    buttonText: {
        padding: 5,
        color: '#FFF',
        fontWeight: 'bold',
    },
    textInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginLeft: 5,
    },
    icon: {
        marginRight: 5,
        marginLeft: 10,
    },
    textInput: {
        borderRadius: 20,
        flex: 1,
        marginLeft: 5,
        fontSize: 16,
        height: 45,
        justifyContent: 'center',
        borderColor: 'transparent',
    },
});

export default EditBeepCardNameModal;
