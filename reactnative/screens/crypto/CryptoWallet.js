import { StatusBar } from 'expo-status-bar';
import React, {useState, useEffect} from 'react';
import {Button, FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View, Image} from 'react-native';

import data from './wallet_data.json' // Test Data


export default function CryptoWallet() {

  return (
    <SafeAreaView style={styles.cryptoWallet}>
      <ScrollView >

        <StatusBar style="auto" />

        <View style={{ flexDirection:'row', alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.cryptoWalletTitle}>Crypto Wallets</Text>
          </View>
        </View>

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
      <View style={{ flex: 1, flexDirection:'row', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 5, borderRadius: 10, marginRight: 10}}>
          <Image style={styles.walletAssetImage} source={{ uri: `https://cryptoicons.org/api/color/${props.item.symbol.toLowerCase()}/200` }} />
        </View>
        <Text style={styles.walletAssetTitle}>{props.item.name}</Text>
      </View>
      <View style={{ flexDirection:'row', alignItems: 'center' }}>
        <Text style={styles.walletAssetTitle}>{props.item.value} {props.item.symbol}</Text>
      </View>
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
    alignSelf: 'center',
  },
  backArrow: {
    fontWeight: '900',
    fontSize: 40,
    position: 'absolute',
    paddingLeft: 10,
  },
  walletList: {
    borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 30,
  },
  walletAsset: {
    backgroundColor: '#e5e5e5',
    padding: 10,
    borderBottomColor: '#a3a3a3',
    borderBottomWidth: 1,
    flexDirection:'row',
    justifyContent:'space-between'
  },
  walletAssetTitle: {
    fontWeight: '700',
  },
  walletAssetImage: {
    width: 32,
    height: 32,
  }
});
