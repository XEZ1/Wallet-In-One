import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { StyleSheet, Text, ScrollView, Dimensions, TouchableOpacity, View, } from "react-native";
import { VictoryPie, VictoryBar, VictoryLabel, VictoryContainer, VictoryStack } from "victory-native";

import { useTheme } from "reactnative/src/theme/ThemeProvider";
import { auth_get } from "../../authentication";
import { styles } from "reactnative/screens/All_Styles.style.js";

import NoWallets from "./chartComponents/noWallets";
import PieChart from "./chartComponents/pieChart";
import BarChart from "./chartComponents/barChart"
import StackedChart from "./chartComponents/stackedBarChart";
import fixture from "../charts/chartData.json";

export default function HomePage({ navigation }) {
  const {dark, colors, setScheme } = useTheme();
  const isFocused = useIsFocused();
  const [chartType, setChartType] = useState("pie"); // Default chart is pie chart

  const [baseData, setBaseData] = useState(fixture);
  const [data, setNewData] = useState(baseData.all);
  const [pressed, setPressed] = useState(false);

  // Uncomment to show bank data from backend

  useEffect(() => {
    const fetchData = async () => {
      const response = await auth_get("/graph_data/");
      console.log("fetch graph data", response.status);
      if (response.status == 200) {
        setBaseData(response.body);
        setNewData(response.body.all);
        setPressed(false);
      }
    };
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const handlePressIn = (event, datapoint) => {
    if (pressed) {
      setNewData(baseData.all);
    } else {
      const dataPoint = data[datapoint.index];
      if (baseData[dataPoint.x]) {
        setNewData(baseData[dataPoint.x]);
      } else {
        setNewData(baseData.all.filter((val) => val.x.match(dataPoint.x)));
      }
    }
    setPressed(!pressed);
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
              styles.btn,
              chartType === "pie" && { backgroundColor: "aliceblue" },
            ]}
            onPress={() => handleChartTypeChange("pie")}
          >
            <Text style={styles.chartTypeText}>Pie Chart</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btn,
              chartType === "stacked" && { backgroundColor: "aliceblue" },
            ]}
            onPress={() => handleChartTypeChange("stacked")}
          >
            <Text style={styles.chartTypeText}>Stacked Bar Chart</Text>
          </TouchableOpacity>
        </View>

        {chartType == "pie" ? <PieChart colours={colours} data={data} handlePressIn={handlePressIn}/>: <StackedChart data={baseData} />}

        {BarChart(colours, list, data, colors, spacing, handlePressIn)}
        
        {pressed ? (
          <TouchableOpacity
            onPress={() => {
              setNewData(baseData.all);
              setPressed(false);
            }}
          >
            <Text style={[styles.button, { color: colors.text }]}>Back</Text>
          </TouchableOpacity>
        ) : (
          ""
        )}
      </ScrollView>
    );
  }
}

