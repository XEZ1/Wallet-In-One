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
import AboutUsScreen from './screens/AboutUsScreen';
import DeveloperInfoScreen from './screens/DeveloperInfoScreen';

import { initAuthState } from './authentication';
import { userContext } from './data';

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
            headerStyle: {backgroundColor: colors.primary},
            headerTitleStyle: {color: colors.text},
            tabBarStyle: {backgroundColor: colors.primary}
          }}>
          <Tab.Screen name="1" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 1', tabBarIcon: ({ color, size }) => (<Text style={[{color: colors.text}]}>A</Text>) }}/>
          <Tab.Screen name="2" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 2', tabBarIcon: ({ color, size }) => (<Text style={[{color: colors.text}]}>B</Text>) }}/>
          <Tab.Screen name="Settings" component={SettingsPage} options={{ tabBarLabel: 'Settings', tabBarIcon: ({ color, size }) => (<Text style={[{color: colors.text}]}>C</Text>) }}/>
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name='Start' component={StartScreen} />
          <Stack.Screen name='Sign Up' component={SignUpScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen name='Settings' component={SettingsPage} />
          <Stack.Screen options={{headerShown: false}}  name='About Us' component={AboutUsScreen} />
          <Stack.Screen options={{headerShown: false}} name='Developer Info' component={DeveloperInfoScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  )
}