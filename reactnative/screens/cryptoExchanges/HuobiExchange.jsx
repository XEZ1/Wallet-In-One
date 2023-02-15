import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from "expo-secure-store";

export default function HuobiCredentials({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleSubmit = async () => {
    if (!apiKey || !secretKey) {
      Alert.alert('Error', 'Please enter both API Key and Secret Key.');
      return;
    }

    try {
      const response = await fetch('http://10.0.2.2:8000/crypto-exchanges/huobi', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
        body: JSON.stringify({ api_key: apiKey, secret_key: secretKey }),
      });
      const data = await response.json();
      const statusCode = response.status;
      console.log(statusCode)
      if (statusCode == 200) {
        Alert.alert('Success', 'Huobi account data retrieved successfully!');
      } else {
        Alert.alert('Error', data["error"]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while retrieving Huobi account data.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Pressable onPress={() => navigation.navigate("Crypto exchanges")}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>Huobi Credentials:</Text>
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
