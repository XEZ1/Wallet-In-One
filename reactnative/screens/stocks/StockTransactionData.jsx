import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler';

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
    return (
      <ScrollView style={styles.screen}>
        <Text style={styles.text}>Transaction Data{"\n"}</Text>

        {data ? (
          <View>
            <Text style={styles.text}>Name</Text>
            <Text>{data.name}{"\n"}</Text>

            <Text style={styles.text}>Transaction ID</Text>
            <Text>{data.investment_transaction_id}{"\n"}</Text>

            <Text style={styles.text}>Stock ID</Text>
            <Text>{data.stock}{"\n"}</Text>

            <Text style={styles.text}>Amount</Text>
            <Text>£ {data.amount}{"\n"}</Text>

            <Text style={styles.text}>Quantity</Text>
            <Text>{data.quantity}{"\n"}</Text>

            <Text style={styles.text}>Price</Text>
            <Text>£ {data.price}{"\n"}</Text>

            <Text style={styles.text}>Fees</Text>
            <Text>£ {data.fees}{"\n"}</Text>

            <Text style={styles.text}>Date</Text>
            <Text>{data.date}{"\n"}</Text>
          </View>
        ):(<Text>Loading...</Text>)}

        <Text>{JSON.stringify(data)}</Text>
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
  text: {
    fontWeight: 'bold',
  },
  screen: {
    padding: 20,
  }
});