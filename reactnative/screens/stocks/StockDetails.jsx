import { View, Text, TouchableOpacity,StyleSheet, Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { api_url } from '../../authentication';
import {Table, Row, Rows,TableWrapper,Cell} from 'react-native-table-component';
import { useTheme } from "reactnative/src/theme/ThemeProvider";
import { styles } from "reactnative/screens/All_Styles.style.js";
import LineChartScreen from '../charts/LineChart';

export default function StockDetails({ route, navigation }){

  const [stockTransactions, setStockTransactions] = useState();
  const stock = route.params.stock;
  const {dark, colors, setScheme } = useTheme();
  

  const {width: SIZE} = Dimensions.get('window');

  let getStockTransactions = useCallback(async (stock) => {
    try {
      const response = await fetch(api_url + `/stocks/list_transactions/${stock}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      });
      let data = await response.json();
      data = data.filter(item => item.security_id === route.params.stock.security_id);
      let graph_data = data.map((item) => [item.amount, item.date]);
      graph_data = graph_data.sort((a, b) => new Date(b[1]) - new Date(a[1]));

      let points = [];
      let balance = current_balance;

      for (let i = 0; i < graph_data.length; i++) {
          let point = {timestamp: new Date(graph_data[i][1]).getTime(), value: balance}
          balance -= graph_data[i][0]
          points = [point, ...points]
      }
      if (points.length > 0) {
          points[points.length - 1].value = parseFloat(points[points.length - 1].value);
      }
      setStockTransactions(points);
    } catch (error) {
      // console.error(error);
    }
  }, []);

  useEffect(() => {
    if (stock) {
      getStockTransactions(stock.stockAccount);
    }
  }, [stock, getStockTransactions]);

  const current_balance = stockTransactions?.map(item => item.amount).reduce((acc, current) => acc + current, 0);
  

  const data = {
    tableHead: ['ID', 'Amount', 'Date', 'Quantity', 'Fees'],
    tableData: stockTransactions?.map(item => [
      item.id,
      (item.amount).toFixed(2),
      item.date,
      item.quantity,
      item.fees,
    ]),
  };

  const stylesInternal = StyleSheet.create({
    item:{
      padding: 20,
      borderRadius: 10,
    },
    row:{
      flexDirection: 'row',
      alignItems: 'flex-start',
    },
    name:{
      color: "white",
      fontWeight: 'bold',
      fontSize: 21,
    },
    ins_name:{
      color: "white",
      fontSize: 18,
    },
    table: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: colors.background,
      paddingTop: 20,
    },
    head: {
      height: 44,
       backgroundColor: '#42b983'
    },
    row: { 
      flexDirection: 'row',
    },
  });

    return (
      <ScrollView style={[styles(dark, colors).container, {padding: 20}]}>
        {/* <Text style={[styles(dark, colors).textBold, {color: colors.primary}]}>Stock Data{"\n"}</Text> */}

        {stock ? (
          <View>
            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Name</Text>
            <Text style={styles(dark, colors).text}>{stock.name}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Institution Price Currency</Text>
            <Text style={styles(dark, colors).text}>{stock.institution_price_currency}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Institution Price</Text>
            <Text style={styles(dark, colors).text}>{stock.institution_price}{"\n"}</Text>

            {stock.ticker_symbol != null && (
              <View>
                <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Ticker Symbol</Text>
                <Text style={styles(dark, colors).text}>{stock.ticker_symbol}{"\n"}</Text>
              </View>
            )}

            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Quantity</Text>
            <Text style={styles(dark, colors).text}>{stock.quantity}{"\n"}</Text>

          </View>
        ):(<Text style={styles(dark, colors).text}>Loading...</Text>)}

          <Text style={[styles(dark, colors).textBold, {color: colors.text, fontSize: 21}]}>Line Graph</Text>
          {stockTransactions && (
            <LineChartScreen
            graph_version={1} 
            height={SIZE / 2} 
            width={SIZE * 0.85}
            current_balance={current_balance}
            data={stockTransactions}
            />
          )}


        <Text style={[styles(dark, colors).textBold, {color: colors.text, fontSize: 21}]}>Stock Transactions</Text>
        {data && (
          <View style={stylesInternal.table}>
              {data && data.tableData && data.tableData.length > 0 ? (
                <View>
                  <Table style={{paddingBottom:20}} borderStyle={{ borderWidth: 2, borderColor: '#42b983' }}>
                    <Row data={data.tableHead} style={stylesInternal.head} />
                    {data.tableData.map((rowData, index) => (
                      <TouchableOpacity key={index} onPress={() => navigation.navigate('TransactionData', { id: rowData[0] })}>
                        <TableWrapper style={[stylesInternal.row, {backgroundColor: rowData[1] < 0 ? "#f87171" : '#bbf7d0'}]} borderStyle={{borderWidth: 1, borderColor: '#000000'}}>
                          {rowData.map((cellData, cellIndex) => (
                            <Cell key={cellIndex} data={cellData} textStyle={{textAlign: 'center', fontSize: 12}} />
                          ))}
                        </TableWrapper>
                      </TouchableOpacity>
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