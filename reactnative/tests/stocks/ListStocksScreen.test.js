import React from "react";
import { render, screen, fireEvent, act, waitFor} from '@testing-library/react-native';
import SuccessComponent from "../../screens/stocks/ListStocksScreen";
import stocks from './fixtures/stocks.json'
import transactions from './fixtures/transaction.json'

describe('<SuccessComponent />', () => {

    beforeEach(() => {
        global.fetch =  jest.fn( async (url) => {
            if(url.includes('list_accounts')){
            return Promise.resolve({
                status: 200, json: () => stocks.all
            })
            }
            else{
                return Promise.resolve({
                    status: 200, json: () => transactions.all
                })
            }
        })
      })

      afterEach(() => {
        global.fetch.mockClear();
        delete global.fetch;
      })

      it('listStocksScreen snapshot test', async () => {
        const listStocksScreen = render(<SuccessComponent />);

            await waitFor( () => {
                const loading = screen.UNSAFE_queryByType('ActivityIndicator');
                expect(loading).toBeNull();
            })
        expect(listStocksScreen).toMatchSnapshot();
    }
    )
})
