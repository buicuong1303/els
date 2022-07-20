/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { Theme } from '@mui/material';
import { DefaultTheme } from './schemes/default-theme';
import { PureLightTheme } from './schemes/pure-light-theme';
import { LightBloomTheme } from './schemes/light-bloom-theme';
import { GreyGooseTheme } from './schemes/grey-goose-theme';
import { NebulaFighterTheme } from './schemes/nebula-fighter-theme';
import { DarkSpacesTheme } from './schemes/dark-spaces-theme';
import { PurpleFlowTheme } from './schemes/purple-flow-theme';
import { GreenFieldsTheme } from './schemes/green-fields-theme';

export function themeCreator(theme: string): Theme {
  return themeMap[theme];
}

declare module '@mui/material/styles' {
  interface Theme {
    colors: {
      gradients: {
        // blue1: string;
        // blue2: string;
        // blue3: string;
        // orange1: string;
        // orange2: string;
        // purple1: string;
        // pink1: string;
        // pink2: string;
        // green1: string;
        // black1: string;
        '1': string;
        '2': string;
        '3': string;
        '4': string;
        '5': string;
        '6': string;
        '7': string;
        '8': string;
        '9': string;
        '10': string;
      };
      common: {
        grey: string;
      },
      shadows: {
        success: string;
        error: string;
        info: string;
        warning: string;
        primary: string;
        card: string;
        cardSm: string;
        cardLg: string;
      };
      alpha: {
        white: {
          5: string;
          10: string;
          30: string;
          50: string;
          70: string;
          80: string;
          90: string;
          100: string;
        };
        trueWhite: {
          5: string;
          10: string;
          30: string;
          50: string;
          70: string;
          80: string;
          90: string;
          100: string;
        };
        black: {
          5: string;
          10: string;
          30: string;
          50: string;
          70: string;
          80: string;
          90: string;
          100: string;
        };
      };
      secondary: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
      primary: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
      success: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
      warning: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
      error: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
      info: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
    };
    general: {
      reactFrameworkColor: React.CSSProperties['color'];
      borderRadiusSm: string;
      borderRadius: string;
      borderRadiusLg: string;
      borderRadiusXl: string;
    };
    sidebar: {
      background: React.CSSProperties['color'];
      boxShadow: React.CSSProperties['color'];
      width: string;
      textColor: React.CSSProperties['color'];
      dividerBg: React.CSSProperties['color'];
      menuItemColor: React.CSSProperties['color'];
      menuItemColorActive: React.CSSProperties['color'];
      menuItemBg: React.CSSProperties['color'];
      menuItemBgActive: React.CSSProperties['color'];
      menuItemIconColor: React.CSSProperties['color'];
      menuItemIconColorActive: React.CSSProperties['color'];
      menuItemHeadingColor: React.CSSProperties['color'];
    };
    header: {
      height: string;
      background: React.CSSProperties['color'];
      boxShadow: React.CSSProperties['color'];
      textColor: React.CSSProperties['color'];
    };
  }

  interface ThemeOptions {
    colors: {
      gradients: {
        // 'blue1': string;
        // 'blue2': string;
        // 'blue3': string;
        // 'orange1': string;
        // 'orange2': string;
        // 'purple1': string;
        // 'pink1': string;
        // 'pink2': string;
        // 'green1': string;
        // 'black1': string;
        '1': string;
        '2': string;
        '3': string;
        '4': string;
        '5': string;
        '6': string;
        '7': string;
        '8': string;
        '9': string;
        '10': string;
      };
      common: {
        grey: string
      },
      shadows: {
        success: string;
        error: string;
        info: string;
        warning: string;
        primary: string;
        card: string;
        cardSm: string;
        cardLg: string;
      };
      alpha: {
        white: {
          5: string;
          10: string;
          30: string;
          50: string;
          70: string;
          80: string;
          90: string;
          100: string;
        };
        trueWhite: {
          5: string;
          10: string;
          30: string;
          50: string;
          70: string;
          80: string;
          90: string;
          100: string;
        };
        black: {
          5: string;
          10: string;
          30: string;
          50: string;
          70: string;
          80: string;
          90: string;
          100: string;
        };
      };
      secondary: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
      primary: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
      success: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
      warning: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
      error: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
      info: {
        lighter: string;
        light: string;
        main: string;
        dark: string;
      };
    };

    general: {
      reactFrameworkColor: React.CSSProperties['color'];
      borderRadiusSm: string;
      borderRadius: string;
      borderRadiusLg: string;
      borderRadiusXl: string;
    };
    sidebar: {
      background: React.CSSProperties['color'];
      boxShadow: React.CSSProperties['color'];
      width: string;
      textColor: React.CSSProperties['color'];
      dividerBg: React.CSSProperties['color'];
      menuItemColor: React.CSSProperties['color'];
      menuItemColorActive: React.CSSProperties['color'];
      menuItemBg: React.CSSProperties['color'];
      menuItemBgActive: React.CSSProperties['color'];
      menuItemIconColor: React.CSSProperties['color'];
      menuItemIconColorActive: React.CSSProperties['color'];
      menuItemHeadingColor: React.CSSProperties['color'];
    };
    header: {
      height: string;
      background: React.CSSProperties['color'];
      boxShadow: React.CSSProperties['color'];
      textColor: React.CSSProperties['color'];
    };
  }
}

const themeMap: { [key: string]: Theme } = {
  DefaultTheme,
  PureLightTheme,
  LightBloomTheme,
  GreyGooseTheme,
  PurpleFlowTheme,
  NebulaFighterTheme,
  DarkSpacesTheme,
  GreenFieldsTheme,
};
