import {Button, Dimensions, Image, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import { useRoute } from "@react-navigation/native";
import React from "react";
import {LineChart} from "react-native-chart-kit";
import getCryptoIcon from "./icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';

export default function WalletAssetDetail(props) {

  const {dark, colors, setScheme} = useTheme();
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
    <ScrollView style={{flex: 1, backgroundColor: colors.background, paddingHorizontal: 30}}>

      <TouchableWithoutFeedback onPress={() => props.navigation.goBack()}>
        <Text style={[styles.backArrow, {color: colors.primary}]}>←</Text>
      </TouchableWithoutFeedback>

      <View style={[styles.walletAsset, {backgroundColor: colors.background}]}>
        <Image
          style={styles.walletAssetImage}
          source={getCryptoIcon(item.symbol)}
        />
        <Text style={{fontWeight: "800", fontSize: 40, color: colors.text}}>{item.cryptocurrency} Wallet</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Address</Text>
        <Text style={{color: colors.text}}>{item.address}</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Balance</Text>
        <Text style={{color: colors.text}}>{item.value} {item.symbol}</Text>
        <Text />

        <Text style={{fontWeight: "700", color: colors.text}}>Value</Text>
        <Text style={{color: colors.text}}>£0.00 ▲ 0.00% (Not Implemented)</Text>

      </View>

      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10, color: colors.text}}>Graph</Text>
      <View style={[styles.walletAsset, {backgroundColor: colors.background}]}>
        <LineChart
          data={data}
          width={Dimensions.get("window").width * 0.8}
          height={120}
          style={{ paddingRight: 0, paddingBottom: 3}}
          chartConfig={{
            fillShadowGradientFrom: "#000",
            fillShadowGradientTo: colors.text,
            fillShadowGradientOpacity: 0,
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            //color: (opacity = 1) => `rgb(0, 0, 0)`,
            color: (opacity = 1) => colors.primary,
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

      <Text style={{fontWeight:"800", fontSize:25, paddingTop: 10, color: colors.text}}>Transactions</Text>
      <View style={[styles.walletAsset, {backgroundColor: colors.background}]}>
        <Text style= {{color: colors.text}}>⚠ Transaction history not implemented.</Text>
      </View>

      <Pressable
        onPress={() => removeWallet(item.id).then(() => props.navigation.goBack())}
        style={{alignItems: "center", justifyContent: "center"}}>
        <View style={[styles.deleteButton, {backgroundColor: colors.primary}]}>
          <Text style={{color: "#fee2e2", fontWeight: "800"}}>Remove</Text>
        </View>
      </Pressable>

    </ScrollView>
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
  }
});
