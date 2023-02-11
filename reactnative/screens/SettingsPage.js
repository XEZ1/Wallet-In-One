import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { logout } from '../authentication';
import { useContext } from 'react';
import { userContext } from '../data';
import { useTheme } from '../src/theme/ThemeProvider'
  
export default function SettingsPage ({ navigation }) {
  const [notifications, setNotifications] = useState(false);
  const toggleNotifications = () => setNotifications(previousState => !previousState);
  const [user, setUser] = useContext(userContext)

  const {dark, colors, setScheme} = useTheme();
  const toggleTheme=() => {
    dark ? setScheme('light') : setScheme('dark');
  };


  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow : 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: colors.primary,
        }}
      style={styles.container}
    >
      <Text style={[styles.title, {color: colors.text}]}>Notifications</Text>
      <View style={styles.switchContainer}>
        <Text style={[{color: colors.text}]}>Receive notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notifications ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleNotifications}
          value={notifications}
        />
      </View>

      <Text style={[styles.title, {color: colors.text}]}>Themes</Text>
      <View style={styles.switchContainer}>
        <Text style={[{color: colors.text}]}>Dark Mode (Beta)</Text>
        <Switch
          // trackColor={{ false: "#767577", true: "#81b0ff" }}
          // thumbColor={dark ? "#f5dd4b" : "#f4f3f4"}
          onValueChange={toggleTheme}
          value={dark}
        />
      </View>

      <Button title="Log out" onPress={()=>{logout(user, setUser)}} style={styles.logoutButton}/>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('About Us')}
      >
        <Text style={styles.aboutUs}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Developer Info')}
      >
        <Text style={styles.developers}>Meet the team!</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  aboutUs: {
    backgroundColor: 'red',
    color: 'black',
    width: "30%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: "2%",
    fontSize:  17,
    marginTop: '10%',
    alignSelf: 'center'
  },
  developers: {
    backgroundColor: 'black',
    color: 'red',
    width: "40%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    padding: "2%",
    fontSize:  17,
    marginTop: '10%',
    alignSelf: 'center',
  },
});