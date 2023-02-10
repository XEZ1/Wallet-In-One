import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useContext, useEffect } from 'react';
import { Text } from 'react-native';

import PieChartWallet from './screens/Pie_Chart';
import BarChartWallet from './screens/Bar_Chart';

// Screens
import StartScreen from './screens/StartScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoggedInScreen from './screens/LoggedInScreen';
import LoginScreen from './screens/LoginScreen';
import AboutUsScreen from './screens/AboutUsScreen';
import DeveloperInfoScreen from './screens/DeveloperInfoScreen';

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
          <Stack.Screen name='Bar Chart' component={BarChartWallet} />
          <Stack.Screen name='Pie Chart' component={PieChartWallet} />
          <Tab.Screen name="1" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 1', tabBarIcon: ({ color, size }) => (<Text>A</Text>) }}/>
          <Tab.Screen name="2" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 2', tabBarIcon: ({ color, size }) => (<Text>B</Text>) }}/>
          <Tab.Screen name="3" component={LoggedInScreen} options={{ tabBarLabel: 'Screen 3', tabBarIcon: ({ color, size }) => (<Text>C</Text>) }}/>
        </Tab.Navigator>
      ) : (
        <Stack.Navigator>
          <Stack.Screen options={{headerShown: false}} name='Start' component={StartScreen} />
          <Stack.Screen name='Sign Up' component={SignUpScreen} />
          <Stack.Screen name='Login' component={LoginScreen} />
          <Stack.Screen options={{headerShown: false}}  name='About Us' component={AboutUsScreen} />
          <Stack.Screen options={{headerShown: false}} name='Developer Info' component={DeveloperInfoScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>)
}