import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';

export default function StockAsset({ route, navigation }){
    const isFocused = useIsFocused()
    const [transactions, setTransactions] = useState()
    const [stocks, setStocks] = useState()

    const deleteAccount = async () => {
        const response = await fetch('http://10.0.2.2:8000/stocks/delete_account/', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Token ${await SecureStore.getItemAsync("token")}`
            },
            body: JSON.stringify({
                account_id: route.params.accountID
            }),
          });
    }
    console.log(route.params)

    useEffect(() => {
        const listTransactions = async (stock) => {
          await fetch(`http://10.0.2.2:8000/stocks/list_transactions/${stock}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
            },
          }).then(async (res) => setTransactions(await res.json()));
          await fetch(`http://10.0.2.2:8000/stocks/list_stocks/${stock}/`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
              },
            }).then(async (res) => setStocks(await res.json()));
          console.log(stocks)
          // .catch((error) => {
          //   console.error(error);
          // });
        };
        if(isFocused){listTransactions(route.params.accountID);}
    }, [isFocused])


      console.log(JSON.stringify(transactions))
    return(
      <View>
          <TouchableOpacity onPress={async ()=> {await deleteAccount(), navigation.navigate('Stock Account List')}}>
              <Text>REMOVE</Text>
          </TouchableOpacity>
          {/* <FlatList data={stocks} renderItem={({item, index}) =>{
            return (
              <TouchableOpacity style={[styles.item, {backgroundColor: 'red'}]}>
                <View style={styles.row}>
                  <Text style={styles.name}> {item.name} </Text>
                  <Text style={styles.ins_name}>{item.quantity}</Text>
                </View>
              </TouchableOpacity>
            )
          }}
          /> */}
          <FlatList data={stocks.concat(transactions)} renderItem={({item, index}) =>{
            return (
              <TouchableOpacity style={[styles.item, {backgroundColor: 'red'}]} onPress={()=> navigation.navigate('TransactionData', {id: item.id}) }>
                <View style={styles.row}>
                  <Text style={styles.name}> {item.name} </Text>
                  <Text style={styles.ins_name}> Hello World!</Text>
                </View>
              </TouchableOpacity>
            )
          }}
          ListEmptyComponent={<Text>{'\nYou have no stock accounts\n'}</Text>}
          />
      </View>

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
  }
});