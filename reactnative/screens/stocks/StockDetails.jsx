import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { api_url } from '../../authentication';
import {Table, Row, Rows,TableWrapper,Cell} from 'react-native-table-component';

export default function StockDetails({ route, navigation }){
  console.log("STOCKTRANS")
  console.log(route.params.stock_transactions);
      const stock_data = route.params.stock;

      const table_data = route.params.stock_transactions.data.map(item => [
        item.id,
        item.amount,
        item.date,
        item.quantity,
        item.fees,
      ]);

      const data = {
        tableHead: ['ID','Amount', 'Date', 'Quantity','Fees'],
        tableData : table_data,
      };
      
      // console.log(JSON.stringify(data))
    return (
      <ScrollView style={styles.screen}>
        <Text style={styles.label}>Stock Data{"\n"}</Text>

        {stock_data ? (
          <View>
            <Text style={styles.label}>Name</Text>
            <Text>{stock_data.name}{"\n"}</Text>

            <Text style={styles.label}>Institution Price Currency</Text>
            <Text>{stock_data.institution_price_currency}{"\n"}</Text>

            <Text style={styles.label}>Institution Price</Text>
            <Text>{stock_data.institution_price}{"\n"}</Text>

            <Text style={styles.label}>Ticker Symbol</Text>
            <Text>{stock_data.ticker_symbol}{"\n"}</Text>

            <Text style={styles.label}>Quantity</Text>
            <Text>{stock_data.quantity}{"\n"}</Text>

          </View>
        ):(<Text>Loading...</Text>)}

        {/* <Text>{JSON.stringify(data)}</Text> */}
        {data && (
          <View style={styles.table}>
              {data.tableData.length > 0 ? (
                <View>
                  <Table borderStyle={{ borderWidth: 2, borderColor: '#42b983' }}>
                    <Row data={data.tableHead} style={styles.head} textStyle={styles.text} />
                    {data.tableData.map((rowData, index) => (
                      // <TouchableOpacity key={index} onPress={()=> navigation.navigate('TransactionData', {id: rowData[0]})}>
                        <TableWrapper style={styles.row}>
                          {rowData.map((cellData, cellIndex) => (
                            <Cell key={cellIndex} data={cellData} textStyle={styles.text} />
                          ))}
                        </TableWrapper>
                      // </TouchableOpacity>
                    ))}
                  </Table>
                </View>
              ) : (
                <Text style={[{textAlign: 'center', alignSelf: 'center'}]}>No data available</Text>
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