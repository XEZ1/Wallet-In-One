import React, {useEffect} from "react";
import {
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
} from "react-native";
import useCryptoWallet from "../crypto_wallet/useCryptoWallet";
import {useTheme} from 'reactnative/src/theme/ThemeProvider'
import exchanges from './exchanges.json'
import {styles} from 'reactnative/screens/All_Styles.style.js';
import blockchains from "./blockchains.json";
import getCryptoIcon from "./icons/icon";


export default function CryptoConnector(props) {

  const {connectWallet} = useCryptoWallet();
  const {dark, colors, setScheme} = useTheme();

  const stylesInternal = StyleSheet.create({
    asset: {
      padding: 10,
      marginVertical: 5,
      borderRadius: 10,
      flexDirection: "row",
    },
    assetImage: {
      width: 30,
      height: 30,
    },
  });

  return (
    <ScrollView style={[styles(dark, colors).container, {padding: 20}]}>

      <View style={{flexDirection: "row", alignItems: "center"}}>
        <View style={{flex: 1, flexDirection: "column"}}>
          <Text style={[styles(dark, colors).largeTextBold, {alignSelf: "center"}]}>Connect Wallet</Text>
        </View>
      </View>

      {
        blockchains.map((blockchain) =>

          <TouchableOpacity
            key={blockchain.symbol}
            onPress={() => props.navigation.navigate("WalletConnector",
              {connectWallet: connectWallet, cryptocurrency: blockchain.name, symbol: blockchain.symbol})}
          >
            <View style={[stylesInternal.asset, {backgroundColor: colors.primary}]}>
              <View style={{alignItems: "center", justifyContent: "center", paddingRight: 10}}>
                <Image style={stylesInternal.assetImage} source={getCryptoIcon(blockchain.symbol)}/>
              </View>
              <Text style={{fontSize: 25, fontWeight: "700", color: colors.text}}>
                {blockchain.name}
              </Text>
            </View>
          </TouchableOpacity>
        )
      }

      <View style={{flexDirection: "row", alignItems: "center"}}>
        <View style={{flex: 1, flexDirection: "column"}}>
          <Text style={[styles(dark, colors).largeTextBold, {alignSelf: "center"}]}>Connect Exchange</Text>
        </View>
      </View>

      {
        exchanges.map((exchange) =>
          <TouchableOpacity
            key={exchange.name}
            onPress={() => props.navigation.navigate('Exchange Credentials', {exchange: exchange.name})}
          >
            <View style={[stylesInternal.asset, {backgroundColor: colors.primary}]}>
              <View style={{alignItems: "center", justifyContent: "center", paddingRight: 10}}>
                <Image style={stylesInternal.assetImage} source={getCryptoIcon(exchange.name)}/>
              </View>
              <Text style={{fontSize: 25, fontWeight: "700", color: colors.text}}>
                {exchange.name}
              </Text>
            </View>
          </TouchableOpacity>)
      }

    </ScrollView>
  );
}
