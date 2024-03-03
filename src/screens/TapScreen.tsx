import React, { useEffect, useState } from 'react';
import { Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import io, { Socket } from 'socket.io-client';
import { Camera, useCameraDevice, useCameraPermission, useCodeScanner } from 'react-native-vision-camera';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused } from '@react-navigation/native';
import { MMKV } from 'react-native-mmkv';

interface Message {
	room: string;
	message: string;
}

const WebSocketTester = () => {
	const [receivedMessage, setReceivedMessage] = useState<string | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [isConnected, setIsConnected] = useState<boolean>(false);
	const [room, setRoom] = useState<string>('');
	const [message, setMessage] = useState<string>('');
	const [showFrontCamera, setShowFrontCamera] = useState<boolean>(false); // State for toggling front/back camera
	const [cameraOn, setCameraOn] = useState<boolean>(true);
	const { hasPermission, requestPermission } = useCameraPermission();
	const device = useCameraDevice(showFrontCamera ? 'front' : 'back');
	const isFocused = useIsFocused();
	const mmkv = new MMKV();

	const codeScanner = useCodeScanner({
		codeTypes: ['qr'],
		onCodeScanned: (codes) => {
			const { value } = codes[0];
			setRoom(value || ''); // Set room to empty string if value is undefined
			joinRoom();
			sendMessage();
		},
	});

	useEffect(() => {
		if (isFocused) {
			setCameraOn(true); // Reset onScanned state when screen is focused
			setMessage(mmkv.getString('selectedBeepCard')?.toString() || '');
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFocused]);

	useEffect(() => {
		// Connect to the WebSocket server
		const newSocket = io('http://192.168.64.240:5000'); // Replace with your WebSocket server URL
		setSocket(newSocket);

		// Listen for messages from the server
		newSocket.on('message', (msg: string) => {
			setCameraOn(false);
			setReceivedMessage(msg);
		});

		// Set connection status
		newSocket.on('connect', () => {
			setIsConnected(true);
		});
		newSocket.on('disconnect', () => {
			setIsConnected(false);
		});

		return () => {
			// Disconnect WebSocket connection when component unmounts
			if (newSocket) {
				newSocket.disconnect();
			}
		};
	}, []);

	const sendMessage = () => {
		// Send a message to the server
		if (socket && room && message) {
			const data: Message = { room, message };
			socket.emit('messageToRoom', data);
		}
	};

	const joinRoom = () => {
		// Join a room
		if (socket && room) {
			socket.emit('joinRoom', room);
		}
	};

	const leaveRoom = () => {
		// Leave a room
		if (socket && room) {
			socket.emit('leaveRoom', room);
		}
	};

	const toggleCamera = async () => {
		if (!hasPermission) {
			await requestPermission();
		}
		setShowFrontCamera(prevState => !prevState); // Toggle camera between front and back
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>WebSocket Tester</Text>
			{cameraOn &&
				<View style={styles.cameraContainer}>
					<Camera style={styles.camera}
						device={device!}
						isActive={cameraOn}
						codeScanner={codeScanner} />
				</View>
			}

			<TextInput
				label="Message"
				value={message}
				onChangeText={setMessage}
				style={styles.input}
			/>
			<Button title="Leave Room" onPress={leaveRoom} disabled={!isConnected || !room} />
			<Button
				title="Send Message to Room"
				onPress={sendMessage}
				disabled={!isConnected || !room || !message}
			/>
			<TouchableOpacity style={styles.toggleCameraButton} onPress={toggleCamera}>
				<Icon name={showFrontCamera ? 'camera-retro' : 'camera'} size={24} color="black" />
			</TouchableOpacity>
			<View style={styles.statusContainer}>
				<Text style={styles.status}>
					{isConnected ? 'Connected to WebSocket server' : 'Not connected to WebSocket server'}
				</Text>
				{receivedMessage && <Text style={styles.receivedMessage}>Received message: {receivedMessage}</Text>}
			</View>
		</View>
	);
};

export default WebSocketTester;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 20,
	},
	title: {
		color: 'black',
		marginBottom: 10,
		fontSize: 20,
		fontWeight: 'bold',
	},
	input: {
		width: 200,
		marginBottom: 10,
	},
	cameraContainer: {
		width: '100%',
		aspectRatio: 1, // Ensure the camera preview is square
		overflow: 'hidden',
		marginBottom: 10,
	},
	camera: {
		width: '100%',
		height: '100%',
	},
	toggleCameraButton: {
		position: 'absolute',
		top: 20,
		right: 20,
	},
	statusContainer: {
		marginTop: 20,
		alignItems: 'center',
	},
	status: {
		color: 'black',
		marginTop: 10,
	},
	receivedMessage: {
		color: 'black',
		marginTop: 10,
	},
});
