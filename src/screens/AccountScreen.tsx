/* eslint-disable react/no-unstable-nested-components */
import { faClock, faKey, faMoon, faRedoAlt, faSignOutAlt, faTrashAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Divider, IconButton, List, Switch, Text } from 'react-native-paper';

const SettingsScreen = () => {

  const handleLogout = () => {
    // Implement logout functionality
  };

  const handleChangeUsername = () => {
    // Implement change username functionality
  };

  const handleChangePin = () => {
    // Implement change pin functionality
  };

  const handleSetTimeout = () => {
    // Implement set timeout functionality
  };

  const handleToggleDarkMode = () => {
    // Implement toggle dark mode functionality
  };

  const handleResetAccount = () => {
    // Implement reset account functionality
  };

  const handleDeleteAllData = () => {
    // Implement delete all data functionality
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
            onPress={handleChangeUsername}
          />
          <List.Item
            title={<Text style={styles.itemText}>Change PIN</Text>}
            left={() => <FontAwesomeIcon icon={faKey} style={styles.icon} />}
            onPress={handleChangePin}
          />
          <List.Item
            title={<Text style={styles.itemText}>Set Timeout</Text>}
            left={() => <FontAwesomeIcon icon={faClock} style={styles.icon} />}
            onPress={handleSetTimeout}
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
            right={() => <Switch value={false} onValueChange={handleToggleDarkMode} />}
          />
          <List.Item
            title={<Text style={styles.itemText}>Reset Account</Text>}
            left={() => <FontAwesomeIcon icon={faRedoAlt} style={styles.icon} />}
            onPress={handleResetAccount}
          />
          <List.Item
            title={<Text style={styles.itemText}>Delete All Data</Text>}
            left={() => <FontAwesomeIcon icon={faTrashAlt} style={styles.icon} />}
            onPress={handleDeleteAllData}
          />
        </List.Accordion>
        <Divider style={styles.divider} />
      </List.Section>
      <TouchableOpacity onPress={handleLogout} style={styles.bottomContainer}>
        <Text style={styles.logoutText}>Logout</Text>
        <IconButton
          icon={() => <FontAwesomeIcon icon={faSignOutAlt} size={18}/>}
          size={24}
          style={styles.logoutButton}
        />
      </TouchableOpacity>
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
