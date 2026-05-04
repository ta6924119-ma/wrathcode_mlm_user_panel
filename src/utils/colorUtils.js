// Color utility functions

/**
 * Lighten a hex color by a percentage
 */
export const lightenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.min(255, (num >> 16) + (percent * 2.55));
  const g = Math.min(255, ((num >> 8) & 0x00FF) + (percent * 2.55));
  const b = Math.min(255, (num & 0x0000FF) + (percent * 2.55));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

/**
 * Darken a hex color by a percentage
 */
export const darkenColor = (color, percent) => {
  const num = parseInt(color.replace("#", ""), 16);
  const r = Math.max(0, (num >> 16) - (percent * 2.55));
  const g = Math.max(0, ((num >> 8) & 0x00FF) - (percent * 2.55));
  const b = Math.max(0, (num & 0x0000FF) - (percent * 2.55));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
};

/**
 * Generate gradient colors based on theme
 */
export const generateThemeGradients = (theme) => {
  const primary = theme.primary;
  const secondary = theme.secondary;
  const primaryDark = theme.primaryDark;
  
  return {
    card1: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
    card2: `linear-gradient(135deg, ${primary} 0%, ${primaryDark} 100%)`,
    card3: `linear-gradient(135deg, ${secondary} 0%, ${lightenColor(secondary, 20)} 100%)`,
    card4: `linear-gradient(135deg, ${primaryDark} 0%, ${lightenColor(primaryDark, 30)} 100%)`,
  };
};
