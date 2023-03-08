import React from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions, Button, TouchableHighlight, Alert,TouchableOpacity } from 'react-native';

import data from "./chartData.json"
import { LineChart } from 'react-native-wagmi-charts';


import {Table, Row, Rows,TableWrapper,Cell} from 'react-native-table-component';

export default function LineChartScreen({transactions, graph_version, height, width})
{
    // console.log("INPUT TRANSACTIONS")
    // console.log(transactions);

    let graph_data = transactions.map((item) => [item.amount, item.date]);

    const accumulate_totals_for_each_day = (data_input) => {
        return Object.entries(data_input.reduce((acc, [amount, date]) => {
            amount = String(amount);

            // If this day already exists in the accumulator, add the amount to it.
            if (acc[date]) {
                // If amount is negative subtract in accumulator, else add to it.
                if (amount.startsWith("-")) {
                    acc[date] -= parseFloat(amount.substr(1));
                } else {
                    acc[date] += parseFloat(amount);
                }
            }
            // Otherwise, create a new entry for this day in the accumulator.
            else {
                acc[date] = parseFloat(amount);
            }

            return acc;
        }, {})).map(([date, amount]) => [amount, date]);
    }
    graph_data = accumulate_totals_for_each_day(graph_data);

    // console.log(graph_data);

    graph_data = graph_data.map((item) => {
        return {timestamp: (new Date(item[1])).getTime(), value: item[0]};
    }).sort((a, b) => a.timestamp - b.timestamp);

    let balance = 0;
    
    graph_data = graph_data.map((item) => {
        balance += item.value;
        return {timestamp: item.timestamp, value: item.value};
    });

    let color = 'green';

    // if (graph_data !== undefined && graph_data[0][0] > graph_data[graph_data.length -1][0]){
    //     color = 'red';
    // } 
    // else {
    //     color = 'green'
    // }

    return (
        <View>
            {graph_data && graph_data.length > 0 ? (
                <>
                    { graph_version == 1 && 
                        <LineChart.Provider data={graph_data}>
                            <LineChart width={width} height={height}>
                                <LineChart.Path color={color}>
                                    <LineChart.Gradient />
                                </LineChart.Path>
                                <LineChart.CursorCrosshair />
                            </LineChart>
                            <LineChart.PriceText />
                            <LineChart.DatetimeText />
                        </LineChart.Provider>
                    }
                    
                    { graph_version == 2 &&
                        <LineChart.Provider data={graph_data}>
                            <LineChart width={width} height={height}>
                                <LineChart.Path color={color}/>
                                <LineChart.CursorCrosshair>
                                    <LineChart.Tooltip />
                                </LineChart.CursorCrosshair>
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