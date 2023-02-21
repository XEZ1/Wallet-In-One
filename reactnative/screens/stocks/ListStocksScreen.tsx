import React, {useState, useEffect, useCallback} from 'react';
import {
  Text,
  View,
  ToastAndroid,
  Platform,
  Alert,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SuccessComponent = () => {
    const [data, setData] = useState(null);
    const [list, setList] = useState()

      useEffect(() => {
        const listAccounts = async () => {

          fetch('http://10.0.2.2:8000/stocks/list_accounts/', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
            },
          }).then(async (res) => setList(await res.json()))};
        listAccounts()
      })
    return (
        <View>
          <View>
            <Text>Balance Response</Text>
          </View>
          <View>
            <Text>
                {
                  JSON.stringify(list)
                }
            </Text>
          </View>
        </View>
      );
    };



export default SuccessComponent;