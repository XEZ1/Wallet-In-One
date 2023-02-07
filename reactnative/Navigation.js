import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useContext, useEffect } from 'react';
import { Text } from 'react-native';

// Screens
import StartScreen from './screens/StartScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoggedInScreen from './screens/LoggedInScreen';
import LoginScreen from './screens/LoginScreen';
import CryptoWallet from "./screens/crypto/CryptoWallet";

import { initAuthState } from './authentication';
import { userContext } from './data';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function Navigation() {

    const [user, setUser] = useContext(userContext)

    useEffect(()=>{initAuthState(user, setUser);}, []);

  return (
    <NavigationContainer>
      {user.signedIn ? (
        <Tab.Navigator>
          {/* vvvvv Temporary (will be moved to account screen) vvvvv */}
          <Tab.Screen name="Crypto Wallets" component={CryptoWallet} options={{ tabBarLabel: 'Crypto Wallet', tabBarIcon: ({ color, size }) => (<Text>₿</Text>) }}/>

          <Tab.Screen name="1" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 1', tabBarIcon: ({ color, size }) => (<Text>A</Text>) }}/>
          <Tab.Screen name="2" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 2', tabBarIcon: ({ color, size }) => (<Text>B</Text>) }}/>
          <Tab.Screen name="3" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 3', tabBarIcon: ({ color, size }) => (<Text>C</Text>) }}/>
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name='Start' component={StartScreen} />
          <Stack.Screen name='Sign Up' component={SignUpScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>)
}
