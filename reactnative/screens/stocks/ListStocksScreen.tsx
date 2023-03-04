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


const SuccessComponent = (props) => {
    const [data, setData] = useState(null);
    const [list, setList] = useState()
    const isFocused = useIsFocused()

      useEffect(() => {
        const listAccounts = async () => {

          await fetch(api_url + '/stocks/list_accounts/', {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
            },
          }).then(async (res) => setList(await res.json()))};
        if(isFocused){listAccounts()}
      }, [isFocused])
    return (
        <View>
          <View>
            <Text>Accounts</Text>
          </View>
          <View>
            <FlatList data={list} renderItem={({item, index}) =>{
              return (
                <TouchableOpacity style={[styles.item, {backgroundColor: 'red'}]} onPress={()=> props.navigation.navigate('StockAsset', {accountID: item.account_id, accessToken: item.access_token}) }>
                  <View style={styles.row}>
                    <Text style={styles.name}>{item.name} - </Text>
                    <Text style={styles.ins_name}>{item.institution_name} - £{item.balance}</Text>
                  </View>
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
        color: "white",
        fontWeight: 'bold',
        fontSize: 21,
      },
      ins_name:{
        color: "white",
        fontSize: 18,
      }
    });


export default SuccessComponent;