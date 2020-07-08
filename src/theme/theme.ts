import { createMuiTheme } from '@material-ui/core';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import colors from './colors';
import { generateShadows } from './shadows';

const baseDarkPalette: ThemeOptions['palette'] = {
  type: 'dark',
  text: {
    primary: colors.white,
  },
  primary: {
    main: colors.bright,
  },
  secondary: {
    main: colors.dark,
  },
  background: {
    default: colors.black,
    paper: colors.trueBlack,
  },
};
const baseLightPalette: ThemeOptions['palette'] = {
  type: 'light',
  text: {
    primary: colors.black,
  },
  primary: {
    main: colors.black,
  },
  secondary: {
    main: colors.medium,
  },
  background: {
    default: colors.bright,
    paper: colors.white,
  },
};

const { palette: lightPalette, breakpoints } = createMuiTheme({
  palette: baseLightPalette,
});
const { palette: darkPalette } = createMuiTheme({ palette: baseDarkPalette });

const themeFactory = (
  palette: ThemeOptions['palette'],
  shadows: ThemeOptions['shadows'],
) =>
  createMuiTheme({
    palette,
    shape: {},
    shadows,
    typography: {
      fontSize: 16,
    },
    overrides: {
      MuiAppBar: {
        colorDefault: {
          backgroundColor: 'transparent',
        },
      },
      MuiTypography: {
        /**
         * @note I like to tweak the heading sizes in MUI for
         * smaller screens, since they're very large by default.
         */
        h1: {
          [breakpoints.down('sm')]: {
            fontSize: '5vmax',
          },
        },
        h2: {
          [breakpoints.down('sm')]: {
            fontSize: '4vmax',
          },
        },
        h3: {
          [breakpoints.down('sm')]: {
            fontSize: '3.75vmax',
          },
        },
        h4: {
          [breakpoints.down('sm')]: {
            fontSize: '3.3vmax',
          },
        },
      },
    },
    props: {
      MuiTextField: {
        variant: 'filled',
      },
      MuiButton: {
        color: 'primary',
      },
      MuiLink: {
        underline: 'always',
      },
    },
  });

export const lightTheme = themeFactory(lightPalette, generateShadows());
export const darkTheme = themeFactory(
  darkPalette,
  generateShadows(colors.blackRgb, colors.trueBlackRgb),
);
