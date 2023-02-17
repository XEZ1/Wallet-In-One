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

export default function CryptoWallet(props) {
  const { wallets, fetchWallets, connectWallet, removeWallet } = useCryptoWallet();
  const {dark, colors, setScheme} = useTheme();

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
            <Text style={[styles.backArrow, {color: colors.primary}]}>←</Text>
            <Text style={[styles.cryptoWalletTitle, {color: colors.text}]}>Crypto Wallets</Text>
          </View>
        </View>

        <Button
          title="Add Wallet"
          onPress={() => props.navigation.navigate("WalletSelector", {connectWallet: connectWallet})}
        />

        <View style={[styles.walletList]}>
        {
          wallets.map((item)=> <WalletAsset key={item.id} item={item} removeWallet={removeWallet} navigation={props.navigation} />)
        }
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

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
});
