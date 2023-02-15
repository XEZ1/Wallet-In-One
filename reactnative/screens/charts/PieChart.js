
import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, Alert } from 'react-native';


import { VictoryPie, VictoryBar, VictoryLabel } from "victory-native";

import fixture from "./chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

export default function PieChartWallet({ navigation }) {

  const {dark, colors, setScheme} = useTheme();

  const [data, setNewData] = useState(fixture);

  const handlePressIn = (event, datapoint) => {
    const dataPoint = data[datapoint.index];
    setNewData(fixture.filter((val) => val.x.match(dataPoint.x)));
  };

  let value = 0;
  data.forEach(jsonObj => {
    value += jsonObj.y;
  });

  const list = data.map(val => val.x);
  const colours = ["red", "blue", "green", "purple"];

  let spacing = list.length * 60;

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
      <VictoryPie
        data={data}
        innerRadius={70}
        padAngle={3}
        labels={() => null}
        events={[{
          target: "data",
          eventHandlers: {
            onPressIn: handlePressIn
          }
        }]}
        colorScale={colours}
      />

      <VictoryBar
        horizontal={true}
        style={{ data:  { fill: ({ datum }) => colours[list.indexOf(datum.x)]  }}}
        data={data}
        barWidth={18}
        padding={40}
        labelComponent={<VictoryLabel dy={-20} x={30} style={{ fontSize: 25, fontWeight: '900' }} />}
        labels={({ datum }) => datum.x}
        height={spacing}
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
    fontSize: 40,
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

