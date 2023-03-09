import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from 'reactnative/src/theme/ThemeProvider'
import {styles} from 'reactnative/screens/All_Styles.style.js'


export default function CryptoExchanges({ navigation }) {

  const {dark, colors, setScheme} = useTheme();

  const stylesInternal = StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      paddingTop: 20,
      flex: 1,
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      backgroundColor: colors.background,
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
  });

  return (
    <View style={stylesInternal.container}>
      <View style={stylesInternal.titleContainer}>
        <Pressable onPress={() => navigation.navigate('Crypto exchanges')}>
          <Text style={styles(dark, colors).backArrow}>←</Text>
        </Pressable>
        <Text style={[styles(dark, colors).textBold, {fontSize: 25}]}>
          Add a cryptocurrency account from an exchange:
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Binance')}
        style={[styles(dark, colors).buttonWide, { width: Dimensions.get('window').width - 40 }]}
      >
        <Text style={[styles(dark, colors).textBold, {textAlign: 'center'}]}>Binance</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Huobi')}
        style={[styles(dark, colors).buttonWide, { width: Dimensions.get('window').width - 40 }]}
      >
        <Text style={[styles(dark, colors).textBold, {textAlign: 'center'}]}>Huobi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Gateio')}
        style={[styles(dark, colors).buttonWide, { width: Dimensions.get('window').width - 40 }]}
      >
        <Text style={[styles(dark, colors).textBold, {textAlign: 'center'}]}>Gateio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('CoinList')}
        style={[styles(dark, colors).buttonWide, { width: Dimensions.get('window').width - 40 }]}
      >
        <Text style={[styles(dark, colors).textBold, {textAlign: 'center'}]}>Coinlist</Text>
        <Text style={styles.buttonText}>Coinlist</Text>
      </TouchableOpacity>
    </View>
  );

}


