import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

interface ConfirmationModalProps {
    isVisible: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: React.ReactNode;
    message: React.ReactNode;
    beepCardDetails?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    isVisible,
    onClose,
    onConfirm,
    title,
    message,
    beepCardDetails,
}) => {
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
                            <Text style={styles.modalTitle}>{title}</Text>
                            <Text style={styles.modalMessage}>{message}</Text>
                            <View style={styles.uuidContainer}>
                                <Text style={styles.uuidText}>{beepCardDetails}</Text>
                            </View>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={onConfirm}>
                                    <Text style={styles.buttonText}>Confirm</Text>
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
        marginBottom: 10,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: 14,
        marginBottom: 20,
        textAlign: 'center',
    },
    uuidContainer: {
        backgroundColor: '#172459',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginBottom: 20,
    },
    uuidText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: '#CCC',
    },
    confirmButton: {
        backgroundColor: '#FF6347',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default ConfirmationModal;
