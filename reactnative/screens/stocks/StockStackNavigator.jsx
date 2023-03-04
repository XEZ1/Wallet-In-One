import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import StockAsset from "./StockAsset";
import SuccessComponent from "./ListStocksScreen";

const Stack = createStackNavigator();

export default function StockStackNavigator() {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Stock Account List" component={SuccessComponent} />
        <Stack.Screen name="StockAsset" component={StockAsset} />
      </Stack.Navigator>
    );
  }