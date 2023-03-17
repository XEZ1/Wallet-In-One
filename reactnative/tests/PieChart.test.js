import React from 'react';
import PieChart from '../screens/charts/chartComponents/pieChart';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';

var data = {
    "all": [
        {
          "x": "Credit Card",
          "y": 200
        },
        {
          "x": "Cryptocurrency",
          "y": 50
        },
        {
          "x": "Stocks",
          "y": 75
        },
        {
          "x": "Debit Card",
          "y": 20
        }
    ]
  }

var colours = ["pink", "turquoise", "lime", "#FA991C"]
const handlePressIn = (event, datapoint)=>{console.log(datapoint)};

describe('<PieChart />', () => {
    it('test 4 label pie chart', () => {
        const snapshot = renderer.create(<PieChart colours={colours} data={data} handlePressIn={handlePressIn} labelCount={4} assetSize={17} numSize={27} />);
        expect(snapshot).toMatchSnapshot();         
      });

    it('test 2 label pie chart', () => {
        const snapshot = renderer.create(<PieChart colours={colours} data={data} handlePressIn={handlePressIn} labelCount={2} assetSize={27} numSize={37} />);
        expect(snapshot).toMatchSnapshot();         
      });
  });