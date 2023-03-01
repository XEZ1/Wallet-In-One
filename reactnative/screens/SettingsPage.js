import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Appearance,
  AsyncStorage
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { logout } from '../authentication';
import { useContext } from 'react';
import { userContext } from '../data';
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { sendNotification,sendThemeNotification } from "./SendNotification";
import {styles} from 'reactnative/screens/All_Styles.style.js'
  
export default function SettingsPage ({ navigation }) {
  const [notifications, setNotifications] = useState(false);

  const [user, setUser] = useContext(userContext)

  const {dark, colors, setScheme} = useTheme();
  const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  const stylesInternal = StyleSheet.create({
    switchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '80%'
    },
  });

  //Load notification setting
  useEffect(() => {
      async function loadNotificationSetting() {
        try {
          const savedNotificationSetting = await AsyncStorage.getItem('notificationSetting');
          setNotifications(savedNotificationSetting === 'true');
        } catch(e) {
          console.warn("Couldn't load notification setting")
        }
      }
      loadNotificationSetting();
  }, []);

  useEffect(() => {
      // Load user's saved dark mode setting on component mount
      async function loadDarkModeSettings() {
        const savedDarkModeSettings = await AsyncStorage.getItem('darkModeSettings');
        setIsDarkModeEnabled(savedDarkModeSettings === 'true');
        if (savedDarkModeSettings === 'true') {
            setScheme('dark');
        } else {
            setScheme('light');
        }
      }
      loadDarkModeSettings();
    }, []);


  //Toggle and save notification setting
  const toggleNotifications = async () => {
      setNotifications(previousState => !previousState);
      const notificationSettings = (!notifications).toString();
      await AsyncStorage.setItem('notificationSettings', (!notifications).toString());
      sendNotification(notificationSettings);

  };



  //Toggle and save theme setting
  const toggleTheme = async () => {
      dark ? setScheme('light') : setScheme('dark');

      setIsDarkModeEnabled(previousState => !previousState);
      await AsyncStorage.setItem('darkModeSettings', (!isDarkModeEnabled).toString());

      const notificationSettings = notifications.toString();
      sendThemeNotification(notificationSettings);

  };


  return (
    
    <ScrollView
      contentContainerStyle={{
        flexGrow : 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: colors.background,
        }}
      style={styles(dark, colors).container}
    >
      <Text style={[styles(dark, colors).textBold, {fontSize: 24, marginBottom: 20}]}>Notifications</Text>
      <View style={stylesInternal.switchContainer}>
        <Text style={styles(dark, colors).text}>Receive notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notifications ? colors.primary : "#f4f3f4"}
          onValueChange={toggleNotifications}
          value={notifications}
        />
      </View>

      <Text style={[styles(dark, colors).textBold, {fontSize: 24, marginBottom: 20}]}>Themes</Text>
      <View style={stylesInternal.switchContainer}>
        <Text style={styles(dark, colors).text}>Dark Mode (Beta)</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={dark ? colors.primary : "#f4f3f4"}
          onValueChange={toggleTheme}
          value={isDarkModeEnabled}
        />
      </View>

      <TouchableOpacity
        onPress={()=>{logout(user, setUser)}}
      >
        <Text style={styles(dark, colors).button}>Logout</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}