import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { useContext, useEffect } from 'react';
import { userContext } from './data';

// Screens
import PieChartWallet from './Pie_Chart';
import BarChartWallet from './Bar_Chart';


const Stack = createStackNavigator();

export default function Navigation() {



    return (
    <NavigationContainer>
        <Stack.Navigator
        initialRouteName='Home'>
            <>
              <Stack.Screen name='Bar Chart' component={BarChartWallet} />
              <Stack.Screen name='Pie Chart' component={PieChartWallet} />
            </>
        </Stack.Navigator>
    </NavigationContainer>)
}