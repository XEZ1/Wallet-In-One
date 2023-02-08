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

export default function CryptoWallet(props) {
  const { wallets, fetchWallets, connectWallet, removeWallet } = useCryptoWallet();

  useEffect(() => {
    fetchWallets();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.cryptoWalletTitle}>Crypto Wallets</Text>
          </View>
        </View>



        <Button title="Add Wallet" onPress={() => props.navigation.navigate("WalletSelector", {connectWallet: connectWallet})} />

        <FlatList
          style={styles.walletList}
          data={wallets}
          renderItem={({ item }) => (
            <WalletAsset item={item} removeWallet={removeWallet} navigation={props.navigation} />
          )}
        />
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
