import React from "react";
import { render, screen, fireEvent, act, waitFor} from '@testing-library/react-native';
import PlaidComponent from "../../screens/stocks/AddStocksScreen";
import { PlaidEnvironments, Configuration, PlaidApi,  } from 'plaid';
import { describe } from "@jest/globals";


const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': '63ef90fc73e3070014496336',
      'PLAID-SECRET': 'a57f2537ac53e9842da752b987bb5b',
    },
  },
});

const client = new PlaidApi(configuration);
prods = ['investments', 'transactions'];

describe('<PlaidComponent />', () => {

    beforeEach(() => {
        global.fetch =  jest.fn( async (url) => {
            const request = await client.linkTokenCreate({
                products: prods,
                client_name: "KCL",
                country_codes: ['GB'],
                language: 'en',
                user: {
                    client_user_id: '1',
                  },
            })
            if(url.includes('/stocks/initiate_plaid_link/')){
            return Promise.resolve({
                status: 200, json: () => ({ link_token: request.data.link_token })
            })
            }
            else if(url.includes('get_access_token')){
                return Promise.resolve({
                    status: 200, json: () => 'access-sandbox-c314b575-cc3d-4897-ae93-c792eb4c2d7c'
                })
            }
            else if(url.includes('get_balance')){
                return Promise.resolve({
                    status: 200, json: () => '200.00'
                })
            }
        })
      })

    afterEach(() => {
        global.fetch.mockClear();
        delete global.fetch;
      })
    
    it('addStocksScreen snapshot test', async () => {
        const addStocksScreen = render(<PlaidComponent />);
        expect(addStocksScreen).toMatchSnapshot();
    }
    )
})