import React from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions, Button, TouchableHighlight, Alert,TouchableOpacity } from 'react-native';

import data from "./chartData.json"
import { LineChart, CandlestickChart } from 'react-native-wagmi-charts';
import {useEffect, useState} from "react";
import { useTheme } from "reactnative/src/theme/ThemeProvider";

import {Table, Row, Rows,TableWrapper,Cell} from 'react-native-table-component';

export default function LineChartScreen({transactions, graph_version, height, width, current_balance, data})
{
    const [ graphData, setGraphData ] = useState([{timestamp: 0, value: 0}, {timestamp: 0, value: 0}]);
    const {dark, colors, setScheme } = useTheme();

    useEffect(() => {
        if(data == null){
            let graph_data = transactions.map((item) => [item.amount, item.date]);
            graph_data = graph_data.sort((a, b) => new Date(b[1]) - new Date(a[1]));

            let points = [];
            let balance = current_balance;

            for (let i = 0; i < graph_data.length; i++) {
                let point = {timestamp: new Date(graph_data[i][1]).getTime(), value: balance}
                balance -= graph_data[i][0]
                points = [point, ...points]
            }
            if (points.length > 0) {
                points[points.length - 1].value = parseFloat(points[points.length - 1].value);
            }
            setGraphData(points)
        } else{
            setGraphData(data);
        }
    }, [transactions]);

    let color1 = '';
    
    if (graphData && graphData.length > 0) {
        if (graphData[0]?.value > graphData[graphData.length -1]?.value){
            color1 = 'red';
        } 
        else {
            color1 = 'green';
        }
    }
    // console.log(graphData);

    let candlestickData = null;

    if(graph_version == 3){
        const transformedData = graphData.reduce((acc, transaction) => {
            const date = new Date(transaction.timestamp);
            const month = `${date.getFullYear()}-${date.getMonth() + 1}`;

            if (!acc[month]) {
                acc[month] = {
                    high: transaction.value,
                    low: transaction.value,
                    open: transaction.value,
                    close: transaction.value,
                };
            } 
            else {
                if (transaction.value > acc[month].high) {
                    acc[month].high = transaction.value;
                }

                if (transaction.value < acc[month].low) {
                    acc[month].low = transaction.value;
                }

                acc[month].close = transaction.value;
            }

            return acc;
        }, {});
        
        candlestickData = Object.keys(transformedData).map((key) => {
            const [year, month] = key.split('-');
            return {
                timestamp: (new Date(year, month - 1)).getTime(),
                open: parseFloat(transformedData[key].open),
                close: parseFloat(transformedData[key].close),
                high: parseFloat(transformedData[key].high),
                low: parseFloat(transformedData[key].low),
            };
        });
    }

    let percentageChange = null;
    let priceChange = null;
    
    function calculateChange(new_value, old_value) {
        if (old_value != 0){
            percentageChange = (((new_value - old_value) / Math.abs(old_value)) * 100).toFixed(2);
        }
        else{
            percentageChange = '0 ERR';
        }
        
        if (percentageChange > 0) {
            percentageChange = '+' + percentageChange;
        }
        
        priceChange = (((new_value) - old_value)).toFixed(3);
        if(priceChange > 0){
            priceChange = '+' + priceChange;
        }
    }

    if(graph_version != 3){
        calculateChange(current_balance, graphData[0]?.value);
    }
    else if (current_balance != null){
        calculateChange(current_balance, candlestickData[0]?.open);
    }
    else{
        calculateChange(candlestickData[candlestickData.length-1].close, candlestickData[0]?.open);
    }

    return (
        <View >
            {graphData && graphData.length > 1 ? (
                <>
                    {/* Interactive graph */}
                    { graph_version == 1 && 
                        <>
                        <View style={{flexDirection: 'row', paddingBottom: 14, paddingHorizontal: 10}}>
                            <Text style={{ color: color1, fontSize: 14, fontWeight: 'bold' }}>{priceChange}</Text>
                            <Text style={{ color: color1, fontSize: 14, fontWeight: 'bold' }}> ({percentageChange}%)</Text>
                        </View>

                        <LineChart.Provider data={graphData}>
                            <LineChart height={height} width={width}>
                                <LineChart.Path color={color1}>
                                    <LineChart.Gradient />
                                </LineChart.Path>
                                <LineChart.HorizontalLine />
                                <LineChart.CursorLine />
                                <LineChart.CursorCrosshair />
                            </LineChart>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ marginHorizontal: 5, fontSize: 12}}>Date: </Text>
                                    <LineChart.DatetimeText precision={10} style={{ color: colors.text, fontSize: 13 }} />
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ marginHorizontal: 5, fontSize: 12}}>Balance: </Text>
                                    <LineChart.PriceText precision={10} style={{ color: colors.text, fontSize: 13 }}/>
                                </View>
                            </View>
                        </LineChart.Provider></>
                    }


                    {/* Static graph */}   
                    { graph_version == 2 &&
                    <><Text style={{ textAlign: 'right', marginLeft: 'auto', color: color1, fontSize: 11 }}>{percentageChange}%</Text>
                    <LineChart.Provider data={graphData}>
                            <LineChart width={width} height={height}>
                                <LineChart.Path color={color1}>
                                    <LineChart.Gradient />
                                </LineChart.Path>
                            </LineChart>
                        </LineChart.Provider></>
                    }
                    {/* Candelstick graph */}   
                    { graph_version == 3 && candlestickData &&
                        <>
                        <View style={{flexDirection: 'row', paddingBottom: 14, paddingHorizontal: 10}}>
                            <Text style={{ color: color1, fontSize: 14, fontWeight: 'bold' }}>{priceChange}</Text>
                            <Text style={{ color: color1, fontSize: 14, fontWeight: 'bold' }}> ({percentageChange}%)</Text>
                        </View>

                        <CandlestickChart.Provider data={candlestickData}>
                            <CandlestickChart height={height} width={width}>
                                <CandlestickChart.Candles />
                                <CandlestickChart.Crosshair />
                            </CandlestickChart>
                            
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ marginHorizontal: 8, fontSize: 12 }}>Opening Price:</Text>
                                    <CandlestickChart.PriceText precision={10} type="open" style={{ color: colors.text, fontSize: 12 }} />
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ marginHorizontal: 8, fontSize: 12  }}>Highest Price: </Text>
                                    <CandlestickChart.PriceText precision={10} type="high" style={{ color: colors.text, fontSize: 12 }} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ marginHorizontal: 8, fontSize: 12  }}>Closing Price:</Text>
                                    <CandlestickChart.PriceText precision={10} type="close" style={{ color: colors.text, fontSize: 12 }} />
                                </View>

                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ marginHorizontal: 8, fontSize: 12 }}>Lowest Price:</Text>
                                    <CandlestickChart.PriceText precision={10} type="low" style={{ color: colors.text, fontSize: 12 }} />
                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ marginHorizontal: 1, fontSize: 12}}>Date:</Text>
                                <CandlestickChart.DatetimeText style={{ fontSize: 12 }} />
                            </View>

                        </CandlestickChart.Provider></>
                    }

                    {/* Interactive graph WalletAssetVersion */}
                    { graph_version == 4 && 
                        <>
                        <View style={{flexDirection: 'row', paddingBottom: 14, paddingHorizontal: 10}}>
                            <Text style={{ color: color1, fontSize: 14, fontWeight: 'bold' }}>{priceChange}</Text>
                            <Text style={{ color: color1, fontSize: 14, fontWeight: 'bold' }}> ({percentageChange}%)</Text>
                        </View>

                        <LineChart.Provider data={data}>
                            <LineChart height={height} width={width}>
                            <LineChart.Path color={colors.text}/>
                            <LineChart.CursorCrosshair color={colors.text}>

                                <LineChart.Tooltip textStyle={{color: colors.text}}>
                                <LineChart.PriceText precision={10} style={{color: colors.text}} />
                                </LineChart.Tooltip>

                                <LineChart.Tooltip position="bottom" >
                                <LineChart.DatetimeText style={{color: colors.text}} />
                                </LineChart.Tooltip>

                            </LineChart.CursorCrosshair>
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