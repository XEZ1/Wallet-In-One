import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, Dimensions, Button, TouchableHighlight } from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

import data1 from './data.json'

export default function BarChartWallet() {
  const data = {
    labels: ["crypto", "cards", "stocks"],
    datasets: [{
            data: [50, 45, 28],
            colors: [
                () => "red"
            ]}]
};
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <TouchableHighlight style={styles.button}> 
        <Button title="Switch Chart" onPress={() => navigation.navigate('Sign Up')} />
      </TouchableHighlight>
      <View>
      <BarChart
  data={data}
  width={Dimensions.get("window").width}
  height={220}
  chartConfig={{
    backgroundGradientFrom: "#1E2923",
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: "#08130D",
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false // optiona
  }}
  verticalLabelRotation={30}
/>
</View>
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