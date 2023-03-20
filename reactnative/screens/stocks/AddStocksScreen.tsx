import React, { useState, useEffect,useRef  } from 'react';
import { Button, Text, Image ,Dimensions } from 'react-native';
import PlaidLink from '@burstware/expo-plaid-link'
import * as SecureStore from 'expo-secure-store';
import { api_url } from '../../authentication';
import { useIsFocused } from '@react-navigation/native';
import { auth_post } from '../../authentication';
import { useTheme } from "reactnative/src/theme/ThemeProvider";
import { styles } from "reactnative/screens/All_Styles.style.js";
import ConditionalModal from '../Modal';

import {Alert, Modal, StyleSheet, Pressable, View, Animated} from 'react-native';

const { width, height } = Dimensions.get('window');


const PlaidComponent = ({ navigation }) => {
  const [linkToken, setLinkToken] = useState<string | undefined>(undefined)
  const isFocused = useIsFocused()
  let access_token = ''
  let balance = ''
  let image = ''
  let fetched_transaction_list = null
  let stocks = null
  let securities = null

  let data_response = null

  const stylesInternal = StyleSheet.create({
    modalView: {
      margin: 20,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 35,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2,
    },
    buttonClose: {
      backgroundColor: '#2196F3',
    },
    textStyle: {
      color: 'white',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    modalText: {
      marginBottom: 15,
      textAlign: 'center',
    },
  });

  const account_data = null;

  const addAccount = async (account, success) => {
    const account_data = {
      account_id: account._id,
      name: account.meta.name,
      institution_name: success.metadata.institution.name,
      institution_id: success.metadata.institution.id,
      access_token: access_token,
      balance: balance,
      institution_logo: image,
    }
    const response = await auth_post('/stocks/add_stock_account/', account_data)
    data_response = response.status
  };
    
  useEffect(() => {
  const initiatePlaidLink = async () => {
      const response = await auth_post('/stocks/initiate_plaid_link/')
      setLinkToken(response.body.link_token);
  };
  if(isFocused){initiatePlaidLink()}
}, [isFocused])

  const getAccessToken = async (publicToken) => {
    const body = {
      public_token: publicToken
    }
    const response = await auth_post('/stocks/get_access_token/', body)
    access_token = response.body.access_token
  }

  const getBalance = async (accessToken) => {
    const body = {
      access_token: accessToken
    }
    const response = await auth_post('/stocks/get_balance/', body)
    const data = response.body;
    balance = (parseFloat(data.accounts[0].balances.current)*0.83).toFixed(2) 
  }

  const getStocks = async (accessToken) => {
    const body = {
      access_token: accessToken
    }
    const response = await auth_post('/stocks/get_stocks/', body)
    const data = response.body;
    stocks = data.holdings
    securities = data.securities
  }

  const addStock = async (stock, stockInfo) => {
    const body = {
      institution_price: (stock.institution_price).toFixed(2),
      quantity: stock.quantity,
      name: stockInfo.name,
      ticker_symbol: stockInfo.ticker_symbol,
      stockAccount: stock.account_id,
      security_id: stockInfo.security_id
    }
    const res = await auth_post('/stocks/add_stock/', body)
    if(res.status == 201){
      setModalVisible(true);
    }
  }

  const getTransaction = async (accessToken) => {
    const body = {
      access_token: accessToken
    }
    const response = await auth_post('/stocks/get_transactions/', body)
    fetched_transaction_list = response.body
  }

  const addTransaction = async (element) => {
    let latitude = parseFloat(((Math.random() * (7) + 35.5).toFixed(3)))
    let longitude = parseFloat(((Math.random() * (43) + 77).toFixed(3))) * -1
    const body = {
      account_id: element.account_id,
      investment_transaction_id: element.investment_transaction_id,
      security_id: element.security_id,
      date: element.date,
      name: element.name,
      quantity: element.quantity,
      amount: element.amount * 0.83, // to convert to GBP
      price: element.price,
      fees: element.fees,
      stock: fetched_transaction_list.accounts[0].account_id,
      latitude: latitude,
      longitude: longitude
    }
    const response = await auth_post('/stocks/add_transaction_account/', body)
    };


  const getLogo = async (success) => {
    const body = {
      name: success.metadata.institution.name
    }
    const response = await auth_post('/stocks/get_logo/', body)
    image = response.body.logo
  }
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("Empty Modal");
  const scaleValue = useRef(new Animated.ValueXY({x: 0.5, y: 0.5})).current;


  useEffect(() => {
    if (modalVisible) {
      Animated.timing(scaleValue, {
        toValue: {x: 1, y: 1},
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(scaleValue, {
        toValue: {x: 0, y: 0},
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [modalVisible]);

  const {dark, colors, setScheme } = useTheme();

  return (
    <>
      <PlaidLink
      
      linkToken={linkToken}
      onEvent={(event) => console.log(event)}
      onExit={(exit) => console.log(exit)}
      onSuccess={async (success) => {
        let account_list = success.metadata.accounts
        await getAccessToken(success.publicToken)
        await getBalance(access_token)
        await getStocks(access_token)

        account_list.forEach(async element => {
          await getLogo(success)
          await addAccount(element, success)

          if(data_response != 400){
            await getTransaction(access_token)
            fetched_transaction_list.investment_transactions.forEach(element => {addTransaction(element)})
    
            stocks.forEach(element => {
              let stockInfo = securities[stocks.indexOf(element)]
              addStock(element, stockInfo)
            })
            setModalText("Stock account has been successfully added.")
          }else{
            setModalText("Stock account has already been added!")
            setModalVisible(true);
          }
          // setModalVisible(true)
        });
      }}
    />
  <View>

  
  <ConditionalModal
    headerText={modalText}
    bodyText={
      <View style={stylesInternal.modalView}>
        {modalText == "Stock account has been successfully added." && 
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: `https://cdn-icons-png.flaticon.com/512/4436/4436481.png` }}
          />
        }
        {modalText == "Stock account has already been added!" && 
          <View>
            <Image
              style={{ width: 100, height: 100 }}
              source={{ uri: 'http://www.setra.com/hubfs/Sajni/crc_error.jpg' }}
            />
          </View>
        }
      </View>
    }

    visible={modalVisible}
    onClose={() =>navigation.navigate("Stock Account List")}
    cancelButtonName={"View Stock Accounts"}
    oneButton={true}
  />
  </View>
    </>
  );
};

export default PlaidComponent;