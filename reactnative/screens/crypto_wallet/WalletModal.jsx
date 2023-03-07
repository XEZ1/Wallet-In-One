import React, { useState } from "react";
import {
  Button, Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput, TouchableWithoutFeedback,
  View,
} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import getCryptoIcon from "./icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import {styles} from 'reactnative/screens/All_Styles.style.js';

const Stack = createStackNavigator();

export function WalletSelector(props) {

  const { connectWallet } = props.route.params;
  const {dark, colors, setScheme} = useTheme();

  const stylesInternal = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      alignItems: 'flex-start',
      alignSelf: "center",
      paddingTop: 20,
    },
    cryptoItem: {
      backgroundColor: '#e5e5e5',
      width: '40%',
      padding: 10,
      margin: 10,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
  });

  return(
    <View style={[styles(dark, colors).container, {paddingTop: 30}]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Text style={[styles(dark, colors).largeTextBold, {alignSelf: "center"}]}>Connect Wallet</Text>
        </View>
      </View>

      <View style={stylesInternal.container}>

        <TouchableWithoutFeedback 
          onPress={() => props.navigation.navigate("WalletConnector", {connectWallet: connectWallet, cryptocurrency: 'Bitcoin', symbol: 'BTC'})}
        >
          <View style={[stylesInternal.cryptoItem]}>
            <Image
              style={{width: 64, height: 64}}
              source={require(`./icons/BTC.png`)}
            />
            <Text style={[styles(dark, colors).textBold, {fontSize: 20}]}>Bitcoin</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate("WalletConnector", {connectWallet: connectWallet, cryptocurrency: 'Dogecoin', symbol: 'DOGE'})}
        >
          <View style={[stylesInternal.cryptoItem]}>
            <Image
              style={{width: 64, height: 64}}
              source={require(`./icons/DOGE.png`)}
            />
            <Text style={[styles(dark, colors).textBold, {fontSize: 20}]}>Dogecoin</Text>
          </View>
        </TouchableWithoutFeedback>

      </View>

      <Button title="Next" onPress={() => props.navigation.navigate("WalletConnector")} />

    </View>
  )
}


export function WalletConnector(props) {
  const [address, setAddress] = useState("");
  const { connectWallet, cryptocurrency, symbol } = props.route.params;
  const {dark, colors, setScheme} = useTheme();

  const stylesInternal = StyleSheet.create({
    input: {
      height: 40,
      width: '100%',
      borderWidth: 0.5,
      padding: 10,
      borderColor: 'gray',
      borderRadius: 5,
      marginTop: 5,
      marginBottom: 5,
    },
  });

  return (
    <View style={{flex:1, backgroundColor: colors.background}}>
      <View style={{ paddingTop: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Text style={[styles(dark, colors).largeTextBold, {alignSelf: "center"}]}>Connect Wallet</Text>
          </View>
        </View>

        <View style={{alignItems: "center", justifyContent: "center", paddingTop: 30}}>
          <Image
            style={{width: 100, height: 100}}
            source={getCryptoIcon(symbol)}
          />
          <Text style={{fontWeight: "800", fontSize: 30, alignSelf: "center", color: colors.text}}>{cryptocurrency}</Text>
        </View>

        <TextInput
          style={[styles(dark, colors).input, {color: colors.text}, {backgroundColor: colors.background}]}
          onChangeText={(text) => setAddress(text)}
          placeholderTextColor= {colors.text}
          placeholder="Wallet Address"
        />

        <Button
          title="Connect Wallet"
          onPress={() =>
            connectWallet(cryptocurrency, symbol, address)
              .then(() => props.navigation.reset({
                index: 0,
                routes: [{ name: 'Crypto Wallets & Exchanges' }],
              }))
              .then(() => props.navigation.navigate("Crypto Wallets & Exchanges"))
          }
        />
      </View>
    </View>
  );
}
