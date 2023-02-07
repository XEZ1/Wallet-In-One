import {useState} from "react";
import * as SecureStore from "expo-secure-store";

/*
  Test BTC Address:
  1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71
 */
export default function useCryptoWallet() {
  const [wallets, setWallets] = useState([]);

  const fetchWallets = async () => {
    await fetch('http://192.168.1.17:8000/crypto_wallets/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${await SecureStore.getItemAsync('token')}`
      }
    })
      .then(res => res.json())
      .then(res => setWallets(res))
      .catch(err => console.log(err))
  }

  const connectWallet = async (address) => {
    await fetch('http://localhost:8000/crypto_wallets/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Token ${await SecureStore.getItemAsync('token')}`
      },
      body: JSON.stringify({
        'cryptocurrency': 'Bitcoin',
        'symbol': 'BTC',
        'address': address,
      })
    })
      .then(res => res.json())
      .then(res => setWallets([...wallets, res])) // Handle 400
      .catch(err => console.log(err))
  }

  return {wallets, fetchWallets, connectWallet: connectWallet};

}