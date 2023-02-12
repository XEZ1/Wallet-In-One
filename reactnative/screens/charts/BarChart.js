import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, Button, TouchableHighlight, Alert } from 'react-native';

import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory-native"

import data from './chartData.json'
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

export default function BarChartWallet({ navigation }) {

  const {dark, colors, setScheme} = useTheme();

  const handlePressIn = (event, datapoint) => {
    const dataPoint = data[datapoint.index];
    Alert.alert(dataPoint.x);
  };

  let value = 0;
  data.forEach(jsonObj => {
    value += jsonObj.y;
  });

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow : 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20,
        backgroundColor: colors.background,
      }}
      style={styles.container}
    >
      <Text style={[styles.title, {color: colors.text}]}>Wallet-In-One</Text>
      <Text style={[styles.amountText, {color: colors.text}]}>Amount: £{value}</Text>

      <TouchableHighlight style={styles.button}> 
        <Button title="Switch Chart" onPress={() => navigation.navigate('Pie Chart')} />
      </TouchableHighlight>

      <VictoryChart
        theme={ VictoryTheme.material}
      >
        <VictoryAxis
          dependentAxis
          style={{
            axis: {stroke: colors.primary},
            tickLabels: {fill: colors.text},
            grid: {stroke: colors.primary},
          }}
        />
        <VictoryAxis
          style={{
            axis: {stroke: colors.primary},
            tickLabels: {fill: colors.text},
            grid: {stroke: colors.primary},
          }}
        />
        <VictoryBar
        data={data}
        style={{
          data: {fill: "blue"}
        }}
        events={[{
          target: "data",
          eventHandlers: {
            onPressIn: handlePressIn
          }
        }]}
        />
      </VictoryChart>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
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