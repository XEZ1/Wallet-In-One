import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";


import BinanceCredentials from "./BinanceExchange";
import CryptoExchanges from "./CryptoExchanges";

import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state', // Replace with Redux State Management
]);


const Stack = createStackNavigator();

export default function CryptoExchangesStackNavigator( props ) {
  console.log(props)
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Crypto exchanges" component={CryptoExchanges} />
      <Stack.Screen name="Binance" component={BinanceCredentials} />
      <Stack.Screen name="Huobi" component={BinanceCredentials} />
      <Stack.Screen name="CoinList" component={BinanceCredentials} />
    </Stack.Navigator>
  );
}
