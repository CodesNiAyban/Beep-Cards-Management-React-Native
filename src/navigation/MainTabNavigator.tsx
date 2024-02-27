/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AddBeepCardModal from '../components/AddBeepCardModal';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';
import { fetchBeepCard } from '../network/BeepCardManagerAPI';
import BeepCardsScreen from '../screens/BeepCardsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import TapScreen from '../screens/TapScreen';
import AccountScreen from '../screens/AccountScreen';
import HomeScreen from '../screens/HomeScreen';
import ToastManager, { Toast } from 'toastify-react-native';
import { Text } from 'react-native-paper';

const Tab = createBottomTabNavigator();

const screenContainerStyle = { flex: 1 };

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    zIndex: 1,
  },
  headerAddBeepCard: {
    color: '#6CB5E2', // Text color
    fontSize: 16, // Text size
    fontWeight: 'bold', // Text weight
  },
  addButton: {
    width: 45,
    height: 45,
    borderRadius: 25, // Make it circular
    overflow: 'hidden', // Hide the overflow to make the image circular
    backgroundColor: '#FF6F00', // Optional background color for the button
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  circleButtonImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover', // Adjust the image size to cover the entire circle
  },
});

interface AddBeepCardButtonProps {
  onPress: () => void;
}

const AddBeepCardButton: React.FC<AddBeepCardButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.addButtonContainer} onPress={onPress}>
    <View style={styles.addButton}>
      <Image source={require('../assets/circle_button_image.png')} style={styles.circleButtonImage} />
    </View>
  </TouchableOpacity>
);

const MainTabNavigator = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [beepCards, setBeepCards] = useState<BeepCardsModel[]>([]);
  const navigation = useNavigation();

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      e.preventDefault();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    const fetchBeepCardsData = async () => {
      try {
        const data = await fetchBeepCard();
        setBeepCards(data);
      } catch (error) {
        console.error('Error fetching beep cards:', error);
      }
    };

    fetchBeepCardsData();

    return () => {
      // Clean up function if needed
    };
  }, [navigation, isModalVisible, setIsModalVisible, setBeepCards]);

  const handleBeepCardSaved = (newBeepCard: BeepCardsModel) => {
    Toast.success('Beep card ' + newBeepCard.UUIC + ' replaced successfully!', 'top');
  };

  return (
    <View style={screenContainerStyle}>
      <ToastManager />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName = '';
            if (route.name === 'Home') {
              iconName = 'house-user';
            } else if (route.name === 'MyCard') {
              iconName = 'wallet';
            } else if (route.name === 'Transactions') {
              iconName = 'money-check';
            } else if (route.name === 'Account') {
              iconName = 'user-circle';
            }
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#172459',
          tabBarInactiveTintColor: '#ADAEB2',
          tabBarStyle: {
            backgroundColor: '#FFFFFF', // Background color for the tab bar
            borderTopWidth: 0,
            borderTopColor: '#172459',
            height: 60, // Adjust the height of the tab bar
            paddingVertical: 5, // Add padding vertically
            paddingHorizontal: 10, // Add padding horizontally
            borderRadius: 0, // Apply border radius to round the edges
          },
          tabBarLabelStyle: {
            fontSize: 11,
            marginBottom: 13,
          },
          headerStyle: {
            backgroundColor: '#172459', // Header background color
            elevation: 0, // Remove shadow on Android
            shadowOpacity: 0, // Remove shadow on iOS
          },
          headerTintColor: '#FFFFFF', // Header text color
          headerTitleAlign: 'center', // Center the header title
          headerRight: route.name === 'MyCard' ? () => (
            // eslint-disable-next-line react-native/no-inline-styles
            <TouchableOpacity onPress={toggleModal} style={{ marginRight: 10 }}>
              <Text style={styles.headerAddBeepCard}>Add</Text>
            </TouchableOpacity>
          ) : undefined, // Hide button for other screens
          tabBarIndicatorStyle: {
            backgroundColor: 'red', // Color of the indicator
            height: 3, // Height of the indicator
          },
        })}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
          }}
        />
        <Tab.Screen
          name="MyCard"
          options={{
            tabBarLabel: 'My Card',
            headerShown: true,
            title: 'Cards', // Set header title
          }}
        >
          {() => <BeepCardsScreen beepCards={beepCards} setBeepCards={setBeepCards} />}
        </Tab.Screen>
        <Tab.Screen
          name="Tap"
          component={TapScreen}
          options={{
            tabBarLabel: 'Tap',
          }}
        />
        <Tab.Screen
          name="Transactions"
          options={{
            tabBarLabel: 'Transaction',
            headerShown: true,
            title: 'Transactions', // Set header title
          }}
        >
          {() => <TransactionsScreen beepCards={beepCards} setBeepCards={setBeepCards} />}
        </Tab.Screen>
        <Tab.Screen
          name="Account"
          component={AccountScreen}
          options={{
            tabBarLabel: 'Account',
          }}
        />
      </Tab.Navigator>

      <AddBeepCardButton onPress={toggleModal} />
      <AddBeepCardModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        beepCards={beepCards}
        setBeepCards={setBeepCards}
        onSuccess={handleBeepCardSaved}
      />
    </View>
  );
};

export default MainTabNavigator;
