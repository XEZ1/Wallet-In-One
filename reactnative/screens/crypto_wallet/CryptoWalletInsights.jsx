import {View, Text, StyleSheet, Image, ScrollView} from "react-native";
import React, {useEffect, useState} from "react";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { BACKEND_URL } from "@env"
import * as SecureStore from "expo-secure-store";
import getCryptoIcon from "../cryptocurrency/icons/icon";
import { OldChart } from "./CryptoWalletDetail";

export default function CryptoWalletInsights() {
  const [insights, setInsights] = useState({predicted_balance: {}, received_spent: {}, average_spend: {}});
  const [exchangeInsights, setExchangeInsights] = useState({all_transactions: {}, most_expensive_transaction: {}});
  const {dark, colors, setScheme} = useTheme();
  const [ graphData, setGraphData ] = useState([{timestamp: 0, value: 0}, {timestamp: 0, value: 0}]);

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
    },
    smallSubtitle: {
      fontWeight: "900",
      fontSize: 24,
      alignSelf: "center",
      color: colors.text,
      textAlign: 'center',
    },
    info: {
      fontWeight: "900",
      fontSize: 15,
      alignSelf: "center",
      color: colors.text
    }
  });

  useEffect(() => {
    fetchInsights();
    fetchExchangeInsights();
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

  const fetchExchangeInsights = async () => {
    await fetch(`${BACKEND_URL}/crypto-exchanges/get_insights/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setExchangeInsights(res))
      .catch((err) => console.log(err));
  };

  const convertData = () => {
    let points = [];
    let count = 1;

    for (let i = 0; i < exchangeInsights.all_transactions.length; i++) {
      let point = {timestamp: exchangeInsights.all_transactions[i].timestamp, value: count}
      count += 1;
      points = [point, ...points]
    }
    setGraphData(points)
  }

  useEffect(() => {
    convertData();
  }, [exchangeInsights])

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background, paddingHorizontal: 20 }}>
      <Text />

      <Text style={styles.subtitle}>Predicted Balance</Text>
      <Text style={styles.info}>Next four weeks</Text>
      <View style={{ borderRadius: 10, paddingVertical: 10}}>
        {
          Object.keys(insights.predicted_balance).length === 0
            ?
            <Text style={{color: colors.text}}>There are no wallet insights to display. Try connect a crypto wallet.</Text>
            :
            <View>
              {
                Object.entries(insights.predicted_balance).map(([key, value]) =>
                  <InsightItem key={key} symbol={key} upper={`${value} ${key}`} />
                )
              }
            </View>
        }
      </View>
      <Text />

      <Text style={styles.subtitle}>Total Spent & Received</Text>
      <View style={{ borderRadius: 10, paddingVertical: 10}}>
        {
          Object.keys(insights.received_spent).length === 0
            ?
            <Text style={{color: colors.text}}>There are no wallet insights to display. Try connect a crypto wallet.</Text>
            :
            <View>
              {
                Object.entries(insights.received_spent).map(([key, value]) =>
                  <InsightItem key={key} symbol={key} upper={`+${value.received} ${key}`} lower={`-${value.spent} ${key}`} />
                )
              }
            </View>
        }
      </View>
      <Text />

      <Text style={styles.subtitle}>Average Spend</Text>
      <View style={{ borderRadius: 10, paddingVertical: 10}}>
        {
          Object.keys(insights.average_spend).length === 0
            ?
            <Text style={{color: colors.text}}>There are no wallet insights to display. Try connect a crypto wallet.</Text>
            :
            <View>
              {
                Object.entries(insights.average_spend).map(([key, value]) =>
                  <InsightItem key={key} symbol={key} upper={`${value * -1} ${key}`} />
                )
              }
            </View>
        }
      </View>
      <Text />

      <Text style={styles.smallSubtitle}>Most Expensive Transaction In All Exchanges</Text>
      <View style={{ borderRadius: 10, paddingVertical: 10}}>
        <InsightItem symbol={exchangeInsights.most_expensive_transaction[5]} upper={`${exchangeInsights.most_expensive_transaction[1]} ${exchangeInsights.most_expensive_transaction[0]} (£${exchangeInsights.most_expensive_transaction[2]}), type: ${exchangeInsights.most_expensive_transaction[3]}`} lower={`${exchangeInsights.most_expensive_transaction[4]}`}/>
      </View>
      <Text />

      <Text style={styles.smallSubtitle}>Most Expensive Transaction In All Exchanges</Text>
      <View style={{ borderRadius: 10, paddingVertical: 10}}>
        <OldChart graphData={graphData} />
      </View>
      <Text />

    </ScrollView>
  )
}

function InsightItem(props) {

  const {dark, colors, setScheme} = useTheme();
  const [value, setValue] = useState(0);

  const getCryptoValue = async () => {
    await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${props.symbol}&tsyms=GBP`)
      .then((res) => res.json())
      .then((res) => res.GBP)
      .then((res) => setValue(res))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getCryptoValue()
  }, [])

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

          {
            props.lower
              ?
              <Text style={[styles.walletAssetTitle, {color: colors.text}]}>
                {props.lower}
              </Text>
              :
              <Text style={[styles.walletAssetTitle, {color: colors.text}]}>
                £{value}
              </Text>
          }

        </View>

      </View>
    </View>
  );
}