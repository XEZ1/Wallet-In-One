// import React from 'react';
// import SettingsPage from 'reactnative/screens/SettingsPage';
// import renderer from 'react-test-renderer';
// import { render, screen, fireEvent, act, waitFor} from '@testing-library/react-native';
// // import Link from '../Link';

// jest.mock('react', () => {
//     const ActualReact = jest.requireActual('react')
//     return {
//       ...ActualReact,
//       useContext: () => (ActualReact.useState({'signedIn': false})),
//     }
//   })

// it('snapshot test for settings page', () => {
//     const navigate = jest.fn();
//     const settingsPage = renderer.create(<SettingsPage navigation={{ navigate }} />);
//     expect(settingsPage).toMatchSnapshot();         
//   });