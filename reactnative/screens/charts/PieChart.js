
import React from 'react';
import { StyleSheet, Text, ScrollView, Alert, TouchableOpacity, View } from 'react-native';


import { VictoryPie } from "victory-native";

import data from "./chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

import Icon from 'react-native-vector-icons/AntDesign';


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
      <TouchableOpacity
        onPress={() => navigation.navigate('Bar Chart')}
        testID="Switch Chart"
      >
        <Text style={styles.button}><Icon name='barchart' size={30}/> Switch Chart</Text>
      </TouchableOpacity>
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

