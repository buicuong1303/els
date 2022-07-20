/* eslint-disable @typescript-eslint/no-empty-function */
import { FC, useState, createContext, useEffect } from 'react';
import { ThemeProvider as ThemeProviderMui } from '@mui/material';
import { themeCreator } from './base';
import { StylesProvider } from '@mui/styles';

export const ThemeContext = createContext((_themeName: string): void => {});

const ThemeProviderWrapper: FC = (props) => {
  const [themeName, _setThemeName] = useState('DefaultTheme');

  useEffect(() => {
    const curThemeName =
      window.localStorage.getItem('appTheme') || 'DefaultTheme';
    _setThemeName(curThemeName);
  }, []);

  const theme = themeCreator(themeName);
  const setThemeName = (themeName: string): void => {
    window.localStorage.setItem('appTheme', themeName);
    _setThemeName(themeName);
  };

  return (
    <StylesProvider injectFirst>
      <ThemeContext.Provider value={setThemeName}>
        <ThemeProviderMui theme={theme}>{props.children}</ThemeProviderMui>
      </ThemeContext.Provider>
    </StylesProvider>
  );
};

export { ThemeProviderWrapper as ThemeProvider };
