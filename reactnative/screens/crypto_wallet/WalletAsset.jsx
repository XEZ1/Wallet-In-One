import { Image, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import React from "react";

export default function WalletAsset(props) {
  const data = {
    datasets: [
      {
        data: [
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
          Math.random() * 100,
        ],
      },
    ],
  };

  return (
    <View style={styles.walletAsset}>
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingRight: 10,
        }}
      >
        <Image
          style={styles.walletAssetImage}
          source={{
            uri: `https://cryptoicons.org/api/color/${props.item.symbol.toLowerCase()}/200`,
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <View style={{}}>
          <Text style={{ fontSize: 25, fontWeight: "700" }}>
            {props.item.cryptocurrency}
          </Text>
          <Text style={styles.walletAssetTitle}>£000.00 ▲ 0.00%</Text>
          <Text style={styles.walletAssetTitle}>
            {props.item.value} {props.item.symbol}
          </Text>
        </View>

        <View style={{}}>
          <LineChart
            data={data}
            width={200} // Dimensions.get("window").width
            height={60}
            style={{ paddingRight: 0, paddingBottom: 3 }}
            chartConfig={{
              fillShadowGradientFrom: "#525252",
              fillShadowGradientTo: "#e5e5e5",
              fillShadowGradientOpacity: 1,
              backgroundGradientFromOpacity: 0,
              backgroundGradientToOpacity: 0,
              color: (opacity = 1) => `rgb(82, 82, 82)`,
              propsForDots: {
                r: "0",
              },
            }}
            withInnerLines={false}
            withHorizontalLabels={false}
            withOuterLines={false}
            bezier
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  walletAsset: {
    backgroundColor: "#e5e5e5",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
    borderColor: "#525252",
    borderWidth: 1,
  },
  walletAssetTitle: {
    fontWeight: "700",
    flex: 1,
  },
  walletAssetImage: {
    width: 30,
    height: 30,
  },
});
