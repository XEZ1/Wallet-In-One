import React, { useState, useEffect } from 'react';
import { Button, Text, Image } from 'react-native';
import { LinkSuccess, LinkExit} from 'react-native-plaid-link-sdk';
import PlaidLink from '@burstware/expo-plaid-link'
import * as SecureStore from 'expo-secure-store';
import { api_url } from '../../authentication';
import { useIsFocused } from '@react-navigation/native';

import {Alert, Modal, StyleSheet, Pressable, View, Animated} from 'react-native';

const PlaidComponent = ({ navigation }) => {
  const [linkToken, setLinkToken] = useState<string | undefined>(undefined)
  const [account_id, setAccountID] = useState()
  const [name, setName] = useState()
  const [list, setList] = useState()
  const [institution_name, setInstitutionName] = useState()
  const [institution_id, setInstitutionID] = useState()
  const [imageState, setImage] = useState()

  const [modalVisible, setModalVisible] = useState(false);
  const [modalText, setModalText] = useState("Modal");
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
    await fetch(api_url + '/stocks/add_stock_account/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({
        account_id: account._id,
        name: account.meta.name,
        institution_name: success.metadata.institution.name,
        institution_id: success.metadata.institution.id,
        access_token: access_token,
        balance: balance,
        institution_logo: image,
      }),
    }).then(res => res.json().then(data => ({status: res.status, body: data})) )
    .then((data) => console.log(data.status))
    .then((data) => data_response = data)
    };
    
    
  const listAccounts = async () => {

  fetch(api_url + '/stocks/list_accounts/', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
    },
  }).then(async (res) => setList(await res.json()))};

  useEffect(() => {
  const initiatePlaidLink = async () => {
    // if(access_token == null)
    // {
      let token = await SecureStore.getItemAsync('token')
      const response = await fetch(api_url + '/stocks/initiate_plaid_link/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token '+ token
        },
        body: JSON.stringify({
          // any additional parameters needed for the Django view
        }),
      });
      const data = await response.json();
      setLinkToken(data.link_token);
      // console.log(linkToken);
    // }
    // else{
    //   setLinkToken(access_token);
    //   console.log(access_token)
    // }
  };
  if(isFocused){initiatePlaidLink()}
}, [isFocused])

  const getAccessToken = async (publicToken) => {
    const response = await fetch(api_url + '/stocks/get_access_token/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({ public_token: publicToken }),
    });
    const data = await response.json();
    access_token = data.access_token
    // setAccessToken(data.access_token)
  }

  const getBalance = async (accessToken) => {
    const response = await fetch(api_url + '/stocks/get_balance/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({ access_token: accessToken }),
    });
    const data = await response.json();
    console.log((parseFloat(data.accounts[0].balances.current)*0.83).toFixed(2))
    balance = (parseFloat(data.accounts[0].balances.current)*0.83).toFixed(2) 
  }

  const getStocks = async (accessToken) => {
    const response = await fetch(api_url + '/stocks/get_stocks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({ access_token: accessToken }),
    });
    const data = await response.json();
    stocks = data.holdings
    securities = data.securities
    console.log(data)
  }

  const addStock = async (stock, stockInfo) => {
    await fetch(api_url + '/stocks/add_stock/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({
        institution_price: (stock.institution_price).toFixed(2),
        quantity: stock.quantity,
        name: stockInfo.name,
        ticker_symbol: stockInfo.ticker_symbol,
        stockAccount: stock.account_id
      }),
    }).then(res => res.json().then(data => ({status: res.status, body: data})) )
    .then((data) => console.log(data))
  }

  const getTransaction = async (accessToken) => {
    const response = await fetch(api_url + '/stocks/get_transactions/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({ access_token: accessToken }),
    });
    const data = await response.json();
    // console.log("Get transaction data")
    // console.log(data)
    fetched_transaction_list = data
  }

  // {'investment_transaction_id': '1pkroJ4L3bHd5ZQoBNweTAwaEgL1wrFZAAND5',
  //  'account_id': 'VAeoMpawGbFv3mnPKk8AiKVW98MKmbUqNdk7g', 
  //  'security_id': 'abJamDazkgfvBkVGgnnLUWXoxnomp5up8llg4',
  //   'date': datetime.date(2023, 2, 7), 
  //   'name': 'SELL iShares Inc MSCI Brazil', 
  //   'quantity': -49.02909689729298, 
  //   'amount': -2066.58,
  //    'price': 41.62, 
  //    'fees': 0.0, 
  //    'type': 'sell',
  //     'subtype': 'sell',
  //      'iso_currency_code': 'USD', 
  //      'unofficial_currency_code': None, 
  //      'cancel_transaction_id': None
  //     }

  const addTransaction = async (element) => {
    await fetch(api_url + '/stocks/add_transaction_account/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      }, 
      body: JSON.stringify({
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
        // pending: element.pending,
        // transaction_type: element.transaction_type,
      }),
    })
    .then(res => res.json().then(data => ({status: res.status, body: data})))
    .then((data) => console.log(data))
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

  

  return (
    <>
      <Image
        style={{ width: 152, height: 152 }}
        source={{ uri: `data:image/png;base64,${imageState}` }}
      />
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
          addAccount(element, success)
          console.log(data_response)

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
        
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View >
          <View style={styles.modalView}>
            <Text style={styles.modalText}>{modalText}</Text>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable
        style={[styles.button]}
        onPress={() => setModalVisible(true)}>
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
});

export default PlaidComponent;