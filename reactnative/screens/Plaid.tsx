import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import { LinkSuccess, LinkExit} from 'react-native-plaid-link-sdk';
import PlaidLink from '@burstware/expo-plaid-link'
import * as SecureStore from 'expo-secure-store';

const PlaidComponent = ({ navigation }) => {
  const [linkToken, setLinkToken] = useState('');
  const [account_id, setAccountID] = useState();
  const [name, setName] = useState();

  const addAccount = () => {
    fetch('http://10.0.2.2:8000/stocks/add_stock_account/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        account_id: account_id,
        name: name
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
  }).then((res) => console.log(res.json()))};

  const initiatePlaidLink = async () => {
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
  };

  return (
    <>
      <Button title="Connect with Plaid" onPress={initiatePlaidLink} />
      <PlaidLink
      linkToken={linkToken}
      onEvent={(event) => console.log(event)}
      onExit={(exit) => console.log(exit)}
      onSuccess={(success) => {
        setAccountID(success.metadata.accounts[0]._id)
        setName(success.metadata.accounts[0].meta.name)
        addAccount()
        listAccounts()
      }}
    />
    </>
  );
};

export default PlaidComponent;