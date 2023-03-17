import React from 'react';
import BarChart from '../../screens/charts/chartComponents/barChart';
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
const array = Object.values(data)[0]
var colours = ["pink", "turquoise", "lime", "#FA991C"]
const handlePressIn = (event, datapoint)=>{console.log(datapoint)};
const list = array.map((val) => val.x);

describe('<BarChart />', () => {
    it('test bar chart', () => {
        const snapshot = renderer.create(<BarChart colours={colours} list={list} data={data} handlePressIn={handlePressIn} spacing={list.length*60} />);
        expect(snapshot).toMatchSnapshot();         
      });


  });