import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import {styles} from 'reactnative/screens/All_Styles.style.js'
import { api_url } from '../../authentication';

export default function GateioCredentials({ navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const {dark, colors, setScheme} = useTheme();

  const handleSubmit = async () => {
    if (!apiKey || !secretKey) {
      Alert.alert('Error', 'Please enter both API Key and Secret Key.');
      return;
    }

    try {
      const response = await fetch(api_url + '/crypto-exchanges/gateio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
        body: JSON.stringify({ api_key: apiKey, secret_key: secretKey }),
      });
      const data = await response.json();
      const statusCode = response.status;
      if (statusCode == 200) {
        Alert.alert('Success', 'Gateio account data retrieved successfully!', [
          {
            text: 'OK',
            onPress: () => {
            navigation.reset({
              index: 0,
              routes: [{ name: 'Crypto Wallets & Exchanges' }],
            });
            navigation.navigate('Crypto Wallets & Exchanges');
          }}
        ]);
      } else {
        Alert.alert('Error', data["error"]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while retrieving Gateio account data.');
    }
  };

  const stylesInternal = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 25,
      color: colors.text,
    },
    text: {
      fontSize: 20,
      marginBottom: 10,
      color: colors.text,
    },
  });
  
  return (
    <View style={{ padding: 20, backgroundColor:colors.background, flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Text style={stylesInternal.title}>Gateio Credentials:</Text>
      </View>
      <Text style={stylesInternal.text}>API Key:</Text>
      <TextInput 
        value={apiKey} 
        onChangeText={setApiKey} 
        style={styles(dark, colors).input} 
      />
      <Text style={stylesInternal.text}>Secret Key:</Text>
      <TextInput 
        value={secretKey} 
        onChangeText={setSecretKey} 
        secureTextEntry 
        style={styles(dark, colors).input} 
      />
      <Button 
        title="Submit" 
        onPress={handleSubmit} 
        color= {colors.primary}
        backgroundColor='#FFFF00'
        buttonStyle={{ borderRadius: 20 }} 
      />
    </View>
  );
}