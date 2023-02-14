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

const Stack = createStackNavigator();

export function WalletSelector(props) {

  const { connectWallet } = props.route.params;
  const {dark, colors, setScheme} = useTheme();

  return(
    <View style={{flex:1, backgroundColor: colors.background, paddingTop: 30}}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Pressable onPress={() => props.navigation.navigate("Wallets")}>
            <Text style={[styles.backArrow, {color: colors.primary}]}>←</Text>
          </Pressable>
          <Text style={[styles.title, {color: colors.text}]}>Connect Wallet</Text>
        </View>
      </View>

      <View style={styles.container}>

        <TouchableWithoutFeedback 
          onPress={() => props.navigation.navigate("WalletConnector", {connectWallet: connectWallet, cryptocurrency: 'Bitcoin', symbol: 'BTC'})}
        >
          <View style={[styles.cryptoItem, {backgroundColor: colors.primary}]}>
            <Image
              style={{width: 64, height: 64}}
              source={require(`./icons/BTC.png`)}
            />
            <Text style={{fontWeight: "700", fontSize: 20, color: colors.text}}>Bitcoin</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPress={() => props.navigation.navigate("WalletConnector", {connectWallet: connectWallet, cryptocurrency: 'Dogecoin', symbol: 'DOGE'})}
        >
          <View style={[styles.cryptoItem, {backgroundColor: colors.primary}]}>
            <Image
              style={{width: 64, height: 64}}
              source={require(`./icons/DOGE.png`)}
            />
            <Text style={{fontWeight: "700", fontSize: 20, color: colors.text}}>Dogecoin</Text>
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

  return (
    <View style={{flex:1, backgroundColor: colors.background}}>
      <View style={{ paddingTop: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Pressable onPress={() => props.navigation.navigate("Wallets")}>
              <Text style={[styles.backArrow, {color: colors.text}]}>✗</Text>
            </Pressable>
            <Text style={[styles.title, {color: colors.text}]}>Connect Wallet</Text>
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
          style={[styles.input, {color: colors.text}, {backgroundColor: colors.background}]}
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

const styles = StyleSheet.create({
  title: {
    fontWeight: "900",
    fontSize: 40,
    alignSelf: "center",
  },
  backArrow: {
    fontWeight: "900",
    fontSize: 40,
    position: "absolute",
    paddingLeft: 10,
  },
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
  },
});
