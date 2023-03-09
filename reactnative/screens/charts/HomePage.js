import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, View, } from "react-native";
import { VictoryPie, VictoryBar, VictoryLabel, VictoryContainer, VictoryStack } from "victory-native";

import { useTheme } from "reactnative/src/theme/ThemeProvider";
import { auth_get, auth_post } from "../../authentication";
import { styles } from "reactnative/screens/All_Styles.style.js";

import NoWallets from "./chartComponents/noWallets";
import PieChart from "./chartComponents/pieChart";
import BarChart from "./chartComponents/barChart"
import StackedChart from "./chartComponents/stackedBarChart";
import fixture from "../charts/chartData.json";
import useCryptoWallet from "../crypto_wallet/useCryptoWallet";

export default function HomePage({ navigation }) {
  const {dark, colors, setScheme } = useTheme();
  const isFocused = useIsFocused();
  const [chartType, setChartType] = useState("pie"); // Default chart is pie chart

  const [baseData, setBaseData] = useState(fixture);
  const [data, setNewData] = useState(baseData.all);
  const [pressed, setPressed] = useState(null);
  const { wallets, fetchWallets, removeWallet } = useCryptoWallet();

  // Uncomment to show bank data from backend

  useEffect(() => {
    const fetchData = async () => {
      const response = await auth_get("/graph_data/");
      console.log("fetch graph data", response.status);
      if (response.status == 200) {
        setBaseData(response.body);
        setNewData(response.body.all);
        setPressed(null);
      }
    };
    if (isFocused) {
      fetchData();
    }
    fetchWallets();
  }, [isFocused]);

  const handlePressIn = async (event, datapoint) => {
    var index = datapoint.index;
    
    if (pressed) {
      if (pressed == "Banks"){
        var bankData = baseData["Banks"][index]
        if (bankData.id){
          navigation.navigate('Bank Transactions', {accountID: bankData.id})
          return
        }
      } else if (pressed === "Cryptocurrency from wallets") {
        var cryptoData = baseData["Cryptocurrency"][index]
        var wallet = wallets.find(x => x.id === cryptoData.id)
        if (cryptoData.id) {
          navigation.navigate("Wallet Detail", { item: wallet, value: cryptoData.y, removeWallet: removeWallet })
          return
        }
      }
      else if (pressed == "Stock Accounts") {
        var stockData = baseData["Stock Accounts"][index]
        if (stockData.id) {
          var response = await auth_get(`/stocks/get_account/${stockData.id}/`)
          const res = await auth_get(`/stocks/list_transactions/${stockData.id}/`)
          navigation.navigate("Stock Account Transactions", {
            accountID: stockData.id, 
            accessToken: response.body.access_token, 
            transactions: res.body,
            logo: response.body.logo,
            balance: response.body.balance
          })
        }
        console.log(stockData.id)

      }
      setNewData(baseData.all);
      setPressed(null)
    } else {
      const dataPoint = data[index];
      const name = dataPoint.x
      if (baseData[name]) {
        setNewData(baseData[name]);
      } else {
        // If data for single type of asset does not exist, just display that one asset from all.
        setNewData(baseData.all.filter((val) => val.x.match(name)));
      }
      setPressed(name);
    }
    
  };

  let value = 0;
  data.forEach((jsonObj) => {
    value += jsonObj.y;
  });
  value = value.toFixed(2);

  const list = data.map((val) => val.x);
  const colours = ["pink", "turquoise", "lime", "#FA991C"];

  let spacing = list.length * 60;

  const handleChartTypeChange = (type) => {
    setChartType(type);
  };

  if (value == 0) {
    return (<NoWallets/>);
  } else {
    return (
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 20,
          backgroundColor: colors.background,
        }}
        style={styles.container}
      >

        {/* Switch Graph Buttons */}
        <View style={{ flexDirection: "row", justifyContent: "space-around", width: "90%", backgroundColor: "antiquewhite", margin: 20, borderRadius: 30 }}>
          <TouchableOpacity
            style={[
              styles(dark, colors).btn,
              chartType === "pie" && { backgroundColor: "aliceblue" },
            ]}
            onPress={() => handleChartTypeChange("pie")}
          >
            <Text style={styles.chartTypeText}>Pie Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles(dark, colors).btn,
              chartType === "stacked" && { backgroundColor: "aliceblue" },
            ]}
            onPress={() => handleChartTypeChange("stacked")}
          >
            <Text style={styles.chartTypeText}>Stacked Bar Chart</Text>
          </TouchableOpacity>
        </View>

        <Text >{pressed}</Text>

        {chartType == "pie" ? 
          <>
            <PieChart colours={colours} data={data} handlePressIn={handlePressIn}/>
            {BarChart(colours, list, data, colors, spacing, handlePressIn)}
          </>
          : 
            <StackedChart data={baseData} />
        }

        
        
        {pressed ? (
          <TouchableOpacity
            onPress={() => {
              setNewData(baseData.all);
              setPressed(false);
            }}
          >
            <Text style={[styles(dark, colors).button, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
        ) : (
          ""
        )}
      </ScrollView>
    );
  }
}

