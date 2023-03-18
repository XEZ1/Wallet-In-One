import React from 'react';
import { render, screen, fireEvent, act, waitFor} from '@testing-library/react-native';
import StockInsight from '../../screens/stocks/StocksInsightScreen';
import insights from './fixtures/insights.json'

global.fetch =  jest.fn( async () => {
    return Promise.resolve({
        status: 200, json: () => insights
    })
})

describe('<StockInsight />', () => {
    it('stockInsight snapshot test', async () => {
        

        const stockInsight = render(<StockInsight/>);

            await waitFor( () => {
                const loading = screen.UNSAFE_queryByType('ActivityIndicator');
                expect(loading).toBeNull();
            })
        expect(stockInsight).toMatchSnapshot();
    }
    )
});