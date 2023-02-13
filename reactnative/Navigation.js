import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useContext, useEffect } from 'react';
import { Text } from 'react-native';

import PieChartWallet from './screens/charts/PieChart';
import BarChartWallet from './screens/charts/BarChart';

// Screens
import StartScreen from './screens/StartScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoggedInScreen from './screens/LoggedInScreen';
import LoginScreen from './screens/LoginScreen';

import SettingsPage from './screens/SettingsPage';
import AboutUsScreen from './screens/AboutUsScreen';
import DeveloperInfoScreen from './screens/DeveloperInfoScreen';

import AddBankScreen from './screens/banking/AddBankScreen'
import BankAccountsScreen from './screens/banking/BankAccountsScreen'

import { initAuthState } from './authentication';
import { userContext } from './data';
import CryptoWalletStackNavigator from "./screens/crypto_wallet/CryptoWalletStackNavigator";

import { useTheme } from 'reactnative/src/theme/ThemeProvider'

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Navigation() {

    const [user, setUser] = useContext(userContext)
    const {dark, colors, setScheme} = useTheme();

    useEffect(()=>{initAuthState(user, setUser);}, []);

  return (
    <NavigationContainer>
      {user.signedIn ? (
        <Tab.Navigator
          screenOptions={{
            headerStyle: {backgroundColor: colors.background},
            headerTitleStyle: {color: colors.text},
            tabBarStyle: {backgroundColor: colors.background},
          }}
        >
          <Stack.Screen
            name='Pie Chart'
            component={PieChartWallet}
            options={{
              tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Pie Chart</Text>),
              tabBarIcon: ({focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>1</Text>)
            }}
          />
          <Stack.Screen
            name='Bar Chart'
            component={BarChartWallet}
            options={{
              tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Bar Chart</Text>),
              tabBarIcon: ({focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>2</Text>)
            }}
          />
          <Tab.Screen
            name="1"
            component={LoggedInScreen}
            options={{
              tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Screen 1</Text>),
              tabBarIcon: ({focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>A</Text>)
            }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsPage}
            options={{
              tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Settings</Text>),
              tabBarIcon: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>C</Text>)
            }}
          />

          {/* vvvvv Temporary (will be moved to account screen) vvvvv */}
          <Tab.Screen
            name="Crypto Wallets"
            component={CryptoWalletStackNavigator}
            options={{
              tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Crypto wallet</Text>),
              tabBarIcon: ({focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>₿</Text>)
            }}
          />
          <Tab.Screen
            name="Add Bank Account"
            component={AddBankScreen}
            options={{
              tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Add bank account</Text>),
              tabBarIcon: ({focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>D</Text>)
            }}
          />
          <Tab.Screen
            name="Bank Accounts"
            component={BankAccountsScreen}
            options={{
              tabBarLabel: ({ focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>Bank accounts</Text>),
              tabBarIcon: ({focused }) => (<Text style={{color: focused ? colors.primary : colors.text}}>E</Text>)
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
