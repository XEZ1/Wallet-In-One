// PieChart.test.js
import React from 'react';
import { render } from '@testing-library/react-native';
import PieChartWallet from '../screens/charts/PieChart';
import renderer from 'react-test-renderer';

describe('<PieChartWallet />', () => {
    it('renders correctly', () => {
        const tree = renderer.create(<PieChartWallet />).toJSON();
        expect(tree).toMatchSnapshot();
      });

      it('displays the text "Wallet-In-One"', () => {
        const { getByText } = render(<PieChartWallet />);
        const walletInOne = getByText('Wallet-In-One');
    
        expect(walletInOne).toBeDefined();
        expect(walletInOne.props.children).toEqual('Wallet-In-One');
      });
  });
