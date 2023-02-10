import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, Button } from 'react-native';
import { logout } from '../authentication';
import { useContext } from 'react';
import { userContext } from '../data';

const SettingsScreen = ({  }) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [user, setUser] = useContext(userContext)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.switchContainer}>
        <Text>Receive notifications:</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleSwitch}
          value={isEnabled}
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
