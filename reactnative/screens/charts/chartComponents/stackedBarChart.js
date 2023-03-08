import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, Dimensions, View, TouchableOpacity } from 'react-native';
import { VictoryChart, VictoryBar, VictoryLabel, VictoryAxis, VictoryStack } from "victory-native";


import { StackedBarChart } from "react-native-chart-kit";

import fixture from "../../charts/chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

export default function StackedChart({ data = fixture.all  }) {
  
  const {dark, colors, setScheme} = useTheme();

  const labels = ["Banks", "Cryptocurrency", "Stocks"]; // ["Crypto-Wallets","Bank","Stocks","Crypto-Exchange"]

  function extract(name){
  return name in data ? data[name].map(i => ({ x: i.x, y: i.y })) : []
}

  const stackChartData = {
    labels: labels,
    data: labels.map(name => extract(name)),
  };
  console.log('before:', data)
  console.log("real version:   ", JSON.stringify(data))
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

      <VictoryChart>
        <VictoryAxis
            tickValues={[1, 2, 3, 4]}
          tickFormat ={["Banks", "Cryptocurrency", "Stocks"]}
        />
        <VictoryAxis dependentAxis />
        <VictoryStack colorScale={["tomato", "orange", "gold"]}>
          {labels.map((name, index) => (
      <VictoryBar
        key={index}
        data={data[name]}

        y={(datum) => datum.y}
      />
    ))}
  {/*  <VictoryBar*/}
  {/*  data={[{x: "Banks", y: 2}, {x: "Cryptocurrency", y: 3}, {x: "Stocks", y: 5}]}*/}
  {/*/>*/}
  {/*<VictoryBar*/}
  {/*  data={[{x: "Banks", y: 1}, {x: "Cryptocurrency", y: 4}, {x: "Stocks", y: 5}]}*/}
  {/*/>*/}
  {/*<VictoryBar*/}
  {/*  data={[{x: "Banks", y: 3}, {x: "Cryptocurrency", y: 2}, {x: "Stocks", y: 6}]}*/}
  {/*/>*/}
        </VictoryStack>
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
  button: {
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:  30,
  },
});
