import { auth_post } from "../../authentication";

export default function AddStocksHelper(){

    const getAccessToken = async (publicToken) => {
        const body = {
          public_token: publicToken
        }
        const response = await auth_post('/stocks/get_access_token/', body)
        return response.body.access_token
    }

    const getBalance = async (accessToken) => {
        const body = {
            access_token: accessToken
        }
        const response = await auth_post('/stocks/get_balance/', body)
        const data = response.body;
        return (parseFloat(data.accounts[0].balances.current)*0.83).toFixed(2)
    }

    const getTransaction = async (accessToken) => {
        const body = {
          access_token: accessToken
        }
        const response = await auth_post('/stocks/get_transactions/', body)
        return response.body
    }

    const addAccount = async (account, success, access_token, balance, image) => {
        const account_data = {
          account_id: account._id,
          name: account.meta.name,
          institution_name: success.metadata.institution.name,
          institution_id: success.metadata.institution.id,
          access_token: access_token,
          balance: balance,
          institution_logo: image,
        }
        await auth_post('/stocks/add_stock_account/', account_data)
    };

    const addTransaction = async (element, fetched_transaction_list) => {
        let latitude = parseFloat(((Math.random() * (7) + 35.5).toFixed(3)))
        let longitude = parseFloat(((Math.random() * (43) + 77).toFixed(3))) * -1
        const body = {
          account_id: element.account_id,
          investment_transaction_id: element.investment_transaction_id,
          security_id: element.security_id,
          date: element.date,
          name: element.name,
          quantity: element.quantity,
          amount: element.amount * 0.83, // to convert to GBP
          price: element.price,
          fees: element.fees,
          stock: fetched_transaction_list.accounts[0].account_id,
          latitude: latitude,
          longitude: longitude
        }
        await auth_post('/stocks/add_transaction_account/', body)
    };

    const addStock = async (stock, stockInfo) => {
        const body = {
          institution_price: (stock.institution_price).toFixed(2),
          quantity: stock.quantity,
          name: stockInfo.name,
          ticker_symbol: stockInfo.ticker_symbol,
          stockAccount: stock.account_id,
          security_id: stockInfo.security_id
        }
        const res = await auth_post('/stocks/add_stock/', body)
        console.log(res.status)
        return res.status
    }

    const getLogo = async (success) => {
        const body = {
          name: success.metadata.institution.name
        }
        const response = await auth_post('/stocks/get_logo/', body)
        return response.body.logo
    }

    const getStocks = async (accessToken) => {
        const body = {
          access_token: accessToken
        }
        const response = await auth_post('/stocks/get_stocks/', body)
        const data = response.body;
        return [data.holdings, data.securities]
    }

    return { getAccessToken, getBalance, getTransaction, addAccount, addTransaction, addStock, getLogo, getStocks };
}