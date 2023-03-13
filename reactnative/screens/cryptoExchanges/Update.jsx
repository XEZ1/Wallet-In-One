import React, { useState } from 'react';
import { StyleSheet, Pressable, View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import { Ionicons } from '@expo/vector-icons';
import { api_url } from '../../authentication';


export default function UpdateCrypto({ navigation }) {
  const {dark, colors, setScheme} = useTheme();

  const handleSubmit = async () => {
    
    try {
      const response = await fetch(api_url + '/crypto-exchanges/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
        body: JSON.stringify({ }),
      });
      const data = await response.json();
      const statusCode = response.status;
      if (statusCode == 200) {
        Alert.alert('Success', 'updated account data successfully!');
      } else {
        Alert.alert('Error', data["error"]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while updating account info.');
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
    backArrow: {
      fontWeight: "900",
      fontSize: 30,
      marginRight: 10,
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
    refreshButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'red',
        borderRadius: 50,
        padding: 10,
      },
  });
  
  return (
    <View style={{ padding: 20, backgroundColor:colors.background, flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 20 }}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
      </View>
      <TouchableOpacity onPress={handleSubmit} style={styles.refreshButton}>
        <Ionicons name="refresh-outline" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}