
import React, { useState } from 'react';
import { StyleSheet, Text, ScrollView, Alert } from 'react-native';


import { VictoryPie, VictoryBar, VictoryLabel } from "victory-native";

import fixture from "./chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

import Svg from 'react-native-svg'

export default function HomePage({ navigation }) {

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

  if(value == 0){
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
      <Text style={[styles.amountText, {color: colors.text}]}>Connect your Wallets to See your Funds!</Text>
      </ScrollView>
    );
  }
  else{

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
      {/* <Text style={[styles.title, {color: colors.text}]}>Wallet-In-One</Text>
      <Text style={[styles.amountText, {color: colors.text}]}>Amount: £{value}</Text> */}
      <Svg height="60%" width="100%" viewBox="0 0 100 100">
      <VictoryPie
        data={data}
        innerRadius={120}
        padAngle={2}
        labels={() => null}
        events={[{
          target: "data",
          eventHandlers: {
            onPressIn: handlePressIn
          }
        }]}
        colorScale={colours}
      />
      <VictoryLabel
          textAnchor="middle"
          style={{fontSize: 3, fill: colors.text}}
          x={50} y={37}
          text= {"Net Worth"}
      />
      <VictoryLabel
          textAnchor="middle"
          style={{fontSize: 7, fontWeight: '700', fill: colors.text}}
          x={50} y={43}
          text= {"£" + value}
      />
      <VictoryLabel
          textAnchor="middle"
          style={{fontSize: 3, fill: colors.text}}
          x={50} y={59}
          text= {"Assets"}
      />
      <VictoryLabel
          textAnchor="middle"
          style={{fontSize: 7, fontWeight: '700', fill: colors.text}}
          x={50} y={65}
          text= {data.length}
      />
      </Svg>

      <VictoryBar
        horizontal={true}
        style={{ data:  { fill: ({ datum }) => colours[list.indexOf(datum.x)] }}}
        data={data}
        barWidth={18}
        padding={40}
        labels={({ datum }) => datum.x}
        labelComponent={<VictoryLabel dy={-20} x={30} style={{ fontSize: 22, fontWeight: '900', fill: colors.text}} />}
        height={spacing}
        events={[{
          target: "data",
          eventHandlers: {
            onPressIn: handlePressIn
          }
        }]}
      />
    </ScrollView>
  );
}
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
});

