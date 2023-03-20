import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  ToastAndroid,
  Platform,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';
import { api_url } from '../../authentication';
import { Button, Image } from 'react-native';
import { auth_get } from '../../authentication';
import { useTheme } from "reactnative/src/theme/ThemeProvider";
import { styles } from "reactnative/screens/All_Styles.style.js";
import Loading from '../banking/Loading';


import LineChartScreen from '../charts/LineChart';

const SuccessComponent = ({ route, ...props }) => {
  const { scrollToLastItem } = route.params || {}; // default to empty object if params is undefined
    const [list, setList] = useState()
    const isFocused = useIsFocused()
    const [transactions, setTransactions] = useState({});
    const {dark, colors, setScheme } = useTheme();
    const [loading, setLoading] = useState(true)

    const {width: SIZE} = Dimensions.get('window');

    const stylesInternal = StyleSheet.create({
      item:{
        padding: 20,
        borderRadius: 10,
        backgroundColor: colors.stock_account,
        text: colors.text,
      },
      row:{
        flexDirection: 'row',
        alignItems: 'flex-start',
      },
      name:{
        color: colors.text,
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'sans-serif',
      },
      ins_name:{
        color: colors.text,
        fontSize: 15,
        fontFamily: 'sans-serif',
      },
      separator: {
        height: 1,
        backgroundColor: "#3f3f46",
      },
    });

      useEffect(() => {
        const listAccounts = async () => {
          const response = await auth_get('/stocks/list_accounts/')
          const accountList = response.body;
          setList(accountList);
          // if(list){
          //   list.forEach((account) => {
          //     getTransactions(account.account_id);
          //   });
          //   console.log(list)
          // }
          // console.log(transactions)
          // setLoading(false)

          // if (scrollToLastItem && list.length > 0) {
          //   const last = list[list.length - 1];
          //   // const transactions = await getTransactions(last.account_id);
          //   // console.log(transactions[last.account_id])

            
          //   props.navigation.navigate('StockAsset', {
          //     accountID: last.account_id, 
          //     accessToken: last.access_token, 
          //     transactions: transactions[last.account_id],
          //     logo: last.institution_logo,
          //     balance: last.balance,
          //     name: last.institution_name,
          //     account_name: last.name,
          //     balance_currency: last.balance_currency
          //   });
          // }
        }
        
        if (isFocused) {
          listAccounts();
        }        
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
          setLoading(false)
        }
      }, [isFocused, list, getTransactions]);


      const setData = (transaction, current_balance) => {
            let graph_data = transaction.map((item) => [item.amount, item.date]);
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
            return points
      }

      const ItemSeparator = () => <View style={stylesInternal.separator} />;
    if(loading){
      return(<Loading/>)
    }
    else{
    return (
        <View style={{ ...styles(dark, colors),paddingTop:8, paddingBottom: 8 }}>
          <View>
            <FlatList 
              data={list} 
              ItemSeparatorComponent={() => <View style={{height: 8}} />} 
              style={{paddingHorizontal:8}}
              renderItem={({item, index}) =>{
              return (
                <TouchableOpacity style={{ ...stylesInternal.item }}
                  onPress={()=> {
                      props.navigation.navigate('StockAsset', {
                      accountID: item.account_id, 
                      accessToken: item.access_token, 
                      transactions: transactions[item.account_id],
                      logo: item.institution_logo,
                      balance: item.balance,
                      name: item.institution_name,
                      account_name: item.name,
                      balance_currency: item.balance_currency
                    
                  })} }>

                  <View style={stylesInternal.row}>
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
                      <Text style={stylesInternal.name}>  {item.name}</Text>
                      <Text style={[stylesInternal.ins_name, {fontSize: 11}]}>   {item.institution_name} • {item.balance_currency}</Text>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text style={[stylesInternal.ins_name, {fontWeight: 'bold', fontSize: 14, height: 19}]}>£{parseInt(item.balance)}</Text>
                      <View style={{height: 16}}>
                        <Text style={[stylesInternal.ins_name, { fontSize: 12}]}>.{(item.balance).toString().split('.')[1]}</Text>
                      </View>
                    </View>

                  </View>

                  {transactions[item.account_id] && 
                    <LineChartScreen 
                      current_balance={item.balance}
                      graph_version={2}
                      height={75}
                      width={SIZE*0.85}
                      data={setData(transactions[item.account_id], item.balance)}
                  />}

                </TouchableOpacity>
              )
            }}
            ListEmptyComponent={<Text style={styles(dark, colors).text}>{'\nYou have no stock accounts\n'}</Text>}
            />
          </View>
        </View>
      );
    }
    };

export default SuccessComponent;