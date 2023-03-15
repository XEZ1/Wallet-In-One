import React, { useEffect } from "react";
import {
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import useCryptoWallet from "../crypto_wallet/useCryptoWallet";
import useCryptoExchange from "../cryptoExchanges/useCryptoExchange";
import CryptoListWalletItem from "../crypto_wallet/CryptoListWalletItem";
import ExchangeAsset from "../cryptoExchanges/ExchangeAsset";
import { useTheme } from '../../src/theme/ThemeProvider'
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";
import { api_url } from '../../authentication';


export default function CryptoList(props) {
  const { wallets, listWallets, connectWallet, removeWallet } = useCryptoWallet();
  const { exchanges, fetchExchanges, removeExchange } = useCryptoExchange();
  const {dark, colors, setScheme} = useTheme();

  const styles = StyleSheet.create({
    cryptoWalletTitle: {
      fontWeight: "900",
      fontSize: 40,
      alignSelf: "center",
      paddingVertical: 10,
    },
    cryptoWalletSubtitle: {
      fontWeight: "900",
      fontSize: 30,
      alignSelf: "center",
    },

    walletList: {
      marginHorizontal: 10,
      marginBottom: 30,
    },
    button: {
      padding: 10,
      borderRadius: 10,
      marginVertical: 10,
      backgroundColor: colors.primary,
      alignSelf: 'center',
    },
    buttonText: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: colors.text,
    },
    refreshButton: {
      position: 'absolute',
      top: 0,
      right: 10,
      backgroundColor: colors.primary,
      borderRadius: 30,
      padding: 10,
      marginTop: 10
    },
  });

  useEffect(() => {
    listWallets();
    fetchExchanges();
  }, []);

  const handleSubmit = async () => {
    
    try {
      const response = await fetch(api_url + '/crypto-exchanges/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
        body: JSON.stringify({ }),
      });
      const data = await response.json();
      const statusCode = response.status;
      if (statusCode == 200) {
        Alert.alert('Success', 'updated account data successfully!');
      } else {
        Alert.alert('Error', data["error"]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while updating account info.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView>
        <TouchableOpacity onPress={handleSubmit} style={styles.refreshButton}>
          <Ionicons name="refresh-outline" size={25} color="white" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <View style={{ marginRight: 20 }}>
              <Text style={[styles.cryptoWalletTitle, {color: colors.text}]}>Cryptocurrency</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.cryptoWalletSubtitle, {color: colors.text, marginTop: 10}]}>Wallets</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => props.navigation.navigate("Crypto Wallet Insights")}
        >
          <Text style={styles.buttonText}>Wallet Insights</Text>
        </TouchableOpacity>

        <View style={[styles.walletList]}>
        {
          wallets.map((item) =>
            <CryptoListWalletItem key={item.id} id={item.id} item={item} removeWallet={removeWallet} navigation={props.navigation} />)
        }
        </View>

        <Text style={[styles.cryptoWalletSubtitle, {color: colors.text}]}>Exchanges</Text>
        <View style={[styles.walletList]}>
        {
          exchanges.map((item) =>
            <ExchangeAsset key={item.id} item={item} removeExchange={removeExchange} navigation={props.navigation} />)
        }
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}