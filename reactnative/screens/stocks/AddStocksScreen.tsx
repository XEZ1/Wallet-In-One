import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import { LinkSuccess, LinkExit} from 'react-native-plaid-link-sdk';
import PlaidLink from '@burstware/expo-plaid-link'
import * as SecureStore from 'expo-secure-store';

const PlaidComponent = ({ navigation }) => {
  const [linkToken, setLinkToken] = useState()
  const [account_id, setAccountID] = useState()
  const [name, setName] = useState()
  const [list, setList] = useState()
  const [institution_name, setInstitutionName] = useState()
  const [institution_id, setInstitutionID] = useState()

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
      {list ? (<Text>{JSON.stringify(list)}</Text>):''}
      <PlaidLink
      linkToken={linkToken}
      onEvent={(event) => console.log(event)}
      onExit={(exit) => console.log(exit)}
      onSuccess={(success) => {
        let account_list = success.metadata.accounts
        console.log(success.metadata.accounts[0].meta)

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