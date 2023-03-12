import { View, Text, TouchableOpacity,StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { FlatList, ScrollView } from 'react-native-gesture-handler';
import { api_url } from '../../authentication';
import { useTheme } from "reactnative/src/theme/ThemeProvider";
import { styles } from "reactnative/screens/All_Styles.style.js";

export default function TransactionData({ route, navigation }){
    const isFocused = useIsFocused()
    const [data, setTransactions] = useState()
    const {dark, colors, setScheme } = useTheme();

    const stylesInternal = StyleSheet.create({
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
    });

    useEffect(() => {
        const getTransaction = async (id) => {
          await fetch(api_url + `/stocks/get_transaction/${id}/`, {
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


    return (
      <ScrollView style={[styles(dark, colors).container, {padding: 20}]}>
        {/* <Text style={stylesInternal.text}>Transaction Data{"\n"}</Text> */}

        {data ? (
          <View>
            <Text style={[styles(dark, colors).textBold, {color: colors.primary}]}>Name</Text>
            <Text style={styles(dark, colors).text}>{data.name}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.primary}]}>Transaction ID</Text>
            <Text style={styles(dark, colors).text}>{data.investment_transaction_id}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.primary}]}>Stock ID</Text>
            <Text style={styles(dark, colors).text}>{data.stock}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.primary}]}>Amount</Text>
            <Text style={styles(dark, colors).text}>£ {data.amount}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.primary}]}>Date</Text>
            <Text style={styles(dark, colors).text}>{data.date}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.primary}]}>Quantity</Text>
            <Text style={styles(dark, colors).text}>{data.quantity}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.primary}]}>Price</Text>
            <Text style={styles(dark, colors).text}>£ {data.price}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.primary}]}>Fees</Text>
            <Text style={styles(dark, colors).text}>£ {data.fees}{"\n"}</Text>
          </View>
        ):(<Text style={styles(dark, colors).text}>Loading...</Text>)}

        {/* <Text>{JSON.stringify(data)}</Text> */}
      </ScrollView>
  );
    
}