
import React from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions, Button, TouchableHighlight, Alert } from 'react-native';


import { VictoryPie } from "victory-native";

import data from "./chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

export default function PieChartWallet({ navigation }) {

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
        <Button title="Switch Chart" onPress={() => navigation.navigate('Bar Chart')} />
      </TouchableHighlight>
      <VictoryPie
        data={data}
        padding={{left: 50, right: 85}}
        style={{
          labels: {fill: colors.text}
        }}
        events={[{
          target: "data",
          eventHandlers: {
            onPressIn: handlePressIn
          }
        }]}
        colorScale={["red", "blue", "green", "yellow"]}
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
  amountText:{
    fontWeight: '900',
    fontSize: 25,
    textAlign: 'left',
  }
});

