import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
  FlatList,
  TouchableHighlight
} from 'react-native';
import { logout } from '../authentication';
import { useContext } from 'react';
import { userContext } from '../data';
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { sendNotification,sendThemeNotification } from "./SendNotification";
import * as SecureStore from 'expo-secure-store';

import Icon from 'react-native-vector-icons/Feather';

export default function SettingsPage ({ navigation }) {
  const [notifications, setNotifications] = useState(false);

  const [user, setUser] = useContext(userContext)

  const {dark, colors, setScheme, update} = useTheme();

  const [selectedValue, setSelectedValue] = useState(null);

  function Item({label, value, style = styles.item}) {
    return <TouchableHighlight onPress={() => changeTheme(value)} underlayColor={dark?'#666':'#ddd'}>
      <View style={style}>
        <Text style={{color: colors.text}}>{label}</Text>
        {selectedValue === value && (<Icon name={'check'} size={24} color={'green'} />)}
      </View>
    </TouchableHighlight>;
  }

  //Load notification setting
  useEffect(() => {
      async function loadNotificationSettings() {

        const initialValue = await SecureStore.getItemAsync('darkModeSettings');
        setSelectedValue(initialValue);

        const savedSettings = await SecureStore.getItemAsync('notificationSettings');
        
        setNotifications(savedSettings === 'true');
      }
      loadNotificationSettings();
  }, []);

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

  return (
    
    <ScrollView
      contentContainerStyle={{
        flexGrow : 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: colors.background,
        }}
      style={styles.container}
    >
      <Text style={[styles.title, {color: colors.text}]}>Notifications</Text>
      <View style={styles.switchContainer}>
        <Text style={[{color: colors.text}]}>Receive notifications</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notifications ? colors.primary : "#f4f3f4"}
          onValueChange={toggleNotifications}
          value={notifications}
        />
      </View>

      <Text style={[styles.title, {color: colors.text}]}>Themes</Text>

      {/* <View style={styles.switchContainer}>
        <Text style={[{color: colors.text}]}>Dark Mode (Beta)</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={dark ? colors.primary : "#f4f3f4"}
          onValueChange={toggleTheme}
          value={dark}
        />
      </View> */}

      <View style={styles.list}>
        <Item label={'System Default'} value={null} />
        <Item label={'Light Mode'} value={'false'}/>
        <Item label={'Dark Mode'} value={'true'} style={[styles.item, styles.last_item]}/>
      </View>

      <TouchableOpacity
        onPress={()=>{logout(user, setUser)}}
      >
        <Text style={[{backgroundColor: colors.primary}, {color: colors.text}, styles.button]}>Logout</Text>
      </TouchableOpacity>


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


