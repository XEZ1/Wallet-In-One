import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
  } from "react-native";
  //import { LineChart } from "react-native-chart-kit";
  import React, {useEffect, useState} from "react";
  import getCryptoIcon from "../crypto_wallet/icons/icon";
  import { useTheme } from 'reactnative/src/theme/ThemeProvider'
  
  export default function ExchangeAsset(props) {
  
    const [cryptoValue, setCryptoValue] = useState(0); {/* Display `-` if not retrievable */}
    const {dark, colors, setScheme} = useTheme();
  
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
    
  
  
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          props.navigation.navigate("f",
            { item: props.item, value: crypto_exchange_name })
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
              source={getCryptoIcon("BTC")}
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
              {/* <Text style={[styles.exchangeAssetTitle, {color: colors.background}]}>
                {props.item.balance} {props.item.symbol}
              </Text> */}
  
              <Text style={[styles.exchangeAssetTitle, {color: colors.background}]}>£{cryptoValue * props.item.balance}</Text>
              {/* ▲ 0.00% */}
            </View>
  
          </View>
        </View>
      </TouchableWithoutFeedback>
    );
  }