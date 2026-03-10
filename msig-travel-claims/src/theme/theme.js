import { createTheme } from '@mui/material/styles';

const BLUE = 'rgb(27, 117, 187)';
const BLUE_DARK = '#1558A0';
const BLUE_LIGHT = '#4A9FD5';

const theme = createTheme({
  palette: {
    primary: {
      main: BLUE,
      light: BLUE_LIGHT,
      dark: BLUE_DARK,
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#2C3E50',
      light: '#485C6D',
      dark: '#1A252F',
      contrastText: '#ffffff',
    },
    background: {
      default: '#F0F4F8',
      paper: '#FFFFFF',
    },
    success: { main: '#27AE60', light: '#2ECC71', dark: '#1E8449' },
    warning: { main: '#F39C12', light: '#F5B041', dark: '#D68910' },
    error:   { main: '#E74C3C', light: '#EC7063', dark: '#C0392B' },
    info:    { main: BLUE, light: BLUE_LIGHT, dark: BLUE_DARK },
    text: {
      primary: '#1A252F',
      secondary: '#607D8B',
    },
    divider: '#E8EDF2',
  },
  typography: {
    fontFamily: '"Roboto", "Inter", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 800, letterSpacing: '-0.5px' },
    h5: { fontWeight: 700, letterSpacing: '-0.3px' },
    h6: { fontWeight: 700 },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600, color: '#2C3E50' },
    body2: { lineHeight: 1.6 },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    '0 3px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.05)',
    '0 6px 16px rgba(0,0,0,0.08), 0 3px 6px rgba(0,0,0,0.05)',
    '0 10px 24px rgba(0,0,0,0.09)',
    ...Array(20).fill('0 10px 24px rgba(0,0,0,0.09)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: '#F0F4F8' },
        '*::-webkit-scrollbar': { width: 6, height: 6 },
        '*::-webkit-scrollbar-track': { background: '#f0f0f0' },
        '*::-webkit-scrollbar-thumb': { background: '#c1c1c1', borderRadius: 3 },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
          letterSpacing: 0,
        },
        containedPrimary: {
          background: `linear-gradient(135deg, ${BLUE} 0%, ${BLUE_DARK} 100%)`,
          '&:hover': {
            background: `linear-gradient(135deg, ${BLUE_LIGHT} 0%, ${BLUE} 100%)`,
          },
        },
        outlinedPrimary: {
          borderColor: `${BLUE}60`,
          '&:hover': { borderColor: BLUE, bgcolor: `${BLUE}08` },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid #E8EDF2',
          boxShadow: '0 1px 4px rgba(27,117,187,0.06)',
          transition: 'box-shadow 0.2s',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: { '&:last-child': { paddingBottom: 20 } },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined', size: 'small' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': { borderColor: '#DDE3EA' },
            '&:hover fieldset': { borderColor: BLUE },
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        outlined: {
          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#DDE3EA' },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 500 } },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            bgcolor: '#F7F9FB',
            fontWeight: 700,
            fontSize: '0.78rem',
            color: '#455A64',
            borderBottom: '2px solid #E8EDF2',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:hover': { backgroundColor: '#F7FAFD !important' },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { borderColor: '#EEF2F6', padding: '10px 14px' },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: '#EEF2F6' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.85rem',
          minHeight: 44,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { borderBottom: '1px solid #EEF2F6' },
        indicator: { height: 3, borderRadius: '3px 3px 0 0', backgroundColor: BLUE },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 4, backgroundColor: '#E8EDF2' },
        bar: { borderRadius: 4 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10 },
        standardInfo: { backgroundColor: '#EBF4FF', color: BLUE_DARK },
        standardSuccess: { backgroundColor: '#EAFAF1' },
        standardWarning: { backgroundColor: '#FEF9E7' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 6, fontSize: '0.75rem', bgcolor: '#2C3E50' },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
      },
    },
    MuiStepLabel: {
      styleOverrides: {
        label: { fontSize: '0.75rem' },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: { borderRadius: 8 },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundColor: '#ffffff', color: '#1A252F' },
      },
    },
  },
});

export default theme;
