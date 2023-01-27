import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {Button, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';

import data from './wallet_data.json' // Test Data

export default function CryptoWallet() {

  return (
    <SafeAreaView style={styles.cryptoWallet}>
      <ScrollView >

        <StatusBar style="auto" />

        <Text>
          <Text style={styles.cryptoWalletTitle}>←</Text>
          <Text style={styles.cryptoWalletTitle}>Crypto Wallet</Text>
        </Text>

        <Button title="Add Wallet" />

        <FlatList
          style={styles.walletList}
          data={data}
          renderItem={({item}) => <WalletAsset item={item} />}
        />

      </ScrollView>
    </SafeAreaView>
  );
}


function WalletAsset(props) {
  return (
    <View style={styles.walletAsset}>
      <Text style={styles.walletAssetTitle}>{props.item.name}</Text>
      <Text style={styles.walletAssetTitle}>{props.item.value} {props.item.symbol}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  cryptoWallet: {
    flex: 1,
    paddingVertical: 300,
  },
  cryptoWalletTitle: {
    fontWeight: '900',
    fontSize: 40,
    // alignItems: 'center',
  },
  walletList: {
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 30,
  },
  walletAsset: {
    backgroundColor: '#e5e5e5',
    padding: 20,
    borderBottomColor: '#a3a3a3',
    borderBottomWidth: 1,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  walletAssetTitle: {
    fontWeight: '700',
  }
});
