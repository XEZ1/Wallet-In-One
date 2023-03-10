import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

//Bank Screens
import AddBankScreen from "../banking/AddBankScreen";
import BankAccountsScreen from "../banking/BankAccountsScreen";
import BankTransactionsScreen from "../banking/BankTransactionsScreen";
import MainAccountPage from "./MainAccountPage";

//Crypto Wallet Screens
import CryptoWallet from "../crypto_wallet/CryptoWallet";
import WalletAssetDetail from "../crypto_wallet/WalletAssetDetail";
import { WalletConnector, WalletSelector } from "../crypto_wallet/WalletModal";
import AddCryptoScreen from "../crypto_wallet/AddCryptoScreen"

//Crypto Exchanges Screens
import BinanceCredentials from "../cryptoExchanges/BinanceExchange";
import HuobiCredentials from "../cryptoExchanges/HuobiExchange";
import GateioCredentials from "../cryptoExchanges/GateioExchange";
import CoinListCredentials from "../cryptoExchanges/CoinlistExchange";
import CoinbaseCredentials from "../cryptoExchanges/CoinbaseExchange";
import KrakenCredentials from "../cryptoExchanges/KrakenExchange";
import CryptoExchanges from "../cryptoExchanges/CryptoExchanges";
import ExchangeAsset from "../cryptoExchanges/ExchangeAsset";

import StockStackNavigator from "../stocks/StockStackNavigator";

import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import CryptoWalletInsights from "../crypto_wallet/CryptoWalletInsights";
import ExchangeCredentials from "../cryptoExchanges/ExchangeCredentials";

const Stack = createStackNavigator();

export default function MainStackNavigator() {

  const {dark, colors, setScheme} = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Main Account"
      screenOptions={
        {
          headerStyle: {backgroundColor: colors.background},
          headerTitleStyle: {color: colors.text},
          tabBarStyle: {backgroundColor: colors.background},
          tabBarShowLabel: false,
          tabBarHideOnKeyboard: true,
        }}
    >
      <Stack.Screen name="Accounts" component={MainAccountPage} />
      <Stack.Screen
        name="Bank Accounts"
        component={BankAccountsScreen}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate("Add Bank Account")}
            >
              <Text style={{ color: "#007AFF" }}>Add</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen name="Add Bank Account" component={AddBankScreen} />
      <Stack.Screen
        name="Bank Transactions"
        component={BankTransactionsScreen}
      />
      <Stack.Screen 
        name="Crypto Wallets & Exchanges"
        component={CryptoWallet}
        options={({ navigation }) => ({
          headerRight: () => (
            <TouchableOpacity 
              style={{ marginRight: 15 }} 
              onPress={() => navigation.navigate("Add Cryptocurrency Wallet or Account")}
            >
              <Text style={{ color: '#007AFF' }}>Add</Text>
            </TouchableOpacity>
          )
      })}/>
      <Stack.Screen
        name="Add Cryptocurrency Wallet or Account"
        component={AddCryptoScreen} />
      <Stack.Screen
        name="WalletAssetDetail"
        component={WalletAssetDetail}
      />
      <Stack.Screen name="WalletSelector" component={WalletSelector} />
      <Stack.Screen name="WalletConnector" component={WalletConnector} />
      <Stack.Screen name="Crypto Wallet Insights" component={CryptoWalletInsights} />

      <Stack.Screen name="Crypto exchanges" component={CryptoExchanges} />
      <Stack.Screen name="Exchange Credentials" component={ExchangeCredentials} />

      <Stack.Screen name="Binance" component={BinanceCredentials} />
      <Stack.Screen name="Huobi" component={HuobiCredentials} />
      <Stack.Screen name="Gateio" component={GateioCredentials} />
      <Stack.Screen name="CoinList" component={CoinListCredentials} />
      <Stack.Screen name="Stock Accounts" component={StockStackNavigator} options={{headerShown: false}} />
      <Stack.Screen name="Coinbase" component={CoinbaseCredentials} />
      <Stack.Screen name="Kraken" component={KrakenCredentials} />
  
    </Stack.Navigator>
  );
}