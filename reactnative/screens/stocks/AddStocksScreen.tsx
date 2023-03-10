import React, { useState, useEffect,useRef  } from 'react';
import { Button, Text, Image ,Dimensions } from 'react-native';
import { LinkSuccess, LinkExit} from 'react-native-plaid-link-sdk';
import PlaidLink from '@burstware/expo-plaid-link'
import * as SecureStore from 'expo-secure-store';
import { api_url } from '../../authentication';
import { useIsFocused } from '@react-navigation/native';
import { auth_post } from '../../authentication';

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


  const addAccount = async (account, success) => {
    const body = {
      account_id: account._id,
      name: account.meta.name,
      institution_name: success.metadata.institution.name,
      institution_id: success.metadata.institution.id,
      access_token: access_token,
      balance: balance,
      institution_logo: image,
    }
    const response = await auth_post('/stocks/add_stock_account/', body)
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
      stockAccount: stock.account_id
    }
    await auth_post('/stocks/add_stock/', body)
  }

  const getTransaction = async (accessToken) => {
    const body = {
      access_token: accessToken
    }
    const response = await auth_post('/stocks/get_transactions/', body)
    fetched_transaction_list = response.body
  }
//19614.54

  const addTransaction = async (element) => {
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
    }
    await auth_post('/stocks/add_transaction_account/', body)
    };


  const getLogo = async (success) => {
    const response = await fetch(api_url + '/stocks/get_logo/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({ name: success.metadata.institution.name }),
    });
    const data = await response.json()
    image = data.logo
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
          }
          setModalVisible(true)
        });
      }}
    />
  <View>
    <Modal
      animationType="none"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
        setModalVisible(false);
      }}
    >
    <Animated.View style={[styles.modal, { transform: [{ scaleX: scaleValue.x }, { scaleY: scaleValue.y }] }]}>
      <View style={styles.modalView}>
        {modalText == "Stock account has been successfully added." && 
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: `https://cdn-icons-png.flaticon.com/512/4436/4436481.png` }}
          />
        }
        {modalText == "Stock account has already been added!" && 
          <Image
            style={{ width: 100, height: 100 }}
            source={{ uri: 'http://www.setra.com/hubfs/Sajni/crc_error.jpg' }}
          />
        }
        <Text style={styles.modalText}>{modalText}</Text>
        <Pressable
          style={[styles.button, styles.buttonClose]}
          onPress={() => {
            Animated.timing(scaleValue, {
              toValue: 0,
              duration: 300,
              useNativeDriver: true,
            }).start(() => setModalVisible(false));
            navigation.navigate("Stock Account List")
          }}
        >
        <Text style={styles.textStyle}>Exit</Text>
        </Pressable>
      </View>
    </Animated.View>
    </Modal>
  </View>
    </>
  );
};


const styles = StyleSheet.create({
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
  modal: {
    
  }
});

export default PlaidComponent;