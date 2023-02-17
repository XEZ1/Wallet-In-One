import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import AboutUsScreen from '../screens/pre_logged_in/AboutUsScreen';

describe('<AboutUsScreen/>', () => {
    it('developer team button test', () => {
        const navigate = jest.fn();
        const { getByText } = render(<AboutUsScreen  navigation={{ navigate }}/>);
        fireEvent.press(getByText('Meet the team!'));
        expect(navigate).toHaveBeenCalledWith('Developer Info');
    })

    it('start button test', () => {
        const navigate = jest.fn();
        const { getByText } = render(<AboutUsScreen  navigation={{ navigate }}/>);
        fireEvent.press(getByText('Home Page'));
        expect(navigate).toHaveBeenCalledWith('Start');
    })
})