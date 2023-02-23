import React, { useEffect, useState } from "react";
import {
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
import {styles} from 'reactnative/screens/All_Styles.style.js'

export default function CryptoWallet(props) {
  const { wallets, fetchWallets, connectWallet, removeWallet } = useCryptoWallet();
  const {dark, colors, setScheme} = useTheme();

  const stylesInternal = StyleSheet.create({
    cryptoWalletTitle: {
      fontWeight: "900",
      fontSize: 40,
      alignSelf: "center",
      paddingVertical: 10,
      color: colors.text,
    },
    backArrow: {
      fontWeight: "900",
      fontSize: 30,
      position: "absolute",
      marginLeft: 10,
      color: colors.primary
    },
    walletList: {
      marginHorizontal: 10,
      marginVertical: 30,
    },
    view: {
      flexDirection: "row",
      alignItems: "center",
    }
  });

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <SafeAreaView style={styles(dark, colors).container}>
      <ScrollView>
        <View style={stylesInternal.view}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text style={stylesInternal.backArrow}>←</Text>
            <Text style={stylesInternal.cryptoWalletTitle}>Crypto Wallets</Text>
          </View>
        </View>

        <Button
          title="Add Wallet"
          onPress={() => props.navigation.navigate("WalletSelector", {connectWallet: connectWallet})}
        />

        <View style={[stylesInternal.walletList]}>
        {
          wallets.map((item)=> <WalletAsset key={item.id} item={item} removeWallet={removeWallet} navigation={props.navigation} />)
        }
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
