import React from 'react';
import { View, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import RNExitApp from 'react-native-exit-app';
import SimpleToast from 'react-native-simple-toast';

interface ConfirmationModalProps {
    isVisible: boolean;
    onClose: () => void;
    title: React.ReactNode;
    message: React.ReactNode;
}

const AppTimeOutModal: React.FC<ConfirmationModalProps> = ({
    isVisible,
    title,
    message,
}) => {
    const handleClose = () => {
        SimpleToast.show('User inactive, closing app.', SimpleToast.SHORT, { tapToDismissEnabled: true, backgroundColor: '#172459' });
        setTimeout(() => {
            RNExitApp.exitApp();
        }, 500); // 1000 milliseconds = 1 second delay
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={() => { }}
        >
            <View style={styles.centeredView}>
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{title}</Text>
                            <Text style={styles.modalMessage}>{message}</Text>
                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleClose}>
                                    <Text style={styles.buttonText}>OK</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>
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
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    button: {
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#172459',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
    },
});

export default AppTimeOutModal;
