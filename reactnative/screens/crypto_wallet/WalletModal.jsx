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

const Stack = createStackNavigator();

export function WalletSelector(props) {

  const { connectWallet } = props.route.params;

  return(
    <View style={{flex:1, backgroundColor: 'white', paddingTop: 30}}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <View style={{ flex: 1, flexDirection: "column" }}>
          <Pressable onPress={() => props.navigation.navigate("Wallets")}>
            <Text style={styles.backArrow}>←</Text>
          </Pressable>
          <Text style={styles.title}>Connect Wallet</Text>
        </View>
      </View>

      <View style={styles.container}>

        <TouchableWithoutFeedback onPress={() => props.navigation.navigate("WalletConnector", {connectWallet: connectWallet})} >
          <View style={styles.cryptoItem}>
            <Image
              style={{width: 64, height: 64}}
              source={require(`./icons/BTC.png`)}
            />
            <Text style={{fontWeight: "700", fontSize: 20}}>Bitcoin</Text>
          </View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback onPress={() => props.navigation.navigate("WalletConnector")}>
          <View style={styles.cryptoItem}>
            <Image
              style={{width: 64, height: 64}}
              source={require(`./icons/BTC.png`)}
            />
            <Text style={{fontWeight: "700", fontSize: 20}}>Bitcoin</Text>
          </View>
        </TouchableWithoutFeedback>

      </View>

      <Button title="Next" onPress={() => props.navigation.navigate("WalletConnector")} />

    </View>
  )
}


export function WalletConnector(props) {
  const [address, setAddress] = useState("");
  const { connectWallet } = props.route.params;

  return (
    <View style={{flex:1, backgroundColor: 'white'}}>
      <View style={{ paddingTop: 30 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View style={{ flex: 1, flexDirection: "column" }}>
            <Pressable onPress={() => props.navigation.navigate("Wallets")}>
              <Text style={styles.backArrow}>✗</Text>
            </Pressable>
            <Text style={styles.title}>Connect Wallet</Text>
          </View>
        </View>

        <View style={{alignItems: "center", justifyContent: "center", paddingTop: 30}}>
          <Image
            style={{width: 100, height: 100}}
            source={require(`./icons/BTC.png`)}
          />
          <Text style={{fontWeight: "800", fontSize: 30, alignSelf: "center"}}>Bitcoin</Text>

        </View>

        <TextInput
          style={styles.input}
          onChangeText={(text) => setAddress(text)}
          placeholder="Wallet Address"
        />

        <Button
          title="Connect Wallet"
          onPress={() =>
            connectWallet(address)
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
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    marginHorizontal: 30,
    marginVertical: 10,
    padding: 10,
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
  }
});
