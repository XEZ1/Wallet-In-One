import { View, Text, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useIsFocused } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';

export default function StockAsset({ route, navigation }){
    const isFocused = useIsFocused()
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

    useEffect(() => {
        console.log(route.params.accessToken)
        const getStocks = async () => {
            await fetch('http://10.0.2.2:8000/stocks/get_stocks/', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
              },
              body: JSON.stringify({ access_token: route.params.accessToken }),
            }).then(async (res) => setStocks(await res.json()))};
        if(isFocused){getStocks()}
      }, [isFocused])

    return(
    <View>
        <Text>{JSON.stringify(stocks)}</Text>
        <TouchableOpacity onPress={async ()=> {await deleteAccount(), navigation.navigate('Stock Account List')}}>
            <Text>REMOVE</Text>
        </TouchableOpacity>
    </View>

    );
}