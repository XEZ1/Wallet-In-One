import React from 'react';
import { StyleSheet, Text, ScrollView, View, Dimensions, Button, TouchableHighlight, Alert } from 'react-native';

import data from "./chartData.json"
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from 'react-native-chart-kit'

import {Table, Row, Rows} from 'react-native-table-component';

// import moment from 'moment';

export default function LineChartScreen({route,navigation})
{
    const transactions = route.params.transactions_data

    const transaction_table_data = transactions.map((item) => [
        item.amount, 
        item.date, 
        item.quantity, 
        item.fees,
    ]);

    const graph_date_data = transaction_table_data.map((item) => item.date);

    const tableData = {
        tableHead: ['Amount', 'Date', 'Quantity','Fees'],
        tableData : transaction_table_data
    };

    const [data, setTableData] = React.useState(tableData);
    const [showTable,setShowTable] = React.useState(false);

    const toggleTable = () => {
        setShowTable(!showTable);
    };

    let balance = 0;

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

    
    const [line_graph_data, setLineGraphData] = React.useState(graph_data.map((item) => item[0]));
    const [line_graph_label, setLineGraphLabel] = React.useState(graph_data.map((item) => item[1]));

    const filter_transactions = (time) => {
        const currentDate = new Date();
        const currentDateTime = currentDate.getTime();
        const lastTransactionDate = new Date(currentDate.setDate(currentDate.getDate() - time));
        const lastTransactionDateTime = lastTransactionDate.getTime();
      
        let updated_data = transactions.filter(transaction => {
          const transactionDateTime = new Date(transaction.date).getTime();

          if (transactionDateTime <= currentDateTime && transactionDateTime > lastTransactionDateTime) {
            return true;
          }
          return false;
        })

        let line_graph_data = accumulate_totals_for_each_day(updated_data.map((item) => [balance + item.amount, item.date]));

        console.log(line_graph_data);
      
        setLineGraphData(line_graph_data.map((item) => item[0]));
        setLineGraphLabel(line_graph_data.map((item) => item[1]));

        let updated_table_data = updated_data.map((item) => [
            item.amount, 
            item.date, 
            item.quantity, 
            item.fees,
        ]);

        setTableData({
            tableHead: ['Amount', 'Date', 'Quantity','Fees'],
            tableData : updated_table_data,
        });
    }

    const last_week = () => {
        filter_transactions(7);
    }

    const last_month = () => {
        filter_transactions(30);
    }

    const last_year = () => {
        filter_transactions(365);
    }

    const all_time = () => {
        setLineGraphData(graph_data.map((item) => item[0]));
        setLineGraphLabel(graph_data.map((item) => item[1]));
    }

    // let line_graph_data = graph_data.map((item) => item[0]);

    // let line_graph_label = graph_data.map((item) => item[1]);

    // console.log(graph_data);

    return (
        <ScrollView style={styles.container} contentContainerStyle={{flexGrow: 1, justifyContent: 'space-between' }}>
        <Text></Text>

        <View style={styles.chartContainer}>
        <LineChart 
            data={{
                labels: line_graph_label,
                datasets: [
                    {
                        data: line_graph_data,
                    },
                ],
            }}
            width={Dimensions.get('window').width - 16}
            height={220}
            withDots={true}
            withInnerLines={false}
            yAxisLabel={'£ '}
            chartConfig={{
                backgroundColor: '#f2f2f2',
                backgroundGradientFrom: '#f2f2f2',
                backgroundGradientTo: '#f2f2f2',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                    marginHorizontal: 8,
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                },
            }}
            bezier
            style={{
                marginVertical: 8,
                borderRadius: 16,
            }}
        />

        <View style={styles.buttonContainer}>
            <View style={styles.timeButton}><Button onPress={all_time} title="ALL"/></View>
            <View style={styles.timeButton}><Button onPress={last_year} title="Y"/></View>
            <View style={styles.timeButton}><Button onPress={last_month} title="M"/></View>
            <View style={styles.timeButton}><Button onPress={last_week} title="D"/></View>
        </View>

        </View>

        <Button
            onPress={toggleTable}
            title={showTable ? "Hide Transactions" : "View Transactions"}
            color="#fcd34d"
        />

        {showTable && (
            <View style={styles.table}>
                <Table borderStyle={{ borderWidth: 2, borderColor: '#42b983' }}>
                    <Row data={data.tableHead} />
                    <Rows data={data.tableData}/>
                </Table>
            </View>
        )}
        </ScrollView>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignSelf: 'center',
    padding: 8,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    marginVertical: 8,
    borderRadius: 16,
    // paddingHorizontal: 10,
  },
  timeButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  table: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingTop: 20,
  },
  head: {
    height: 44,
     backgroundColor: '#42b983'
  },
  // text: {
  //   margin: 6
  // },
});