import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  mode: ThemeMode;
  isDark: boolean;
  colors: {
    // Background colors
    background: string;
    surface: string;
    card: string;
    
    // Text colors
    text: string;
    textSecondary: string;
    textMuted: string;
    
    // Brand colors
    primary: string;
    primaryLight: string;
    success: string;
    warning: string;
    error: string;
    
    // UI colors
    border: string;
    separator: string;
    shadow: string;
    
    // Tier colors
    tierBasic: string;
    tierGood: string;
    tierRare: string;
    tierEpic: string;
    
    // XP colors
    xpFill: string;
    xpBackground: string;
  };
}

const lightTheme: Theme = {
  mode: 'light',
  isDark: false,
  colors: {
    background: '#F5F5F7',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    
    text: '#1D1D1F',
    textSecondary: '#86868B',
    textMuted: '#C7C7CC',
    
    primary: '#007AFF',
    primaryLight: 'rgba(0, 122, 255, 0.1)',
    success: '#4CAF50',
    warning: '#FF9800',
    error: '#FF6B6B',
    
    border: '#E0E0E0',
    separator: 'rgba(0, 0, 0, 0.1)',
    shadow: '#000000',
    
    tierBasic: '#4CAF50',
    tierGood: '#2196F3',
    tierRare: '#FF9800',
    tierEpic: '#9C27B0',
    
    xpFill: '#4CAF50',
    xpBackground: '#E5E5EA',
  },
};

const darkTheme: Theme = {
  mode: 'dark',
  isDark: true,
  colors: {
    background: '#000000',
    surface: '#1C1C1E',
    card: '#2C2C2E',
    
    text: '#FFFFFF',
    textSecondary: '#8E8E93',
    textMuted: '#48484A',
    
    primary: '#0A84FF',
    primaryLight: 'rgba(10, 132, 255, 0.15)',
    success: '#32D74B',
    warning: '#FF9F0A',
    error: '#FF453A',
    
    border: '#38383A',
    separator: 'rgba(255, 255, 255, 0.1)',
    shadow: '#000000',
    
    tierBasic: '#32D74B',
    tierGood: '#007AFF',
    tierRare: '#FF9F0A',
    tierEpic: '#BF5AF2',
    
    xpFill: '#32D74B',
    xpBackground: '#3A3A3C',
  },
};

interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [systemColorScheme, setSystemColorScheme] = useState<ColorSchemeName>(
    Appearance.getColorScheme()
  );

  // Listen to system theme changes
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemColorScheme(colorScheme);
    });

    return () => subscription.remove();
  }, []);

  // Always use system theme
  const getCurrentTheme = useCallback((): Theme => {
    return systemColorScheme === 'dark' ? darkTheme : lightTheme;
  }, [systemColorScheme]);

  const theme = getCurrentTheme();

  const contextValue = useMemo((): ThemeContextType => ({
    theme,
    themeMode: 'system',
    setThemeMode: () => {}, // No-op since we always use system
    toggleTheme: () => {}, // No-op since we always use system
  }), [theme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
