import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

interface LoadingProps {
    loading: boolean
}

const LoadingContainer: React.FC<LoadingProps> = ({ loading }) => {
    if (!loading) { return null; }

    return (
        <View style={styles.loadingContainer}>
            <View style={styles.loadingOverlay} />
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.text}>Loading beep™ cards...</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000, // Make sure it overlays other content
        flex: 1,
        flexDirection: 'row',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent and blurred color
        flex: 1,
        flexDirection: 'row',
    },
    text: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
        zIndex: 1001,
    },
});

export default LoadingContainer;
