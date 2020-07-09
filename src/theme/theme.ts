import { createMuiTheme } from '@material-ui/core';
import { ThemeOptions } from '@material-ui/core/styles/createMuiTheme';
import colors from './colors';

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

const { palette: darkPalette, breakpoints } = createMuiTheme({
  palette: baseDarkPalette,
});

const themeFactory = (palette: ThemeOptions['palette']) =>
  createMuiTheme({
    palette,
    shape: {},
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

export const darkTheme = themeFactory(darkPalette);
