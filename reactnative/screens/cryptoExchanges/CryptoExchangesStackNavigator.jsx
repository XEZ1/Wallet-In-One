import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";


import BinanceCredentials from "./BinanceExchange";
import HuobiCredentials from "./HuobiExchange";
import GateioCredentials from "./GateioExchange";
import CoinListCredentials from "./CoinlistExchange";
import CoinbaseCredentials from "./CoinbaseExchange";
import KrakenCredentials from "./KrakenExchange";
import CryptoExchanges from "./CryptoExchanges";


import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state', // Replace with Redux State Management
]);


const Stack = createStackNavigator();

export default function CryptoExchangesStackNavigator( props ) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Crypto exchanges" component={CryptoExchanges} />
      <Stack.Screen name="Binance" component={BinanceCredentials} />
      <Stack.Screen name="Huobi" component={HuobiCredentials} />
      <Stack.Screen name="Gateio" component={GateioCredentials} />
      <Stack.Screen name="CoinList" component={CoinListCredentials} />
      <Stack.Screen name="Coinbase" component={CoinbaseCredentials} />
      <Stack.Screen name="Kraken" component={KrakenCredentials} />
    </Stack.Navigator>
  );
}
