import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';

export default function BinanceCredentials({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://10.0.2.2:8000/binance-credentials/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ api_key: apiKey, secret_key: secretKey }),
      });
      const data = await response.json();
      console.log(data);
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