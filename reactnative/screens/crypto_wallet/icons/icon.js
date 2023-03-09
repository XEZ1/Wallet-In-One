const images = {
  'BTC': require('./BTC.png'),
  'DOGE': require('./DOGE.png'),
  'Binance': require('./Binance.png'),
  'Huobi': require('./Huobi.png'),
  'GateIo': require('./Gateio.png'),
  'CoinList': require('./Coinlist.png'),
  'CoinBase': require('./Coinbase.png'),
  'Kraken': require('./Kraken.png'),
}

export default function getCryptoIcon(symbol) {
  return images[symbol];
}