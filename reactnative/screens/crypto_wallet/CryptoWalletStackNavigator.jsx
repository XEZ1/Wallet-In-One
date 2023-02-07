import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import CryptoWallet from "./CryptoWallet";
import WalletAssetDetail from "./WalletAssetDetail";

const Stack = createStackNavigator();

export default function CryptoWalletStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Wallets" component={CryptoWallet} />
      <Stack.Screen name="WalletAssetDetail" component={WalletAssetDetail} />
    </Stack.Navigator>
  );
}
