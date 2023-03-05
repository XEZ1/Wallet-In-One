const images = {
  'BTC': require('./BTC.png'),
  'BCH': require('./BCH.png'),
  'LTC': require('./LTC.png'),
  'DOGE': require('./DOGE.png'),
  'DASH': require('./DASH.png'),
  'GRS': require('./GRS.png'),
  'ZEC': require('./ZEC.png'),
  'XEC': require('./XEC.png'),
}

export default function getCryptoIcon(symbol) {
  return images[symbol];
}