const images = {
  'BTC': require('./BTC.png'),
  'BCH': require('./BCH.png'),
  'LTC': require('./LTC.png'),
  'DOGE': require('./DOGE.png'),
  'DASH': require('./DASH.png'),
  'GRS': require('./GRS.png'),
  'ZEC': require('./ZEC.png'),
  'XEC': require('./XEC.png'),
  'Binance': require('./Binance.png'),
  'GateIo': require('./Gateio.png'),
  'CoinList': require('./Coinlist.png'),
  'CoinBase': require('./Coinbase.png'),
  'Kraken': require('./Kraken.png'),
}

export default function getCryptoIcon(symbol) {
  return images[symbol];
}