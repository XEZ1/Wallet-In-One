import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import React from "react";
import getCryptoIcon from "./icons/icon";

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
    <TouchableWithoutFeedback
      onPress={() =>
        props.navigation.navigate("WalletAssetDetail",
          { item: props.item, removeWallet: props.removeWallet })
      }
    >
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
            source={getCryptoIcon(props.item.symbol)}
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
            <Text style={styles.walletAssetTitle}>
              {props.item.value} {props.item.symbol}
            </Text>
            <Text style={styles.walletAssetTitle}>£0.00 ▲ 0.00%</Text>
          </View>

          <View style={{}}>
            <LineChart
              data={data}
              width={200} // Dimensions.get("window").width
              height={60}
              style={{ paddingRight: 0, paddingBottom: 3 }}
              chartConfig={{
                fillShadowGradientFrom: "#000",
                fillShadowGradientTo: "#e5e5e5",
                fillShadowGradientOpacity: 0,
                backgroundGradientFromOpacity: 0,
                backgroundGradientToOpacity: 0,
                color: (opacity = 1) => `rgb(0, 0, 0)`,
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
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  walletAsset: {
    backgroundColor: "#e5e5e5",
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection: "row",
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
