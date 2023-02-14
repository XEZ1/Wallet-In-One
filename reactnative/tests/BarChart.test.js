// PieChart.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import BarChartWallet from '../screens/charts/BarChart';
import renderer from 'react-test-renderer';

describe('<BarChartWallet />', () => {
    it('snapshot test', () => {
        const snapshot = renderer.create(<BarChartWallet />).toJSON();
        expect(snapshot).toMatchSnapshot();
      });

      it('displays the text "Wallet-In-One"', () => {
        const { getByText } = render(<BarChartWallet />);
        const walletInOne = getByText('Wallet-In-One');
        expect(walletInOne).toBeDefined();
      });

      it('switch chart button test', () => {
        const navigate = jest.fn();
        const { getByTestId } = render(<BarChartWallet navigation={{ navigate }} />);
        fireEvent.press(getByTestId('Switch Chart'));
        expect(navigate).toHaveBeenCalledWith('Pie Chart');
      });
  });
