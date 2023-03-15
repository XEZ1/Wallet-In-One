import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { Text, TouchableOpacity } from 'react-native'
import StockAsset from "./StockAsset";
import SuccessComponent from "./ListStocksScreen";
import TransactionData from "./StockTransactionData";
import LineChartScreen from "reactnative/screens/charts/LineChart.js";
import PlaidComponent from "./AddStocksScreen";
import StockDetails from "./StockDetails";
import { useTheme } from "reactnative/src/theme/ThemeProvider";
import StockInsight from "./StocksInsightScreen";

const Stack = createStackNavigator();

export default function StockStackNavigator() {

  const {dark, colors, setScheme} = useTheme();

    return (
      <Stack.Navigator
        screenOptions={
          {
            headerStyle: {backgroundColor: colors.background},
            headerTitleStyle: {color: colors.text},
          }}
      >
        {/* <Stack.Screen name="Insights" component={StockInsight} /> */}
        <Stack.Screen name="Stock Account List" component={SuccessComponent}
                options={({ navigation }) => ({
                  headerRight: () => (
                    <TouchableOpacity 
                      style={{ marginRight: 15 }} 
                      onPress={() => navigation.navigate('Stocks')}
                    >
                      <Text style={{ color: '#007AFF' }}>Add</Text>
                    </TouchableOpacity>
                  )
                })}
        />
        <Stack.Screen name="StockAsset" component={StockAsset} />
        <Stack.Screen name="TransactionData" component={TransactionData} />
        <Stack.Screen name="LineGraph" component={LineChartScreen} />
        <Stack.Screen name="Stocks" component={PlaidComponent} />
        <Stack.Screen name="StockDetails" component={StockDetails} />
      </Stack.Navigator>
    );
  }