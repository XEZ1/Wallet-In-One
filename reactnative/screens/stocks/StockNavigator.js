import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StockAsset from "./StockAsset";
import TransactionData from "./StockTransactionData";
import LineChartScreen from "reactnative/screens/charts/LineChart.js";
import StockDetails from "./StockDetails";
import { useTheme } from "reactnative/src/theme/ThemeProvider";

const Stack = createStackNavigator();

export default function StockNavigator() {

  const {dark, colors, setScheme} = useTheme();

    return (
      <Stack.Navigator
        screenOptions={
          {
            headerStyle: {backgroundColor: colors.background},
            headerTitleStyle: {color: colors.text},
          }}
      >
        <Stack.Screen name="StockAsset" component={StockAsset} />
        <Stack.Screen name="TransactionData" component={TransactionData} />
        <Stack.Screen name="LineGraph" component={LineChartScreen} />
        <Stack.Screen name="StockDetails" component={StockDetails} />
      </Stack.Navigator>
    );
  }