import React from 'react';
import SettingsPage from 'reactnative/screens/SettingsPage';
import renderer from 'react-test-renderer';
import { render, screen, fireEvent } from '@testing-library/react-native';

  jest.mock('react', () => {
      const ActualReact = jest.requireActual('react')
      return {
        ...ActualReact,
        useContext: () => (ActualReact.useState({'signedIn': false})),
      }
    })

  it('snapshot test for settings page', () => {
      const navigate = jest.fn();
      const settingsPage = renderer.create(<SettingsPage navigation={{ navigate }} />);
      expect(settingsPage).toMatchSnapshot();         
    });

  it('settings page pressing log out button test', () => {
      const navigate = jest.fn();
      const settingsPage = render(<SettingsPage navigation={ {navigate} }/>);
      fireEvent.press(screen.getByText('Logout'));
      expect(settingsPage).toMatchSnapshot();
  });

  it('setting page dark mode toggle', () => {
    const navigate = jest.fn();
    const settingsPage = render(<SettingsPage navigation={ {navigate} }/>);
    fireEvent.press(screen.getByText('Dark Mode'));
    expect(settingsPage).toMatchSnapshot();
  });