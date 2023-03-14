import React, { useState } from "react";
import {
  ActivityIndicator,
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
import coins from './blockchains.json'


export default function WalletConnector(props) {
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
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

        {
          loading ?
            <ActivityIndicator size="large" color={colors.primary}/>
            :
            <Button
              title="Connect Wallet"
              onPress={() => {
                  setLoading(true);
                  connectWallet(cryptocurrency, symbol, address)
                    .then(() => props.navigation.reset({
                      index: 0,
                      routes: [{name: 'Crypto Wallets & Exchanges'}],
                    }))
                    .then(() => props.navigation.navigate("Crypto Wallets & Exchanges"))
                }
              }
            />
        }
      </View>
    </View>
  );
}
