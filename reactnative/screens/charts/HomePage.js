import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { VictoryPie, VictoryBar, VictoryLabel, VictoryContainer } from "victory-native";

import fixture from "../charts/chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

import {auth_get} from '../../authentication'


export default function HomePage({ navigation }) {
  const [baseData, setBaseData ] = useState(fixture)
  const {dark, colors, setScheme} = useTheme();
  const [data, setNewData] = useState(baseData.all);
  const [pressed, setPressed ] = useState(false)
  
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
      fetchData()
  }, [])
  
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
      <VictoryContainer
      width={Dimensions.get('window').width}
      height={Dimensions.get('window').height/2}
      >    
      <VictoryPie
        data={data}
        innerRadius={100}
        padAngle={1}
        cornerRadius= {10}
        radius= {Dimensions.get('window').width/2.5}
        labels={() => null}
        events={[{
          target: "data",
          eventHandlers: {
            onPressIn: handlePressIn
          }
        }]}
        colorScale={colours}
        standalone={false}
        height={400}
      />
      <VictoryLabel
          textAnchor="middle"
          style={{fontSize: 22, fill: colors.text}}
          x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/5.5}
          text= {"Net Worth"}
      />
      <VictoryLabel
          textAnchor="middle"
          style={{fontSize: 22, fontWeight: '700', fill: colors.text}}
          x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/4.5}
          text= {"£" + value.toFixed(2)}
      />
      <VictoryLabel
          textAnchor="middle"
          style={{fontSize: 22, fill: colors.text}}
          x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/3.7}
          text= {"Assets"}
      />
      <VictoryLabel
          textAnchor="middle"
          style={{fontSize: 22, fontWeight: '700', fill: colors.text}}
          x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/3.25}
          text= {data.length}
      />
      </VictoryContainer>

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
    <TouchableOpacity
      onPress={()=>{setNewData(baseData.all);setPressed(false)}}
      >
        <Text style={styles.button} x={10}>Back</Text>
      </TouchableOpacity>
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

