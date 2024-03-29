/* eslint-disable react-native/no-inline-styles */
import { NavigationProp, useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { RNHoleView } from 'react-native-hole-view';
import { MMKV } from 'react-native-mmkv';
import { Button, Text } from 'react-native-paper'; // Import Button from React Native Paper
import SimpleToast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import { Socket } from 'socket.io-client';
import { connectWebsocket } from '../network/BeepCardManagerAPI';

// Define Message interface
interface Message {
    room: string;
    message: string;
}

interface TapScreenProps {
    navigation: NavigationProp<any>;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const WebSocketTester: React.FC<TapScreenProps> = ({ navigation }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [room, setRoom] = useState<string>('');
    // const [message, setMessage] = useState<string>('');
    const [showFrontCamera, setShowFrontCamera] = useState<boolean>(false);
    const [receivedMessage, setReceivedMessage] = useState<string | null>(null);
    const [cameraOn, setCameraOn] = useState<boolean>(false);
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice(showFrontCamera ? 'front' : 'back');
    const isFocused = useIsFocused();
    const mmkv = new MMKV();
    const [refreshing, setRefreshing] = useState(false);
    const [reconnectLoading, setReconnectLoading] = useState(false); // Add state for reconnect button loading

    const codeScanner = useCodeScanner({
        codeTypes: ['qr'],
        onCodeScanned: (codes) => {
            const { value } = codes[0];
            const scannedValue = value;

            let corners = codes[0].corners;

            const scanRegionCoordinates = {
                minX: 500,
                minY: 130,
                maxX: 688,
                maxY: 947,
            };

            const allCornersWithinRegion = corners!.every(corner => {
                return (
                    corner.x >= scanRegionCoordinates.minX &&
                    corner.y >= scanRegionCoordinates.minY &&
                    corner.x <= scanRegionCoordinates.maxX &&
                    corner.y <= scanRegionCoordinates.maxY
                );
            });
            if (allCornersWithinRegion) {
                if (isValidUUID(scannedValue!)) {
                    console.log(scannedValue + ' ' + isValidUUID(scannedValue!));
                    setRoom(value!);
                    joinRoom();
                    sendMessage(mmkv.getString('selectedBeepCard')?.toString()!);
                    if (receivedMessage && !isValidBeepCard(receivedMessage)) {
                        SimpleToast.show(receivedMessage, SimpleToast.LONG, { tapToDismissEnabled: true, backgroundColor: '#172459' });
                        setCameraOn(false);
                        setReceivedMessage('');
                    }
                } else {
                    SimpleToast.show('Invalid QR Code', SimpleToast.LONG, { tapToDismissEnabled: true, backgroundColor: '#172459' });
                    setCameraOn(false);
                }
            }
        },
    });

    const isValidUUID = (value: string) => {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        return uuidRegex.test(value);
    };

    const isValidBeepCard = (value: string) => {
        const regex = /^637805\d{9}$/;
        return regex.test(value);
    };

    useEffect(() => {
        mmkv.delete('isAskingPermission');
        setReceivedMessage('');
        return () => {
            mmkv.delete('isAskingPermission');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    useEffect(() => {
        if (receivedMessage && !isValidBeepCard(receivedMessage)) {
            console.log(receivedMessage);
            SimpleToast.show(receivedMessage, SimpleToast.LONG, { tapToDismissEnabled: true, backgroundColor: '#172459' });
            setCameraOn(false);
            setReceivedMessage('');
        }
    }, [receivedMessage]);

    const initializeSocket = async () => {
        const newSocket = await connectWebsocket();
        setSocket(newSocket);

        newSocket!.on('message', (msg: string) => {
            setReceivedMessage(msg);
        });

        newSocket!.on('connect', async () => {
            setRefreshing(false);
            setIsConnected(true);
            if (hasPermission) {
                setCameraOn(true);
            } else {
                const isAskingPermission = mmkv.getBoolean('isAskingPermission') || false; // Get the current value, default to false if not set
                if (!isAskingPermission) {
                    mmkv.set('isAskingPermission', '1'); // Update MMKV value when permission is granted
                }
                if (await requestPermission()) {
                    setCameraOn(true);
                    mmkv.delete('isAskingPermission');
                } else {
                    newSocket!.disconnect();
                    mmkv.delete('isAskingPermission');
                }
            }
        });
        newSocket!.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            if (newSocket) {
                newSocket.disconnect();
            }
        };
    };

    useEffect(() => {
        setRefreshing(true);
        handleReconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const sendMessage = (message: string) => {
        if (socket && room && message) {
            const data: Message = { room, message };
            socket.emit('messageToRoom', data);
            // navigation.goBack();
        }
    };

    const joinRoom = () => {
        if (socket && room) {
            socket.emit('joinRoom', room);
        }
    };

    const switchCamera = () => {
        setShowFrontCamera(prevState => !prevState);
    };

    const handleReconnect = async () => {
        setReconnectLoading(true); // Start loading
        handleRefresh(); // Refresh the connection
        setReconnectLoading(false); // Stop loading
    };

    const handleRefresh = () => {
        setReceivedMessage('');
        setRefreshing(true);
        initializeSocket();
    };

    return (
        <ScrollView
            contentContainerStyle={styles.scrollView}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            }
        >
            <View style={styles.container}>
                {isConnected && cameraOn ? (
                    <>
                        <Camera
                            style={styles.camera}
                            device={device!}
                            isActive={cameraOn}
                            codeScanner={codeScanner}
                        />
                        <RNHoleView style={styles.maskView} holes={[{ x: 70, y: 190, width: 250, height: 250, borderRadius: 60 }]} />
                        <View style={styles.qrLabel}>
                            <Text style={styles.qrLabelText}>beep™ QR</Text>
                        </View>
                        <View style={styles.scanRegion} />
                        <TouchableOpacity style={styles.toggleCameraContainer} onPress={switchCamera}>
                            <Icon name="exchange-alt" size={23} color="#172459" />
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.statusContainer}>
                        <Text style={styles.status}>
                            Not Connected to MRT Tap
                        </Text>
                        <Text style={styles.status}>
                            Drag Down to Refresh or
                        </Text>
                        <Button
                            mode="contained"
                            onPress={handleReconnect}
                            loading={reconnectLoading}
                            disabled={reconnectLoading} // Disable the button when loading
                            style={{ backgroundColor: '#333', marginTop: 10 }}
                        >
                            {reconnectLoading ? 'Connecting...' : 'Reconnect'}
                        </Button>
                    </View>
                )}
            </View>
        </ScrollView>
    );
};

export default WebSocketTester;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EDF3FF',
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
        zIndex: -1,
    },
    qrLabel: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
        backgroundColor: '#172459',
        opacity: 0.8,
        borderRadius: 5,
    },
    qrLabelText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    scanRegion: {
        position: 'absolute',
        left: 70,
        top: 190,
        width: 250,
        height: 250,
        borderWidth: 3.5,
        borderColor: '#FFFFFF',
        borderRadius: 60,
        borderStyle: 'dashed',
        opacity: 0.5,
    },
    toggleCameraContainer: {
        position: 'absolute',
        top: 20,
        right: 20,
        borderWidth: 1,
        borderRadius: 5,
        padding: 5,
        backgroundColor: '#EDF3FF',
        borderColor: '#172459',
    },
    maskView: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'black',
        opacity: 0.55,
        zIndex: 0,
    },
    statusContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    status: {
        color: 'black',
        marginTop: 10,
    },
});
