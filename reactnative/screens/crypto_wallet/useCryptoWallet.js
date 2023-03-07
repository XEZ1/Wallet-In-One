import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { BACKEND_URL } from "@env"
import {Alert} from "react-native";

/*
  Test BTC Address:
  1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71
 */
export default function useCryptoWallet() {
  const [wallets, setWallets] = useState([]);

  const fetchWallets = async () => {
    await fetch(`${BACKEND_URL}/crypto_wallets/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
    })
      .then((res) => res.json())
      .then((res) => setWallets(res))
      .catch((err) => console.log(err));
  };

  const connectWallet = async (cryptocurrency, symbol, address) => {
    const response = await fetch(`${BACKEND_URL}/crypto_wallets/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({
        cryptocurrency: cryptocurrency,
        symbol: symbol,
        address: address,
      }),
    })
      .catch((err) => console.log(err));

    const data = await response.json()

    if (response.status === 200) setWallets([...wallets, response])
    else Alert.alert("Connection Fault", `Error - ${data.address[0].toLowerCase()}`)
  };

  const removeWallet = async (id) => {
    await fetch(`${BACKEND_URL}/crypto_wallets/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({
        id: id
      }),
    })
      .then(() => setWallets(wallets.filter(wallet => wallet.id !== id)))
      .catch((err) => console.log(err));

    }

  return { wallets, fetchWallets, connectWallet, removeWallet };
}
