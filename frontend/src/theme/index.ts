import { createTheme, alpha } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: {
      main: string;
      light: string;
      dark: string;
    };
  }
  interface PaletteOptions {
    neutral: {
      main: string;
      light: string;
      dark: string;
    };
  }
}

const systemColors = {
  light: {
    blue: '#007AFF',
    green: '#34C759',
    indigo: '#5856D6',
    orange: '#FF9500',
    pink: '#FF2D55',
    purple: '#AF52DE',
    red: '#FF3B30',
    teal: '#5AC8FA',
    yellow: '#FFCC00',
    gray: {
      1: '#8E8E93',
      2: '#AEAEB2',
      3: '#C7C7CC',
      4: '#D1D1D6',
      5: '#E5E5EA',
      6: '#F2F2F7',
    },
  },
  dark: {
    blue: '#0A84FF',
    green: '#30D158',
    indigo: '#5E5CE6',
    orange: '#FF9F0A',
    pink: '#FF375F',
    purple: '#BF5AF2',
    red: '#FF453A',
    teal: '#64D2FF',
    yellow: '#FFD60A',
    gray: {
      1: '#8E8E93',
      2: '#636366',
      3: '#48484A',
      4: '#3A3A3C',
      5: '#2C2C2E',
      6: '#1C1C1E',
    },
  },
};

