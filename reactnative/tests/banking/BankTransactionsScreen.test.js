import React from 'react';
import { render, screen, fireEvent, act, within, waitFor} from '@testing-library/react-native';
import BankTransactionsScreen from '../../screens/banking/BankTransactionsScreen'
import bank_list from './fixtures/bank_list.json'

global.fetch =  jest.fn( async (api, data ) => {

    return Promise.resolve({
        status: 200, json: () => [{
            "id": "abc",
            "time": "2023-03-12T11:42:32Z",
            "amount_currency": "GBP",
            "amount": "-10.00",
            "info": "t1",
            "account": "def",
            "formatted_amount": {
                "string": "-£10.00",
                "currency": "GBP",
                "amount": "-10.00"
            }
        },
        {
            "id": "def",
            "time": "2023-03-11T11:46:36Z",
            "amount_currency": "GBP",
            "amount": "-10.00",
            "info": "t2",
            "account": "def",
            "formatted_amount": {
                "string": "£10.00",
                "currency": "GBP",
                "amount": "10.00"
            }
        }]
    })

})

describe('<BankTransactionsScreen />', () => {
    it('snapshot test', async () => {
        

        const snapshot = render(<BankTransactionsScreen route={{params: undefined}}/>);

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

describe('<BankTransactionsScreen />', () => {
    it('snapshot test with account id', async () => {
        

        const snapshot = render(<BankTransactionsScreen route={{params: 'abc'}}/>);

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