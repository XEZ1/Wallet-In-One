jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(),
  }));

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'))

jest.mock('react-native-wagmi-charts')
