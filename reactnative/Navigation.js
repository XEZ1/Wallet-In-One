import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useContext, useEffect } from 'react';
import { userContext } from './data';

// Screens
import StartScreen from './screens/StartScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoggedInScreen from './screens/LoggedInScreen';
import LoginScreen from './screens/LoginScreen';

import { initAuthState } from './authentication';

const Stack = createStackNavigator();

export default function Navigation() {

    const [user, setUser] = useContext(userContext)

    useEffect(()=>{initAuthState(user, setUser);}, []);

    return (
    <NavigationContainer>
        <Stack.Navigator>
            {user.signedIn ? (
            <>
              <Stack.Screen name='Logged In' component={LoggedInScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name='Start' component={StartScreen} />
              <Stack.Screen name='Sign Up' component={SignUpScreen} />
              <Stack.Screen name='Login' component={LoginScreen} />
            </>
          )}
        </Stack.Navigator>
    </NavigationContainer>)
}