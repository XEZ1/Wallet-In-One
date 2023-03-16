import { View, Text, TouchableOpacity,StyleSheet,SectionList,Image,Pressable } from 'react-native';
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
import { useTheme } from "reactnative/src/theme/ThemeProvider";
import { styles } from "reactnative/screens/All_Styles.style.js";
import SwitchSelector from "react-native-switch-selector";
import ConditionalModal from '../Modal';

export default function StockAsset({ route, navigation, }){
  const [stocks, setStocks] = useState()
  const {dark, colors, setScheme } = useTheme();

  const stylesInternal = StyleSheet.create({
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 20,
      marginVertical: 10,
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
      backgroundColor: colors.background,
    },
    head: {
      height: 44,
       backgroundColor: '#42b983'
    },
    row: { 
      flexDirection: 'row',
      justifyContent: 'center',
    },
    separator: {
      height: 1,
      backgroundColor: "#3f3f46",
    },
    balanceContainer: {
      flexDirection: 'row',
      alignSelf: 'center'
      // alignItems: 'center',
      // justifyContent: 'center',
      // marginTop: 20,
    },
    balanceText: {
      fontSize: 20,
      fontWeight: 'bold',
      // marginHorizontal: 10,
      color: colors.text,
    },
    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 22,
    },
  });

  

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

  const isFocused = useIsFocused();
  const [transactions, setTransactions] = useState(route.params.transactions);
  // const [stocks, setStocks] = useState()

  const deleteAccount = async () => {
    await auth_delete(`/stocks/delete_account/${route.params.accountID}/`)
  }
    
  const transaction_table_data = transactions
    ? transactions.map((item) => [
        item.id,
        (item.amount).toFixed(2), 
        item.date, 
        item.quantity, 
        item.fees,
      ])
    : null;

  const tableData = {
    tableHead: ['ID','Amount', 'Date', 'Quantity','Fees'],
    tableData : transaction_table_data
  };
  

  const [data, setTableData] = React.useState(tableData);
  const [showTable,setShowTable] = React.useState(false);
  const [showStocks,setShowStocks] = React.useState(false);
  
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

    let updated_table_data = updated_data.map((item) => [
        item.id,
        (item.amount).toFixed(2), 
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
  
  const ItemSeparator = () => <View style={stylesInternal.separator} />;

  const [graphVersion,setGraphVersion] = React.useState(1);
  const [modalVisible, setModalVisible] = useState(false);

    return(
      <FlatList
        style={[styles(dark, colors).container, {padding: 10}]}
        data={transactions}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={
        <View style={styles(dark, colors).container}>

          <View style={stylesInternal.balanceContainer}>
            <Text style={[{fontSize: 13, fontWeight: 'bold'}]}>{route.params.name} • {route.params.balance_currency} • {route.params.account_name}</Text>
          </View>
          
          <View style={{flexDirection: 'row', alignItems: 'center'}}>

            <View>
              {/* <Text>{route.params.account_name}</Text> */}
              {/* <Text style={[{fontSize: 11}]}>{route.params.name} • {route.params.balance_currency}</Text> */}
              <View style={{flexDirection: 'row'}}>
                <Text style={stylesInternal.balanceText}>BALANCE:</Text>
                <Text style={stylesInternal.balanceText}>£{route.params.balance}</Text>
              </View>
            </View>

            <View style={{ textAlign: 'right', marginLeft: 'auto'}}>
              {route.params.logo !== null && 
                <Image
                  style={{ width: 60, height: 60 }}
                  source={{ uri: `data:image/png;base64,${route.params.logo}` }}
                />
              }
            </View>

          </View>
          
          <View style={{padding: 15}}>
            <SwitchSelector
              initial={0}
              onPress={value => setGraphVersion(value)}
              // textColor="#7a44cf"
              selectedColor="#fff"
              buttonColor="#7a44cf"
              borderColor="#7a44cf"
              hasPadding
              options={[    
                { label: "Line Chart", value: 1},  
                { label: "Candlestick Chart", value: 3} 
              ]}
              imageStyle={{ width: 20, height: 20 }}
              textStyle={{ fontWeight: 'bold' }}
            />
          </View>


          {transactions && 
            <LineChartScreen 
              transactions={transactions}
              current_balance={route.params.balance}
              graph_version={graphVersion}
              height={275}
              width={375}
          />}
          
          <View style={stylesInternal.buttonContainer, {flexDirection: "row"}}>
            <View style={stylesInternal.timeButton}><Button onPress={all_time} title="ALL"/></View>
            <View style={stylesInternal.timeButton}><Button onPress={last_year} title="Y"/></View>
            <View style={stylesInternal.timeButton}><Button onPress={last_month} title="M"/></View>
            <View style={stylesInternal.timeButton}><Button onPress={last_week} title="D"/></View>
          </View>

          {/* <Button
              onPress={toggleGraph}
              title={graphVersion == 1 ? "Line Chart" : "Candle Stick Chart"}
              color="#fcd34d"
          /> */}

          <Button
              onPress={toggleTable}
              title={showTable ? "Hide Transactions" : "View Transactions"}
              color="#fcd34d"
          />

          {showTable && (
              <View style={stylesInternal.table}>
                  {data.tableData.length > 0 ? (
                    <View>
                      <Text style={[{textAlign: 'center', alignSelf: 'center', color: colors.text}]}>Press on any transaction to view in depth details.{"\n"}</Text>
                      
                      <Table borderStyle={{ borderWidth: 2, borderColor: '#42b983' }}>
                        <Row data={data.tableHead} style={stylesInternal.head} />
                        {data.tableData.map((rowData, index) => (
                          <TouchableOpacity key={index} onPress={() => navigation.navigate('TransactionData', { id: rowData[0] })}>
                            <TableWrapper style={[stylesInternal.row, {backgroundColor: rowData[1] < 0 ? "#f87171" : '#bbf7d0'}]} borderStyle={{borderWidth: 1, borderColor: '#000000'}}>
                              {rowData.map((cellData, cellIndex) => (
                                <Cell key={cellIndex} data={cellData} textStyle={{textAlign: 'center', fontSize: 12, fontWeight: 'bold'}} />
                              ))}
                            </TableWrapper>
                          </TouchableOpacity>
                        ))}
                      </Table>

                    </View>
                  ) : (
                    <Text style={[{textAlign: 'center', alignSelf: 'center', color: colors.text}]}>No data available</Text>
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
                  <TouchableOpacity style={[stylesInternal.item, {backgroundColor: colors.primary}]} onPress={()=> navigation.navigate('StockDetails', {stock: stocks[index], security_id: stocks[index].security_id}) }>
                  <View style={stylesInternal.row}>
                    <Text style={[stylesInternal.name, {fontSize: 14}]}> {item.name} </Text>
                  </View>
                </TouchableOpacity>
                )
              }}
              ListEmptyComponent={<Text>{'\nYou have no stocks listed.\n'}</Text>}
              />)
            }

      <View style={{marginTop: 40, marginBottom: 30}}>
        <Button title="REMOVE" color="red" onPress={() => setModalVisible(true)}/>
      </View>

      <ConditionalModal
        headerText={"Remove Your Account"}
        bodyText={"Are you sure you want to remove your account?"}
        visible={modalVisible}
        onEvent={async () => {await deleteAccount(), navigation.navigate('Stock Account List')}}
        onClose={() => setModalVisible(false)}
      />

        </View>
        }
      />
    );
}