import { elements } from 'chart.js';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableHighlight, TouchableOpacity, Alert } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
  Sector
} from "react-native-chart-kit";

import { VictoryPie, VictoryTheme } from "victory-native";

import data from "./data.json"


export default function PieChartWallet({ navigation, onDataPointClick }) {


  const handlePressIn = (event, datapoint) => {
    const dataPoint = data[datapoint.index];
    Alert.alert(dataPoint.x);
  };

  return (
    <View style={styles.container}>
      <TouchableHighlight style={styles.button}> 
        <Button title="Switch Chart" onPress={() => navigation.navigate('Bar Chart')} />
      </TouchableHighlight>
      <VictoryPie
        data={data}
        events={[{
          target: "data",
          eventHandlers: {
            onPressIn: handlePressIn
          }
        }]}
        colorScale="cool"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

