import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CryptoWallet from "./CryptoWallet";
import WalletAssetDetail from "./WalletAssetDetail";
import {WalletConnector, WalletSelector} from "./WalletModal"
import { LogBox } from 'react-native';
import BinanceCredentials from "../cryptoExchanges/BinanceExchange";
import HuobiCredentials from "../cryptoExchanges/HuobiExchange";
import GateioCredentials from "../cryptoExchanges/GateioExchange";
import CoinListCredentials from "../cryptoExchanges/CoinlistExchange";
import CoinbaseCredentials from "../cryptoExchanges/CoinbaseExchange";
import KrakenCredentials from "../cryptoExchanges/KrakenExchange";

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state', // Replace with Redux State Management
]);


const Stack = createStackNavigator();

export default function CryptoWalletStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Wallets" component={CryptoWallet} />
      <Stack.Screen name="WalletAssetDetail" component={WalletAssetDetail} />
      <Stack.Screen name="WalletSelector" component={WalletSelector} />
      <Stack.Screen name="WalletConnector" component={WalletConnector} />
      
      <Stack.Screen name="Binance" component={BinanceCredentials} />
      <Stack.Screen name="Huobi" component={HuobiCredentials} />
      <Stack.Screen name="Gateio" component={GateioCredentials} />
      <Stack.Screen name="CoinList" component={CoinListCredentials} />
      <Stack.Screen name="Coinbase" component={CoinbaseCredentials} />
      <Stack.Screen name="Kraken" component={KrakenCredentials} />

    </Stack.Navigator>
  );
}
