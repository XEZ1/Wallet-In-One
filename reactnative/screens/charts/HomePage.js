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
import useCryptoExchange from "../cryptoExchanges/useCryptoExchange";

export default function HomePage({ navigation }) {
  const originalColours = ["pink", "turquoise", "lime", "#FA991C"]
  const {dark, colors, setScheme } = useTheme();
  const isFocused = useIsFocused();
  const [chartType, setChartType] = useState("pie"); // Default chart is pie chart

  const [baseData, setBaseData] = useState(fixture);
  const [data, setNewData] = useState(baseData.all);
  const [pressed, setPressed] = useState(null);
<<<<<<< HEAD
  const [colorScheme, setColors] = useState(["pink", "turquoise", "lime", "#FA991C"]);
  const { removeWallet } = useCryptoWallet();
=======
  const [colorScheme, setColors] = useState(originalColours);
  const { wallets, fetchWallets, removeWallet } = useCryptoWallet();
>>>>>>> main
  const { exchanges, fetchExchanges, removeExchange } = useCryptoExchange();

  // Uncomment to show bank data from backend
  useEffect(() => {
    const fetchData = async () => {
      const response = await auth_get("/graph_data/");
      console.log("fetch graph data", response.status);
      if (response.status == 200) {
        setBaseData(response.body);
        setNewData(response.body.all);
        setPressed(null);
        setColors(originalColours);
      }
    };
    if (isFocused) {
      fetchData();
    }
    fetchExchanges();
  }, [isFocused]);

  const handlePressIn = async (event, datapoint) => {
    var index = datapoint.index;
    
    if (pressed) {
      if (pressed == "Banks"){
        var bankData = baseData["Banks"][index]
        if (bankData.id){
          setColors(originalColours)
          navigation.navigate('Bank Transactions', {accountID: bankData.id})
          return
        }
      } else if (pressed === "Cryptocurrency from wallets") {
        var cryptoData = baseData["Cryptocurrency from wallets"][index]
        if (cryptoData.id) {
          setColors(originalColours)
          navigation.navigate("Wallet Detail", { item: wallet, value: cryptoData.y, removeWallet: removeWallet })
          return
        }
      }
      else if (pressed == "Stock Accounts") {
        var stockData = baseData["Stock Accounts"][index]
        if (stockData.id) {
          var response = await auth_get(`/stocks/get_account/${stockData.id}/`)
          const res = await auth_get(`/stocks/list_transactions/${stockData.id}/`)
          setColors(originalColours)
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
      else if (pressed === "Cryptocurrency from exchanges") {
        var cryptoExchangeData = baseData["Cryptocurrency from exchanges"][index]
        var exchange = exchanges.find(x => x.id === cryptoExchangeData.id)
        if (cryptoExchangeData.id) {
          navigation.navigate("ExchangeTransactions", { item: exchange, value: cryptoExchangeData.y, removeExchange: removeExchange })
          return
        }
      }
      setNewData(baseData.all);
      setPressed(null)
    } else {
      const dataPoint = data[index];
      let col = datapoint.style["fill"]
      if(typeof col != 'string' || col === "black" || col === "white"){
        col = originalColours[list.indexOf(datapoint.datum["x"])]
      }
      setColors([col, "red", "blue", "yellow", "#800000", "#a9a9a9", "#fffac8", "#E7E9B9", "#6B238F"])
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

  const handlePressInStacked = async (event, datapoint) => {
    for (let i = 0; i < datapoint.data.length; i++) {
      if (datapoint.data[i].z) {
        var index = datapoint.data[i].z;
        var pressed = datapoint.data[i].name;
        break;
      }
    }
    console.log(index)
    console.log(datapoint)
      if (pressed == "Banks"){
        for (let i = 0; i < baseData["Banks"].length; i++) {
          if (baseData["Banks"][i].x === index) {
            var bankData = baseData["Banks"][i]
            break;
          }
        }
        if (bankData.id){
          navigation.navigate('Bank Transactions', {accountID: bankData.id})
          return
        }
      } else if (pressed === "Cryptocurrency from wallets") {
        for (let i = 0; i < baseData["Cryptocurrency from wallets"].length; i++) {
          if (baseData["Cryptocurrency from wallets"][i].x === index) {
            var cryptoData = baseData["Cryptocurrency from wallets"][i]
            break;
          }
        }
        var wallet = wallets.find(x => x.id === cryptoData.id)
        if (cryptoData.id) {
          navigation.navigate("Wallet Detail", { item: wallet, value: cryptoData.y, removeWallet: removeWallet })
          return
        }
      }
      else if (pressed == "Stock Accounts") {
        console.log(baseData["Stock Accounts"])
        console.log(index)
        for (let i = 0; i < baseData["Stock Accounts"].length; i++) {
          if (baseData["Stock Accounts"][i].x === index) {
            console.log(baseData["Stock Accounts"][i])
            var stockData = baseData["Stock Accounts"][i]
            break;
          }
        }
        console.log(stockData)
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
      else if (pressed === "Cryptocurrency from exchanges") {
        for (let i = 0; i < baseData["Cryptocurrency from exchanges"].length; i++) {
          if (baseData["Cryptocurrency from exchanges"][i].x === index) {
            var cryptoData = baseData["Cryptocurrency from exchanges"][i]
            break;
          }
        }
        var exchange = exchanges.find(x => x.id === cryptoData.id)
        if (cryptoData.id) {
          navigation.navigate("ExchangeTransactions", { item: exchange, value: cryptoData.y, removeExchange: removeExchange })
          return
        }
      }
      setNewData(baseData.all);
    };

  let value = 0;
  data.forEach((jsonObj) => {
    value += jsonObj.y;
  });
  value = value.toFixed(2);

  const list = data.map((val) => val.x);
  const colours = ["pink"];

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
        <View style={{ flexDirection: "row", justifyContent: "space-around", width: "90%", backgroundColor: "antiquewhite", margin: 10, borderRadius: 30 }}>
          <TouchableOpacity
            style={[
              styles(dark, colors).btn,
              chartType === "pie" && { backgroundColor: 'aliceblue'},
            ]}
            onPress={() => handleChartTypeChange("pie")}
          >
          <Text>Pie Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles(dark, colors).btn,
              chartType === "stacked" && { backgroundColor: 'aliceblue'},
            ]}
            onPress={() => handleChartTypeChange("stacked")}
          >
          <Text>Stacked Bar Chart</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles(dark, colors).largeTextBold, {fontSize: 30}]}>{pressed}</Text>

        {chartType == "pie" ? 
          <>
            <PieChart colours={colorScheme} data={data} handlePressIn={handlePressIn}/>
            {BarChart(colorScheme, list, data, colors, spacing, handlePressIn)}
          </>
          : 
            <StackedChart data={baseData} handlePressIn={handlePressInStacked}/>
        }

        
        
        {pressed ? (
          <TouchableOpacity
            onPress={() => {
              setNewData(baseData.all);
              setPressed(false);
              setColors(originalColours);
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

