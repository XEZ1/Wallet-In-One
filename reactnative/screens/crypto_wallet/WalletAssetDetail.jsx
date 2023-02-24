import {Button, Dimensions, Image, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import { useRoute } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
//import {LineChart} from "react-native-chart-kit";
import getCryptoIcon from "./icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider, ChartXLabel, ChartYLabel,
  monotoneCubicInterpolation,
} from '@rainbow-me/animated-charts';
import WalletAsset from "./WalletAsset";

export default function WalletAssetDetail(props) {

  const {dark, colors, setScheme} = useTheme();
  const route = useRoute();
  const { item, value, removeWallet } = props.route.params;
  const [ graphData, setGraphData ] = useState([]);

  const {width: SIZE} = Dimensions.get('window');

  useEffect(() => {
    let points = [];
    let balance = item.balance;

    for (let i = 0; i < item.transactions.length; i++) {
      let point = {x: item.transactions.at(i).time, y: balance}
      balance -= item.transactions.at(i).value
      points = [point, ...points]
    }
    setGraphData(points)

    }, []);


  const formatPrice = value => {
    'worklet';
    if (value === 'undefined') return `0 ${item.symbol}`;
    const price = (value === '') ? Number(item.balance) : Number(value);
    return `${price} ${item.symbol}`;
  }

  const formatDate = value => {
    'worklet';
    const date = (value === '') ? new Date() : new Date(Number(value * 1000));
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    };
    return date.toLocaleString("en-JP", options);
  }


  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.background, paddingHorizontal: 30}}>

      <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
        <Text style={[styles.backArrow, {color: colors.primary}]}>←</Text>
      </TouchableWithoutFeedback>

      <View style={[styles.walletAsset, {backgroundColor: colors.background}]}>
        <Image
          style={styles.walletAssetImage}
          source={getCryptoIcon(item.symbol)}
        />
        <Text style={{fontWeight: "800", fontSize: 40, color: colors.text}}>{item.cryptocurrency} Wallet</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Address</Text>
        <Text style={{color: colors.text}}>{item.address}</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Balance</Text>
        <Text style={{color: colors.text}}>{item.balance} {item.symbol}</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Value</Text>
        <Text style={{color: colors.text}}>£{value}</Text>
        {/* ▲ 0.00% */}

      </View>

      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10, color: colors.text}}>Graph</Text>
      <View style={[styles.walletAsset, {backgroundColor: colors.background}]}>
        <ChartPathProvider
          data={{
            points: graphData,
            smoothingStrategy: 'bezier',
          }}>
          <ChartPath height={SIZE / 2} stroke={colors.text} width={SIZE * 0.85} strokeWidth="5" selectedStrokeWidth="5" selectedOpacity={0.4}/>
          <ChartDot
            style={{
              backgroundColor: colors.text,
            }}
          />
          <ChartYLabel style={{color: colors.text}} format={formatPrice} />
          <ChartXLabel style={{color: colors.text}} format={formatDate} />
        </ChartPathProvider>

      </View>

      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10, color: colors.text}}>Transactions</Text>
      <View style={[styles.walletAsset, {backgroundColor: colors.background}]}>
        {/* Text if no transactions */}
        {
          item.transactions.map((t)=> <CryptoWalletTransaction id={t.id} transaction={t} symbol={item.symbol}/>)
        }
      </View>

      <Pressable
        onPress={() => removeWallet(item.id).then(() => props.navigation.goBack())}
        style={{alignItems: "center", justifyContent: "center"}}>
        <View style={[styles.deleteButton, {backgroundColor: colors.primary}]}>
          <Text style={{color: "#fee2e2", fontWeight: "800"}}>Remove</Text>
        </View>
      </Pressable>

    </ScrollView>
  );
}

function CryptoWalletTransaction(props) {

  const {dark, colors, setScheme} = useTheme();

  const date = new Date(Number(props.transaction.time * 1000))
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  const f_date = date.toLocaleString("en-JP", options);

  return (
    <View style={styles.transaction}>
      <Text style={{color: colors.text}}>{props.transaction.value} {props.symbol}</Text>
      <Text style={{color: colors.text}}>{f_date}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  backArrow: {
    fontWeight: "900",
    fontSize: 30,
    paddingVertical: 10,
  },
  walletAsset: {
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    //paddingVertical: 20,
  },
  walletAssetTitle: {
    fontWeight: "700",
    flex: 1,
  },
  walletAssetImage: {
    width: 100,
    height: 100,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
  },
  transaction: {
    paddingVertical: 5,
  }
});
