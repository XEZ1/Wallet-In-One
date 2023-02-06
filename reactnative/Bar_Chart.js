import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableHighlight, Alert } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

import { VictoryBar, VictoryChart, VictoryTheme } from "victory-native"

import data from './data.json'

export default function BarChartWallet({ navigation }) {

  const handlePressIn = (event, datapoint) => {
    const dataPoint = data[datapoint.index];
    Alert.alert(dataPoint.x);
  };

  return (
    <View style={styles.container}>
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
      backgroundColor: 'red',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });