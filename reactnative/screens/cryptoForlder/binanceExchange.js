import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from "expo-secure-store";

export default function BinanceCredentials({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = async () => {
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
      Alert.alert('Success', 'Binance account data retrieved successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while retrieving Binance account data');
    }
  };

  return (
    <View>
      <Text>API Key:</Text>
      <TextInput value={apiKey} onChangeText={setApiKey} />
      <Text>Secret Key:</Text>
      <TextInput value={secretKey} onChangeText={setSecretKey} secureTextEntry />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};