import React from 'react';
import { render, screen, fireEvent, act, within, waitFor} from '@testing-library/react-native';
import BankInsights from '../../screens/banking/BankInsights'
import testData from './fixtures/metrics.json'

global.fetch =  jest.fn( async (api, data ) => {
    return Promise.resolve({
        status: 200, json: () => testData
    })

})

describe('<BankInsights />', () => {
    it('snapshot test', async () => {
        

        const snapshot = render(<BankInsights/>);

        await act( async () => {
            
            await waitFor( () => {
                const activityIndicator = screen.UNSAFE_queryByType('ActivityIndicator');
                expect(activityIndicator).toBeNull();
            })

        });

        expect(snapshot).toMatchSnapshot();
    }
    )
});