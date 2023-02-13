import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { BACKEND_URL } from "@env"

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
    await fetch(`${BACKEND_URL}/crypto_wallets/`, {
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
      .then((res) => {
        if (!res.ok) throw new Error("Bad response from server");
        return res.json()
        }
      )
      .then((res) => setWallets([...wallets, res])) // Handle 400
      .catch((err) => console.log(err));
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
