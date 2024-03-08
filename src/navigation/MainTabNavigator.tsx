/* eslint-disable react/no-unstable-nested-components */
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { AppState, Image, LogBox, StyleSheet, TouchableOpacity, View } from 'react-native';
import { MMKV } from 'react-native-mmkv';
import { Text } from 'react-native-paper';
import SimpleToast from 'react-native-simple-toast'; // Import SimpleToast
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import UserInactivityWrapper from '../components/UserActivityDetector';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';
import { TransactionItem as TransactionsModel } from '../models/TransactionsModel';
import { fetchBeepCard, getTransactions } from '../network/BeepCardManagerAPI';
import AccountScreen from '../screens/AccountScreen';
import BeepCardsScreen from '../screens/BeepCardsScreen';
import HomeScreen from '../screens/HomeScreen';
import TapScreen from '../screens/TapScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
LogBox.ignoreLogs(['new NativeEventEmitter']); // Ignore log notification by message
LogBox.ignoreAllLogs(); //Ignore all log notifications

const Tab = createBottomTabNavigator();

const screenContainerStyle = { flex: 1 };

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    bottom: 60,
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
  navigation: NavigationProp<any>;
  onPress: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const AddBeepCardButton: React.FC<AddBeepCardButtonProps> = ({ onPress, navigation }) => (
  <TouchableOpacity style={styles.addButtonContainer} onPress={onPress}>
    <View style={styles.addButton}>
      <Image source={require('../assets/circle_button_image.png')} style={styles.circleButtonImage} />
    </View>
  </TouchableOpacity>
);

const MainTabNavigator = () => {
  const [beepCards, setBeepCards] = useState<BeepCardsModel[]>([]);
  const [transactions, setTransactions] = useState<TransactionsModel[]>([]);
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const [appState, setAppState] = useState(AppState.currentState);
  const mmkv = new MMKV();
  // let backgroundTimer: number | null = null;
  const androidID = mmkv.getString('phoneID');

  const showAddBeepCardScreen = () => {
    navigation.navigate('AddBeepCard');
  };

  const showTapScreen = () => {
    const selectedBeepCard = mmkv.getString('selectedBeepCard');
    if (selectedBeepCard) {
      navigation.navigate('Tap');
    } else {
      SimpleToast.show('Select a beep™ card first', SimpleToast.SHORT, { tapToDismissEnabled: true, backgroundColor: '#172459' });
    }
  };

  useEffect(() => {
    const navigateToPinScreen = () => {
      navigation.navigate('Pin');
    };

    const appInactiveHandler = () => {
      SimpleToast.show('Logged out. App was Inactive.', SimpleToast.SHORT, { tapToDismissEnabled: true, backgroundColor: '#172459' });
      navigateToPinScreen();
    };

    const handleAppStateChange = (nextAppState: any) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active') {
        appInactiveHandler(); // Reset timer only when going from background/inactive to active
      }
      setAppState(nextAppState);
    };

    const unsubscribe = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      unsubscribe.remove(); // Use remove method to unsubscribe
    };
  }, [appState, navigation]);

  useEffect(() => {
    const fetchBeepCardsData = async () => {
      try {
        console.log('Nagfetch');
        const data = await fetchBeepCard(androidID!);
        const transactionData = await getTransactions(androidID!);
        setBeepCards(data);
        if (transactionData) {
          setTransactions(transactionData);
        } else {
          console.log('Transactions not found');
        }
      } catch (error) {
        console.error('Error fetching beep cards:', error);
        SimpleToast.show('Network Error. Please Connect to the Internet', SimpleToast.SHORT, { tapToDismissEnabled: true, backgroundColor: '#172459' });
        navigation.navigate('Pin');
      }
    };

    fetchBeepCardsData();
  }, [androidID, navigation]);

  return (
    <UserInactivityWrapper>
      <View style={screenContainerStyle}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color }) => {
              let iconName = '';
              if (route.name === 'Home') {
                iconName = 'house-user';
                return <FontAwesome5 name={iconName} size={22} color={color} />;
              } else if (route.name === 'MyCard') {
                iconName = 'wallet';
                return <FontAwesome5 name={iconName} size={22} color={color} />;
              } else if (route.name === 'Transactions') {
                iconName = 'money-check';
                return <FontAwesome5 name={iconName} size={20} color={color} />;
              } else if (route.name === 'Account') {
                iconName = 'user-circle';
                return <FontAwesome5 name={iconName} size={24} color={color} />;
              } else {
                return;
              }
            },
            tabBarActiveTintColor: '#172459',
            tabBarInactiveTintColor: '#ADAEB2',
            tabBarStyle: {
              backgroundColor: '#FFFFFF', // Background color for the tab bar
              borderTopWidth: 0,
              borderTopColor: '#172459',
              height: 80, // Adjust the height of the tab bar
              paddingHorizontal: 13, // Add padding horizontally
              borderRadius: 0, // Apply border radius to round the edges
              paddingTop: 5,
            },
            tabBarLabelStyle: {
              fontSize: 11,
              marginBottom: 34,
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
              <TouchableOpacity onPress={showAddBeepCardScreen} style={{ marginRight: 10 }}>
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
          >{() => <BeepCardsScreen beepCards={beepCards} setBeepCards={setBeepCards} transactions={transactions} setTransactions={setTransactions} navigation={navigation} />}
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
            {() => <TransactionsScreen beepCards={beepCards} setBeepCards={setBeepCards} transactions={transactions} setTransactions={setTransactions} navigation={navigation} />}
          </Tab.Screen>
          <Tab.Screen
            name="Account"
            component={AccountScreen}
            options={{
              tabBarLabel: 'Account',
            }}
          />
        </Tab.Navigator>
        <AddBeepCardButton onPress={showTapScreen} navigation={navigation} />
      </View>
    </UserInactivityWrapper >
  );
};

export default MainTabNavigator;
