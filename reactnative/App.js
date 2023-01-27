import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import CryptoWallet from "./screens/crypto/CryptoWallet";

export default function App() {
  return (
    /* <StatusBar style="auto" />*/
    <CryptoWallet />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
