// PieChart.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import BarChartWallet from '../screens/charts/BarChart';
import renderer from 'react-test-renderer';

describe('<BarChartWallet />', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<BarChartWallet />).toJSON();
        expect(tree).toMatchSnapshot();
      });

      it('displays the text "Wallet-In-One"', () => {
        const { getByText } = render(<BarChartWallet />);
        const walletInOne = getByText('Wallet-In-One');
    
        expect(walletInOne).toBeDefined();
        expect(walletInOne.props.children).toEqual('Wallet-In-One');
      });
  });
