import { useIsFocused } from '@react-navigation/native';
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
import { NavigationProp } from '@react-navigation/native';

// Define Message interface
interface Message {
    room: string;
    message: string;
}

interface TapScreenProps {
	navigation: NavigationProp<any>;
  }

const WebSocketTester: React.FC<TapScreenProps> = ({ navigation }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [room, setRoom] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [showFrontCamera, setShowFrontCamera] = useState<boolean>(false);
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
                    console.log(scannedValue);
                    setRoom(value || '');
                    joinRoom();
                    sendMessage();
                    setCameraOn(false);
					SimpleToast.show('Tap Success!', SimpleToast.LONG, { tapToDismissEnabled: true, backgroundColor: '#172459' });
                } else {
                    SimpleToast.show('Invalid QR Code', SimpleToast.LONG, { tapToDismissEnabled: true, backgroundColor: '#172459' });
                    setCameraOn(false);
                }
            } else {
                // console.log('Invalid UUID number: ', scannedValue);
            }
        },
    });

    const isValidUUID = (value: string) => {
        const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/;
        return uuidRegex.test(value);
    };

    const fetchSelectecBeepCard = async () => {
        if (isFocused) {
            setMessage(mmkv.getString('selectedBeepCard')?.toString() || '');
        }
    };

    useEffect(() => {
        handleRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isFocused]);

    const initializeSocket = async () => {
        const newSocket = await connectWebsocket();
        setSocket(newSocket);

        newSocket!.on('message', () => {
            setCameraOn(false);
        });

        newSocket!.on('connect', async () => {
            setRefreshing(false);
            setIsConnected(true);
            if (hasPermission) {
                setCameraOn(true);
            } else {
                if (await requestPermission()) {
                    setCameraOn(true);
                } else {
                    newSocket!.disconnect();
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
    }, []);

    const sendMessage = () => {
        if (socket && room && message) {
            const data: Message = { room, message };
            socket.emit('messageToRoom', data);
			navigation.goBack();
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
        await handleRefresh(); // Refresh the connection
        setReconnectLoading(false); // Stop loading
    };

    const handleRefresh = () => {
        fetchSelectecBeepCard();
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
                            isActive={true}
                            codeScanner={codeScanner}
                        />
                        <RNHoleView style={styles.maskView} holes={[{ x: 70, y: 190, width: 250, height: 250, borderRadius: 60 }]} />
                        <View style={styles.qrLabel}>
                            <Text style={styles.qrLabelText}>beep™ Tap</Text>
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
                            Drag Down to Refresh
                        </Text>
                        <Button
                            mode="contained"
                            onPress={handleReconnect}
                            loading={reconnectLoading}
                            disabled={reconnectLoading} // Disable the button when loading
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
        left: 69.5,
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
