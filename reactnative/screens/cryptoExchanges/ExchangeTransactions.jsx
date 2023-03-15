import {Dimensions, Image, Pressable, StyleSheet, Text, TouchableWithoutFeedback, TouchableOpacity, View, ScrollView} from "react-native";
import * as SecureStore from 'expo-secure-store';
import React, {useEffect, useState, useCallback} from "react";
import getCryptoIcon from "../crypto_wallet/icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import { styles } from 'reactnative/screens/All_Styles.style.js';
import { api_url } from '../../authentication';
import {Table, Row, Cell} from 'react-native-table-component';
import { VictoryPie, VictoryLabel, VictoryContainer } from "victory-native";
import BarChart from "../charts/chartComponents/barChart";

export default function ExchangeTransactions(props) {

  const {dark, colors } = useTheme();
  const [exchangeTransactions, setExchangeTransactions] = useState([]);
  const [exchangeTokens, setExchangeTokens] = useState([]);
  const { item, removeExchange } = props.route.params;
  const exchange = item.id;
  const stylesInternal = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
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
      alignItems: 'center',
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

  let getExchangeTokens = useCallback(async (exchange) => {
    try {
      const response = await fetch(api_url + `/crypto-exchanges/get_token_breakdown/${exchange}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      });
      let data = await response.json();
      setExchangeTokens(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (exchange) {
      getExchangeTransactions(exchange);
      getExchangeTokens(exchange);
    }
  }, [exchange, getExchangeTransactions, getExchangeTokens]);

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

  const [chartType, setChartType] = useState("pie");
  const handleChartTypeChange = (type) => {
    setChartType(type);
  };
  const tokenList = exchangeTokens.map((val) => val.x);
  const colours = [];
  for (let i = 0; i < tokenList.length; i++) {
    const token = tokenList[i];
    let hex = '';
    if (token.length >= 3) {
      for (let j = 0; j < 3; j++) {
        const charCode = token.charCodeAt(j);
        const hexByte = (charCode * 3.2).toString(16).slice(0, 2);
        hex += hexByte;
      }
      colours.push('#' + hex);
    } else {
      // less than 3 chars
      const charCode = token.charCodeAt(0);
      const hexByte = (charCode * 412).toString(16).slice(0, 6);
      colours.push('#' + hexByte);
    }
  }
  const handlePressIn = ()=>{};


  return (
    <ScrollView style={{flex: 1, backgroundColor: colors.background, paddingHorizontal: 30}}>

      {/* Back arrow and remove button */}
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

      {/* Exchange logo, title and balance */}
      <View style={[stylesInternal.exchangeAsset, styles(dark, colors).container, {flexDirection: 'row'}]}>
        <Image
          style={stylesInternal.exchangeAssetImage}
          source={getCryptoIcon(item.crypto_exchange_name)}/>
        <View style={{marginLeft: 10}}>
          <Text style={stylesInternal.largeBoldText}>{item.crypto_exchange_name} Exchange</Text>
          <Text style={stylesInternal.mediumText}>Balance: £{item.balance}</Text>
        </View>
      </View>

      {/* Switch Menus Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-around", width: "90%", backgroundColor: "antiquewhite", margin: 10, borderRadius: 30 }}>
        <TouchableOpacity
          style={[
            styles(dark, colors).btn,
            chartType === "pie" && { backgroundColor: 'aliceblue'},
          ]}
          onPress={() => handleChartTypeChange("pie")}
        >
        <Text>Coin Breakdown</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles(dark, colors).btn,
            chartType === "transactions" && { backgroundColor: 'aliceblue'},
          ]}
          onPress={() => handleChartTypeChange("transactions")}
        >
        <Text>Transactions</Text>
        </TouchableOpacity>
      </View>

      {/* Pie chart and transactions table */}    
      {chartType == "pie" ?
        <View style={stylesInternal.container}>
          <Text style={stylesInternal.mediumBoldText}>Coin Breakdown</Text>
          {exchangeTokens.length == 0 ? (
            <Text style={styles(dark, colors).text}>Loading...</Text>
          ) : (
          <>
          <VictoryContainer
            width={Dimensions.get('window').width}
            height={330}
            style= {{ paddingTop: 0}}
            > 
            <VictoryPie
              data={exchangeTokens}
              innerRadius={90}
              padAngle={1}
              cornerRadius= {10}
              radius= {Dimensions.get('window').width/3}
              colorScale={colours}
              height={330}
              labels={() => null}
            />
            <VictoryLabel
              textAnchor="middle"
              style={{ fontSize: 27, fill: colors.text }}
              x={Dimensions.get("window").width / 2}
              y={145}
              text={"Assets"}
            />
            <VictoryLabel
              textAnchor="middle"
              style={{ fontSize: 37, fontWeight: "700", fill: colors.text }}
              x={Dimensions.get("window").width / 2}
              y={180}
              text={exchangeTokens.length}
            />
          </VictoryContainer>
          {BarChart(colours, tokenList, exchangeTokens, colors, (tokenList.length*60), handlePressIn)}
          </>
          )}
        </View>  
       : 
      <> 
      <View style={stylesInternal.container}>
        <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10, color: colors.text}}>Transactions</Text>
      </View>  
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
                    {data.tableData.map((rowData, rowIndex) => (
                      <Row key={rowIndex} data={rowData.map((cellData, cellIndex) => (<Cell key={cellIndex} data={cellData} textStyle={{color: colors.text}} />))} 
                        style={[stylesInternal.row, {backgroundColor: rowData[2] == "sell" ? dark ? "#8b0000" : "#f87171" : rowData[2] == "buy" ? dark ? "#006400" : "#90ee90" : dark ? "#323232" : "#f3f3f3"}]}
                      />
                    ))}
                  </Table>
                </View>
              ) : (
                <Text style={[styles(dark, colors).text, {textAlign: 'center', alignSelf: 'center'}]}>Loading...</Text>
              )}
          </View>
      )}</>
      }
    </ScrollView>
  );

}