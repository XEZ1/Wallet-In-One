import React from 'react';
import { render, screen, fireEvent, act, waitFor} from '@testing-library/react-native';
import StockDetails from '../../screens/stocks/StockDetails';
import transactions from './fixtures/transactions.json';

describe('<StockDetails />', () => {

    beforeEach(() => {
        global.fetch =  jest.fn( async () => {
            return Promise.resolve({
                status: 200, json: () => transactions
            })
        })
      })

      afterEach(() => {
        global.fetch.mockClear();
        delete global.fetch;
      })

    it('stockDetails snapshot test', async () => {
        const stockDetails = render(<StockDetails route={{params: "8E4L9XLl6MudjEpwPAAgivmdZRdBPJuvMPlPb"}}/>);

            await waitFor( () => {
                const loading = screen.UNSAFE_queryByType('ActivityIndicator');
                expect(loading).toBeNull();
            })
        expect(stockDetails).toMatchSnapshot();
    }
    )
})