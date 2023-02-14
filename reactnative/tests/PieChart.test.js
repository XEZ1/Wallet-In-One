// PieChart.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import PieChartWallet from '../screens/charts/PieChart';
import renderer from 'react-test-renderer';

describe('<PieChartWallet />', () => {
    it('snapshot test', () => {
        const snapshot = renderer.create(<PieChartWallet />).toJSON();
        expect(snapshot).toMatchSnapshot();
      });

      it('displays the text "Wallet-In-One"', () => {
        const { getByText } = render(<PieChartWallet />);
        const walletInOne = getByText('Wallet-In-One');
        expect(walletInOne).toBeDefined();
      });
  });
