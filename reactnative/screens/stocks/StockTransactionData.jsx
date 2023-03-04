import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { FlatList } from 'react-native-gesture-handler';

export default function TransactionData({ route, navigation }){
    const isFocused = useIsFocused()
    const [data, setTransactions] = useState()

    useEffect(() => {
        const getTransaction = async (id) => {
          await fetch(`http://10.0.2.2:8000/stocks/get_transaction/${id}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
            },
          }).then(async (res) => setTransactions(await res.json()))
          // .catch((error) => {
          //   console.error(error);
          // });
        };
        if(isFocused){getTransaction(route.params.id);}
    }, [isFocused])


      console.log(JSON.stringify(data))
      return(
        <View>
            <Text>{JSON.stringify(data)}</Text>
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