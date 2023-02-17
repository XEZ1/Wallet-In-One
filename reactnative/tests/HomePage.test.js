// HomePage.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import fixture from '../screens/charts/chartData.json';
import HomePage from '../screens/charts/HomePage';
import renderer from 'react-test-renderer';

global.fetch =  jest.fn( async (api, data ) => {
    if (true){ 
      return Promise.resolve({ status: 200, json: () => fixture})
    }
})

describe('<HomePage />', () => {
    it('snapshot test', () => {
        const snapshot = renderer.create(<HomePage />).toJSON();
        expect(snapshot).toMatchSnapshot();
      });
  });