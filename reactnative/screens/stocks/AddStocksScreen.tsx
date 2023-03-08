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
  const [account_id, setAccountID] = useState()
  const [name, setName] = useState()
  const [list, setList] = useState()
  const [institution_name, setInstitutionName] = useState()
  const [institution_id, setInstitutionID] = useState()
  const [imageState, setImage] = useState()
  const isFocused = useIsFocused()
  //const [access_token, setAccessToken] = useState()
  //const [stocks, setStocks] = useState(null)
  let access_token = ''
  let balance = ''
  let image = ''
  let fetched_transaction_list = null
  let transactions_stock_account_id = ''
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
    
    
  // const listAccounts = async () => {
  //   const response = await auth_get('/stocks/list_accounts/')
  //   setList
  // fetch(api_url + '/stocks/list_accounts/', {
  //   method: "GET",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
  //   },
  // }).then(async (res) => setList(await res.json()))};

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
    // setAccessToken(data.access_token)
  }

  const getBalance = async (accessToken) => {
    const body = {
      access_token: accessToken
    }
    const response = await auth_post('/stocks/get_balance/', body)
    const data = response.body;
    console.log((parseFloat(data.accounts[0].balances.current)*0.83).toFixed(2))
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
    console.log(data)
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


  const addTransaction = async (element) => {
    const body = {
      account_id: element.account_id,
      investment_transaction_id: element.investment_transaction_id,
      security_id: element.security_id,
      date: element.date,
      name: element.name,
      quantity: element.quantity,
      amount: element.amount,
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
    console.log(data.logo)
    image = data.logo
    setImage(data.logo)
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
      {/* <Image
        style={{ width: 152, height: 152 }}
        source={{ uri: `data:image/png;base64,${imageState}` }}
      /> */}
      <PlaidLink
      linkToken={linkToken}
      onEvent={(event) => console.log(event)}
      onExit={(exit) => console.log(exit)}
      onSuccess={async (success) => {
        let account_list = success.metadata.accounts
        // let access_token = await SecureStore.getItemAsync('access_token')
        // if(access_token == null){
        await getAccessToken(success.publicToken)
        console.log(access_token)
          // console.log("krishna")
        // }
        await getBalance(access_token)
        // console.log("krishna")
        await getStocks(access_token)
        console.log(success.metadata.accounts[0].meta)
        console.log(success.publicToken)

        account_list.forEach(async element => {
          // setAccountID(element._id)
          // console.log(element._id)
          // setName(element.meta.name)
          // console.log(element.meta.name)
          // setInstitutionName(success.metadata.institution.name)
          // console.log(success.metadata.institution.name)
          // setInstitutionID(success.metadata.institution.id)
          // console.log(success.metadata.institution.id)
          await getLogo(success)
          await addAccount(element, success)
          // while(data_response == undefined){
          //   console.log(data_response)
          // }
          console.log(data_response)
          console.log(data_response.status)

          if(data_response != 400){
            await getTransaction(access_token)
            // console.log("fetched_transaction_list: ")
            // console.log(fetched_transaction_list.accounts)
            // // console.log(fetched_transaction_list.accounts[0])
            // console.log(fetched_transaction_list.accounts[0].account_id)
            fetched_transaction_list.investment_transactions.forEach(element => {addTransaction(element)})
    
            stocks.forEach(element => {
              let stockInfo = securities[stocks.indexOf(element)]
              addStock(element, stockInfo)
              console.log(element.quantity)
            })
            // listAccounts()
            // listTransactions()
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
          }}
        >
        <Text style={styles.textStyle}>Close</Text>
        </Pressable>
      </View>
    </Animated.View>
    </Modal>

    <Pressable
      style={[styles.button]}
      onPress={() => setModalVisible(true)}
    >
      <Text style={styles.textStyle}>Show Modal</Text>
    </Pressable>
  </View>
    </>
  );
};


const styles = StyleSheet.create({
  // centeredView: {
  //   flex: 1,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginTop: 22,
  // },
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
  // buttonOpen: {
  //   backgroundColor: '#F194FF',
  // },
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