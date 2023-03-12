# Team Wallet-In-One Large Group project

## Team members
The members of the team are:
- Abbas Bin Vakas
- Yusuf Abdulrahman
- Ezzat Alsalibi
- Shozab Anwar Siddique
- Jamal Boustani
- Krishna Prasanna Kumar
- Michael Seiranian
- Matushan Yogaraj

## Software description
The software should be a financial hub where people can link their bankcards, credit cards, stocks, crypto etc. assets and can monitor their current financial status. It should present all the data with multiple graphs to give insight into one's assets with a user-friendly and informative frontend.

## Technology Used
- Django backend
- ReactNative Frontend
- SQL database (PostgresSQL/SQLite)

## External resources and libraries used
reactnative/src/theme folder code partly derived from Youtube video - https://www.youtube.com/watch?v=JD5scyA6v0c
Plaid API Documentation
Plaid API Quickstart Repository
Victory Chart Documentation

## Features
Multiple graphs to represent data with dynamic features.
A dynamic pie chart that shows the current portfolio of a person with different categories. Once you click on a segment of the pie chart it should show another pie chart of a detailed description of the assets (such as particular stocks) within that category.

## Intellectual property arrangements
This software is to be delivered to a client. The developers will retain no access to the source code. The developers retain the moral rights to be identified as the developers of the application or part of the application and can identify the project and the work they did in the project in their CV, social media pages, job interviews, etc.

## Django-Python (Backend): Installation and execution instructions
To install the software and use it in your local development environment, you must first set up and activate a local development environment.  From the root of the project:

Navigate to the `backend` folder:

```
$ cd backend
```

Create a virtual environment

```
$ virtualenv venv
$ source venv/bin/activate
```

Install all required packages:

```
$ pip3 install -r requirements.txt
```

Migrate the database:

```
$ python3 manage.py migrate
```

Run all tests with:

```
$ python3 manage.py test
```

Start the backend of the app:

```
$ python3 manage.py runserver
```

## React Native-Javascript (Frontend)

Navigate to the `reactnative` folder:

```
$ cd reactnative
```

Install all required packages:

```
$ yarn install
```


Run all tests with:

```
$ yarn test
```

Start the frontend of the app:

```
$ npx expo start
```

## Accounts for use
There are multiple assets that can be connected to the app including Bank Accounts, Crypto Wallets, Crypto Exchanges and Stock Brokers. Below are listed some accounts to use for testing purposes. We reccomend using personal accounts where possible.
### Bank Accounts
- Account details are not available for security reasons, users must connect thier own personal accounts.
- Please note that by connecting your account Wallet-In-One can NOT access any sensitive information that may put you at risk.
### Crypto Wallets
- Since balances and transactions of crypto wallets are public, you may use any public address to connect a wallet. These addresses can be found on Google, but here are some example addresses that can be used.
- Bitcoin
  - bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh
  - 1P5ZEDWTKTFGxQjZphgWPQUpe554WKDfHQ
- Bitcoin-Cash
  - pqx5ej6z9cvxc2c7nw5p4s5kf8nzmzc5cqapu8xprq
- Litecoin
  - MGxNPPB7eBoWPUaprtX9v9CXJZoD2465zN
- Dogecoin
  - DMvC38mMGgXKJ1QVEBRCo9Kf8U32ApNN2B
  - 9u2VokzEL1s756PzNoUntcyjzrdgdaHgs7
- Dash
  - XpESxaUmonkq8RaLLp46Brx2K39ggQe226
- Groestlcoin
    - 3E2p6qP9vh4hFfuVQLsxTAziRDDHJ5DnQj
- Zcash
  - t3cKr4YxVPvPBG1mCvzaoTTdBNokohsRJ8n
- eCash
  - qr2z7dusk64qn960h9vspf2ezewl0pla9gcpnk35f0
### Crypto Exchanges
- Account details are not available for security reasons, users must connect thier own personal accounts.
- Please note that by connecting your account Wallet-In-One can NOT access any sensitive information that may put you at risk.
### Stock Brokers
- From the 'Select your institution' page select an Institution
- Credentials to use are
- - User Name: user_good
- - Password: pass_good
- Choose either 'Plaid IRA' or 'Plaid 401k'

## Sources
The packages used by this application are specified in `requirements.txt`
