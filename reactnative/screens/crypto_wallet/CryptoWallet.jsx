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
            <Text style={[styles(dark, colors).backArrow, {position: "absolute"}]}>←</Text>
            <Text style={[styles(dark, colors).largeTextBold, {alignSelf: "center", paddingVertical: 10}]}>Crypto Wallets</Text>
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
