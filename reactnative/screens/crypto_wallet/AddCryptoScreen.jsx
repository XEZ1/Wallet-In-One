import React, { useEffect } from "react";
import {
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";
import useCryptoWallet from "./useCryptoWallet";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import * as SecureStore from "expo-secure-store";
import exchanges from '../cryptoExchanges/exchanges.json'


export default function AddCryptoScreen(props) {
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
    }
  });


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
            <View style={{ marginRight: 20 }}>
              <Text style={[styles.cryptoWalletTitle, {color: colors.text}]}>Add Cryptocurrency</Text>
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
              Add a cryptocurrency wallet from the blockchain:
            </Text>
          </View>
        </View>

        <TouchableOpacity
            onPress={() => props.navigation.navigate("WalletSelector", {connectWallet: connectWallet})}
            style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
          >
            <Text style={styles.buttonText}>Add Wallet</Text>
        </TouchableOpacity>

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

          {
            exchanges.map((exchange) =>
              <TouchableOpacity
                key={exchange.name}
                onPress={() => props.navigation.navigate('Exchange Credentials', {exchange: exchange.name})}
                style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
              >
                <Text style={styles.buttonText}>{exchange.name}</Text>
              </TouchableOpacity>)
          }

        </View>


      </ScrollView>
    </SafeAreaView>
  );
}