import React, { useState } from 'react';
import { Button } from 'react-native';
import PlaidLink from 'react-native-plaid-link-sdk';

const PlaidComponent = () => {
  const [linkToken, setLinkToken] = useState('');

  const initiatePlaidLink = async () => {
    const response = await fetch('http://10.0.2.2:8000/initiate_plaid_link/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
      {linkToken && (
        <PlaidLink
          token={linkToken}
          onSuccess={(publicToken, metadata) => {
            // Handle successful Plaid Link flow
          }}
          onExit={() => {
            // Handle user exit from Plaid Link flow
          }}
        />
      )}
    </>
  );
};

export default PlaidComponent;