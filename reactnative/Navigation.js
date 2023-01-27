import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useContext } from 'react';
import { userContext } from './data';

// Screens
import StartScreen from './screens/StartScreen';
import SignUpScreen from './screens/SignUpScreen';
import LoggedInScreen from './screens/LoggedInScreen';

const Stack = createStackNavigator();

export default function Navigation() {

    const [user, setUser] = useContext(userContext)

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
            </>
          )}
        </Stack.Navigator>
    </NavigationContainer>)
}