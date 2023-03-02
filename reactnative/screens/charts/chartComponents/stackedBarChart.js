import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';


import { StackedBarChart } from "react-native-chart-kit";

import fixture from "../../charts/chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

import {auth_get} from '../../../authentication'



export default function StackedChart({ navigation }) {
  const [baseData, setBaseData ] = useState(fixture)
  const {dark, colors, setScheme} = useTheme();
  const [data, setNewData] = useState(baseData.all);
  const [pressed, setPressed ] = useState(false)
  const isFocused = useIsFocused()

  // Uncomment to show bank data from backend

  useEffect(() =>{
    const fetchData = async () => {
        const response = await auth_get('/graph_data/')
        console.log('fetch graph data', response.status)
        if (response.status == 200){
          setBaseData(response.body)
          setNewData(response.body.all)
          setPressed(false)
        }
      }
      if(isFocused){fetchData()}

  }, [isFocused])


  const handlePressIn = (event, datapoint) => {
    if (pressed){
      setNewData(baseData.all)
    }
    else{
      const dataPoint = data[datapoint.index];
      if (baseData[dataPoint.x]){
        setNewData(baseData[dataPoint.x]);
      }
      else{
        setNewData(baseData.all.filter((val) => val.x.match(dataPoint.x)));
      }
    }
    setPressed(!pressed)
  };

  let value = 0;
  data.forEach(jsonObj => {
    value += jsonObj.y;
  });
  value = value.toFixed(2)

  const list = data.map(val => val.x);
  const colours = ["pink", "turquoise", "lime", "#FA991C"];

  let spacing = list.length * 60;
  const stackChartData = {
    labels: ["Crypto-Wallets","Bank","Stocks","Crypto-Exchange"],
    // legend: ["Bank", "Crypto", "Stocks", "Other"],
    data: [
      //map through the data and get the y value for each x value
      data.map((val) => val.y),
    ],
    barColors: ["pink", "turquoise", "lime", "yellow"],
  };
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
          // events={[
          //   {
          //     // target: "data",
          //     // eventHandlers: {
          //     //   onPressIn: handlebarPressIn,
          //     },
          //   },
          // ]}
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
  button: {
    width: "75%",
    borderRadius: 25,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize:  30,
  },
});
