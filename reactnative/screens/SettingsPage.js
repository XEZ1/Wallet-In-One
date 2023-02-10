import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Button } from 'react-native';
import { logout } from '../authentication';
import { useContext } from 'react';
import { userContext } from '../data';

const SettingsScreen = ({  }) => {
  const [notifications, setNotifications] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const toggleNotifications = () => setNotifications(previousState => !previousState);
  const toggleDarkMode = () => setDarkMode(previousState => !previousState);
  const [user, setUser] = useContext(userContext)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.switchContainer}>
        <Text>Receive notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notifications ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleNotifications}
          value={notifications}
        />
      </View>

      <Text style={styles.title}>Themes</Text>
      <View style={styles.switchContainer}>
        <Text>Dark Mode (Beta)</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={darkMode ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleDarkMode}
          value={darkMode}
        />
      </View>

      <Button title="Log out" onPress={()=>{logout(user, setUser)}} style={styles.logoutButton}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%'
  },
  logoutButton: {
    marginTop: 20
  }
});

export default SettingsScreen;
