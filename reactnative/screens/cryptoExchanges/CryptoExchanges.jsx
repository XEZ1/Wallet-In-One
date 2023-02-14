import React, { useState, useEffect } from 'react';
import { Pressable, StyleSheet, Text, View, Dimensions, Button, TouchableHighlight, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';

import BinanceCredentials from './BinanceExchange';

export default function CryptoExchanges({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add a cryptocurrency account from an exchange:</Text>
      <TouchableOpacity
        onPress={() =>  navigation.navigate('Binance')}
        style={[styles.button, {width: Dimensions.get('window').width - 40}]}
      >
        <Text style={styles.buttonText}>Binance</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Huobi')}
        style={[styles.button, {width: Dimensions.get('window').width - 40}]}
      >
        <Text style={styles.buttonText}>Huobi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('CoinList')}
        style={[styles.button, {width: Dimensions.get('window').width - 40}]}
      >
        <Text style={styles.buttonText}>Coinlist</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
  },
  button: {
    padding: 20,
    backgroundColor: 'lightgray',
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backArrow: {
    fontWeight: "900",
    fontSize: 30,
    position: "absolute",
    marginLeft: 10,
  },
});