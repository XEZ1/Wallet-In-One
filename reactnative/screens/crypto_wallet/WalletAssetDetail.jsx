import {Button, Dimensions, Image, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import { useRoute } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
//import {LineChart} from "react-native-chart-kit";
import getCryptoIcon from "./icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import {styles} from 'reactnative/screens/All_Styles.style.js';
import { LineChart } from 'react-native-wagmi-charts';
import WalletAsset from "./WalletAsset";
import LineChartScreen from "../charts/LineChart";

export default function WalletAssetDetail(props) {

  const {dark, colors, setScheme} = useTheme();
  const route = useRoute();

  const stylesInternal = StyleSheet.create({
    walletAsset: {
      borderRadius: 10,
      padding: 20,
    },
    walletAssetImage: {
      width: 100,
      height: 100,
    },
    mediumBoldText: {
      fontWeight:"800",
      fontSize:25,
      paddingTop: 10,
      color: colors.text,
    }
  });  

  const { item, value, removeWallet } = props.route.params;
  const [ graphData, setGraphData ] = useState([{timestamp: 0, value: 0}, {timestamp: 0, value: 0}]);

  const {width: SIZE} = Dimensions.get('window');

  useEffect(() => {
    let points = [];
    let balance = item.balance;

    for (let i = 0; i < item.transactions.length; i++) {
      let point = {timestamp: item.transactions[i].time * 1000, value: balance}
      balance -= item.transactions[i].value
      points = [point, ...points]
    }
    setGraphData(points)

    }, []);

    // setGraphData(graphData.sort((a, b) => new Date(b[1]) - new Date(a[1])));


  const data = graphData

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
        <Text style={styles(dark, colors).backArrow}>←</Text>
      </TouchableWithoutFeedback>

      <View style={[stylesInternal.walletAsset, styles(dark, colors).container]}>
        <Image
          style={stylesInternal.walletAssetImage}
          source={getCryptoIcon(item.symbol)}
        />
        <Text style={styles(dark, colors).largeTextBold}>{item.cryptocurrency} Wallet</Text>
        <Text />

        <Text style={styles(dark, colors).textBold}>Address</Text>
        <Text style={styles(dark, colors).text}>{item.address}</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Balance</Text>
        <Text style={{color: colors.text}}>{item.balance} {item.symbol}</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Value</Text>
        <Text style={{color: colors.text}}>£{value.toFixed(2)}</Text>
        <Text />
        {/* ▲ 0.00% */}

        <Text style={{fontWeight: "700", color: colors.text}}>Received</Text>
        <Text style={{color: colors.text}}>{item.received} {item.symbol}</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Spent</Text>
        <Text style={{color: colors.text}}>{item.spent} {item.symbol}</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Output Count</Text>
        <Text style={{color: colors.text}}>{item.output_count}</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Unspent Output Count</Text>
        <Text style={{color: colors.text}}>{item.unspent_output_count}</Text>

      </View>

      <Pressable
        onPress={() => removeWallet(item.id).then(() => props.navigation.goBack())}
        style={{alignItems: "center", justifyContent: "center"}}>
        <View style={styles(dark, colors).smallButton}>
          <Text style={{color: colors.text, fontWeight: "800"}}>Remove</Text>
        </View>
      </Pressable>

      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10, color: colors.text}}>Graph</Text>
      {graphData.length <= 2 ? (
        <Text style={{color: colors.text}}>Not enough data to display graph.</Text>
      ) : (
        <View style={[styles.walletAsset, {backgroundColor: colors.background}]}>
          <LineChart.Provider data={data}>
            <LineChart height={SIZE / 2} width={SIZE * 0.85}>
              <LineChart.Path color={colors.text}/>
              <LineChart.CursorCrosshair color={colors.text}>

                <LineChart.Tooltip textStyle={{color: colors.text}}>
                  <LineChart.PriceText precision={10} style={{color: colors.text}} />
                </LineChart.Tooltip>

                <LineChart.Tooltip position="bottom" >
                  <LineChart.DatetimeText style={{color: colors.text}} />
                </LineChart.Tooltip>

              </LineChart.CursorCrosshair>
            </LineChart>
          </LineChart.Provider>

          {graphData && 
            <LineChartScreen 
              transactions={undefined}
              // current_balance={graphData[0].value}
              graph_version={3}
              height={SIZE / 2} 
              width={SIZE * 0.85}
              data={graphData}
          />}

        </View>

      )

      }


      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10, color: colors.text}}>Transactions</Text>
      <View style={[styles.walletAsset, {backgroundColor: colors.background}]}>
        {/* Text if no transactions */}
        {
          item.transactions.map((t)=> <CryptoWalletTransaction key={t.id} transaction={t} symbol={item.symbol}/>)
        }
      </View>


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
      <Text />
      <Text style={{color: colors.text, fontWeight: "700"}}>{props.transaction.value} {props.symbol}</Text>
      <Text style={{color: colors.text}}>{f_date}</Text>
    </View>
  )
}

// const styles = StyleSheet.create({
//   backArrow: {
//     fontWeight: "900",
//     fontSize: 30,
//     paddingVertical: 10,
//   },
//   walletAsset: {
//     backgroundColor: "#e5e5e5",
//     borderRadius: 10,
//     //paddingVertical: 20,
//   },
//   walletAssetTitle: {
//     fontWeight: "700",
//     flex: 1,
//   },
//   walletAssetImage: {
//     width: 100,
//     height: 100,
//   },
//   deleteButton: {
//     marginTop: 10,
//     padding: 10,
//     paddingHorizontal: 30,
//     borderRadius: 5,
//   },
//   transaction: {
//     paddingVertical: 5,
//   }
// });