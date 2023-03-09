jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
jest.mock('@react-navigation/native', () => ({
    useIsFocused: jest.fn(),
  }));
jest.mock('victory-native');