import React, {useState} from 'react';
import {Button, Modal, Pressable, StyleSheet, Text, TextInput, View} from "react-native";
import { authorize } from 'react-native-app-auth';

import {CLIENT_ID, CLIENT_SECRET} from "@env"
import * as SecureStore from "expo-secure-store";

export default function WalletModal(props) {


  // Deprecated
  async function login() {
    const USER_TOKEN = await fetch('https://api.vezgo.com/v1/auth/token', {
      method: 'POST',
      headers: {
        'loginName': 'test',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'clientId': CLIENT_ID,
        'secret': CLIENT_SECRET
      })
    })
      .then(res => res.json())
      .then(res => res.token)

    console.log(USER_TOKEN)

    const authorizeUrl = 'https://connect.vezgo.com/connect?client_id=1dr2cfg7ru4qsrtsqifck3d62d'
    const redirectUrl = 'reactnative://callback' // needs to be registered

    try {
      const result = await authorize({
        serviceConfiguration: {
          authorizationEndpoint: authorizeUrl,
          tokenEndpoint: authorizeUrl,
        },
        clientId: CLIENT_ID,
        redirectUrl,
        additionalParameters: {token: USER_TOKEN, lang: 'en'},
        skipCodeExchange: true,
      });

      const accountId = result.authorizationCode;
      console.log(accountId)

      fetch(`https://api.vezgo.com/v1/accounts/${accountId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${USER_TOKEN}`
        }
      })
        .then(res => res.json())
        .then(res => console.log(res))


    } catch (err) {
      if (err.message !== 'Connection closed by the user') console.log(err);
    }

  }


  // 1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71 <-- Test BTC address

  async function connect() {
    var test = await fetch('http://localhost:8000/crypto_wallets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${await SecureStore.getItemAsync('token')}`
      },
      body: JSON.stringify({
        'cryptocurrency': 'Bitcoin',
        'symbol': 'BTC',
        'address': address,
      })
    })
      .then(res => res.json())
      .then(res => props.setWallets([...props.wallets, res])) // Handle 400
      .then(() => props.setVisible(false))
      .catch(err => console.log(err))

  }

  const [address, setAddress] = useState("");


  return (
    <Modal
      animationType='slide'
      presentationStyle='pageSheet'
      visible={props.visible}>
      <View style={{ paddingTop: 30 }}>

        <View style={{ flexDirection:'row', alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Pressable onPress={() => props.setVisible(false)}>
              <Text style={styles.backArrow}>←</Text>
            </Pressable>
            <Text style={styles.title}>Connect Wallet</Text>
            <Text style={{alignSelf: 'center'}}>(Bitcoin Wallet)</Text>
          </View>
        </View>

        <TextInput
          style={styles.input}
          onChangeText={(text) => setAddress(text)}
          placeholder="Wallet Address" />

        <Button title="Connect Bitcoin Wallet" onPress={() => connect()} />

        <Button title="Connect Using Vezgo (Unused)" onPress={() => login()} />

      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  title: {
    fontWeight: '900',
    fontSize: 40,
    alignSelf: 'center',
  },
  backArrow: {
    fontWeight: '900',
    fontSize: 40,
    position: 'absolute',
    paddingLeft: 10,
  },
  input: {
    backgroundColor: '#e5e5e5',
    borderRadius: 10,
    margin: 30,
    padding: 10,
  }
});