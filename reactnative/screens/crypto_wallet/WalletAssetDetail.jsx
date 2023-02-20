import {Button, Dimensions, Image, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import { useRoute } from "@react-navigation/native";
import React from "react";
//import {LineChart} from "react-native-chart-kit";
import getCryptoIcon from "./icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import {
  ChartDot,
  ChartPath,
  ChartPathProvider,
  monotoneCubicInterpolation,
} from '@rainbow-me/animated-charts';

export default function WalletAssetDetail(props) {

  const {dark, colors, setScheme} = useTheme();
  const route = useRoute();
  const { item, removeWallet } = props.route.params;

  const {width: SIZE} = Dimensions.get('window');

  const data = [
    {x: 1453075200, y: 1.47},
    {x: 1453161600, y: 1.37},
    {x: 1453248000, y: 1.53},
    {x: 1453334400, y: 1.54},
    {x: 1453420800, y: 1.52},
    {x: 1453507200, y: 2.03},
    {x: 1453593600, y: 2.1},
    {x: 1453680000, y: 2.5},
    {x: 1453766400, y: 2.3},
    {x: 1453852800, y: 2.42},
    {x: 1453939200, y: 2.55},
    {x: 1454025600, y: 2.41},
    {x: 1454112000, y: 2.43},
    {x: 1454198400, y: 2.2},
  ];

  const points = monotoneCubicInterpolation({data, range: 40});



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
        <ChartPathProvider
          data={{
            points,
            smoothingStrategy: 'bezier',
          }}>
          <ChartPath height={SIZE / 2} stroke="black" width={SIZE * 0.8} />
          <ChartDot
            style={{
              backgroundColor: 'black',
            }}
          />
        </ChartPathProvider>

        {/* Old Chart
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
        */}
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
