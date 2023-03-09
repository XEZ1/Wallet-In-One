import {View, Text, StyleSheet} from "react-native";
import React, {useEffect} from "react";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
// import useCryptoWallet from "./useCryptoWallet";

export default function CryptoWalletInsights(props) {
  const {dark, colors, setScheme} = useTheme();
  // const { wallets, fetchWallets } = useCryptoWallet();

  const styles = StyleSheet.create({
    title: {
      fontWeight: "900",
      fontSize: 40,
      alignSelf: "center",
      paddingVertical: 10,
      color: colors.text
    }
  });

  /*
  useEffect(() => {
    fetchWallets();
  }, [])

  const totalSpent = () => {
    // [{}, {}, {}]
  }

   */

  // console.log(wallets)

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