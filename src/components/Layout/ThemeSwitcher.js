import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { FaPalette, FaMoon, FaSun } from 'react-icons/fa';
import './ThemeSwitcher.css';

const ThemeSwitcher = () => {
  const { 
    themeMode, 
    toggleTheme, 
    colorTheme, 
    changeColorTheme, 
    availableThemes 
  } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="theme-switcher">
      {/* Theme Mode Toggle */}
      <button 
        className="theme-toggle-btn"
        onClick={toggleTheme}
        title={themeMode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
      >
        {themeMode === 'light' ? <FaMoon /> : <FaSun />}
      </button>

      {/* Color Theme Selector */}
      <div className="color-theme-selector">
        <button 
          className="color-theme-btn"
          onClick={() => setIsOpen(!isOpen)}
          title="Change Color Theme"
        >
          <FaPalette />
        </button>

        {isOpen && (
          <>
            <div 
              className="theme-overlay"
              onClick={() => setIsOpen(false)}
            />
            <div className="theme-picker-dropdown">
              <div className="theme-picker-header">
                <h3>Choose Theme Color</h3>
                <button 
                  className="close-btn"
                  onClick={() => setIsOpen(false)}
                >
                  ×
                </button>
              </div>
              <div className="theme-colors-grid">
                {Object.entries(availableThemes).map(([key, theme]) => (
                  <button
                    key={key}
                    className={`theme-color-option ${colorTheme === key ? 'active' : ''}`}
                    onClick={() => {
                      changeColorTheme(key);
                      setIsOpen(false);
                    }}
                    style={{
                      background: theme.gradient,
                    }}
                    title={theme.name}
                  >
                    <div className="theme-color-preview" style={{ background: theme.gradient }}>
                      {colorTheme === key && (
                        <div className="check-icon">✓</div>
                      )}
                    </div>
                    <span className="theme-name">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
