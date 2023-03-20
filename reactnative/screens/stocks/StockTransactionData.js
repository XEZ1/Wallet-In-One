import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { api_url } from '../../authentication';
import Map from './Map';

import { useTheme } from "reactnative/src/theme/ThemeProvider";
import { styles } from "reactnative/screens/All_Styles.style.js";
import Loading from '../banking/Loading';
import { auth_get } from '../../authentication';

export default function TransactionData({ route }){
    const isFocused = useIsFocused()
    const [data, setTransactions] = useState()
    const {dark, colors, setScheme } = useTheme();
    const[loading, setLoading] = useState(true);

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
        mapContainer: {
    height: '100%',
  },
    screen: {
    flex: 1,
    padding: 10,
  },
    transaction: {
    flex: 1,
  },
    });
  useEffect(() => {
    const getTransaction = async (id) => {
      response = await auth_get(`/stocks/get_transaction/${id}/`)
      if(response.status == 200){
        setTransactions(await response.body)
        setLoading(false)
      }
    };
    if (isFocused != false) {
      getTransaction(route.params.id);
    }
  }, [isFocused]);

  if(loading){
    return(<Loading/>)
  }
  else{
    return (
      <View style={stylesInternal.screen}>
        {/* <Text style={stylesInternal.text}>Transaction Data{"\n"}</Text> */}

          <View style={stylesInternal.screen}>
            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Name</Text>
            <Text style={styles(dark, colors).text}>{data.name}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Transaction ID</Text>
            <Text style={styles(dark, colors).text}>{data.investment_transaction_id}{"\n"}</Text>

            {/* <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Stock ID</Text>
            <Text style={styles(dark, colors).text}>{data.stock}{"\n"}</Text> */}

            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Amount</Text>
            <Text style={styles(dark, colors).text}>£ {data.amount.toFixed(2)}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Date</Text>
            <Text style={styles(dark, colors).text}>{data.date}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Quantity</Text>
            <Text style={styles(dark, colors).text}>{data.quantity}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Price</Text>
            <Text style={styles(dark, colors).text}>£ {data.price}{"\n"}</Text>

            <Text style={[styles(dark, colors).textBold, {color: colors.text}]}>Fees</Text>
            <Text style={styles(dark, colors).text}>£ {data.fees}{"\n"}</Text>
            <View style={{flex: 1}}>
            <View style={stylesInternal.mapContainer}>
            <Map latitude={data.latitude} longitude={data.longitude}/>
            </View>
            </View>
          </View>

        {/* <Text>{JSON.stringify(data)}</Text> */}
      </View>
  );
  }
    
}
