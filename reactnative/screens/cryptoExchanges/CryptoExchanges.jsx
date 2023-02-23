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


export default function CryptoExchanges({ navigation }) {

  const {dark, colors, setScheme} = useTheme();

  const styles = StyleSheet.create({
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
    title: {
      fontSize: 25,
      color: colors.text,
    },
    button: {
      padding: 20,
      borderRadius: 10,
      marginVertical: 10,
      backgroundColor: colors.primary,
    },
    buttonText: {
      textAlign: 'center',
      fontWeight: 'bold',
      color: colors.text,
    },
    backArrow: {
      fontWeight: '900',
      fontSize: 30,
      marginRight: 10,
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Pressable onPress={() => navigation.navigate('Crypto exchanges')}>
          <Text style={styles.backArrow}>←</Text>
        </Pressable>
        <Text style={styles.title}>
          Add a cryptocurrency account from an exchange:
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => navigation.navigate('Binance')}
        style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
      >
        <Text style={styles.buttonText}>Binance</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Huobi')}
        style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
      >
        <Text style={styles.buttonText}>Huobi</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Gateio')}
        style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
      >
        <Text style={styles.buttonText}>Gateio</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('CoinList')}
        style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
      >
        <Text style={styles.buttonText}>Coinlist</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Coinbase')}
        style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
      >
        <Text style={styles.buttonText}>Coinbase</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Kraken')}
        style={[styles.button, { width: Dimensions.get('window').width - 40 }]}
      >
        <Text style={styles.buttonText}>Kraken</Text>
      </TouchableOpacity>
    </View>
  );

}


