import { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { BACKEND_URL } from "@env"

/*
  Test BTC Address:
  1Lbcfr7sAHTD9CgdQo3HTMTkV8LK4ZnX71
 */
export default function useCryptoExchange() {
  const [exchange, setExchange] = useState([]);

  const fetchExchanges = async () => {
    fetchBinance();
    fetchHuobi();
    fetchGateio();
    fetchCoinlist();
    fetchCoinbase();
    fetchKraken();
  };

  const fetchBinance = async () => {
    await fetch(`${BACKEND_URL}/crypto-exchanges/binance/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => setExchange(res))
        .catch((err) => console.log(err));
  }

  const fetchHuobi = async () => {
    await fetch(`${BACKEND_URL}/crypto-exchanges/huobi/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => setExchange(res))
        .catch((err) => console.log(err));
  }

  const fetchGateio = async () => {
    await fetch(`${BACKEND_URL}/crypto-exchanges/gateio/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => setExchange(res))
        .catch((err) => console.log(err));
  }

  const fetchCoinlist = async () => {
    await fetch(`${BACKEND_URL}/crypto-exchanges/coinlist/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => setExchange(res))
        .catch((err) => console.log(err));
  }

  const fetchCoinbase = async () => {
    await fetch(`${BACKEND_URL}/crypto-exchanges/coinbase/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => setExchange(res))
        .catch((err) => console.log(err));
  }

  const fetchKraken = async () => {
    await fetch(`${BACKEND_URL}/crypto-exchanges/kraken/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${await SecureStore.getItemAsync("token")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => setExchange(res))
        .catch((err) => console.log(err));
  }

  return { exchange, fetchExchanges };
}
