import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, TextInput, Button, Alert } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import { BACKEND_URL } from "@env"


export default function ExchangeCredentials({ route, navigation }) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const {dark, colors, setScheme} = useTheme();
  const {exchange} = route.params;

  const handleSubmit = async () => {
    if (!apiKey || !secretKey) {
      Alert.alert('Error', 'Please enter both API Key and Secret Key.');
      return;
    }

    try {
      const response = await fetch(`http://10.0.2.2:8000/crypto-exchanges/${exchange.toLowerCase()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
        body: JSON.stringify({ api_key: apiKey, secret_key: secretKey }),
      });
      const data = await response.json();
      const statusCode = response.status;
      if (statusCode === 200) {
        Alert.alert('Success', `${exchange} account data retrieved successfully!`, [
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
      Alert.alert('Error', `An error occurred while retrieving ${exchange} account data.`);
    }
  };

  const styles = StyleSheet.create({
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    title: {
      fontSize: 25,
      color: colors.text,
    },
    input:{
      height: 40,
      width: '100%',
      borderWidth: 0.5,
      padding: 10,
      borderColor: 'gray',
      borderRadius: 5,
      marginTop: 5,
      marginBottom: 10,
      color: colors.text,
      backgroundColor: colors.background

    },
  });

  return (
    <View style={{ padding: 20, backgroundColor:colors.background, flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Text style={styles.title}>{exchange} Credentials:</Text>
      </View>
      <Text style={{ fontSize: 20, marginBottom: 10, color: colors.text }}>API Key:</Text>
      <TextInput
        value={apiKey}
        onChangeText={setApiKey}
        style={styles.input}
      />
      <Text style={{ fontSize: 20, marginBottom: 10, color: colors.text }}>Secret Key:</Text>
      <TextInput
        value={secretKey}
        onChangeText={setSecretKey}
        secureTextEntry
        style={styles.input}
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
