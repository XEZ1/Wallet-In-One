import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";

import {
  VictoryPie,
  VictoryLabel,
  VictoryContainer,
} from "victory-native";


import { useTheme } from "reactnative/src/theme/ThemeProvider";

export default function PieChart({colours, data, handlePressIn}) {

  const {dark, colors, setScheme} = useTheme();
  const [pressed, setPressed ] = useState(false)
  const isFocused = useIsFocused()

  let value = 0;
  data.forEach((jsonObj) => {
    value += jsonObj.y;
  });
  value = value.toFixed(2);

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

      <VictoryContainer
        width={Dimensions.get("window").width}
        // height={Dimensions.get('window').height/2}
        height={300}
        style={{ paddingBottom: 10 }}
      >
        <VictoryPie
          data={data}
          innerRadius={100}
          padAngle={1}
          cornerRadius={10}
          radius={Dimensions.get("window").width / 3}
          labels={() => null}
          events={[
            {
              target: "data",
              eventHandlers: {
                onPressIn: handlePressIn,
              },
            },
          ]}
          // animate={{
          //   duration: 2000,
          //   easing: "bounce"
          // }}
          colorScale={colours}
          standalone={false}
          height={300}
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 17, fill: colors.text }}
          // x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/5.5}
          x={Dimensions.get("window").width / 2}
          y={105}
          text={"Net Worth"}
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 27, fontWeight: "700", fill: colors.text }}
          // x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/4.5}
          x={Dimensions.get("window").width / 2}
          y={125}
          text={"£" + value}
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 17, fill: colors.text }}
          // x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/3.7}
          x={Dimensions.get("window").width / 2}
          y={165}
          text={"Assets"}
        />
        <VictoryLabel
          textAnchor="middle"
          style={{ fontSize: 27, fontWeight: "700", fill: colors.text }}
          // x={Dimensions.get('window').width/2} y={Dimensions.get('window').height/3.25}
          x={Dimensions.get("window").width / 2}
          y={185}
          text={data.length}
        />
      </VictoryContainer>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontWeight: "900",
    fontSize: 50,
    alignSelf: "center",
    paddingVertical: 10,
  },
  button: {
    width: "75%",
    borderRadius: 25,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
  },
});