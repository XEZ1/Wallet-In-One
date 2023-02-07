import {Button, Dimensions, Image, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View} from "react-native";
import { useRoute } from "@react-navigation/native";
import React from "react";
import {LineChart} from "react-native-chart-kit";

export default function WalletAssetDetail(props) {
  const route = useRoute();
  const { item, removeWallet } = props.route.params;
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
    <View style={{flex: 1, backgroundColor: 'white', paddingHorizontal: 30}}>

      <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
        <Text style={styles.backArrow}>←</Text>
      </TouchableWithoutFeedback>

      <View style={styles.walletAsset}>
        <Image
          style={styles.walletAssetImage}
          source={require(`./icons/BTC.png`)}
        />
        <Text style={{fontWeight: "800", fontSize: 40}}>{item.cryptocurrency} Wallet</Text>
        <Text />

        <Text style={{fontWeight: "700"}}>Address</Text>
        <Text>{item.address}</Text>
        <Text />

        <Text style={{fontWeight: "700"}}>Balance</Text>
        <Text>{item.value} {item.symbol}</Text>
        <Text />

        <Text style={{fontWeight: "700"}}>Value</Text>
        <Text>£0.00 ▲ 0.00%</Text>

      </View>

      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10}}>Graph</Text>
      <View style={styles.walletAsset}>
        <LineChart
          data={data}
          width={Dimensions.get("window").width * 0.8}
          height={120}
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

      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10}}>Transactions</Text>
      <View style={styles.walletAsset}>
        <Text>⚠ Transaction history not implemented.</Text>
      </View>

        <Pressable
          onPress={() => removeWallet(item.id).then(() => props.navigation.goBack())}
          style={{alignItems: "center", justifyContent: "center"}}>
          <View style={styles.deleteButton}>
            <Text style={{color: "#fee2e2", fontWeight: "800"}}>Remove</Text>
          </View>
        </Pressable>

    </View>
  );
}


const styles = StyleSheet.create({
  backArrow: {
    fontWeight: "900",
    fontSize: 30,
    paddingVertical: 10,
  },
  walletAsset: {
    backgroundColor: "#e5e5e5",
    borderRadius: 10,
    padding: 20,
  },
  walletAssetTitle: {
    fontWeight: "700",
    flex: 1,
  },
  walletAssetImage: {
    width: 100,
    height: 100,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    paddingHorizontal: 30,
    borderRadius: 5,
    backgroundColor: '#dc2626',
  }
});
