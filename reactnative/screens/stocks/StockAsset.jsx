import { View, Text, TouchableOpacity,StyleSheet,VirtualizedList } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect,useCallback } from 'react';
import { FlatList } from 'react-native-gesture-handler';
import { api_url } from '../../authentication';
import LineChartScreen from "reactnative/screens/charts/LineChart.js";
import { ScrollView, Dimensions, Button, TouchableHighlight, Alert } from 'react-native';
import {Table, Row, Rows,TableWrapper,Cell} from 'react-native-table-component';
import { auth_delete } from '../../authentication';
import { auth_get } from '../../authentication';

export default function StockAsset({ route, navigation, }){
  const [stocks, setStocks] = useState()

  const getStocks = useCallback(async (accountID) => {
      try {
        const res = await fetch(api_url + `/stocks/list_stocks/${accountID}/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
          },
        });
        const data = await res.json();
        setStocks(data);

      } catch (error) {
        console.error(error);
      }
    }, []);
  
    useEffect(() => {
      if (isFocused ) {
        getStocks(route.params.accountID);
      }
    }, [isFocused, getStocks]);

  //   const [stockTransactions, setStockTransactions] = useState([]);

  //   const getStockTransactions = useCallback(async (accountID) => {
  //     try {
  //       const response = await fetch(api_url + `/stocks/list_transaction/${accountID}/`, {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
  //         },
  //       });
  //       const data = await response.json();
  //       setStockTransactions(prevTransactions => ({
  //         ...prevTransactions,
  //         ["data"]: data
  //       }));
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }, []);

  // useEffect(() => {
  //   if (stocks.length) {
  //     stocks.forEach((stock) => {
  //       getStockTransactions(stock.stockAccount);
  //     });
  //   }
  // }, [stocks, getStockTransactions]);

  console.log("STOCKS SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS:");
  console.log(stocks);

    const isFocused = useIsFocused();
    const [transactions, setTransactions] = useState(route.params.transactions);
    // const [stocks, setStocks] = useState()

    const deleteAccount = async () => {
      await auth_delete(`/stocks/delete_account/${route.params.accountID}/`)
    }
    
    // console.log("transactions:", transactions);
    
    const transaction_table_data = transactions
      ? transactions.map((item) => [
          item.id,
          item.amount, 
          item.date, 
          item.quantity, 
          item.fees,
        ])
      : null;
      // console.log("stocks");
      // console.log(route.params.stocks);

      const tableData = {
        tableHead: ['ID','Amount', 'Date', 'Quantity','Fees'],
        tableData : transaction_table_data
      };
      

      const [data, setTableData] = React.useState(tableData);
      const [showTable,setShowTable] = React.useState(false);
      const [showStocks,setShowStocks] = React.useState(false);
      // console.log("DATA")
      // console.log(data);
      
      const toggleTable = () => {
          setShowTable(!showTable);
      };
      
      const toggleStocksView = () => {
        setShowStocks(!showStocks);
      };

      const filter_transactions = (time) => {
        const currentDate = new Date();
        const currentDateTime = currentDate.getTime();
        const lastTransactionDate = new Date(currentDate.setDate(currentDate.getDate() - time));
        const lastTransactionDateTime = lastTransactionDate.getTime();
      
        let updated_data = route.params.transactions.filter(transaction => {
          const transactionDateTime = new Date(transaction.date).getTime();

          if (transactionDateTime <= currentDateTime && transactionDateTime > lastTransactionDateTime) {
            return true;
          }
          return false;
        })

        // let line_graph_data = accumulate_totals_for_each_day(updated_data.map((item) => [balance + item.amount, item.date]));

        // console.log(line_graph_data);
      
        // setLineGraphData(line_graph_data.map((item) => item[0]));
        // setLineGraphLabel(line_graph_data.map((item) => item[1]));

        let updated_table_data = updated_data.map((item) => [
            item.id,
            item.amount, 
            item.date, 
            item.quantity, 
            item.fees,
        ]);

        setTableData({
            tableHead: ['ID','Amount', 'Date', 'Quantity','Fees'],
            tableData : updated_table_data,
        });

        setTransactions(updated_data);
      }

    const last_week = () => {
        filter_transactions(7);
    }

    const last_month = () => {
        filter_transactions(30);
    }

    const last_year = () => {
        filter_transactions(365);
    }

    const all_time = () => {
      setTransactions(route.params.transactions);
      setTableData(tableData);
    }

    // console.log("Transactions to check balance");
    // console.log(route.params.balance);
    
    const ItemSeparator = () => <View style={styles.separator} />;

    return(
      <ScrollView style={{padding: 10}}>
        <View>
          <Button title ={"REMOVE"} color = "red" onPress={async ()=> {await deleteAccount(), navigation.navigate('Stock Account List')}}/>

          {transactions && 
            <LineChartScreen 
              transactions={transactions}
              stockAccountBalance={route.params.balance}
              graph_version={1}
              height={275}
              width={375}
              // stockAccountBalance={route.params.balance}
          />}
          
          <View style={styles.buttonContainer, {flexDirection: "row"}}>
            <View style={styles.timeButton}><Button onPress={all_time} title="ALL"/></View>
            <View style={styles.timeButton}><Button onPress={last_year} title="Y"/></View>
            <View style={styles.timeButton}><Button onPress={last_month} title="M"/></View>
            <View style={styles.timeButton}><Button onPress={last_week} title="D"/></View>
          </View>

          <Button
              onPress={toggleTable}
              title={showTable ? "Hide Transactions" : "View Transactions"}
              color="#fcd34d"
          />

          {showTable && (
              <View style={styles.table}>
                  {data.tableData.length > 0 ? (
                    <View>
                      <Text style={[{textAlign: 'center', alignSelf: 'center'}]}>Select Row to view transaction details.{"\n"}</Text>
                      
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
                    <Text style={[{textAlign: 'center', alignSelf: 'center'}]}>No data available</Text>
                  )}
              </View>
          )}

          <Button
            onPress={toggleStocksView}
            title={showStocks ? "Hide Stocks" : "View Stocks"}
            color="#fcd34d"
          />
          
          {showStocks && stocks &&  (
            <FlatList 
              data={stocks} 
              style={{paddingVertical: 5, paddingHorizontal: 10}}
              ItemSeparatorComponent={() => <View style={{height: 5}} />}
              contentContainerStyle={{paddingBottom: 20}}
              renderItem={({item, index}) =>{
                return (
                  <TouchableOpacity style={[styles.item, {backgroundColor: '#1e40af'}]} onPress={()=> navigation.navigate('StockDetails', {stock: stocks[index]}) }>
                  <View style={styles.row}>
                    <Text style={[styles.name, {fontSize: 14}]}> {item.name} </Text>
                  </View>
                </TouchableOpacity>
                )
              }}
              ListEmptyComponent={<Text>{'\nYou have no stocks listed.\n'}</Text>}
              />)
            }
        </View>
      </ScrollView>
    );
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
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
  timeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
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
  text: { 
    // margin: 8
  },
  row: { 
    flexDirection: 'row',
  },
  separator: {
    height: 1,
    backgroundColor: "#3f3f46",
  },
});