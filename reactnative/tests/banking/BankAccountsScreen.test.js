import React from 'react';
import { render, screen, fireEvent, act, within, waitFor} from '@testing-library/react-native';
import BankAccountsScreen from '../../screens/banking/BankAccountsScreen'

global.fetch =  jest.fn( async (api, data ) => {
    var response = [
        {
            "id": "1",
            "requisition_id": "None",
            "last_update": "2023-03-17T13:32:01.539829Z",
            "iban": "1234",
            "institution_id": "REVOLUT_REVOGB21",
            "institution_name": "Revolut",
            "institution_logo": "https://cdn.nordigen.com/ais/REVOLUT_REVOGB21.png",
            "color": "#18A7F7",
            "disabled": false,
            "user": 1,
            "balance": {
                "string": "£100",
                "currency": "GBP",
                "amount": "100"
            }
        },
        {
            "id": "2",
            "requisition_id": "None",
            "last_update": "2023-03-17T13:32:01.539829Z",
            "iban": "1234",
            "institution_id": "REVOLUT_REVOGB21",
            "institution_name": "Revolut",
            "institution_logo": "https://cdn.nordigen.com/ais/REVOLUT_REVOGB21.png",
            "color": "#18A7F7",
            "disabled": true,
            "user": 1,
            "balance": {
                "string": "£200",
                "currency": "GBP",
                "amount": "200"
            }
        },
    ]

    return Promise.resolve({
        status: 200, json: () => response
    })

})

describe('<BankAccountsScreen />', () => {
    it('snapshot test', async () => {
        snapshot = render(<BankAccountsScreen />);
        
        await waitFor( () => {
            const activityIndicator = screen.UNSAFE_queryByType('ActivityIndicator');
            expect(activityIndicator).toBeNull();
        })

        expect(snapshot).toMatchSnapshot();
    }
    )
});