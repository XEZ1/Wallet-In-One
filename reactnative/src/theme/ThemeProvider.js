import React, {createContext, useEffect, useContext, useState, AsyncStorage} from 'react';
import {lightColors, darkColors} from './colors';

import {useColorScheme} from 'react-native';
export const ThemeContext = createContext({
    dark: false,
    colors: lightColors,
    setScheme: () => {},
});

export const ThemeProvider = props => {
    const colorScheme = useColorScheme(); // colorScheme is either 'dark', 'light' or 'null'
    const [isDark, setIsDark] = useState(colorScheme == 'dark');
    useEffect(() => {
        setIsDark(colorScheme == 'dark');
    }, [colorScheme]);

    const defaultTheme = {
        dark: isDark,
        colors: isDark ? darkColors : lightColors,
        setScheme: scheme => setIsDark(scheme === 'dark'),
    };
    return (
        <ThemeContext.Provider value={defaultTheme}>
            {props.children}
        </ThemeContext.Provider>
    );
};

// creating a custom hook for accessing all the values

export const useTheme = () => useContext(ThemeContext);