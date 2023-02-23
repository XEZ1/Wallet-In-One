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
} from "react-native";
import useCryptoWallet from "./useCryptoWallet";
import WalletAsset from "./WalletAsset";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

export default function CryptoWallet(props) {
  const { wallets, fetchWallets, connectWallet, removeWallet } = useCryptoWallet();
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
  });

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text style={[styles.cryptoWalletTitle, {color: colors.text}]}>Crypto</Text>
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

        <View style={[styles.walletList]}>
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