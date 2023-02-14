import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableHighlight, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';

import BinanceCredentials from './BinanceExchange';





export default function CryptoExchanges({ navigation }) {

    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity
          onPress={() =>  navigation.navigate('Binance')}
          style={{
            padding: 20,
            backgroundColor: 'lightgray',
            borderRadius: 10,
            marginVertical: 10,
            width: '70%'
          }}
        >
          <Text style={{ textAlign: 'center' }}>Binance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Huobi')}
          style={{
            padding: 20,
            backgroundColor: 'lightgray',
            borderRadius: 10,
            marginVertical: 10,
            width: '70%'
          }}
        >
          <Text style={{ textAlign: 'center' }}>Huobi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CoinList')}
          style={{
            padding: 20,
            backgroundColor: 'lightgray',
            borderRadius: 10,
            marginVertical: 10,
            width: '70%'
          }}
        >
          <Text style={{ textAlign: 'center' }}>Coinlist</Text>
        </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF00',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '900',
    fontSize: 50,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  amountText:{
    fontWeight: '900',
    fontSize: 25,
    textAlign: 'left',
  }
});  
