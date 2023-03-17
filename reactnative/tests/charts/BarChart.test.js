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
const array = Object.values(data)[0]
const floatArray = Object.values(floatData)[0]
var colours = ["pink", "turquoise", "lime", "#FA991C"]
const handlePressIn = (event, datapoint)=>{console.log(datapoint)};
const list = array.map((val) => val.x);
const floatList = floatArray.map((val) => val.x);

describe('<BarChart />', () => {
    it('test bar chart', () => {
        const snapshot = renderer.create(<BarChart colours={colours} list={list} data={data} handlePressIn={handlePressIn} spacing={list.length*60} />);
        expect(snapshot).toMatchSnapshot();         
      });

    it('test bar chart with float values', () => {
        const snapshot = renderer.create(<BarChart colours={colours} list={floatList} data={floatData} handlePressIn={handlePressIn} spacing={list.length*60} />);
        expect(snapshot).toMatchSnapshot();         
      });

    it('test bar chart no props', () => {
        const barChart = renderer.create(<BarChart />).toJSON();
        expect(barChart).toBeNull();
        expect(barChart).toMatchSnapshot();
      });
  });