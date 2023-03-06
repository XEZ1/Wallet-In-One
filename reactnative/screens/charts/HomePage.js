import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  View,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import {
  VictoryPie,
  VictoryBar,
  VictoryLabel,
  VictoryContainer,
  VictoryStack
} from "victory-native";

import fixture from "../charts/chartData.json";
import { useTheme } from "reactnative/src/theme/ThemeProvider";

import { auth_get } from "../../authentication";
import PieChart from "./chartComponents/pieChart";
import StackedChart from "./chartComponents/stackedBarChart";
import { styles } from "reactnative/screens/All_Styles.style.js";

export default function HomePage({ navigation }) {
  const [baseData, setBaseData] = useState(fixture);
  const { dark, colors, setScheme } = useTheme();
  const [data, setNewData] = useState(baseData.all);
  const [pressed, setPressed] = useState(false);
  const isFocused = useIsFocused();
  const [chartType, setChartType] = useState("pie"); // Default chart is pie chart

  const stylesInternal = StyleSheet.create({
    victoryLabelSmall: {
      fontSize: 17,
      fill: colors.text,
    },
    victoryLabelBig: {
      fontSize: 27,
      fontWeight: "700",
      fill: colors.text,
    },
    victoryLabelBar: {
      fontSize: 22,
      fontWeight: "900",
      fill: colors.text,
    },
  });

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
        <Text style={[styles.title, { color: colors.text }]}>
          Wallet-In-One
        </Text>
        <Text style={[styles.amountText, { color: colors.text }]}>
          Amount: £{value}
        </Text>
        <Text style={[styles.amountText, { color: colors.text }]}>
          Connect your Wallets to See your Funds!
        </Text>
      </ScrollView>
    );
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

        <View style={{flexDirection: "row", justifyContent: "space-around", width: "90%", backgroundColor: "antiquewhite", margin: 20, borderRadius: 30}}>
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
        {chartType == "pie" ? <PieChart /> : <StackedChart />}
        <VictoryBar
          horizontal={true}
          style={{
            data: { fill: ({ datum }) => colours[list.indexOf(datum.x)] },
          }}
          data={data}
          barWidth={18}
          padding={40}
          labels={({ datum }) => "●" + datum.x}
          labelComponent={
            <VictoryLabel
              dy={-20}
              x={30}
              style={{ fontSize: 22, fontWeight: "900", fill: colors.text }}
            />
          }
          height={spacing}
          events={[
            {
              target: "data",
              eventHandlers: {
                onPressIn: handlePressIn,
              },
            },
            {
              target: "labels",
              eventHandlers: {
                onPressIn: handlePressIn,
              },
            },
          ]}
        />
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

//const mystyle = StyleSheet.create({
  // container: {
  //   flex: 1,
  // },
  // title: {
  //   fontWeight: "900",
  //   fontSize: 50,
  //   alignSelf: "center",
  //   paddingVertical: 10,
  // },
  // button: {
  //   width: "75%",
  //   borderRadius: 25,
  //   textAlign: "center",
  //   fontWeight: "bold",
  //   fontSize: 30,
  // },
  // btn: {
  //   padding: 10,
  //   margin: 10,
  //   borderRadius: 20,
  //   width: "40%",
  //   alignItems: "center",
  // },
  
//});