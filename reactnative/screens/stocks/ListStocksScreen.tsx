import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  ToastAndroid,
  Platform,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { api_url } from '../../authentication';
import { Button, Image } from 'react-native';
import { auth_get } from '../../authentication';

import LineChartScreen from '../charts/LineChart';
// import LineChartScreen from '../../charts/LineChart';

const SuccessComponent = (props) => {
    const [data, setData] = useState(null);
    const [list, setList] = useState()
    const [stocks, setStocks] = useState()
    const isFocused = useIsFocused()
    // const isFocused = useIsFocused();
    const [transactions, setTransactions] = useState({});

      useEffect(() => {
        const listAccounts = async () => {
          const response = await auth_get('/stocks/list_accounts/')
          setList(response.body)
        }
        if(isFocused){listAccounts()}
      }, [isFocused])

    //   useEffect(() => {
    //     const listStocks = async (stockAccount) => {
    //       await fetch(api_url + `/stocks/list_stocks/${stockAccount}/`, {
    //         method: "GET",
    //         headers: {
    //           "Content-Type": "application/json",
    //           Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
    //         },
    //       }).then(async (res) => setStocks(await res.json()));
    //       // console.log(stocks)
    //       // .catch((error) => {
    //       //   console.error(error);
    //       // });
    //       const data = await res.json();
    //       setStocks(prevStocks => ({
    //         ...prevStocks,
    //         [stockAccount]: data
    //       }));
    //     };
    //     if(isFocused && stocks) {
    //       // listTransactions(stockAccount);
    //       list.forEach((account) => {
    //         listTransactions(account.account_id);
    //       });
    //     }
    // }, [isFocused])

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
        setStocks(prevStocks => ({
          ...prevStocks,
          "accountID": data
        }));
      } catch (error) {
        console.error(error);
      }
    }, []);
  
    useEffect(() => {
      if (isFocused && list) {
        list.forEach((account) => {
          getStocks(account.account_id);
        });
      }
    }, [isFocused, list, getStocks]);

      const getTransactions = useCallback(async (accountID) => {
        try {
          const response = await auth_get(`/stocks/list_transactions/${accountID}/`)
          const data = response.body;
          setTransactions(prevTransactions => ({
            ...prevTransactions,
            [accountID]: data
          }));
        } catch (error) {
          console.error(error);
        }
      }, []);
    
      useEffect(() => {
        if (isFocused && list) {
          list.forEach((account) => {
            getTransactions(account.account_id);
          });
        }
      }, [isFocused, list, getTransactions]);

      // useEffect(() => {
      //   if (isFocused && stocks) {
      //     stocks.forEach((account) => {
      //       listStocks(account.account_id);
      //     });
      //   }
      // }, [isFocused, stocks, listStocks]);

      const ItemSeparator = () => <View style={styles.separator} />;
    return (
        <View>
          <View>
            <Text>Accounts</Text>
          </View>
          <View>
            <FlatList data={list} ItemSeparatorComponent={() => <View style={{height: 5}} />} renderItem={({item, index}) =>{
              return (
                <TouchableOpacity style={[styles.item, {backgroundColor: '#a8a29e'}]} onPress={()=> props.navigation.navigate('StockAsset', {
                    accountID: item.account_id, 
                    accessToken: item.access_token, 
                    transactions: transactions[item.account_id],
                    logo: item.institution_logo,
                    stocks: stocks,
                    balance: item.balance
                  }) }>

                  <View style={styles.row}>
                  {item.institution_logo !== null && 
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={{ uri: `data:image/png;base64,${item.institution_logo}` }}
                    />
                  }

                  {item.institution_logo === null && 
                    <Image
                      style={{ width: 50, height: 50 }}
                      source={{ uri: 'https://kriptomat.io/wp-content/uploads/t_hub/usdc-x2.png' }}
                    />
                  }
                    <View style={{flexDirection: "column"}}>
                      <Text style={styles.name}>  {item.name}</Text>
                      <Text style={styles.ins_name}>   {item.institution_name} £{item.balance}</Text>
                    </View>
                    {/* <Text style={styles.ins_name}>   {item.institution_name} £{item.balance}</Text> */}
                  </View>

                  {transactions[item.account_id] && 
                    <LineChartScreen 
                      transactions={transactions[item.account_id]}
                      stockAccountBalance={item.balance}
                      graph_version={2}
                      height={75}
                      width={350}
                      stockAccountBalance={item.balance}
                  />}

                </TouchableOpacity>
              )
            }}
            ListEmptyComponent={<Text>{'\nYou have no stock accounts\n'}</Text>}
            />
          </View>
        </View>
      );
    };

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
        color: "black",
        fontWeight: 'bold',
        fontSize: 21,
      },
      ins_name:{
        color: "black",
        fontSize: 15,
      },
      separator: {
        height: 1,
        backgroundColor: "#3f3f46",
      },
    });


export default SuccessComponent;