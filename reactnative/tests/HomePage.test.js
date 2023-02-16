// HomePage.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomePage from '../screens/charts/HomePage';
import renderer from 'react-test-renderer';

describe('<HomePage />', () => {
    it('snapshot test', () => {
        const snapshot = renderer.create(<HomePage />).toJSON();
        expect(snapshot).toMatchSnapshot();
      });
  });