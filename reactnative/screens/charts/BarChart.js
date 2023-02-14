import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, ScrollView, Alert, TouchableOpacity } from 'react-native';

import { VictoryBar, VictoryChart, VictoryTheme, VictoryAxis } from "victory-native"

import Icon from 'react-native-vector-icons/AntDesign';

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

      <TouchableOpacity
        onPress={() => navigation.navigate('Pie Chart')}
      >
        <Text style={styles.button}><Icon name='piechart' size={30}/> Switch Chart</Text>
      </TouchableOpacity>

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
    },
    button: {
      backgroundColor: 'red',
      color: 'black',
      width: "60%",
      borderRadius: 25,
      textAlign: 'center',
      fontWeight: 'bold',
      padding: "2%",
      fontSize:  30,
      alignSelf: 'center',
  }
  });