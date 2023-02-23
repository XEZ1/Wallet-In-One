import {Button, Dimensions, Image, Pressable, StyleSheet, Text, TouchableWithoutFeedback, View, ScrollView} from "react-native";
import { useRoute } from "@react-navigation/native";
import React from "react";
import {LineChart} from "react-native-chart-kit";
import getCryptoIcon from "./icons/icon";
import { useTheme } from 'reactnative/src/theme/ThemeProvider';
import {styles} from 'reactnative/screens/All_Styles.style.js';

export default function WalletAssetDetail(props) {

  const {dark, colors, setScheme} = useTheme();
  const route = useRoute();
  const { item, removeWallet } = props.route.params;

  const stylesInternal = StyleSheet.create({
    walletAsset: {
      borderRadius: 10,
      padding: 20,
    },
    walletAssetImage: {
      width: 100,
      height: 100,
    },
    mediumBoldText: {
      fontWeight:"800",
      fontSize:25,
      paddingTop: 10,
      color: colors.text,
    }
  });  

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
        <Text style={styles(dark, colors).backArrow}>←</Text>
      </TouchableWithoutFeedback>

      <View style={[stylesInternal.walletAsset, styles(dark, colors).container]}>
        <Image
          style={stylesInternal.walletAssetImage}
          source={getCryptoIcon(item.symbol)}
        />
        <Text style={styles(dark, colors).largeTextBold}>{item.cryptocurrency} Wallet</Text>
        <Text />

        <Text style={styles(dark, colors).textBold}>Address</Text>
        <Text style={styles(dark, colors).text}>{item.address}</Text>
        <Text />

        <Text style={styles(dark, colors).textBold}>Balance</Text>
        <Text style={styles(dark, colors).text}>{item.value} {item.symbol}</Text>
        <Text />

        <Text style={styles(dark, colors).textBold}>Value</Text>
        <Text style={styles(dark, colors).text}>£0.00 ▲ 0.00% (Not Implemented)</Text>

      </View>

      <Text style={stylesInternal.mediumBoldText}>Graph</Text>
      <View style={[stylesInternal.walletAsset, {backgroundColor: colors.background}]}>
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

      <Text style={stylesInternal.mediumBoldText}>Transactions</Text>
      <View style={[stylesInternal.walletAsset, {backgroundColor: colors.background}]}>
        <Text style= {{color: colors.text}}>⚠ Transaction history not implemented.</Text>
      </View>

      <Pressable
        onPress={() => removeWallet(item.id).then(() => props.navigation.goBack())}
        style={{alignItems: "center", justifyContent: "center"}}>
        <View style={styles(dark, colors).smallButton}>
          <Text style={{color: colors.text, fontWeight: "800"}}>Remove</Text>
        </View>
      </Pressable>

    </ScrollView>
  );
}