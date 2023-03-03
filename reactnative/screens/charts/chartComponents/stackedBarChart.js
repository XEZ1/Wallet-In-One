import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, ScrollView, Dimensions, View, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';


import { StackedBarChart } from "react-native-chart-kit";

import fixture from "../../charts/chartData.json"
import { useTheme } from 'reactnative/src/theme/ThemeProvider'

import {auth_get} from '../../../authentication'

import stackedBarChart from "../../charts/stackedBarChartData.json";

// Old stack bar chart being used for testing (retrieved from old commit)
// const StackedBar = () => {

//   const colors = [
//     "#6a1b9a",
//     "#00796b",
//     "#c2185b",
//     "#2196f3",
//     "#009688",
//     "#ffc107",
//   ];
//   const data = {
//     labels: stackedBarChart.all.map((item) => item.type),
//     legend: stackedBarChart.all.map((item) => item.type),
//     data: stackedBarChart.all.map((item) => item.assets.map((asset) => asset.y)),
//     barColors: ["#dfe4ea", "#ced6e0", "#a4b0be"],
//   };
//   console.log('test version:', data);

//   return (
//     <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
//       <StackedBarChart
//         data={data}
//         width={Dimensions.get("window").width}
//         height={220}
//         yAxisLabel="£"
//         chartConfig={{
//           backgroundColor: "#ffffff",
//           backgroundGradientFrom: "#ffffff",
//           backgroundGradientTo: "#ffffff",
//           decimalPlaces: 2, // optional, defaults to 2dp
//           color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//           labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,

//           propsForDots: {
//             r: "6",
//             strokeWidth: "2",
//             stroke: "#ffa726",
//           },
//         }}
//         style={{
//           marginVertical: 8,
//         }}
//       />
//     </View>
//   );
// };

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
          console.log('source',response.body)
          setNewData(response.body)
          setPressed(false)
        }
      }
      if(isFocused){fetchData()}

  }, [isFocused])

  console.log('before:', data)


  // const list = data.map(val => val.x);
  // let spacing = list.length * 60;
  const labels = ["Banks", "Cryptocurrency", "Stocks"] // ["Crypto-Wallets","Bank","Stocks","Crypto-Exchange"]
  
  function extract(name){
    return name in data ? data[name].map(i=>i.y) : []
  } 

  const stackChartData = {
    labels: labels,
    data: labels.map(name => extract(name)),
    barColors: ["pink", "turquoise", "lime", "yellow"],
  };

  console.log("real version:    ", JSON.stringify(stackChartData))
  if(false){
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

        {/* <StackedBar/> */}

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
