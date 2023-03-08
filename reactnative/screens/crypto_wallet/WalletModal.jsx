import React, { useState } from "react";
import {
  Button, Image,
  Modal,
  Pressable, ScrollView,
  StyleSheet,
  Text,
  TextInput, TouchableOpacity, TouchableWithoutFeedback,
  View,
} from "react-native";
import {createStackNavigator} from "@react-navigation/stack";
import getCryptoIcon from "./icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import {styles} from 'reactnative/screens/All_Styles.style.js';
import coins from './coins.json'

const Stack = createStackNavigator();

export function WalletSelector(props) {

  const { connectWallet } = props.route.params;
  const {dark, colors, setScheme} = useTheme();

  const stylesInternal = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
    },
    cryptoItem: {
      padding: 10,
      margin: 10,
      borderRadius: 10,
      alignItems: "center",
      justifyContent: 'center',
      backgroundColor: colors.primary,
    },
  });

  return(
    <ScrollView style={[styles(dark, colors).container, {paddingTop: 30}]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Pressable onPress={() => props.navigation.navigate("Wallets")}>
            <Text style={[styles(dark, colors).backArrow, {position: "absolute", paddingLeft: 10}]}>←</Text>
          </Pressable>
          <Text style={[styles(dark, colors).largeTextBold, {alignSelf: "center"}]}>Connect Wallet</Text>
        </View>
      </View>

      <View style={{flex: 1}}>
        {
          coins.map((coin) =>
            <TouchableOpacity
              key={coin.symbol}
              onPress={() => props.navigation.navigate("WalletConnector", {connectWallet: connectWallet, cryptocurrency: coin.name, symbol: coin.symbol})}
            >
              <View style={[stylesInternal.cryptoItem]}>
                <Image
                  style={{width: 64, height: 64}}
                  source={getCryptoIcon(coin.symbol)}
                />
                <Text style={[styles(dark, colors).textBold, {fontSize: 20}]}>{coin.name}</Text>
              </View>
            </TouchableOpacity>
          )

        }
      </View>

    </ScrollView>
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
            <Pressable onPress={() => props.navigation.navigate("Wallets")}>
              <Text style={[styles(dark, colors).backArrow, {position: "absolute", paddingLeft: 10}]}>✗</Text>
            </Pressable>
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
              .then(() => props.navigation.navigate("Wallets"))
          }
        />
      </View>
    </View>
  );
}
