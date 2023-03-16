import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
  } from "react-native";
import React, {useEffect, useState, useCallback} from "react";
import getCryptoIcon from "../crypto_wallet/icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import { api_url } from "../../authentication";
import * as SecureStore from 'expo-secure-store';
  
export default function ExchangeAsset(props) {
  
  //const [cryptoValue, setCryptoValue] = useState(0); {/* Display `-` if not retrievable */}
  const {dark, colors, setScheme} = useTheme();
  // const [balances, setBalances] = useState([]);
  
  const styles = StyleSheet.create({
    exchangeAsset: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      flexDirection: "row",
    },
    exchangeAssetTitle: {
      fontWeight: "700",
      flex: 1,
    },
    exchangeAssetImage: {
      width: 30,
      height: 30,
    },
  });
    
  // let getBalances = useCallback(async () => {
  //   try {
  //     const response = await fetch(api_url + `/crypto-exchanges/get_exchange_balances/`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
  //       },
  //     });
  //     let data = await response.json();
  //     setBalances(data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }, []);

  // useEffect(() => {
  //   getBalances();
  // }, [getBalances]);
  
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          props.navigation.navigate("ExchangeTransactions",
            { item: props.item, removeExchange: props.removeExchange})
        }
      >
        <View style={[styles.exchangeAsset, {backgroundColor: colors.primary}]}>
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              paddingRight: 10,
            }}
          >
            <Image
              style={styles.exchangeAssetImage}
              source={getCryptoIcon(props.item.crypto_exchange_name)}
            />
          </View>
  
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View style={{}}>
              <Text style={{ fontSize: 25, fontWeight: "700", color: colors.background }}>
                {props.item.crypto_exchange_name}
              </Text>
  
              {props.balances.length == 0 ? (
                <Text style={[styles.exchangeAssetTitle, {color: colors.background}]}>Total Balance: £Loading...</Text>
              ) : (
                <Text style={[styles.exchangeAssetTitle, {color: colors.background}]}>
                  Total Balance: £{props.balances.find(balance => balance.id === props.item.id)?.y || '0'}
                </Text>
              )}
            </View>
  
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }