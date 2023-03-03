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

const Stack = createStackNavigator();

export default function MainStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Main Account">
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
        name="Wallets"
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

      <Stack.Screen name="WalletAssetDetail" component={WalletAssetDetail} />
      <Stack.Screen name="WalletSelector" component={WalletSelector} />
      <Stack.Screen name="WalletConnector" component={WalletConnector} />  

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