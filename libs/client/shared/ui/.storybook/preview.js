/* eslint-disable @nrwl/nx/enforce-module-boundaries */
/* eslint-disable react-hooks/exhaustive-deps */
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider } from 'emotion-theming';
// import { themeCreator } from '@els/client-shared-theme'; // ! Not working, don't know the reason
import { themeCreator } from '../../theme/src/lib/base'; // ! Temporary fix
import CssBaseline from '@mui/material/CssBaseline';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  options: {
    storySort: {
      method: 'alphabetical',
    },
  },
  themes: {
    default: window.localStorage.getItem('appTheme') || 'DefaultTheme',
    list: [
      { name: 'DefaultTheme', class: 'pure-light-theme', color: '#5569ff' },
      { name: 'PureLightTheme', class: 'pure-light-theme', color: '#5569ff' },
      { name: 'LightBloomTheme', class: 'light-bloom-theme', color: '#1975FF' },
      { name: 'GreyGooseTheme', class: 'grey-goose-theme', color: '#2442AF' },
      { name: 'PurpleFlowTheme', class: 'purple-flow-theme', color: '#9b52e1' },
      {
        name: 'NebulaFighterTheme',
        class: 'nebula-fighter-theme',
        color: '#8C7CF0',
      },
      {
        name: 'GreenFieldsTheme',
        class: 'green-fields-theme',
        color: '#44a574',
      },
      { name: 'DarkSpacesTheme', class: 'dark-spaces-theme', color: '#CB3C1D' },
    ],
    onChange: (themeName) =>
      window.localStorage.setItem('appTheme', themeName.name || 'DefaultTheme'),
  },
};

export const decorators = [
  (Story) => {
    const curThemeName =
      window.localStorage.getItem('appTheme') || 'DefaultTheme';
    const theme = themeCreator(curThemeName);

    return (
      <MUIThemeProvider theme={theme}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {Story()}
        </ThemeProvider>
      </MUIThemeProvider>
    );
  },
];
