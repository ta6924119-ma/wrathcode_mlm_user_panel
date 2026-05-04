import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Helper function to calculate color brightness (0-255)
const getColorBrightness = (color) => {
  // Remove rgba/rgb prefix and extract values
  let r, g, b;
  
  if (color.startsWith('rgba') || color.startsWith('rgb')) {
    const matches = color.match(/\d+/g);
    if (matches && matches.length >= 3) {
      r = parseInt(matches[0]);
      g = parseInt(matches[1]);
      b = parseInt(matches[2]);
    }
  } else if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    r = parseInt(hex.substr(0, 2), 16);
    g = parseInt(hex.substr(2, 2), 16);
    b = parseInt(hex.substr(4, 2), 16);
  } else {
    // Default to medium brightness
    return 128;
  }
  
  // Calculate relative luminance
  return (r * 299 + g * 587 + b * 114) / 1000;
};


// Helper function to add transparent variants
const addTransparentVariants = (theme) => {
  return {
    ...theme,
    primaryTransparent: `${theme.primary}20`, // 20% opacity
    primarySemiTransparent: `${theme.primary}40`, // 40% opacity
    secondaryTransparent: `${theme.secondary}20`,
    secondarySemiTransparent: `${theme.secondary}40`,
    gradientTransparent: `linear-gradient(135deg, ${theme.primary}40 0%, ${theme.secondary}40 100%)`,
    gradientSemiTransparent: `linear-gradient(135deg, ${theme.primary}60 0%, ${theme.secondary}60 100%)`,
  };
};

