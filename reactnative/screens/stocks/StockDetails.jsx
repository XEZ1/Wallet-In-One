import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { api_url } from '../../authentication';
import {Table, Row, Rows,TableWrapper,Cell} from 'react-native-table-component';

export default function StockDetails({ route, navigation }){

  const [stockTransactions, setStockTransactions] = useState([]);
  const stock = route.params.stock;
  console.log("-----------------------------------------------------");
  console.log(stock);

  const getStockTransactions = useCallback(async (stock) => {
    try {
      const response = await fetch(api_url + `/stocks/list_transactions/${stock}/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      });
      const data = await response.json();
      setStockTransactions(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    if (stock) {
      getStockTransactions(stock.stockAccount);
    }
  }, [stock, getStockTransactions]);

  const data = {
    tableHead: ['ID', 'Amount', 'Date', 'Quantity', 'Fees'],
    tableData: stockTransactions.map(item => [
      item.id,
      item.amount,
      item.date,
      item.quantity,
      item.fees,
    ]),
  };

    return (
      <ScrollView style={styles.screen}>
        <Text style={styles.label}>Stock Data{"\n"}</Text>

        {stock ? (
          <View>
            <Text style={styles.label}>Name</Text>
            <Text>{stock.name}{"\n"}</Text>

            <Text style={styles.label}>Institution Price Currency</Text>
            <Text>{stock.institution_price_currency}{"\n"}</Text>

            <Text style={styles.label}>Institution Price</Text>
            <Text>{stock.institution_price}{"\n"}</Text>

            {stock.ticker_symbol != null && (
              <View>
                <Text style={styles.label}>Ticker Symbol</Text>
                <Text>{stock.ticker_symbol}{"\n"}</Text>
              </View>
            )}

            <Text style={styles.label}>Quantity</Text>
            <Text>{stock.quantity}{"\n"}</Text>

          </View>
        ):(<Text>Loading...</Text>)}

        {/* <Text>{JSON.stringify(data)}</Text> */}
        {data && (
          <View style={styles.table}>
              {data && data.tableData && data.tableData.length > 0 ? (
                <View>
                  <Table borderStyle={{ borderWidth: 2, borderColor: '#42b983' }}>
                    <Row data={data.tableHead} style={styles.head} textStyle={styles.text} />
                    {data.tableData.map((rowData, index) => (
                      <TouchableOpacity key={index} onPress={()=> navigation.navigate('TransactionData', {id: rowData[0]})}>
                        <TableWrapper style={styles.row}>
                          {rowData.map((cellData, cellIndex) => (
                            <Cell key={cellIndex} data={cellData} textStyle={styles.text} />
                          ))}
                        </TableWrapper>
                      </TouchableOpacity>
                    ))}
                  </Table>
                </View>
              ) : (
                <Text style={[{textAlign: 'center', alignSelf: 'center'}]}>... Loading</Text>
              )}
          </View>
          )}
      </ScrollView>
  );
    
}

const styles = StyleSheet.create({
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
  label: {
    fontWeight: 'bold',
  },
  screen: {
    padding: 20,
  },
  table: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#fff',
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