import React from 'react';
import { render } from '@testing-library/react-native';
import ExchangeTransactions from '../../screens/cryptoExchanges/ExchangeTransactions';



describe('ExchangeTransactions', () => {
  const props = {
    route: {
      params: {
        item: {
          id: 1,
          crypto_exchange_name: 'Test Exchange',
        },
        removeExchange: jest.fn(),
      },
    },
    navigation: {
      goBack: jest.fn(),
    },
  };

  it('renders correctly', () => {
    const { toJSON } = render(<ExchangeTransactions {...props} />);
    expect(toJSON()).toMatchSnapshot();
  });
});