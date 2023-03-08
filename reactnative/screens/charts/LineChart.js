import React from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions, Button, TouchableHighlight, Alert,TouchableOpacity } from 'react-native';

import data from "./chartData.json"
import { LineChart } from 'react-native-wagmi-charts';
import {useEffect, useState} from "react";

import {Table, Row, Rows,TableWrapper,Cell} from 'react-native-table-component';

export default function LineChartScreen({transactions, graph_version, height, width, stockAccountBalance})
{
    // console.log("INPUT TRANSACTIONS")
    // console.log(transactions);
    const [ graphData, setGraphData ] = useState([{timestamp: 0, value: 0}, {timestamp: 0, value: 0}]);
    

    let graph_data = transactions.map((item) => [item.amount, item.date]);
    graph_data.sort((a, b) => new Date(b[1]) - new Date(a[1]));
    console.log(graph_data)

    // const test = (data_input) => {
    //     if(data_input.length == 0)
    //     {
    //         return data_input
    //     }
    //     else{
    //         let arr = []
    //         let curr = data_input[0]
    //         for(let i = 0; i < data_input.length; i++)
    //         {
    //             if(curr[1] != data_input[i][1])
    //             {

    //             }
    //         }
    //     }
    // }
    useEffect(() => {
    let points = [];
    let balance = stockAccountBalance;

    for (let i = 0; i < graph_data.length; i++) {
      let point = {timestamp: new Date(graph_data[i][1]).getTime(), value: balance}
      balance -= graph_data[i][0]
      points = [point, ...points]
    }
    console.log(points)
    setGraphData(points)
}, []);
    // const accumulate_totals_for_each_day = (data_input) => {
    //     return Object.entries(data_input.reduce((acc, [amount, date]) => {
    //         amount = String(amount);

    //         // If this day already exists in the accumulator, add the amount to it.
    //         if (acc[date]) {
    //             // If amount is negative subtract in accumulator, else add to it.
    //             if (amount.startsWith("-")) {
    //                 bal += parseFloat(amount)
    //                 acc[date] = bal;
    //             } else {
    //                 bal -= parseFloat(amount)
    //                 acc[date] = bal;
    //             }
    //         }
    //         // Otherwise, create a new entry for this day in the accumulator.
    //         else {
    //             acc[date] = bal;
    //         }

    //         return acc;
    //     }, {})).map(([date, amount]) => [amount, date]);
    // }
    // graph_data = accumulate_totals_for_each_day(graph_data);

    // console.log(graph_data);

    // graph_data = graph_data.map((item) => {
    //     return {timestamp: (new Date(item[1])).getTime(), value: item[0]};
    // }).sort((a, b) => a.timestamp - b.timestamp);
    // console.log(graph_data)
    // let balance = 0;
    
    // graph_data = graph_data.map((item) => {
    //     balance += item.value;
    //     return {timestamp: item.timestamp, value: item.value};
    // });
    // console.log(graph_data)
    let color = 'green';
    const data = graphData
    console.log(data)

    // if (graph_data !== undefined && graph_data[0][0] > graph_data[graph_data.length -1][0]){
    //     color = 'red';
    // } 
    // else {
    //     color = 'green'
    // }
    

    return (
        <View >
            {graph_data && graph_data.length > 0 ? (
                <>
                    {/* Interactive graph */}
                    { graph_version == 1 && 
          <LineChart.Provider data={data}>
          <LineChart height={height} width={width}>
            <LineChart.Path color={color}/>
            <LineChart.CursorCrosshair>

              <LineChart.Tooltip>
                <LineChart.PriceText precision={10} />
              </LineChart.Tooltip>

              <LineChart.Tooltip position="bottom" >
                <LineChart.DatetimeText />
              </LineChart.Tooltip>

            </LineChart.CursorCrosshair>
          </LineChart>
        </LineChart.Provider>
                    }

                    {/* Static graph */}   

                    { graph_version == 2 &&
                        <LineChart.Provider data={graphData}>
                            <LineChart width={width} height={height}>
                                <LineChart.Path color={color}/>
                                {/* <LineChart.CursorCrosshair>
                                    <LineChart.Tooltip />
                                </LineChart.CursorCrosshair> */}
                            </LineChart>
                        </LineChart.Provider>
                    }
                </>
            ) : (<Text style={[styles.emptyText, {textAlign: 'center', alignSelf: 'center'}]}>No data available</Text>)}

        </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    padding: 8,
  },
  chartContainer: {
    marginVertical: 8,
    borderRadius: 16,
    // paddingHorizontal: 10,
  },
  head: {
    height: 44,
     backgroundColor: '#42b983'
  },
  text: { 
    // margin: 8
  },
  row: { 
    flexDirection: 'row',
  },
});