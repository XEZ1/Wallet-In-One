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
import { api_url, auth_get } from '../../authentication';

import LineChartScreen from '../charts/LineChart';
// import LineChartScreen from '../../charts/LineChart';

const SuccessComponent = (props) => {
    const [data, setData] = useState(null);
    const [list, setList] = useState()
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

      const ItemSeparator = () => <View style={styles.separator} />;
    return (
        <View>
          <View>
            <Text>Accounts</Text>
          </View>
          <View>
            <FlatList data={list} ItemSeparatorComponent={ItemSeparator} renderItem={({item, index}) =>{
              return (
                <TouchableOpacity style={[styles.item, {backgroundColor: '#a8a29e'}]} onPress={()=> props.navigation.navigate('StockAsset', {accountID: item.account_id, accessToken: item.access_token, transactions: transactions[item.account_id]}) }>
                  
                  <View style={styles.row}>
                    <Text style={styles.name}>{item.name} - </Text>
                    <Text style={styles.ins_name}>{item.institution_name} - £{item.balance}</Text>
                  </View>

                  {transactions[item.account_id] && 
                    <LineChartScreen 
                      transactions={transactions[item.account_id]}
                      graph_version={2}
                      height={75}
                      width={350}
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
        fontSize: 18,
      },
      separator: {
        height: 1,
        backgroundColor: "#3f3f46",
      },
    });


export default SuccessComponent;