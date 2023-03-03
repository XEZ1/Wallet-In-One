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
import WalletAsset from "./WalletAsset";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import {styles} from 'reactnative/screens/All_Styles.style.js'
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from "expo-secure-store";

export default function CryptoWallet(props) {
  const { wallets, fetchWallets, connectWallet, removeWallet } = useCryptoWallet();
  const {dark, colors, setScheme} = useTheme();

  const stylesInternal = StyleSheet.create({
    walletList: {
      marginHorizontal: 10,
      marginVertical: 30,
    },
    view: {
      flexDirection: "row",
      alignItems: "center",
    }
  });

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
    },
  });

  useEffect(() => {
    fetchWallets();
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
    <SafeAreaView style={styles(dark, colors).container}>
      <ScrollView>
        <View style={stylesInternal.view}>
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
            <Text style={[styles(dark, colors).backArrow, {position: "absolute"}]}>←</Text>
            <Text style={[styles(dark, colors).largeTextBold, {alignSelf: "center", paddingVertical: 10}]}>Crypto Wallets</Text>
            <View style={{ marginRight: 20 }}>
              <Text style={[styles.cryptoWalletTitle, {color: colors.text}]}>Cryptocurrency</Text>
            </View>
          </View>
        </View>

        <View style={styles.container}>
          <View
            style={[
              styles.titleContainer,
              {
                borderWidth: 1,
                borderColor: colors.text,
                padding: 10,
                borderRadius: 10,
                width: Dimensions.get('window').width - 40,
                alignSelf: "center",
              },
            ]}
          >
            <Text style={styles.title}>
              Add a cryptocurrency account from an exchange:
            </Text>
          </View>
        </View>

        <TouchableOpacity
            onPress={() => props.navigation.navigate("WalletSelector", {connectWallet: connectWallet})}
            style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
          >
            <Text style={styles.buttonText}>Add Wallet</Text>
        </TouchableOpacity>

        <View style={[stylesInternal.walletList]}>
        {
          wallets.map((item)=> <WalletAsset key={item.id} item={item} removeWallet={removeWallet} navigation={props.navigation} />)
        }
        </View>

        <View style={styles.container}>
          <View
            style={[
              styles.titleContainer,
              {
                borderWidth: 1,
                borderColor: colors.text,
                padding: 10,
                borderRadius: 10,
                width: Dimensions.get('window').width - 40,
                alignSelf: "center",
              },
            ]}
          >
            <Text style={styles.title}>
              Add a cryptocurrency account from an exchange:
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Binance')}
            style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
          >
            <Text style={styles.buttonText}>Binance</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Huobi')}
            style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
          >
            <Text style={styles.buttonText}>Huobi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Gateio')}
            style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
          >
            <Text style={styles.buttonText}>Gateio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('CoinList')}
            style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
          >
            <Text style={styles.buttonText}>Coinlist</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Coinbase')}
            style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
          >
            <Text style={styles.buttonText}>Coinbase</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => props.navigation.navigate('Kraken')}
            style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
          >
            <Text style={styles.buttonText}>Kraken</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
