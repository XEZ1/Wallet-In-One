import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState} from 'react';
import { LineChart } from "react-native-chart-kit";
import {
  Button,
  FlatList,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Modal, Dimensions
} from 'react-native';

import data from './wallet_data.json' // Test Data
import WalletModal from "./WalletModal";
import * as SecureStore from "expo-secure-store";


export default function CryptoWallet() {

  const [modalVisible, setModalVisible] = useState(false);
  const [wallets, setWallets] = useState([]);

  const fetchWallets = async () => {
    await fetch('http://192.168.1.17:8000/crypto_wallets/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${await SecureStore.getItemAsync('token')}`
      }
    })
      .then(res => res.json())
      .then(res => setWallets(res))
      .catch(err => console.log(err))
  }

  // Refresh button

  useEffect(() => {
    fetchWallets();
  }, [])

  return (
    <SafeAreaView style={styles.cryptoWallet}>
      <ScrollView >


        <View style={{ flexDirection:'row', alignItems: 'center' }}>
          <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
            <Text style={styles.backArrow}>←</Text>
            <Text style={styles.cryptoWalletTitle}>Crypto Wallets</Text>
          </View>
        </View>

        <WalletModal wallets={wallets} setWallets={setWallets} visible={modalVisible} setVisible={setModalVisible} />

        <Button title="Add Wallet" onPress={() => setModalVisible(true)} />


        <FlatList
          style={styles.walletList}
          data={wallets}
          renderItem={({item}) => <WalletAsset item={item} />}
        />

      </ScrollView>
    </SafeAreaView>
  );
}


function WalletAsset(props) {

  return (
    <View style={styles.walletAsset}>
      <View style={{ alignItems: 'center', justifyContent: 'center', paddingRight: 10}}>
        <Image style={styles.walletAssetImage} source={{ uri: `https://cryptoicons.org/api/color/${props.item.symbol.toLowerCase()}/200` }} />
      </View>

      <View style={{flex:1, flexDirection:'row', justifyContent:'space-between' }}>

        <View style={{  }}>
          <Text style={{ fontSize: 25, fontWeight: '700' }}>{props.item.cryptocurrency}</Text>
          <Text style={styles.walletAssetTitle}>£000.00 ▲ 0.00%</Text>
          <Text style={styles.walletAssetTitle}>{props.item.value} {props.item.symbol}</Text>
        </View>

        <View style={{ }}>
          <LineChart
            data={{
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
                  ]
                }
              ]
            }}
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
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
  )
}

const styles = StyleSheet.create({
  cryptoWallet: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cryptoWalletTitle: {
    fontWeight: '900',
    fontSize: 40,
    alignSelf: 'center',
    paddingVertical: 10,
  },
  backArrow: {
    fontWeight: '900',
    fontSize: 30,
    position: 'absolute',
    marginLeft: 10,
  },
  walletList: {
    //borderRadius: 15,
    marginHorizontal: 10,
    marginVertical: 30,
  },
  walletAsset: {
    backgroundColor: '#e5e5e5',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    flexDirection:'row',
  },
  walletAssetTitle: {
    fontWeight: '700',
    flex:1,
  },
  walletAssetImage: {
    width: 30,
    height: 30,
  }
});