const getDesignTokens = (mode: 'light' | 'dark') => ({
  palette: {
    mode,
    primary: {
      main: mode === 'light' ? systemColors.light.blue : systemColors.dark.blue,
      light: mode === 'light' ? alpha(systemColors.light.blue, 0.8) : alpha(systemColors.dark.blue, 0.8),
      dark: mode === 'light' ? alpha(systemColors.light.blue, 1.2) : alpha(systemColors.dark.blue, 1.2),
    },
    secondary: {
      main: mode === 'light' ? systemColors.light.pink : systemColors.dark.pink,
      light: mode === 'light' ? alpha(systemColors.light.pink, 0.8) : alpha(systemColors.dark.pink, 0.8),
      dark: mode === 'light' ? alpha(systemColors.light.pink, 1.2) : alpha(systemColors.dark.pink, 1.2),
    },
    error: {
      main: mode === 'light' ? systemColors.light.red : systemColors.dark.red,
    },
    warning: {
      main: mode === 'light' ? systemColors.light.orange : systemColors.dark.orange,
    },
    success: {
      main: mode === 'light' ? systemColors.light.green : systemColors.dark.green,
    },
    neutral: {
      main: mode === 'light' ? systemColors.light.gray[1] : systemColors.dark.gray[1],
      light: mode === 'light' ? systemColors.light.gray[3] : systemColors.dark.gray[3],
      dark: mode === 'light' ? systemColors.light.gray[2] : systemColors.dark.gray[2],
    },
    text: {
      primary: mode === 'light' ? 'rgba(0, 0, 0, 0.87)' : 'rgba(255, 255, 255, 0.87)',
      secondary: mode === 'light' ? 'rgba(0, 0, 0, 0.6)' : 'rgba(255, 255, 255, 0.6)',
    },
    background: {
      default: mode === 'light' ? systemColors.light.gray[6] : systemColors.dark.gray[6],
      paper: mode === 'light' 
        ? 'rgba(255, 255, 255, 0.7)' 
        : 'rgba(28, 28, 30, 0.7)',
    },
    divider: mode === 'light' 
      ? 'rgba(0, 0, 0, 0.08)' 
      : 'rgba(255, 255, 255, 0.08)',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 700,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    h6: {
      fontSize: '1.125rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
      lineHeight: 1.2,
    },
    body1: {
      letterSpacing: '-0.011em',
      lineHeight: 1.5,
    },
    body2: {
      letterSpacing: '-0.011em',
      lineHeight: 1.5,
    },
    button: {
      textTransform: 'none' as const,
      fontWeight: 600,
      letterSpacing: '-0.011em',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        'html, body': {
          margin: 0,
          padding: 0,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          WebkitOverflowScrolling: 'touch',
          '@media (max-width: 600px)': {
            overflow: 'auto',
          },
        },
        body: {
          backgroundColor: mode === 'light' ? '#F5F5F7' : '#1C1C1E',
          minHeight: '100vh',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: 'column',
          '@media (max-width: 600px)': {
            backgroundColor: mode === 'light' ? '#F5F5F7' : '#1C1C1E',
            minHeight: '-webkit-fill-available',
            overflow: 'auto',
          },
        },
        '#root': {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          '@media (max-width: 600px)': {
            minHeight: '-webkit-fill-available',
            height: 'auto',
            overflow: 'auto',
            paddingBottom: '84px',
          },
        },
        '*': {
          boxSizing: 'border-box',
          margin: 0,
          padding: 0,
          '&::-webkit-scrollbar': {
            width: '4px',
            height: '4px',
            '@media (max-width: 600px)': {
              width: '2px',
              height: '2px',
            },
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: mode === 'light' 
              ? 'rgba(0, 0, 0, 0.2)' 
              : 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          maxWidth: 'none !important',
          padding: '24px',
          margin: 0,
          '@media (max-width: 600px)': {
            padding: '16px',
            paddingBottom: '100px',
            minHeight: 'calc(100vh - 84px)',
          },
          variants: [],
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          '&.page-container': {
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            minHeight: '100vh',
            margin: 0,
            backgroundColor: mode === 'light' 
              ? 'rgba(255, 255, 255, 0.5)' 
              : 'rgba(28, 28, 30, 0.5)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            overflow: 'hidden',
            border: `1px solid ${mode === 'light' 
              ? 'rgba(255, 255, 255, 0.5)' 
              : 'rgba(255, 255, 255, 0.1)'}`,
            '@media (max-width: 600px)': {
              minHeight: 'calc(100vh - 84px)',
              borderRadius: '24px',
              backgroundColor: mode === 'light' 
                ? 'rgba(255, 255, 255, 0.85)' 
                : 'rgba(28, 28, 30, 0.85)',
              backdropFilter: 'blur(25px) saturate(180%)',
              border: `1px solid ${mode === 'light' 
                ? 'rgba(0, 0, 0, 0.1)' 
                : 'rgba(255, 255, 255, 0.1)'}`,
            },
          },
          variants: [],
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(25px) saturate(200%)',
          backgroundColor: mode === 'light' 
            ? 'rgba(255, 255, 255, 0.7)' 
            : 'rgba(44, 44, 46, 0.7)',
          border: `1px solid ${mode === 'light' 
            ? 'rgba(255, 255, 255, 0.5)' 
            : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: mode === 'light'
            ? '0 1px 3px 0 rgba(31, 38, 135, 0.07)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
          transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
          '&:hover': {
            backgroundColor: mode === 'light'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(44, 44, 46, 0.8)',
            transform: 'translateY(-1px)',
            boxShadow: mode === 'light'
              ? '0 4px 20px 0 rgba(31, 38, 135, 0.1)'
              : '0 4px 20px 0 rgba(0, 0, 0, 0.4)',
          },
          '@media (max-width: 600px)': {
            backdropFilter: 'blur(20px) saturate(180%)',
            backgroundColor: mode === 'light'
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(44, 44, 46, 0.95)',
            borderRadius: '16px',
            border: `1px solid ${mode === 'light'
              ? 'rgba(0, 0, 0, 0.1)'
              : 'rgba(255, 255, 255, 0.1)'}`,
            overflow: 'auto',
            WebkitOverflowScrolling: 'touch',
            '&:hover': {
              transform: 'none',
              boxShadow: 'none',
            },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '8px 16px',
          transition: 'all 0.2s cubic-bezier(0.25, 0.8, 0.25, 1)',
          borderRadius: '12px',
          variants: [],
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '@media (max-width: 600px)': {
            borderRadius: '12px',
            width: 'auto',
          },
        },
        contained: {
          backgroundColor: mode === 'light'
            ? systemColors.light.blue
            : systemColors.dark.blue,
          color: '#FFFFFF',
          border: 'none',
          backdropFilter: 'none',
          boxShadow: 'none',
          '&:hover': {
            backgroundColor: mode === 'light'
              ? alpha(systemColors.light.blue, 0.9)
              : alpha(systemColors.dark.blue, 0.9),
            boxShadow: 'none',
          },
        },
        outlined: {
          backgroundColor: 'transparent',
          borderColor: mode === 'light'
            ? alpha(systemColors.light.blue, 0.5)
            : alpha(systemColors.dark.blue, 0.5),
          color: mode === 'light'
            ? systemColors.light.blue
            : systemColors.dark.blue,
          backdropFilter: 'none',
          '&:hover': {
            backgroundColor: mode === 'light'
              ? alpha(systemColors.light.blue, 0.05)
              : alpha(systemColors.dark.blue, 0.05),
            borderColor: mode === 'light'
              ? systemColors.light.blue
              : systemColors.dark.blue,
          },
        },
        text: {
          backgroundColor: 'transparent',
          color: mode === 'light'
            ? systemColors.light.blue
            : systemColors.dark.blue,
          backdropFilter: 'none',
          minWidth: 'auto',
          padding: '6px 8px',
          '&:hover': {
            backgroundColor: mode === 'light'
              ? alpha(systemColors.light.blue, 0.05)
              : alpha(systemColors.dark.blue, 0.05),
          },
        },
      },
    },
    MuiIconButton: {
      defaultProps: {
        disableRipple: true,
      },
      styleOverrides: {
        root: {
          width: 40,
          height: 40,
          borderRadius: '12px',
          backgroundColor: 'transparent',
          border: 'none',
          backdropFilter: 'none',
          '&:hover': {
            backgroundColor: mode === 'light'
              ? 'rgba(0, 0, 0, 0.04)'
              : 'rgba(255, 255, 255, 0.04)',
            border: 'none',
            transform: 'none',
          },
          '&:active': {
            transform: 'none',
          },
          '@media (max-width: 600px)': {
            width: 44,
            height: 44,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(16px) saturate(180%)',
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 0.7)'
            : 'rgba(44, 44, 46, 0.7)',
          border: `1px solid ${mode === 'light'
            ? 'rgba(255, 255, 255, 0.5)'
            : 'rgba(255, 255, 255, 0.1)'}`,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            backgroundColor: mode === 'light'
              ? 'rgba(255, 255, 255, 0.8)'
              : 'rgba(44, 44, 46, 0.8)',
            transform: 'translateY(-2px)',
          },
          '@media (max-width: 600px)': {
            backdropFilter: 'blur(20px) saturate(180%)',
            backgroundColor: mode === 'light'
              ? 'rgba(255, 255, 255, 0.85)'
              : 'rgba(44, 44, 46, 0.85)',
            borderRadius: '16px',
            border: `1px solid ${mode === 'light'
              ? 'rgba(0, 0, 0, 0.1)'
              : 'rgba(255, 255, 255, 0.1)'}`,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: `1px solid ${mode === 'light'
            ? 'rgba(0, 0, 0, 0.04)'
            : 'rgba(255, 255, 255, 0.04)'}`,
          padding: '16px',
          whiteSpace: 'nowrap',
          '@media (max-width: 600px)': {
            padding: '12px 16px',
          },
          variants: [],
        },
        head: {
          fontWeight: 600,
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          variants: [],
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'scale(1.05)',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 0.95)'
            : 'rgba(28, 28, 30, 0.95)',
          backdropFilter: 'blur(25px) saturate(200%)',
          border: 'none',
          boxShadow: mode === 'light'
            ? '1px 0 2px rgba(31, 38, 135, 0.07)'
            : '1px 0 2px rgba(0, 0, 0, 0.3)',
          '@media (max-width: 600px)': {
            width: '85% !important',
            height: '100% !important',
            borderRadius: '0 16px 16px 0',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 0.6)'
            : 'rgba(44, 44, 46, 0.6)',
          backdropFilter: 'blur(25px) saturate(200%)',
          borderBottom: `1px solid ${mode === 'light'
            ? 'rgba(0, 0, 0, 0.08)'
            : 'rgba(255, 255, 255, 0.08)'}`,
          '@media (max-width: 600px)': {
            backdropFilter: 'blur(20px) saturate(180%)',
            backgroundColor: mode === 'light'
              ? 'rgba(255, 255, 255, 0.85)'
              : 'rgba(44, 44, 46, 0.85)',
            borderBottom: `1px solid ${mode === 'light'
              ? 'rgba(0, 0, 0, 0.1)'
              : 'rgba(255, 255, 255, 0.1)'}`,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(20px) saturate(180%)',
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 0.8)'
            : 'rgba(44, 44, 46, 0.8)',
          boxShadow: mode === 'light'
            ? '0 8px 32px 0 rgba(31, 38, 135, 0.1)'
            : '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
          '@media (max-width: 600px)': {
            margin: 16,
            width: 'calc(100% - 32px)',
            borderRadius: 16,
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: mode === 'light'
              ? 'rgba(255, 255, 255, 0.9)'
              : 'rgba(44, 44, 46, 0.7)',
            backdropFilter: 'blur(8px)',
            borderRadius: '12px',
            border: `1px solid ${mode === 'light'
              ? 'rgba(0, 0, 0, 0.12)'
              : 'rgba(255, 255, 255, 0.12)'}`,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '& fieldset': {
              border: 'none',
            },
            '&:hover': {
              backgroundColor: mode === 'light'
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(44, 44, 46, 0.8)',
              border: `1px solid ${mode === 'light'
                ? 'rgba(0, 0, 0, 0.2)'
                : 'rgba(255, 255, 255, 0.2)'}`,
            },
            '&.Mui-focused': {
              backgroundColor: mode === 'light'
                ? 'rgba(255, 255, 255, 1)'
                : 'rgba(44, 44, 46, 0.9)',
              border: `1px solid ${mode === 'light'
                ? alpha(systemColors.light.blue, 0.5)
                : alpha(systemColors.dark.blue, 0.5)}`,
              boxShadow: `0 0 0 3px ${mode === 'light'
                ? alpha(systemColors.light.blue, 0.15)
                : alpha(systemColors.dark.blue, 0.15)}`,
            },
            '@media (max-width: 600px)': {
              backdropFilter: 'none',
              backgroundColor: mode === 'light'
                ? '#FFFFFF'
                : '#2C2C2E',
            },
          },
          '& .MuiInputAdornment-root': {
            '& .MuiIconButton-root': {
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: mode === 'light'
                  ? 'rgba(0, 0, 0, 0.04)'
                  : 'rgba(255, 255, 255, 0.04)',
              },
            },
          },
          '& .MuiInputLabel-root': {
            color: mode === 'light'
              ? 'rgba(0, 0, 0, 0.6)'
              : 'rgba(255, 255, 255, 0.6)',
            '&.Mui-focused': {
              color: mode === 'light'
                ? systemColors.light.blue
                : systemColors.dark.blue,
            },
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          overflow: 'auto',
          WebkitOverflowScrolling: 'touch',
          margin: 0,
          '@media (max-width: 600px)': {
            maxHeight: 'calc(100vh - 200px)',
            margin: '-16px',
            width: 'calc(100% + 32px)',
          },
          variants: [],
        },
      },
    },
    MuiTable: {
      styleOverrides: {
        root: {
          borderCollapse: 'separate',
          borderSpacing: '0',
          width: '100%',
          '@media (max-width: 600px)': {
            minWidth: '600px',
          },
          variants: [],
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: mode === 'light'
            ? 'rgba(0, 0, 0, 0.02)'
            : 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(8px)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          variants: [],
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            padding: '8px',
            '& .MuiListItem-root': {
              borderRadius: '12px',
              marginBottom: '4px',
              transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              '&:active': {
                backgroundColor: mode === 'light'
                  ? 'rgba(0, 0, 0, 0.05)'
                  : 'rgba(255, 255, 255, 0.05)',
                transform: 'scale(0.98)',
              },
            },
          },
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            borderRadius: '12px',
            marginBottom: '4px',
            '&:last-child': {
              marginBottom: 0,
            },
            '&:active': {
              backgroundColor: mode === 'light'
                ? 'rgba(0, 0, 0, 0.05)'
                : 'rgba(255, 255, 255, 0.05)',
            },
          },
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            borderRadius: '12px',
            '&:active': {
              backgroundColor: mode === 'light'
                ? 'rgba(0, 0, 0, 0.05)'
                : 'rgba(255, 255, 255, 0.05)',
              transform: 'scale(0.98)',
            },
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            borderRadius: '12px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:active': {
              backgroundColor: mode === 'light'
                ? 'rgba(0, 0, 0, 0.05)'
                : 'rgba(255, 255, 255, 0.05)',
              transform: 'scale(0.98)',
            },
          },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          margin: 8,
        },
        switchBase: {
          padding: 1,
          '&.Mui-checked': {
            transform: 'translateX(16px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
              backgroundColor: mode === 'dark' ? '#8796A5' : '#aab4be',
              opacity: 1,
              border: 0,
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.5,
            },
          },
          '&.Mui-focusVisible .MuiSwitch-thumb': {
            color: '#33cf4d',
            border: '6px solid #fff',
          },
        },
        thumb: {
          width: 24,
          height: 24,
          backgroundColor: '#fff',
          boxShadow: mode === 'dark' 
            ? '0 2px 4px 0 rgba(0,0,0,0.4)' 
            : '0 2px 4px 0 rgba(0,0,0,0.2)',
        },
        track: {
          borderRadius: 26 / 2,
          border: `1px solid ${mode === 'dark' ? '#39393D' : '#E9E9EA'}`,
          backgroundColor: mode === 'dark' ? '#39393D' : '#E9E9EA',
          opacity: 1,
          transition: 'background-color 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:before, &:after': {
            content: '""',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            width: 16,
            height: 16,
          },
          '&:before': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
              mode === 'dark' ? '#fff' : '#424242'
            )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
            left: 12,
          },
          '&:after': {
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
              mode === 'dark' ? '#fff' : '#424242'
            )}" d="M19,13H5V11H19V13Z" /></svg>')`,
            right: 12,
          },
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          backdropFilter: 'blur(16px)',
          backgroundColor: mode === 'light'
            ? 'rgba(255, 255, 255, 0.9)'
            : 'rgba(44, 44, 46, 0.9)',
          border: `1px solid ${mode === 'light'
            ? 'rgba(0, 0, 0, 0.12)'
            : 'rgba(255, 255, 255, 0.12)'}`,
          boxShadow: mode === 'light'
            ? '0 4px 20px rgba(0, 0, 0, 0.08)'
            : '0 4px 20px rgba(0, 0, 0, 0.3)',
          borderRadius: '16px',
          marginTop: '8px',
          minWidth: '280px',
          maxWidth: '320px',
          overflow: 'hidden',
          '& .MuiList-root': {
            padding: '8px',
          },
          '& .MuiListItem-root': {
            borderRadius: '12px',
            marginBottom: '4px',
            '&:last-child': {
              marginBottom: 0,
            },
          },
          '@media (max-width: 600px)': {
            width: 'calc(100% - 32px)',
            maxWidth: 'none',
            margin: '16px',
            backdropFilter: 'none',
            backgroundColor: mode === 'light'
              ? '#FFFFFF'
              : '#2C2C2E',
          },
        },
      },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          display: 'none',
          '@media (max-width: 600px)': {
            display: 'flex',
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '84px',
            paddingBottom: '24px',
            backgroundColor: mode === 'light'
              ? 'rgba(255, 255, 255, 0.95)'
              : 'rgba(44, 44, 46, 0.95)',
            backdropFilter: 'blur(20px) saturate(180%)',
            borderTop: `1px solid ${mode === 'light'
              ? 'rgba(0, 0, 0, 0.1)'
              : 'rgba(255, 255, 255, 0.1)'}`,
            zIndex: 1200,
          },
        },
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          '@media (max-width: 600px)': {
            color: mode === 'light'
              ? 'rgba(0, 0, 0, 0.6)'
              : 'rgba(255, 255, 255, 0.6)',
            padding: '6px 0',
            minWidth: 'auto',
            '&.Mui-selected': {
              color: mode === 'light'
                ? systemColors.light.blue
                : systemColors.dark.blue,
              padding: '6px 0',
            },
          },
        },
        label: {
          '@media (max-width: 600px)': {
            fontSize: '0.75rem',
            marginTop: '4px',
            '&.Mui-selected': {
              fontSize: '0.75rem',
            },
          },
        },
      },
    },
  },
});

export const lightTheme = createTheme(getDesignTokens('light'));
export const darkTheme = createTheme(getDesignTokens('dark')); 