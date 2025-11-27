import { createContext, useContext, useState, useEffect } from 'react';
import { createTheme } from '@mui/material/styles';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState(() => {
    return localStorage.getItem('themeColor') || '#667eea';
  });

  const [animationsEnabled, setAnimationsEnabled] = useState(() => {
    return localStorage.getItem('animationsEnabled') !== 'false';
  });

  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('soundEnabled') !== 'false';
  });

  // Create MUI theme with dynamic primary color
  const theme = createTheme({
    palette: {
      primary: {
        main: currentTheme,
        light: lightenColor(currentTheme, 0.2),
        dark: darkenColor(currentTheme, 0.2),
      },
      secondary: {
        main: '#764ba2',
      },
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    },
    typography: {
      fontFamily: [
        'Raleway',
        'Roboto',
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'sans-serif',
      ].join(','),
      h1: {
        fontWeight: 700,
        fontSize: '2.5rem',
        lineHeight: 1.2,
      },
      h2: {
        fontWeight: 600,
        fontSize: '2rem',
        lineHeight: 1.3,
      },
      h3: {
        fontWeight: 600,
        fontSize: '1.75rem',
        lineHeight: 1.4,
      },
      h4: {
        fontWeight: 600,
        fontSize: '1.5rem',
        lineHeight: 1.4,
      },
      h5: {
        fontWeight: 600,
        fontSize: '1.25rem',
        lineHeight: 1.4,
      },
      h6: {
        fontWeight: 600,
        fontSize: '1.125rem',
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'none',
            boxShadow: 'none',
            transition: animationsEnabled ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            '&:hover': {
              transform: animationsEnabled ? 'translateY(-2px)' : 'none',
              boxShadow: animationsEnabled ? '0 8px 25px rgba(0,0,0,0.15)' : 'none',
            },
          },
          contained: {
            background: `linear-gradient(135deg, ${currentTheme} 0%, ${darkenColor(currentTheme, 0.1)} 100%)`,
            color: '#ffffff',
            '&:hover': {
              background: `linear-gradient(135deg, ${darkenColor(currentTheme, 0.1)} 0%, ${darkenColor(currentTheme, 0.2)} 100%)`,
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            transition: animationsEnabled ? 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            '&:hover': {
              transform: animationsEnabled ? 'translateY(-4px)' : 'none',
              boxShadow: animationsEnabled ? '0 12px 40px rgba(0,0,0,0.15)' : 'none',
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 20,
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
              transition: animationsEnabled ? 'all 0.3s ease' : 'none',
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: currentTheme,
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: currentTheme,
                borderWidth: 2,
              },
            },
          },
        },
      },
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },
  });

  // Update CSS custom properties for dynamic theming
  useEffect(() => {
    document.documentElement.style.setProperty('--primary-color', currentTheme);
    document.documentElement.style.setProperty('--primary-light', lightenColor(currentTheme, 0.2));
    document.documentElement.style.setProperty('--primary-dark', darkenColor(currentTheme, 0.2));
  }, [currentTheme]);

  const updateTheme = (newColor) => {
    setCurrentTheme(newColor);
    localStorage.setItem('themeColor', newColor);
  };

  const toggleAnimations = () => {
    setAnimationsEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('animationsEnabled', newValue.toString());
      return newValue;
    });
  };

  const toggleSound = () => {
    setSoundEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('soundEnabled', newValue.toString());
      return newValue;
    });
  };

  const value = {
    theme,
    currentTheme,
    animationsEnabled,
    soundEnabled,
    updateTheme,
    toggleAnimations,
    toggleSound,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Utility functions for color manipulation
function lightenColor(color, percent) {
  // Simple color lightening - in a real app, you'd use a proper color library
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
}

function darkenColor(color, percent) {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent * 100);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
    (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
}