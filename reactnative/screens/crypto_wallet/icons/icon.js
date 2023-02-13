const images = {
  'BTC': require('./BTC.png'),
  'DOGE': require('./DOGE.png'),
}

export default function getCryptoIcon(symbol) {
  return images[symbol];
}