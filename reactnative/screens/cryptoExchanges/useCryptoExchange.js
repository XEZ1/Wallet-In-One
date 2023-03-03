import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { BACKEND_URL } from "@env"


export default function useCryptoExchange() {
  const [exchanges, setExchanges] = useState([]);

  const fetchExchanges = async () => {
    await fetch(`${BACKEND_URL}/crypto-exchanges/`, {
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

  return { exchanges, fetchExchanges };
}
