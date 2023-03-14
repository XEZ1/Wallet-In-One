import {View, Text, StyleSheet, Image, ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { BACKEND_URL } from "@env"
import * as SecureStore from "expo-secure-store";
import getCryptoIcon from "../cryptocurrency/icons/icon";

export default function CryptoWalletInsights() {
  const [insights, setInsights] = useState({predicted_balance: {}, received_spent: {}, average_spend: {}});
  const {dark, colors, setScheme} = useTheme();

  const styles = StyleSheet.create({
    title: {
      fontWeight: "900",
      fontSize: 40,
      alignSelf: "center",
      paddingVertical: 10,
      color: colors.text
    },
    subtitle: {
      fontWeight: "900",
      fontSize: 30,
      alignSelf: "center",
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

  const getCryptoValue = async (symbol) => {
    await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${symbol}&tsyms=GBP`)
      .then((res) => res.json())
      .then((res) => res.GBP)
      .catch((err) => console.log(err))
  }

  // console.log(insights)

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 }}>
      <Text style={styles.title}>Wallet Insights</Text>
      <Text />

      <Text style={styles.subtitle}>Predicted Balance</Text>
      <View style={{ borderRadius: 10, paddingVertical: 10}}>
      {
        Object.entries(insights.predicted_balance).map(([key, value]) =>
            <InsightsView key={key} symbol={key} upper={`${value} ${key}`} lower='£0.00' />
        )
      }
      </View>
      <Text />

      <Text style={styles.subtitle}>Total Spent & Received</Text>
      <View style={{ borderRadius: 10, paddingVertical: 10}}>
      {
        Object.entries(insights.received_spent).map(([key, value]) =>
          <InsightsView key={key} symbol={key} upper={`+${value.received} ${key}`} lower={`-${value.spent} ${key}`} />
        )
      }
      </View>
      <Text />

      <Text style={styles.subtitle}>Average Spend</Text>
      <View style={{ borderRadius: 10, paddingVertical: 10}}>
      {
        Object.entries(insights.average_spend).map(([key, value]) =>
          <InsightsView key={key} symbol={key} upper={`${value * -1} ${key}`} lower="£0.00" />
        )
      }
      </View>
      <Text />

    </ScrollView>
  )
}

function InsightsView(props) {

  const {dark, colors, setScheme} = useTheme();

  const styles = StyleSheet.create({
    walletAsset: {
      paddingHorizontal: 10,
      borderRadius: 10,
      flexDirection: "row",
    },
    walletAssetTitle: {
      fontWeight: "700",
    },
    walletAssetImage: {
      width: 30,
      height: 30,
    },
  });


  return (
    <View style={[styles.walletAsset, {paddingVertical: 5}]}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingRight: 10,
        }}
      >
        <Image
          style={styles.walletAssetImage}
          source={getCryptoIcon(props.symbol)}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ fontSize: 20, fontWeight: "700", color: colors.text }}>
            {props.symbol}
          </Text>

          <Text style={[styles.walletAssetTitle, {color: colors.text}]}>
            {props.upper}
          </Text>

          <Text style={[styles.walletAssetTitle, {color: colors.text}]}>
            {props.lower}
          </Text>

        </View>

      </View>
    </View>
  );
}