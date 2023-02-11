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
  });
