import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { BACKEND_URL } from "@env"


export default function useCryptoExchange() {
  const [exchanges, setExchanges] = useState([]);

  const fetchExchanges = async () => {
    await fetch('http://10.0.2.2:8000/crypto-exchanges', {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => setExchanges(res))
        .catch((err) => console.log(err));
  }

  const removeExchange = async (id) => {
    await fetch(`http://10.0.2.2:8000/crypto-exchanges`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
      },
      body: JSON.stringify({
        id: id
      }),
    })
      .then(() => setExchanges(exchanges.filter(exchange => exchange.id !== id)))
      .catch((err) => console.log(err));

    }

  return { exchanges, fetchExchanges, removeExchange };
}