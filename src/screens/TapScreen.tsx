// WebSocketTestScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import io from 'socket.io-client';


const MRT_ONLINE_API_URL = 'https://mrtonlineapi.onrender.com';

const WebSocketTestScreen = () => {
  const [message, setMessage] = useState('');
  const [receivedMessage, setReceivedMessage] = useState('');
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    // Connect to the WebSocket server
    const newSocket = io(MRT_ONLINE_API_URL);
    setSocket(newSocket);

    // Listen for messages from the server
    newSocket.on('chat message', (msg: string) => {
      setReceivedMessage(msg);
    });

    return () => {
      // Close the WebSocket connection when component unmounts
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    // Send the message to the server
    if (socket) {
      socket.emit('chat message', message);
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type your message"
        value={message}
        onChangeText={setMessage}
      />
      <Button title="Send Message" onPress={sendMessage} />
      <Text style={styles.receivedMessage}>Received message: {receivedMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
  receivedMessage: {
    marginTop: 20,
  },
});

export default WebSocketTestScreen;
