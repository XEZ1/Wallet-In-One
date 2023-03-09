import {View, Text, StyleSheet} from "react-native";
import React, {useEffect, useState} from "react";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { BACKEND_URL } from "@env"
import * as SecureStore from "expo-secure-store";

export default function CryptoWalletInsights() {
  const [insights, setInsights] = useState({});

  const {dark, colors, setScheme} = useTheme();

  const styles = StyleSheet.create({
    title: {
      fontWeight: "900",
      fontSize: 40,
      alignSelf: "center",
      paddingVertical: 10,
      color: colors.text
    }
  });

  useEffect(() => {
    fetchInsights();
  }, [])

  const fetchInsights = async () => {
    await fetch(`${BACKEND_URL}/crypto_wallets/insights`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setInsights(res))
      .catch((err) => console.log(err));
  };



  console.log(insights)

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Text style={styles.title}>Wallet Insights</Text>
      <Text />

      <Text style={{ color: colors.text }}>Predicted Crypto Wallet Balance</Text>
      <Text />

      <Text style={{ color: colors.text }}>Total Spent & Received</Text>
      <Text />

      <Text style={{ color: colors.text }}>Average Transaction Amount</Text>
      <Text />

    </View>
  )
}