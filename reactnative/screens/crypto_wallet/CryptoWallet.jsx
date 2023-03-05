import React, { useEffect, useState } from "react";
import {
  Pressable,
  TouchableOpacity,
  Dimensions,
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import useCryptoWallet from "./useCryptoWallet";
import useCryptoExchange from "../cryptoExchanges/useCryptoExchange";
import WalletAsset from "./WalletAsset";
import ExchangeAsset from "../cryptoExchanges/ExchangeAsset";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";

export default function CryptoWallet(props) {
  const { wallets, fetchWallets, connectWallet, removeWallet } = useCryptoWallet();
  const { exchanges, fetchExchanges, removeExchange } = useCryptoExchange();
  const {dark, colors, setScheme} = useTheme();

  const styles = StyleSheet.create({
    cryptoWalletTitle: {
      fontWeight: "900",
      fontSize: 40,
      alignSelf: "center",
      paddingVertical: 10,
    },
    backArrow: {
      fontWeight: "900",
      fontSize: 30,
      position: "absolute",
      marginLeft: 10,
    },
    walletList: {
      marginHorizontal: 10,
      marginVertical: 30,
    },
    container: {
      paddingHorizontal: 20,
      paddingTop: 20,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: colors.background,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 25,
      alignItems: 'center',
      textAlign: "center",
      color: colors.text,
    },
    button: {
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
      backgroundColor: colors.primary,
      alignSelf: 'center', // center the button horizontally
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
    fetchWallets();
    fetchExchanges();
  }, []);

  const handleSubmit = async () => {
    
    try {
      const response = await fetch('http://10.0.2.2:8000/crypto-exchanges/update', {
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

        <View style={[styles.walletList]}>
        {
          wallets.map((item)=> <WalletAsset key={item.id} item={item} removeWallet={removeWallet} navigation={props.navigation} />)
        }
        </View>

        <View style={[styles.walletList]}>
        {
          exchanges.map((item)=> <ExchangeAsset key={item.id} item={item} navigation={props.navigation} />)
        }
        </View>

        {/* <View style={styles.container}>
          <Text style={styles.title}>Exchanges</Text>
          {exchanges.map((exchange) => (
            <ExchangeAsset key={exchange.id} item={exchange} />
          ))}
        </View> */}

      </ScrollView>
    </SafeAreaView>
  );
}