import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, Dimensions, View, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';


import { StackedBarChart } from "react-native-chart-kit";

import fixture from "../../charts/chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

export default function StackedChart({ data = fixture.all }) {
  
  const {dark, colors, setScheme} = useTheme();

  const labels = ["Banks", "Cryptocurrency", "Stocks"] // ["Crypto-Wallets","Bank","Stocks","Crypto-Exchange"]
  
  function extract(name){
    return name in data ? data[name].map(i=>i.y) : []
  } 

  const stackChartData = {
    labels: labels,
    data: labels.map(name => extract(name)),
    barColors: ["pink", "turquoise", "lime", "yellow"],
  };

  console.log('before:', data)
  console.log("real version:    ", JSON.stringify(stackChartData))


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

      <StackedBarChart
          data={stackChartData}
          width={Dimensions.get("window").width} // from react-native
          height={220}
          yAxisLabel="£"
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726",
            },
          }}
          style={{
            marginVertical: 8,
          }}
        />

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
  button: {
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:  30,
  },
});
