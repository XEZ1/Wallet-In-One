import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import { LinkSuccess, LinkExit} from 'react-native-plaid-link-sdk';
import PlaidLink from '@burstware/expo-plaid-link'
import * as SecureStore from 'expo-secure-store';

const PlaidComponent = ({ navigation }) => {
  const [linkToken, setLinkToken] = useState<string | undefined>(undefined)
  const [account_id, setAccountID] = useState()
  const [name, setName] = useState()
  const [list, setList] = useState()
  const [institution_name, setInstitutionName] = useState()
  const [institution_id, setInstitutionID] = useState()
  //const [access_token, setAccessToken] = useState()
  let access_token = ''
  let balance = ''

  const addAccount = async (account, success) => {
    await fetch('http://10.0.2.2:8000/stocks/add_stock_account/', {
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
      }),
    }).then(res => res.json().then(data => ({status: res.status, body: data})) )
    .then((data) => console.log(data))
    };
    
  const listAccounts = async () => {

  fetch('http://10.0.2.2:8000/stocks/list_accounts/', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
    },
  }).then(async (res) => setList(await res.json()))};

  const initiatePlaidLink = async () => {
    // if(access_token == null)
    // {
      let token = await SecureStore.getItemAsync('token')
      const response = await fetch('http://10.0.2.2:8000/stocks/initiate_plaid_link/', {
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
      console.log(linkToken);
    // }
    // else{
    //   setLinkToken(access_token);
    //   console.log(access_token)
    // }
  };

  const getAccessToken = async (publicToken) => {
    const response = await fetch('http://10.0.2.2:8000/stocks/get_access_token/', {
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
    const response = await fetch('http://10.0.2.2:8000/stocks/get_balance/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({ access_token: accessToken }),
    });
    const data = await response.json();
    console.log(data.accounts[0].balances)
    balance = parseFloat(data.accounts[0].balances.current).toFixed(2) 
  }

  const getStocks = async (accessToken) => {
    const response = await fetch('http://10.0.2.2:8000/stocks/get_stocks/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({ access_token: accessToken }),
    });
    const data = await response.json();
    console.log(data)
  }

  return (
    <>
      <Button title="Add Stock Account" onPress={initiatePlaidLink} />
      {list ? (<Text>{JSON.stringify(list)}</Text>):''}
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
          // getBalance(access_token)
          // console.log("krishna")
        // }
        await getBalance(access_token)
        console.log("krishna")
        await getStocks(access_token)
        console.log(success.metadata.accounts[0].meta)
        console.log(success.publicToken)
        // await fetch(`http://10.0.2.2:8080/api/exchange_public_token`, {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({ public_token: success.publicToken }),
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //   });

        account_list.forEach(element => {
          // setAccountID(element._id)
          // console.log(element._id)
          // setName(element.meta.name)
          // console.log(element.meta.name)
          // setInstitutionName(success.metadata.institution.name)
          // console.log(success.metadata.institution.name)
          // setInstitutionID(success.metadata.institution.id)
          // console.log(success.metadata.institution.id)
          addAccount(element, success)
        });
        // listAccounts()
      }}
    />
    </>
  );
};

export default PlaidComponent;