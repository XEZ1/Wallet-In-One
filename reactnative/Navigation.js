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
import SettingsPage from './screens/SettingsPage';

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
          <Tab.Screen name="1" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 1', tabBarIcon: ({ color, size }) => (<Text>A</Text>) }}/>
          <Tab.Screen name="2" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 2', tabBarIcon: ({ color, size }) => (<Text>B</Text>) }}/>
          <Tab.Screen name="3" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 3', tabBarIcon: ({ color, size }) => (<Text>C</Text>) }}/>
          <Tab.Screen name="Settings" component={SettingsPage} options={{ tabBarLabel: 'Settings', tabBarIcon: ({ color, size }) => (<Text>C</Text>) }}/>
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen name='Start' component={StartScreen} />
          <Stack.Screen name='Sign Up' component={SignUpScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Settings' component={SettingsPage} />
        </Stack.Navigator>
      )}
    </NavigationContainer>)
}