// Available color themes
export const THEMES = {
  purple: addTransparentVariants({
    name: 'Purple',
    primary: '#6366f1',
    primaryDark: '#4f46e5',
    secondary: '#8b5cf6',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  }),
  blue: addTransparentVariants({
    name: 'Blue',
    primary: '#3b82f6',
    primaryDark: '#2563eb',
    secondary: '#06b6d4',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
  }),
  green: addTransparentVariants({
    name: 'Green',
    primary: '#10b981',
    primaryDark: '#059669',
    secondary: '#34d399',
    gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
  }),
  pink: addTransparentVariants({
    name: 'Pink',
    primary: '#ec4899',
    primaryDark: '#db2777',
    secondary: '#f472b6',
    gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
  }),
  orange: addTransparentVariants({
    name: 'Orange',
    primary: '#f59e0b',
    primaryDark: '#d97706',
    secondary: '#fbbf24',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
  }),
  red: addTransparentVariants({
    name: 'Red',
    primary: '#ef4444',
    primaryDark: '#dc2626',
    secondary: '#f87171',
    gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 100%)',
  }),
  lightBlue: addTransparentVariants({
    name: 'Light Blue',
    primary: '#60a5fa',
    primaryDark: '#3b82f6',
    secondary: '#93c5fd',
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 100%)',
  }),
  lightGreen: addTransparentVariants({
    name: 'Light Green',
    primary: '#34d399',
    primaryDark: '#10b981',
    secondary: '#6ee7b7',
    gradient: 'linear-gradient(135deg, #34d399 0%, #6ee7b7 100%)',
  }),
  lightPink: addTransparentVariants({
    name: 'Light Pink',
    primary: '#f472b6',
    primaryDark: '#ec4899',
    secondary: '#f9a8d4',
    gradient: 'linear-gradient(135deg, #f472b6 0%, #f9a8d4 100%)',
  }),
  lightOrange: addTransparentVariants({
    name: 'Light Orange',
    primary: '#fbbf24',
    primaryDark: '#f59e0b',
    secondary: '#fcd34d',
    gradient: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%)',
  }),
  lightPurple: addTransparentVariants({
    name: 'Light Purple',
    primary: '#a78bfa',
    primaryDark: '#8b5cf6',
    secondary: '#c4b5fd',
    gradient: 'linear-gradient(135deg, #a78bfa 0%, #c4b5fd 100%)',
  }),
  lightCyan: addTransparentVariants({
    name: 'Light Cyan',
    primary: '#22d3ee',
    primaryDark: '#06b6d4',
    secondary: '#67e8f9',
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #67e8f9 100%)',
  }),
  transparentPurple: addTransparentVariants({
    name: 'Transparent Purple',
    primary: 'rgba(99, 102, 241, 0.8)',
    primaryDark: 'rgba(79, 70, 229, 0.8)',
    secondary: 'rgba(139, 92, 246, 0.8)',
    gradient: 'linear-gradient(135deg, rgba(102, 126, 234, 0.6) 0%, rgba(118, 75, 162, 0.6) 100%)',
  }),
  transparentBlue: addTransparentVariants({
    name: 'Transparent Blue',
    primary: 'rgba(59, 130, 246, 0.8)',
    primaryDark: 'rgba(37, 99, 235, 0.8)',
    secondary: 'rgba(6, 182, 212, 0.8)',
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.6) 0%, rgba(6, 182, 212, 0.6) 100%)',
  }),
  transparentGreen: addTransparentVariants({
    name: 'Transparent Green',
    primary: 'rgba(16, 185, 129, 0.8)',
    primaryDark: 'rgba(5, 150, 105, 0.8)',
    secondary: 'rgba(52, 211, 153, 0.8)',
    gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.6) 0%, rgba(52, 211, 153, 0.6) 100%)',
  }),
  transparentPink: addTransparentVariants({
    name: 'Transparent Pink',
    primary: 'rgba(236, 72, 153, 0.8)',
    primaryDark: 'rgba(219, 39, 119, 0.8)',
    secondary: 'rgba(244, 114, 182, 0.8)',
    gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.6) 0%, rgba(244, 114, 182, 0.6) 100%)',
  }),
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState(() => {
    // Default to dark theme
    const saved = localStorage.getItem('mlm_theme_mode');
    return saved || 'dark';
  });

  const [colorTheme, setColorTheme] = useState(() => {
    const saved = localStorage.getItem('mlm_color_theme');
    return saved || 'purple';
  });

  const currentTheme = THEMES[colorTheme] || THEMES.purple;

  useEffect(() => {
    localStorage.setItem('mlm_theme_mode', themeMode);
    localStorage.setItem('mlm_color_theme', colorTheme);
    
    const root = document.documentElement;
    const isDark = themeMode === 'dark';
    
    // Update CSS variables
    root.style.setProperty('--primary-color', currentTheme.primary);
    root.style.setProperty('--primary-dark', currentTheme.primaryDark);
    root.style.setProperty('--secondary-color', currentTheme.secondary);
    root.style.setProperty('--theme-gradient', currentTheme.gradient);
    
    // Add transparent variants
    root.style.setProperty('--primary-transparent', currentTheme.primaryTransparent || `${currentTheme.primary}20`);
    root.style.setProperty('--primary-semi-transparent', currentTheme.primarySemiTransparent || `${currentTheme.primary}40`);
    root.style.setProperty('--secondary-transparent', currentTheme.secondaryTransparent || `${currentTheme.secondary}20`);
    root.style.setProperty('--gradient-transparent', currentTheme.gradientTransparent || `linear-gradient(135deg, ${currentTheme.primary}40 0%, ${currentTheme.secondary}40 100%)`);
    
    // Theme-based card backgrounds with proper opacity for text visibility
    // Ensure text is always visible regardless of theme color
    if (isDark) {
      // Dark mode - use very subtle theme colors to maintain dark background
      // Text will be light (#e2e8f0) so we need dark backgrounds
      root.style.setProperty('--card-bg-theme', `linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(30, 41, 59, 0.92) 100%)`);
      root.style.setProperty('--card-bg-theme-hover', `linear-gradient(135deg, rgba(51, 65, 85, 0.95) 0%, rgba(51, 65, 85, 0.92) 100%)`);
    } else {
      // Light mode - use very light theme colors with low opacity
      // Text will be dark (#1e293b) so we need light backgrounds
      // Check if theme color is light - if so, use even lower opacity
      const primaryBrightness = getColorBrightness(currentTheme.primary);
      const secondaryBrightness = getColorBrightness(currentTheme.secondary);
      
      // For light colors, use very low opacity to keep background light
      // For dark colors, use slightly higher opacity but still keep it light
      const primaryOpacity = primaryBrightness > 200 ? '03' : primaryBrightness > 150 ? '05' : '08';
      const secondaryOpacity = secondaryBrightness > 200 ? '02' : secondaryBrightness > 150 ? '04' : '06';
      
      root.style.setProperty('--card-bg-theme', `linear-gradient(135deg, ${currentTheme.primary}${primaryOpacity} 0%, ${currentTheme.secondary}${secondaryOpacity} 100%)`);
      root.style.setProperty('--card-bg-theme-hover', `linear-gradient(135deg, ${currentTheme.primary}${parseInt(primaryOpacity) + 3} 0%, ${currentTheme.secondary}${parseInt(secondaryOpacity) + 2} 100%)`);
    }
    
    // Dark mode background adjustments
    if (isDark) {
      // Dark mode - elegant dark background with subtle theme color
      const darkBg = `linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)`;
      const darkAccent = `linear-gradient(135deg, ${currentTheme.primaryDark}15 0%, ${currentTheme.secondary}10 100%)`;
      document.body.style.background = `${darkBg}, ${darkAccent}`;
      root.style.setProperty('--theme-gradient', darkBg);
      root.style.setProperty('--card-bg', 'rgba(30, 41, 59, 0.85)');
      root.style.setProperty('--card-text', '#e2e8f0');
      root.style.setProperty('--bg-overlay', 'rgba(15, 23, 42, 0.6)');
      root.style.setProperty('--border-color', 'rgba(148, 163, 184, 0.2)');
    } else {
      // Light mode - normal gradients
      document.body.style.background = currentTheme.gradient;
      root.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.95)');
      root.style.setProperty('--card-text', '#1e293b');
      root.style.setProperty('--bg-overlay', 'rgba(255, 255, 255, 0.1)');
      root.style.setProperty('--border-color', 'rgba(226, 232, 240, 0.8)');
    }
    
    document.body.style.backgroundAttachment = 'fixed';
    
    document.documentElement.setAttribute('data-theme', themeMode);
    document.documentElement.setAttribute('data-color-theme', colorTheme);
    document.documentElement.classList.toggle('dark-mode', isDark);
    document.documentElement.classList.toggle('light-mode', !isDark);
  }, [themeMode, colorTheme, currentTheme]);

  const toggleTheme = () => {
    setThemeMode(prevMode => prevMode === 'light' ? 'dark' : 'light');
  };

  const changeColorTheme = (themeName) => {
    if (THEMES[themeName]) {
      setColorTheme(themeName);
    }
  };

  const value = {
    themeMode,
    setThemeMode,
    toggleTheme,
    isDark: themeMode === 'dark',
    colorTheme,
    changeColorTheme,
    currentTheme,
    availableThemes: THEMES,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
