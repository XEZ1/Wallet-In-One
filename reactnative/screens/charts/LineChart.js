import React from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions, Button, TouchableHighlight, Alert,TouchableOpacity } from 'react-native';

import data from "./chartData.json"
import { LineChart } from 'react-native-wagmi-charts';
import {useEffect, useState} from "react";
import { useTheme } from "reactnative/src/theme/ThemeProvider";

import {Table, Row, Rows,TableWrapper,Cell} from 'react-native-table-component';

export default function LineChartScreen({transactions, graph_version, height, width, stockAccountBalance})
{
    const [ graphData, setGraphData ] = useState([{timestamp: 0, value: 0}, {timestamp: 0, value: 0}]);
    const {dark, colors, setScheme } = useTheme();
    

    let graph_data = transactions.map((item) => [item.amount, item.date]);
    graph_data.sort((a, b) => new Date(b[1]) - new Date(a[1]));

    useEffect(() => {
    let points = [];
    let balance = stockAccountBalance;

    for (let i = 0; i < graph_data.length; i++) {
      let point = {timestamp: new Date(graph_data[i][1]).getTime(), value: balance}
      balance -= graph_data[i][0]
      points = [point, ...points]
    }
    if (points.length > 0) {
        points[points.length - 1].value = parseFloat(points[points.length - 1].value);
    }
    setGraphData(points)
}, [transactions, stockAccountBalance]);
    
    let percentageChange = null
    if(graphData && graphData.length > 0){
        percentageChange = (((stockAccountBalance - graphData[0].value) / graphData[0].value) * 100).toFixed(2);
        if(percentageChange > 0){
            percentageChange = '+' + percentageChange
        }
    }
    let color1 = 'green';
    const data = graphData;

    
    if (data && data.length > 0) {
        if (data[0]?.value > data[data.length -1]?.value){
            color1 = 'red';
        } 
        else {
            color1 = 'green';
        }
    } 
    

    return (
        <View >
            {graphData && graphData.length > 1 ? (
                <>
                    {/* Interactive graph */}
                    { graph_version == 1 && 
                    <><Text style={{ textAlign: 'center', color: color1, fontSize: 20, fontWeight: 'bold' }}>{percentageChange}%</Text><LineChart.Provider data={graphData}>
                            <LineChart height={height} width={width}>
                                <LineChart.Path color={color1}>
                                    <LineChart.Gradient />
                                </LineChart.Path>
                                <LineChart.HorizontalLine />
                                <LineChart.CursorLine />
                                <LineChart.CursorCrosshair />
                            </LineChart>
                            <LineChart.PriceText style={{ color: colors.text }}/>
                            <LineChart.DatetimeText style={{ color: colors.text }} />
                        </LineChart.Provider></>
                    }


                    {/* Static graph */}   
                    { graph_version == 2 &&
                    <><Text style={{ textAlign: 'right', marginLeft: 'auto', color: color1, fontSize: 11 }}>{percentageChange}%</Text><LineChart.Provider data={graphData}>
                            <LineChart width={width} height={height}>
                                <LineChart.Path color={color1}>
                                    <LineChart.Gradient />
                                </LineChart.Path>
                                {/* <LineChart.CursorCrosshair>
        <LineChart.Tooltip />
    </LineChart.CursorCrosshair> */}
                            </LineChart>
                        </LineChart.Provider></>
                    }
                </>
            ) : (<Text style={[styles.emptyText, {textAlign: 'center', alignSelf: 'center', color: colors.text}]}>No data available</Text>)}

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