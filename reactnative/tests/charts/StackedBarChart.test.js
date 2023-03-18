import React from 'react';
import StackedChart from '../../screens/charts/chartComponents/stackedBarChart';
import renderer from 'react-test-renderer';

var data = {
    "all": [
      {
        "type": "Banks",
        "assets": [
          {
            "asset": "Savings",
            "y": 50
          },
          {
            "asset": "Checking",
            "y": 50
          }
        ]
      },
      {
        "type": "Crypto",
        "assets": [
          {
            "asset": "Bitcoin",
            "y": 30
          },
          {
            "asset": "Ethereum",
            "y": 30
          },
          {
            "asset": "Ethereum",
            "y": 20
          }
        ]
      },
      {
        "type": "Stocks",
        "assets": [
          {
            "asset": "Apple",
            "y": 50
          },
          {
            "asset": "Microsoft",
            "y": 50
          }
        ]
      }
    ]
  }

  var floatData = {
    "all": [
      {
        "type": "Banks",
        "assets": [
          {
            "asset": "Savings",
            "y": 50.10
          },
          {
            "asset": "Checking",
            "y": 50.29
          }
        ]
      },
      {
        "type": "Crypto",
        "assets": [
          {
            "asset": "Bitcoin",
            "y": 30.43
          },
          {
            "asset": "Ethereum",
            "y": 30.24
          },
          {
            "asset": "Ethereum",
            "y": 20.54
          }
        ]
      },
      {
        "type": "Stocks",
        "assets": [
          {
            "asset": "Apple",
            "y": 50.93
          },
          {
            "asset": "Microsoft",
            "y": 50.26
          }
        ]
      }
    ]
  }

  var emptyData = {"all": []}

const handlePressIn = (event, datapoint)=>{console.log(datapoint)};

describe('<StackedChart />', () => {
    it('test stacked bar chart', () => {
        const stackedChart = renderer.create(<StackedChart data={data.all} handlePressIn={handlePressIn} />);
        expect(stackedChart).toMatchSnapshot();         
      });

    it('test stacked bar chart with float values', () => {
        const stackedChart = renderer.create(<StackedChart data={floatData.all} handlePressIn={handlePressIn} />);
        expect(stackedChart).toMatchSnapshot();      
      });

    it('test stacked bar chart with empty data', () => {
        const stackedChart = renderer.create(<StackedChart data={emptyData.all} handlePressIn={handlePressIn} />);
        expect(stackedChart).toMatchSnapshot();      
      });

  });