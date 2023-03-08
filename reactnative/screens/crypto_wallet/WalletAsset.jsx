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
import getCryptoIcon from "./icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

export default function WalletAsset(props) {

  const [cryptoValue, setCryptoValue] = useState(0); {/* Display `-` if not retrievable */}
  const {dark, colors, setScheme} = useTheme();

  const styles = StyleSheet.create({
    walletAsset: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      flexDirection: "row",
    },
    walletAssetTitle: {
      fontWeight: "700",
      flex: 1,
    },
    walletAssetImage: {
      width: 30,
      height: 30,
    },
  });
  

  const getCryptoValue = async () => {
    await fetch(`https://min-api.cryptocompare.com/data/price?fsym=${props.item.symbol}&tsyms=GBP`)
      .then((res) => res.json())
      .then((res) => res.GBP)
      .then((res) => setCryptoValue(res))
      .catch((err) => console.log(err))
  }

  useEffect(() => {
    getCryptoValue();
  }, []);


  return (
    <TouchableOpacity
      onPress={() =>
        props.navigation.navigate("WalletAssetDetail",
          { item: props.item, value: cryptoValue * props.item.balance, removeWallet: props.removeWallet })
      }
    >
      <View style={[styles.walletAsset, {backgroundColor: colors.primary}]}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingRight: 10,
          }}
        >
          <Image
            style={styles.walletAssetImage}
            source={getCryptoIcon(props.item.symbol)}
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
              {props.item.cryptocurrency}
            </Text>
            <Text style={[styles.walletAssetTitle, {color: colors.background}]}>
              {props.item.balance} {props.item.symbol}
            </Text>

            <Text style={[styles.walletAssetTitle, {color: colors.background}]}>£{cryptoValue * props.item.balance}</Text>
            {/* ▲ 0.00% */}
          </View>

        </View>
      </View>
    </TouchableOpacity>
  );
}