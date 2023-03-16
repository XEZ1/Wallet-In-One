import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Appearance,
  AsyncStorage,
  FlatList,
  TouchableHighlight
} from 'react-native';

import * as SecureStore from 'expo-secure-store';
import { logout } from '../authentication';
import { useContext } from 'react';
import { userContext } from '../data';
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { sendNotification,sendThemeNotification } from "./SendNotification";
import {styles} from 'reactnative/screens/All_Styles.style.js'

import Icon from 'react-native-vector-icons/Feather';

export default function SettingsPage ({ navigation }) {
  const [notifications, setNotifications] = useState(false);

  const [user, setUser] = useContext(userContext)

  const {dark, colors, setScheme, update} = useTheme();
  
  //const [isDarkModeEnabled, setIsDarkModeEnabled] = useState(false);

  const stylesInternal = StyleSheet.create({
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
    button: {
      width: "75%",
      borderRadius: 25,
      textAlign: 'center',
      fontWeight: 'bold',
      marginTop: '4%',
      paddingHorizontal: "12%",
      paddingVertical: "2%",
      fontSize:  20,
    },
    list: {
      backgroundColor: colors.background,
      width: "80%",
      borderWidth: 1,
      borderRadius: 4,
      borderColor: 'lightgrey',
    },
    item: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottomColor: '#ddd',
      borderBottomWidth: 1,
      height: 50
    },
    last_item: {
      borderBottomWidth: 0,
    },
  });

  const [selectedValue, setSelectedValue] = useState(null);

  function Item({label, value, style = stylesInternal.item}) {
    return <TouchableHighlight onPress={() => changeTheme(value)} underlayColor={dark?'#666':'#ddd'}>
      <View style={style}>
        <Text style={{color: colors.text}}>{label}</Text>
        {selectedValue === value && (<Icon name={'check'} size={24} color={'green'} />)}
      </View>
    </TouchableHighlight>;
  }

  //Load notification setting
  useEffect(() => {
      async function loadNotificationSetting() {

        const initialValue = await SecureStore.getItemAsync('darkModeSettings');
        setSelectedValue(initialValue);

        try {
          const savedNotificationSetting = await SecureStore.getItemAsync('notificationSetting');
        
          setNotifications(savedNotificationSetting === 'true');
        } catch(e) {
          console.warn("Couldn't load notification setting")
        }
      }
      loadNotificationSetting();
  }, []);

  // useEffect(() => {
  //   // Load user's saved dark mode setting on component mount
  //   async function loadDarkModeSettings() {
  //     const savedDarkModeSettings = await AsyncStorage.getItem('darkModeSettings');
  //     setIsDarkModeEnabled(savedDarkModeSettings === 'true');
  //     if (savedDarkModeSettings === 'true') {
  //         setScheme('dark');
  //     } else {
  //         setScheme('light');
  //     }
  //   }
  //   loadDarkModeSettings();
  // }, []);


  //Toggle and save notification setting
  const toggleNotifications = async () => {
      setNotifications(previousState => !previousState);
      const notificationSettings = (!notifications).toString();
      await  SecureStore.setItemAsync('notificationSettings', (!notifications).toString());
      sendNotification(notificationSettings);

  };

  //Toggle and save theme setting
  const changeTheme = async (theme) => {
      setSelectedValue(theme)
      update(theme)
      if (theme){
        await SecureStore.setItemAsync('darkModeSettings', theme);
      }
      else{
        await SecureStore.deleteItemAsync('darkModeSettings');
      }
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

      {/* <View style={stylesInternal.switchContainer}>
        <Text style={styles(dark, colors).text}>Dark Mode (Beta)</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={dark ? colors.primary : "#f4f3f4"}
          onValueChange={toggleTheme}
          value={dark}
        />
      </View> */}

      <View style={stylesInternal.list}>
        <Item label={'System Default'} value={null} />
        <Item label={'Light Mode'} value={'false'}/>
        <Item label={'Dark Mode'} value={'true'} style={[stylesInternal.item, stylesInternal.last_item]}/>
      </View>

      <TouchableOpacity
        onPress={()=>{logout(user, setUser)}}
      >
        <Text style={[{backgroundColor: colors.primary}, {color: "white"}, stylesInternal.button]}>Logout</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity
        onPress={() => navigation.navigate('About Us')}
      >
        <Text style={stylesInternal.aboutUs}>About Us</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Developer Info')}
      >
        <Text style={stylesInternal.developers}>Meet the team!</Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}