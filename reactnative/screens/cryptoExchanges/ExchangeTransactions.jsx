import {Button, Dimensions, Image, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import { useRoute } from "@react-navigation/native";
import * as SecureStore from 'expo-secure-store';
import React, {useEffect, useState, useCallback} from "react";
//import {LineChart} from "react-native-chart-kit";
import getCryptoIcon from "../crypto_wallet/icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { styles } from 'reactnative/screens/All_Styles.style.js';
import { LineChart } from 'react-native-wagmi-charts';
import ExchangeAsset from "./ExchangeAsset";
import { api_url } from '../../authentication';
import {Table, Row, Cell} from 'react-native-table-component';


export default function ExchangeTransactions(props) {

  const {dark, colors, setScheme} = useTheme();
  const route = useRoute();
  const [exchangeTransactions, setExchangeTransactions] = useState([]);
  const { item, removeExchange } = props.route.params;
  const exchange = item.id;
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
    mediumText: {
      fontWeight:"200",
      fontSize: 19,
      paddingTop: 0,
      color: colors.text,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    header: {
      flexDirection: 'row',
      height: 30,
      fontWeight: "850",
      fontSize: 25,
    },
    head: {
      height: 44,
      backgroundColor: '#42b983'
    },
    table: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.background,
    },

  });  

  let getExchangeTransactions = useCallback(async (exchange) => {
    try {
      const response = await fetch(api_url + `/crypto-exchanges/get_transactions/${exchange}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      });
      let data = await response.json();
      setExchangeTransactions(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (exchange) {
      getExchangeTransactions(exchange);
    }
  }, [exchange, getExchangeTransactions]);

  const data = {
    tableHead: ['Pair', 'Amount', 'Type', 'Date'],
    tableData: exchangeTransactions.map(transaction => [
      transaction.asset,
      transaction.amount,
      transaction.transaction_type,
      new Date(transaction.timestamp).toLocaleString("en-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      })
    ])
  };

  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.background, paddingHorizontal: 30}}>

      <View style={[styles(dark, colors).container, {flexDirection: 'row', alignItems: "flex-end"}]}>
        <TouchableWithoutFeedback onPress={() => props.navigation.goBack()} style={{flex: 1}}>
          <Text style={styles(dark, colors).backArrow}>←</Text>
        </TouchableWithoutFeedback>
        <View style={{flex: 1}}></View>
        <Pressable
          onPress={() => removeExchange(item.id).then(() => props.navigation.goBack())}
          style={{alignItems: "center", justifyContent: "center", marginLeft: 'auto'}}>
          <View style={styles(dark, colors).smallButton}>
            <Text style={{color: colors.text, fontWeight: "800"}}>Remove</Text>
          </View>
        </Pressable>
      </View>


      <View style={[stylesInternal.exchangeAsset, styles(dark, colors).container, {flexDirection: 'row'}]}>
        <Image
          style={stylesInternal.exchangeAssetImage}
          source={getCryptoIcon(item.crypto_exchange_name)}/>
        <View style={{marginLeft: 10}}>
          <Text style={stylesInternal.largeBoldText}>{item.crypto_exchange_name} Exchange</Text>
          <Text style={stylesInternal.mediumText}>Balance: £{item.balance}</Text>
        </View>
      </View>


      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10, color: colors.text}}>Transactions</Text>
      {data && (
          <View style={[stylesInternal.table, {paddingVertical: 20}]}>
              {data && data.tableData && data.tableData.length > 0 ? (
                <View>
                  <Table borderStyle={{ borderWidth: 2, borderColor: colors.text}}>
                    <Row 
                      data={data.tableHead} 
                      style={[stylesInternal.header, {backgroundColor: dark ? "#21201E" : "#D3D3D3"}]}
                      textStyle={{ fontWeight: 'bold', color: colors.text, fontSize: 17 }}
                    />
                    {data.tableData.map((rowData) => (
                      <Row data={rowData.map((cellData, cellIndex) => (<Cell key={cellIndex} data={cellData} textStyle={{color: colors.text}} />))} 
                        style={[stylesInternal.row, {backgroundColor: rowData[2] == "sell" ? dark ? "#8b0000" : "#f87171" : rowData[2] == "buy" ? dark ? "#006400" : "#90ee90" : dark ? "#323232" : "#f3f3f3"}]}
                      />
                    ))}
                  </Table>
                </View>
              ) : (
                <Text style={[styles(dark, colors).text, {textAlign: 'center', alignSelf: 'center'}]}>... Loading</Text>
              )}
          </View>
      )}
    </ScrollView>
  );

}