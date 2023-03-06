const images = {
  'BTC': require('./BTC.png'),
  'DOGE': require('./DOGE.png'),
  'Binance': require('./Binance.png'),
  'Huobi': require('./Huobi.png'),
  'Gateio': require('./Gateio.png'),
  'Coinlist': require('./Coinlist.png'),
  'Coinbase': require('./Coinbase.png'),
  'Kraken': require('./Kraken.png'),
}

export default function getCryptoIcon(symbol) {
  return images[symbol];
}