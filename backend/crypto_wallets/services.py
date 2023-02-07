import requests


def fetch_balance(address):
    # Handle unknown address
    # address = 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
    url = f'https://blockchain.info/rawaddr/{address}?limit=0'
    r = requests.get(url=url)
    response = r.json()

    return response['final_balance'] / 100_000_000
