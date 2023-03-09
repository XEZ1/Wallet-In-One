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

      <VictoryChart padding={{top: 20, bottom: 50, left: 50, right: 50}}>
        <VictoryAxis
            //tickValues={[1, 2, 3, 4]}
             // set the domain to include values up to 20
            fixLabelOverlap={false}
          tickFormat ={["Banks", "Cryptocurrency","Crypto-exchanges" ,"Stocks"]}
            height={2000}
            padding={{ top: 20, bottom: 60 }}
            width={400}
        />
        <VictoryAxis dependentAxis />
        <VictoryStack colorScale={["tomato", "orange", "gold"]}>
          {(data['Banks']?data['Banks']:[]).map(i => (
            <VictoryBar
              key={i}
              data={[{ x: "Banks", y: i.y }]}
            />
          ))}
          {(data['Cryptocurrency']?data['Cryptocurrency']:[]).map(i => (
            <VictoryBar
              key={i}
              data={[{ x: "Cryptocurrency", y: i.y }]}
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
