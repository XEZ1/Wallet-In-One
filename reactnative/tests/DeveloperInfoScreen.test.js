import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import DeveloperInfoScreen from '../screens/DeveloperInfoScreen';
import { Linking } from 'react-native';

describe('<DeveloperInfoScreen />', () => {
    it('back to about us button test', () => {
        const navigate = jest.fn();
        const { getByText } = render(<DeveloperInfoScreen  navigation={{ navigate }}/>);
        fireEvent.press(getByText('Back to About Us'));
        expect(navigate).toHaveBeenCalledWith('About Us');
    })

    it('github button test', () => {
        const github = jest.spyOn(Linking, 'openURL');
        const { getByTestId } = render(<DeveloperInfoScreen/>);
        fireEvent.press(getByTestId('GithubButtonTest'));
        expect(github).toHaveBeenCalledWith('https://github.com/krishnapk7');
    })
})