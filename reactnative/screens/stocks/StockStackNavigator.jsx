import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StockAsset from "./StockAsset";
import SuccessComponent from "./ListStocksScreen";
import TransactionData from "./StockTransactionData";
import LineChartScreen from "reactnative/screens/charts/LineChart.js";

const Stack = createStackNavigator();

export default function StockStackNavigator() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Stock Account List" component={SuccessComponent} />
        <Stack.Screen name="StockAsset" component={StockAsset} />
        <Stack.Screen name="TransactionData" component={TransactionData} />
        <Stack.Screen name="LineGraph" component={LineChartScreen} />
      </Stack.Navigator>
    );
  }