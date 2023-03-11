import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, Dimensions, View, TouchableOpacity } from 'react-native';
import { VictoryChart, VictoryBar, VictoryLabel, VictoryAxis, VictoryStack } from "victory-native";


import { StackedBarChart } from "react-native-chart-kit";

import fixture from "../../charts/chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

export default function StackedChart({ data = fixture.all  }) {
  
  const {dark, colors, setScheme} = useTheme();

  const labels = ["Banks", "Cryptocurrency", "Stocks"]; // ["Crypto-Wallets","Bank","Stocks","Crypto-Exchange"]


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
      {/*domain={{ x: [1, 4] }}*/}
      <VictoryChart  domainPadding={{ x: 20, y: 20 }} >
        <VictoryAxis
          dependentAxis
          style={{
            axis: {stroke: colors.primary},
            tickLabels: {fill: colors.text},
            grid: {stroke: colors.primary},
          }}
        />
        <VictoryAxis
          tickValues={[ 1, 2, 3, 4 ,5]}
          fixLabelOverlap={true}
          style={{
            axis: {stroke: colors.primary},
            tickLabels: {fill: colors.text},
          }}
        />
        <VictoryStack colorScale={["tomato", "orange", "gold", "purple"]}>
          {(data['Banks']?data['Banks']:[]).map(i => (
            <VictoryBar
              key={i}
              data={[{ x: "Banks", y: i.y }]}
              barWidth={35}
            />
          ))}
          {(data['Cryptocurrency from wallets']?data['Cryptocurrency from wallets']:[]).map(i => (
            <VictoryBar
              key={i}
              data={[{ x: "Crypto from wallets ", y: i.y }]}
              barWidth={35}
            />
          ))}
          {(data['Cryptocurrency from exchanges']?data['Cryptocurrency from exchanges']:[]).map(i => (
            <VictoryBar
              key={i}
              data={[{ x: "Cryptocurrency from exchanges", y: i.y }]}
              barWidth={35}
            />
          ))}
          {(data['Stock Accounts']?data['Stock Accounts']:[]).map(i => (
            <VictoryBar
              key={i}
              data={[{ x: "Stock Accounts", y: i.y }]}
              barWidth={35}
            />
          ))}
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
