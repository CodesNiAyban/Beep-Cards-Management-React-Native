import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AddBeepCardModal from '../components/AddBeepCardModal';
import { BeepCardItem as BeepCardsModel } from '../models/BeepCardsModel';
import { fetchBeepCard } from '../network/BeepCardManagerAPI';
import BeepCardsScreen from '../screens/BeepCardsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import ToastManager, { Toast } from 'toastify-react-native';

const Tab = createBottomTabNavigator();

const screenContainerStyle = { flex: 1 };

const styles = StyleSheet.create({
  addButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    zIndex: 1,
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6F00',
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
});

interface AddBeepCardButtonProps {
  onPress: () => void;
}

const AddBeepCardButton: React.FC<AddBeepCardButtonProps> = ({ onPress }) => (
  <TouchableOpacity style={styles.addButtonContainer} onPress={onPress}>
    <View style={styles.addButton}>
      <FontAwesome5 name="plus" size={24} color={'white'} />
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
  }, [beepCards]);

  const handleSuccessToast = (newBeepCard: BeepCardsModel) => {
    // Update the beepCards state with the newly added beep card
    setBeepCards(prevBeepCards => [...prevBeepCards, newBeepCard]);

    // Display a toast indicating the successful addition
    Toast.success('Beep card ' + newBeepCard.UUIC + ' added successfully!', 'top');
  };

  return (
    <View style={screenContainerStyle}>
      <ToastManager />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }) => {
            let iconName = '';
            if (route.name === 'BeepCards') {
              iconName = 'credit-card';
            } else if (route.name === 'Transactions') {
              iconName = 'exchange-alt';
            }
            return <FontAwesome5 name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#FF6F00',
          tabBarInactiveTintColor: '#757575',
          tabBarStyle: {
            backgroundColor: '#ffffff',
            borderTopWidth: 1,
            borderTopColor: '#eeeeee',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 5,
          },
        })}
      >
        <Tab.Screen
          name="BeepCards"
          options={{
            tabBarLabel: 'Beep Cards',
            headerShown: false,
          }}
        >
          {() => <BeepCardsScreen beepCards={beepCards} />}
        </Tab.Screen>
        <Tab.Screen
          name="Transactions"
          options={{
            tabBarLabel: 'Transactions',
            headerShown: false,
          }}
        >
          {() => <TransactionsScreen beepCards={beepCards} />}
        </Tab.Screen>
      </Tab.Navigator>
      <AddBeepCardButton onPress={toggleModal} />
      <AddBeepCardModal
        isVisible={isModalVisible}
        onClose={toggleModal}
        beepCards={beepCards}
        onSuccess={handleSuccessToast} // Pass the onSuccess callback here
      />
    </View>
  );
};

export default MainTabNavigator;
