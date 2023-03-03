import { NavigationContainer,  DefaultTheme, DarkTheme} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useContext, useEffect } from 'react';
import { Text } from 'react-native';



import MainStackNavigator from "./screens/Main Account/MainStackNavigator";

// Screens
import StartScreen from './screens/pre_logged_in/StartScreen';
import SignUpScreen from './screens/pre_logged_in/SignUpScreen';
import LoginScreen from './screens/LoginScreen';
import HomePage from './screens/charts/HomePage';
import SettingsPage from './screens/SettingsPage';
import AboutUsScreen from './screens/pre_logged_in/AboutUsScreen';
import DeveloperInfoScreen from './screens/pre_logged_in/DeveloperInfoScreen';
import NotificationsPage from "./screens/NotificationsPage";

import AddBankScreen from './screens/banking/AddBankScreen'
import BankAccountsScreen from './screens/banking/BankAccountsScreen'
import BankTransactionsScreen from './screens/banking/BankTransactionsScreen'
import BankStackNavigator from "./screens/banking/BankStackNavigator";
import CryptoStackNavigator from './screens/crypto_wallet/CryptoStackNavigator';

import { initAuthState } from './authentication';
import { userContext } from './data';


import { useTheme } from 'reactnative/src/theme/ThemeProvider'

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import { setStatusBarHidden } from 'expo-status-bar';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Navigation() {

    const [user, setUser] = useContext(userContext)
    const {dark, colors, setScheme} = useTheme();

    useEffect(()=>{initAuthState(user, setUser);}, []);

  return (
    <NavigationContainer
      theme={dark ? DarkTheme: DefaultTheme}
    >
      {user.signedIn ? (
        <Tab.Navigator
          initialRouteName='Home Page'
          screenOptions={
          {
            headerStyle: {backgroundColor: colors.background},
            headerTitleStyle: {color: colors.text},
            tabBarStyle: {backgroundColor: colors.background},
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: true,
          }}
        >
          <Tab.Screen
            name='Home Page'
            component={HomePage}
            options={{
              //tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Home</Text>),
              tabBarIcon: ({focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}><AntDesign name="home" size={30}/></Text>),
            }}
          />
          <Tab.Screen
            name="Main Account"
            component={MainStackNavigator}
            options={{
              //tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Home</Text>),
              tabBarIcon: ({ focused }) => (
                <Text style={{ color: focused ? colors.primary : colors.text }}>
                  <AntDesign name="user" size={30} />
                </Text>
              ),
            }}
          />
          <Tab.Screen
            name="Notifications"
            component={NotificationsPage}
            options={{
              //tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Home</Text>),
              tabBarIcon: ({ focused }) => (
                <Text style={{ color: focused ? colors.primary : colors.text }}>
                  <AntDesign name="notification" size={30} />
                </Text>
              ),
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsPage}
            options={{
              //tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Settings</Text>),
              tabBarIcon: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}><AntDesign name="setting" size={30}/></Text>)
            }}
          />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen
            name='Start'
            component={StartScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='Sign Up'
            component={SignUpScreen}
          />
          <Stack.Screen
            name='Login'
            component={LoginScreen}
          />
          <Stack.Screen
            name='Settings'
            component={SettingsPage}
          />
          <Stack.Screen
            name='About Us'
            component={AboutUsScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name='Developer Info'
            component={DeveloperInfoScreen}
            options={{headerShown: false}}
          />

        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}

