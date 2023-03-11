import {Button, Dimensions, Image, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import { useRoute } from "@react-navigation/native";
import React, {useEffect, useState} from "react";
//import {LineChart} from "react-native-chart-kit";
import getCryptoIcon from "../crypto_wallet/icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { styles } from 'reactnative/screens/All_Styles.style.js';
import { LineChart } from 'react-native-wagmi-charts';
import ExchangeAsset from "./ExchangeAsset";


export default function ExchangeTransactions(props) {

  const {dark, colors, setScheme} = useTheme();
  const route = useRoute();

  const stylesInternal = StyleSheet.create({
    exchangeAsset: {
      borderRadius: 10,
      paddingTop: 20,
      paddingBottom: 20
    },
    exchangeAssetImage: {
      width: 80,
      height: 80,
    },
    largeBoldText: {
      fontWeight:"800",
      fontSize:31,
      paddingTop: 10,
      color: colors.text,
    },
    mediumBoldText: {
      fontWeight:"800",
      fontSize:25,
      paddingTop: 10,
      color: colors.text,
    },
    mediumText: {
      fontWeight:"200",
      fontSize: 19,
      paddingTop: 0,
      color: colors.text,
    },
    transaction: {
      paddingVertical: 5,
    }
  });  

  const { item, removeExchange } = props.route.params;
  const [ graphData, setGraphData ] = useState([{timestamp: 0, value: 0}, {timestamp: 0, value: 0}]);

  const {width: SIZE} = Dimensions.get('window');

  useEffect(() => {
    let points = [];
    let balance = item.balance;

    for (let i = 0; i < item.transactions.length; i++) {
      var date = new Date(item.transactions[i].date);
      var milliseconds = date.getTime(); 
      let point = {timestamp: milliseconds, value: balance};
      balance -= item.transactions[i].amount;
      points = [point, ...points];
    }
    setGraphData(points);

    }, []);


  const data = graphData;

  const formatPrice = value => {
    'worklet';
    if (value === 'undefined') return `0 ${item.asset}`;
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

      <View style={[stylesInternal.exchangeAsset, styles(dark, colors).container, {flexDirection: 'row'}]}>
        <Image
          style={stylesInternal.exchangeAssetImage}
          source={getCryptoIcon(item.crypto_exchange_name)}/>
        <View style={{marginLeft: 10}}>
          <Text style={stylesInternal.largeBoldText}>{item.crypto_exchange_name} Exchange</Text>
          <Text style={stylesInternal.mediumText}>Balance: £{item.balance}</Text>
        </View>
      </View>

      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10, color: colors.text}}>Graph</Text>
      {graphData.length <= 2 ? (
        <Text style={{color: colors.text}}>Not enough data to display graph.</Text>
      ) : (
        <View style={[stylesInternal.exchangeAsset, {backgroundColor: colors.background}]}>
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
        </View>
      )

      }


      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10, color: colors.text}}>Transactions</Text>
      <View style={[stylesInternal.exchangeAsset, {backgroundColor: colors.background}]}>
        {
          item.transactions.map((t, index) => <CryptoExchangeTransaction key={index} transaction={t}/>)
        }
      </View>


      <Pressable
        onPress={() => removeExchange(item.id).then(() => props.navigation.goBack())}
        style={{alignItems: "center", justifyContent: "center"}}>
        <View style={[stylesInternal.exchangeAsset, { backgroundColor: colors.background }]}>
          <TransactionTable transactions={item.transactions} />
        </View>
      </Pressable>
    </ScrollView>
  );

}

function TransactionTable(props) {

  const {dark, colors, setScheme} = useTheme();

  return (
    <View style={tableStyles.transaction}>
      <View style={tableStyles.row}>
        <Text style={[tableStyles.header, { color: colors.text }]}>Asset</Text>
        <Text style={[tableStyles.header, { color: colors.text }]}>Amount</Text>
        <Text style={[tableStyles.header, { color: colors.text }]}>Type</Text>
        <Text style={[tableStyles.header, { color: colors.text }]}>Date</Text>
      </View>
      {props.transactions.map((transaction, index) => (
        <View style={tableStyles.row} key={index}>
          <Text style={{ color: colors.text }}>{transaction.asset}</Text>
          <Text style={{ color: colors.text }}>{transaction.amount}</Text>
          <Text style={{ color: colors.text }}>{transaction.transaction_type}</Text>
          <Text style={{ color: colors.text }}>
            {new Date(transaction.date).toLocaleString("en-JP", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </Text>
        </View>
      ))}
    </View>
  );
}

function CryptoExchangeTransaction(props) {
  return <TransactionTable transactions={[props.transaction]} />;
}

const tableStyles = StyleSheet.create({
  transaction: {
    flex: 1,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  header: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
