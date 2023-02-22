import React, { useEffect, useState } from 'react';
import { Text, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { VictoryPie, VictoryBar, VictoryLabel, VictoryContainer } from "victory-native";

import fixture from "../charts/chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

import {auth_get} from '../../authentication'

import {styles} from 'reactnative/screens/All_Styles.style.js'


export default function HomePage({ navigation }) {
  const [baseData, setBaseData ] = useState(fixture);
  const {dark, colors, setScheme} = useTheme();
  const [data, setNewData] = useState(baseData.all);
  const [pressed, setPressed ] = useState(false)

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
  value = value.toFixed(2)

  const list = data.map(val => val.x);
  const colours = ["pink", "turquoise", "lime", "#FA991C"];

  let spacing = list.length * 60;

  if(value == 0){
    return (
      <ScrollView
      contentContainerStyle={{
        flexGrow : 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 20, 
      }}
      style={styles(dark, colors).container}
    >
      <Text style={styles(dark, colors).title}>Wallet-In-One</Text>
      <Text style={styles(dark, colors).text}>Amount: £{value}</Text>
      <Text style={styles(dark, colors).text}>Connect your Wallets to See your Funds!</Text>
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
        style={styles(dark, colors).container}
      >
        <VictoryContainer
        width={Dimensions.get('window').width}
        height={300}
        style= {{ paddingBottom: 10}}
        >    
        <VictoryPie
          data={data}
          innerRadius={100}
          padAngle={1}
          cornerRadius= {10}
          radius= {Dimensions.get('window').width/3}
          labels={() => null}
          events={[{
            target: "data",
            eventHandlers: {
              onPressIn: handlePressIn
            }
          }]}
          // animate={{
          //   duration: 2000,
          //   easing: "bounce"
          // }}
          colorScale={colours}
          standalone={false}
          height={300}
        />
        <VictoryLabel
            textAnchor="middle"
            style={styles(dark, colors).victoryLabelSmall}
            // x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/5.5}
            x={Dimensions.get('window').width/2} y={105}
            text= {"Net Worth"}
        />
        <VictoryLabel
            textAnchor="middle"
            style={styles(dark, colors).victoryLabelBig}
            // x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/4.5}
            x={Dimensions.get('window').width/2} y={125}
            text= {"£" + value}
        />
        <VictoryLabel
            textAnchor="middle"
            style={styles(dark, colors).victoryLabelSmall}
            // x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/3.7}
            x={Dimensions.get('window').width/2} y={165}
            text= {"Assets"}
        />
        <VictoryLabel
            textAnchor="middle"
            style={styles(dark, colors).victoryLabelBig}
            // x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/3.25}
            x={Dimensions.get('window').width/2} y={185}
            text= {data.length}
        />
        </VictoryContainer>

        <VictoryBar
          horizontal={true}
          style={{ data:  { fill: ({ datum }) => colours[list.indexOf(datum.x)] }}}
          data={data}
          barWidth={18}
          padding={40}
          labels={({ datum }) => "●"+ datum.x}
          labelComponent={
            <VictoryLabel 
              dy={-20}
              x={30}
              style={styles(dark, colors).victoryLabelBar}
            />
          }
          height={spacing}
          // animate={{
          //   onExit: {
          //     duration: 200,
          //     before: () => ({
          //       _y: 0,
          //     })
          //   },
          // }}
          events={[{
            target: "data",
            eventHandlers: {
              onPressIn: handlePressIn
            }
          },
          {
            target: "labels",
            eventHandlers: {
              onPressIn: handlePressIn
            }
          }]}
        />
        {pressed ? (
          <TouchableOpacity onPress={()=>{setNewData(baseData.all);setPressed(false)}}>
            <Text style={styles(dark, colors).button}>Back</Text>
          </TouchableOpacity>
        ):''}
      </ScrollView>
    );
  }
}