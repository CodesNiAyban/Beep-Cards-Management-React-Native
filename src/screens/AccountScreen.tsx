/* eslint-disable react/no-unstable-nested-components */
import { faClock, faKey, faMoon, faRedoAlt, faSignOutAlt, faTrashAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React, { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import { Divider, IconButton, List, Switch, Text } from 'react-native-paper';
import SimpleToast from 'react-native-simple-toast';
import ConfirmationModal from '../components/ConfirmationModal';
import { NavigationProp } from '@react-navigation/native';
import { useUserInactivity } from '../components/UserActivityDetector'; // Import the user inactivity hook


interface AccouScreenProps {
  navigation: NavigationProp<any>;
}

const SettingsScreen: React.FC<AccouScreenProps> = ({ navigation }) => {
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<string>('');
  const { resetTimer } = useUserInactivity();

  const handleToggleDarkMode = () => {
    // Implement toggle dark mode functionality
  };

  const handleConfirmAction = () => {
    switch (selectedSetting) {
      case 'logout':
        SimpleToast.show('Logged Out', SimpleToast.SHORT, { tapToDismissEnabled: true, backgroundColor: '#172459' });
        RNExitApp.exitApp();
        break;
      case 'changeUsername':
        // Implement change username functionality
        break;
      case 'changePin':
        navigation.navigate('CreatePin');
        break;
      case 'setTimeout':
        // Implement set timeout functionality
        break;
      case 'toggleDarkMode':
        // Implement toggle dark mode functionality
        break;
      case 'resetAccount':
        // Implement reset account functionality
        break;
      case 'deleteAllData':
        // Implement delete all data functionality
        break;
      default:
        break;
    }
    setIsConfirmationModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <List.Section>
        <Divider style={styles.divider} />
        <List.Accordion
          title="Account Settings"
          titleStyle={styles.groupTitle}
          style={styles.groupContainer}
        >
          <Divider style={styles.divider} />
          <List.Item
            title={<Text style={styles.itemText}>Change Username</Text>}
            left={() => <FontAwesomeIcon icon={faUser} style={styles.icon} />}
            onPress={() => {setIsConfirmationModalVisible(true); setSelectedSetting('changeUsername');}}
          />
          <List.Item
            title={<Text style={styles.itemText}>Change PIN</Text>}
            left={() => <FontAwesomeIcon icon={faKey} style={styles.icon} />}
            onPress={() => {setIsConfirmationModalVisible(true); setSelectedSetting('changePin');}}
          />
          <List.Item
            title={<Text style={styles.itemText}>Set Timeout</Text>}
            left={() => <FontAwesomeIcon icon={faClock} style={styles.icon} />}
            onPress={() => { setIsConfirmationModalVisible(true); setSelectedSetting('setTimeout');}}
          />
        </List.Accordion>
        <Divider style={styles.divider} />
        <List.Accordion
          title="App Settings"
          titleStyle={styles.groupTitle}
          style={styles.groupContainer}
        >
          <Divider style={styles.divider} />
          <List.Item
            title={<Text style={styles.itemText}>Dark Mode</Text>}
            left={() => <FontAwesomeIcon icon={faMoon} style={styles.icon} />}
            right={() => <Switch value={false}
              onValueChange={handleToggleDarkMode}
            />}
          />
          <List.Item
            title={<Text style={styles.itemText}>Reset Account</Text>}
            left={() => <FontAwesomeIcon icon={faRedoAlt} style={styles.icon} />}
            onPress={() => { setIsConfirmationModalVisible(true); setSelectedSetting('resetAccount');}}
          />
          <List.Item
            title={<Text style={styles.itemText}>Delete All Data</Text>}
            left={() => <FontAwesomeIcon icon={faTrashAlt} style={styles.icon} />}
            onPress={() => { setIsConfirmationModalVisible(true); setSelectedSetting('deleteAllData');}}
          />
        </List.Accordion>
        <Divider style={styles.divider} />
      </List.Section>
      <TouchableOpacity onPress={() => { setIsConfirmationModalVisible(true); setSelectedSetting('logout');}} style={styles.bottomContainer}>
        <Text style={styles.logoutText}>Logout</Text>
        <IconButton
          icon={() => <FontAwesomeIcon icon={faSignOutAlt} size={18} />}
          size={24}
          style={styles.logoutButton}
        />
      </TouchableOpacity>
      {/* Logout confirmation modal */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible && selectedSetting === 'logout'}
        onClose={() => {setIsConfirmationModalVisible(false); resetTimer();}}
        onConfirm={() => {handleConfirmAction();  resetTimer();}}
        title={'Logout Confirmation'}
        message={'Are you sure you want to logout?'}
        beepCardDetails={''}
      />
      {/* Change Username confirmation modal */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible && selectedSetting === 'changeUsername'}
        onClose={() => {setIsConfirmationModalVisible(false); resetTimer();}}
        onConfirm={() => {handleConfirmAction();  resetTimer();}}
        title={'Change Username Confirmation'}
        message={'Are you sure you want to change your username?'}
        beepCardDetails={''}
      />
      {/* Change PIN confirmation modal */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible && selectedSetting === 'changePin'}
        onClose={() => {setIsConfirmationModalVisible(false); resetTimer();}}
        onConfirm={() => {handleConfirmAction();  resetTimer();}}
        title={'Change PIN Confirmation'}
        message={'Are you sure you want to change your PIN?'}
        beepCardDetails={''}
      />
      {/* Set Timeout confirmation modal */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible && selectedSetting === 'setTimeout'}
        onClose={() => {setIsConfirmationModalVisible(false); resetTimer();}}
        onConfirm={() => {handleConfirmAction();  resetTimer();}}
        title={'Set Timeout Confirmation'}
        message={'Are you sure you want to set a timeout?'}
        beepCardDetails={''}
      />
      {/* Toggle Dark Mode confirmation modal */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible && selectedSetting === 'toggleDarkMode'}
        onClose={() => {setIsConfirmationModalVisible(false); resetTimer();}}
        onConfirm={() => {handleConfirmAction();  resetTimer();}}
        title={'Toggle Dark Mode Confirmation'}
        message={'Are you sure you want to toggle dark mode?'}
        beepCardDetails={''}
      />
      {/* Reset Account confirmation modal */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible && selectedSetting === 'resetAccount'}
        onClose={() => {setIsConfirmationModalVisible(false); resetTimer();}}
        onConfirm={() => {handleConfirmAction();  resetTimer();}}
        title={'Reset Account Confirmation'}
        message={'Are you sure you want to reset your account?'}
        beepCardDetails={''}
      />
      {/* Delete All Data confirmation modal */}
      <ConfirmationModal
        isVisible={isConfirmationModalVisible && selectedSetting === 'deleteAllData'}
        onClose={() => {setIsConfirmationModalVisible(false); resetTimer();}}
        onConfirm={() => {handleConfirmAction();  resetTimer();}}
        title={'Delete All Data Confirmation'}
        message={'Are you sure you want to delete all data?'}
        beepCardDetails={''}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F4F4F4',
  },
  groupContainer: {
    backgroundColor: '#EFEFEF',
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  icon: {
    fontSize: 18,
    marginRight: 10,
    marginLeft: 20,
    alignSelf: 'center',
  },
  itemText: {
    fontSize: 12,
    color: '#333',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center', // Align items vertically
    marginTop: 20,
  },
  logoutButton: {
    alignSelf: 'flex-end',
  },
  logoutText: {
    fontSize: 16,
    color: '#DC3545', // Logout text color
  },
  divider: {
    height: 1,
    backgroundColor: '#999', // Divider color
  },
});

export default SettingsScreen;
