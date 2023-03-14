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
import useCryptoWallet from "./useCryptoWallet";
import {useTheme} from 'reactnative/src/theme/ThemeProvider'
import exchanges from '../cryptoExchanges/exchanges.json'
import {styles} from 'reactnative/screens/All_Styles.style.js';
import blockchains from "./blockchains.json";
import getCryptoIcon from "./icons/icon";


export default function AddCryptoScreen(props) {

  const {wallets, fetchWallets, connectWallet, removeWallet} = useCryptoWallet();
  const {dark, colors, setScheme} = useTheme();

  const stylesInternal = StyleSheet.create({
    cryptoWalletTitle: {
      fontWeight: "900",
      fontSize: 40,
      alignSelf: "center",
      paddingVertical: 10,
    },
    backArrow: {
      fontWeight: "900",
      fontSize: 30,
      position: "absolute",
      marginLeft: 10,
    },
    walletList: {
      marginHorizontal: 10,
      marginVertical: 30,
    },
    container: {
      paddingHorizontal: 20,
      paddingTop: 20,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: colors.background,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 25,
      alignItems: 'center',
      textAlign: "center",
      color: colors.text,
    },
    button: {
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
      backgroundColor: colors.primary,
      alignSelf: 'center',
    },
    buttonText: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: colors.text,
    },
    cryptoItem: {
      padding: 10,
      margin: 10,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
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
            onPress={() => props.navigation.navigate("WalletConnector",
              {connectWallet: connectWallet, cryptocurrency: blockchain.name, symbol: blockchain.symbol})}
          >

            <View style={[stylesInternal.walletAsset, {backgroundColor: colors.primary}]}>

              <View style={{alignItems: "center", justifyContent: "center", paddingRight: 10}}>
                <Image style={stylesInternal.walletAssetImage} source={getCryptoIcon(blockchain.symbol)}/>
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
            style={[stylesInternal.button, {width: Dimensions.get('window').width - 40}]}
          >
            <Text style={stylesInternal.buttonText}>{exchange.name}</Text>
          </TouchableOpacity>)
      }

    </ScrollView>
  );
}