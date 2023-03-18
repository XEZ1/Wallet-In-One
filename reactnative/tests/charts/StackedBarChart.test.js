import React from 'react';
import StackedChart from '../../screens/charts/chartComponents/stackedBarChart';
import renderer from 'react-test-renderer';

var data = {
    "all": [
        {
            "Banks": [
                {
                    "id": "1",
                    "x": "HSBC Personal", 
                    "y": 9
                }
            ], 
            "Cryptocurrency from exchanges": [
                {
                    "id": 1, 
                    "x": "Binance", 
                    "y": 5
                }
            ], 
            "Cryptocurrency from wallets": [
                {
                    "id": 5, 
                    "x": "BTC Wallet: 3FZbgi29cpjq2Gj...", 
                    "y": 171
                }
            ], 
            "Stock Accounts": [
                {
                    "id": "Px7djDP1w4iev84me19DivRp6p9dJeFoq1j9d", 
                    "x": "Plaid IRA-Vanguard", 
                    "y": 266
                }
            ], 
            "all": [
                {
                    "x": "Banks", 
                    "y": 9
                }, 
                {
                    "x": "Cryptocurrency from wallets", 
                    "y": 171
                }, 
                {
                    "x": "Stock Accounts", 
                    "y": 266
                }, 
                {
                    "x": "Cryptocurrency from exchanges", 
                    "y": 3
                }
            ]
        }
    ]
  }

  var floatData = {
    "all": [
        {
            "Banks": [
                {
                    "id": "1",
                    "x": "HSBC Personal", 
                    "y": 9.45
                }
            ], 
            "Cryptocurrency from exchanges": [
                {
                    "id": 1, 
                    "x": "Binance", 
                    "y": 5.56
                }
            ], 
            "Cryptocurrency from wallets": [
                {
                    "id": 5, 
                    "x": "BTC Wallet: 3FZbgi29cpjq2Gj...", 
                    "y": 171.24
                }
            ], 
            "Stock Accounts": [
                {
                    "id": "Px7djDP1w4iev84me19DivRp6p9dJeFoq1j9d", 
                    "x": "Plaid IRA-Vanguard", 
                    "y": 266.10
                }
            ], 
            "all": [
                {
                    "x": "Banks", 
                    "y": 9.43
                }, 
                {
                    "x": "Cryptocurrency from wallets", 
                    "y": 171.23
                }, 
                {
                    "x": "Stock Accounts", 
                    "y": 266.69
                }, 
                {
                    "x": "Cryptocurrency from exchanges", 
                    "y": 3.95
                }
            ]
        }
    ]
  }

  var emptyData = {"all": []}

const handlePressIn = (event, datapoint)=>{console.log(datapoint)};

describe('<StackedChart />', () => {
    it('test stacked bar chart', () => {
        const stackedChart = renderer.create(<StackedChart data={data} handlePressIn={handlePressIn} />);
        expect(stackedChart).toMatchSnapshot();         
      });

    it('test stacked bar chart with float values', () => {
        const stackedChart = renderer.create(<StackedChart data={floatData} handlePressIn={handlePressIn} />);
        expect(stackedChart).toMatchSnapshot();      
      });

    it('test stacked bar chart with empty data', () => {
        const stackedChart = renderer.create(<StackedChart data={emptyData} handlePressIn={handlePressIn} />);
        expect(stackedChart).toMatchSnapshot();      
      });

  });