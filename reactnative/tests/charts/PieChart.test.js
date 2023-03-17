import React from 'react';
import PieChart from '../../screens/charts/chartComponents/pieChart';
import renderer from 'react-test-renderer';


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

var floatData = {
    "all": [
        {
          "x": "Credit Card",
          "y": 200.50
        },
        {
          "x": "Cryptocurrency",
          "y": 50.39
        },
        {
          "x": "Stocks",
          "y": 75.27
        },
        {
          "x": "Debit Card",
          "y": 20.21
        }
    ]
  }

var colours = ["pink", "turquoise", "lime", "#FA991C"]
const handlePressIn = (event, datapoint)=>{console.log(datapoint)};

describe('<PieChart />', () => {
    it('test 4 label pie chart', () => {
        const pieChart = renderer.create(<PieChart colours={colours} data={data} handlePressIn={handlePressIn} labelCount={4} assetSize={17} numSize={27} />);
        expect(pieChart).toMatchSnapshot();         
      });

    it('test 2 label pie chart', () => {
        const pieChart = renderer.create(<PieChart colours={colours} data={data} handlePressIn={handlePressIn} labelCount={2} assetSize={27} numSize={37} />);
        expect(pieChart).toMatchSnapshot();         
      });

    it('test float values pie chart', () => {
        const pieChart = renderer.create(<PieChart colours={colours} data={floatData} handlePressIn={handlePressIn} labelCount={4} assetSize={17} numSize={27} />);
        expect(pieChart).toMatchSnapshot();         
      });

    it('test pie chart no props', () => {
        const pieChart = renderer.create(<PieChart />).toJSON();
        expect(pieChart).toBeNull();
        expect(pieChart).toMatchSnapshot();
      });
  });