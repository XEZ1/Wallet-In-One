import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableHighlight, Alert } from 'react-native';

import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native"

import data from './data.json'

export default function BarChartWallet({ navigation }) {

  const handlePressIn = (event, datapoint) => {
    const dataPoint = data[datapoint.index];
    Alert.alert(dataPoint.x);
  };

  let value = 0;
  data.forEach(jsonObj => {
    value += jsonObj.y;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet-In-One</Text>
      <Text style={styles.amountText}>Amount: £{value}</Text>
      <TouchableHighlight style={styles.button}> 
        <Button title="Switch Chart" onPress={() => navigation.navigate('Pie Chart')} />
      </TouchableHighlight>
      <VictoryChart
      theme={ VictoryTheme.material }
      >
      <VictoryBar
      data={data}
      events={[{
        target: "data",
        eventHandlers: {
          onPressIn: handlePressIn
        }
      }]}
      style={{ data: { fill: "blue"}}}
      />
      </VictoryChart>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFF00',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      fontWeight: '900',
      fontSize: 50,
      alignSelf: 'center',
      paddingVertical: 10,
    },
    amountText:{
      fontWeight: '900',
      fontSize: 25,
      textAlign: 'left',
    }
  });