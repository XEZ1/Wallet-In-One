import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from "expo-secure-store";

export default function BinanceCredentials({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = async () => {
    if (!apiKey || !secretKey) {
      Alert.alert('Error', 'Please enter both API Key and Secret Key.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8000/crypto-exchanges/binance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
        body: JSON.stringify({ api_key: apiKey, secret_key: secretKey }),
      });
      const data = await response.json();
      console.log(data)
      Alert.alert('Success', 'Binance account data retrieved successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while retrieving Binance account data.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Pressable onPress={() => navigation.navigate("Crypto exchanges")}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Binance Credentials:</Text>
      </View>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>API Key:</Text>
      <TextInput 
        value={apiKey} 
        onChangeText={setApiKey} 
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }} 
      />
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Secret Key:</Text>
      <TextInput 
        value={secretKey} 
        onChangeText={setSecretKey} 
        secureTextEntry 
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }} 
      />
      <Button 
        title="Submit" 
        onPress={handleSubmit} 
        color="#808080"
        backgroundColor='#FFFF00'
        buttonStyle={{ borderRadius: 20 }} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 25,
  },
  backArrow: {
    fontWeight: "900",
    fontSize: 30,
    marginRight: 10,
  },
});
