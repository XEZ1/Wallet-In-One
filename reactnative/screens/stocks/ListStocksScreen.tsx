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
    const [list, setList] = useState()
    const isFocused = useIsFocused()
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
            {/* <Text>Accounts</Text> */}
          </View>
          <View>
            <FlatList data={list} ItemSeparatorComponent={() => <View style={{height: 8}} />} renderItem={({item, index}) =>{
              return (
                
                <TouchableOpacity style={[styles.item, {backgroundColor: '#fafafa'}]} onPress={()=> props.navigation.navigate('StockAsset', {
                    accountID: item.account_id, 
                    accessToken: item.access_token, 
                    transactions: transactions[item.account_id],
                    logo: item.institution_logo,
                    balance: item.balance
                  }) }>

                  <View style={styles.row}>
                  {item.institution_logo !== null && 
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={{ uri: `data:image/png;base64,${item.institution_logo}` }}
                    />
                  }

                  {item.institution_logo === null && 
                    <Image
                      style={{ width: 40, height: 40 }}
                      source={{ uri: 'https://kriptomat.io/wp-content/uploads/t_hub/usdc-x2.png' }}
                    />
                  }
                    <View style={{flexDirection: "column", flex: 1}}>
                      <Text style={styles.name}>  {item.name}</Text>
                      <Text style={[styles.ins_name, {fontSize: 11}]}>   {item.institution_name} • {item.balance_currency}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[styles.ins_name, {fontWeight: 'bold', fontSize: 14, height: 19}]}>£{parseInt(item.balance)}</Text>
                      <View style={{height: 16}}>
                        <Text style={[styles.ins_name, { fontSize: 12}]}>.{(item.balance).toString().split('.')[1]}</Text>
                      </View>
                    </View>

                  </View>

                  {transactions[item.account_id] && 
                    <LineChartScreen 
                      transactions={transactions[item.account_id]}
                      stockAccountBalance={item.balance}
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
        fontSize: 16,
        fontFamily: 'sans-serif',
      },
      ins_name:{
        color: "black",
        fontSize: 15,
        fontFamily: 'sans-serif',
      },
      separator: {
        height: 1,
        backgroundColor: "#3f3f46",
      },
    });


export default SuccessComponent;