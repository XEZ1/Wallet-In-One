import React, { useState } from 'react';
import { Button, Text } from 'react-native';
import { LinkSuccess, LinkExit} from 'react-native-plaid-link-sdk';
import PlaidLink from '@burstware/expo-plaid-link'
import * as SecureStore from 'expo-secure-store';

const PlaidComponent = () => {
  const [linkToken, setLinkToken] = useState('');

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
      onSuccess={(success) => console.log(success.publicToken)}
    />
    </>
  );
};

export default PlaidComponent;