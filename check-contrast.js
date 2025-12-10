// Quick contrast ratio checker for current WCAG values

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function getContrastRatio(hex1, hex2) {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

console.log('=== GREEN TOKENS (Light Mode - on white #FFFFFF) ===\n');

const greenTokens = {
  green100: { base: '#E6FFF5', wcag: '#D4FFE8' },
  green200: { base: '#80FFBB', wcag: '#66FFA8' },
  green300: { base: '#33FF99', wcag: '#1AE680' },
  green400: { base: '#00FF88', wcag: '#00CC6E' },
  green500: { base: '#00CC6E', wcag: '#009954' }
};

Object.entries(greenTokens).forEach(([name, colors]) => {
  const baseRatio = getContrastRatio(colors.base, '#FFFFFF');
  const wcagRatio = getContrastRatio(colors.wcag, '#FFFFFF');
  
  console.log(`${name}:`);
  console.log(`  base: ${colors.base} → ${baseRatio.toFixed(2)}:1`);
  console.log(`  wcag: ${colors.wcag} → ${wcagRatio.toFixed(2)}:1`);
  console.log();
});

console.log('\n=== PURPLE TOKENS (Light Mode - on white #FFFFFF) ===\n');

const purpleTokens = {
  purple300: { base: '#B026FF', wcag: '#A928E6' },
  purple400: { base: '#8D1ECC', wcag: '#7A1DA6' },
  purple500: { base: '#63158F', wcag: '#4A1166' }
};

Object.entries(purpleTokens).forEach(([name, colors]) => {
  const baseRatio = getContrastRatio(colors.base, '#FFFFFF');
  const wcagRatio = getContrastRatio(colors.wcag, '#FFFFFF');
  
  console.log(`${name}:`);
  console.log(`  base: ${colors.base} → ${baseRatio.toFixed(2)}:1`);
  console.log(`  wcag: ${colors.wcag} → ${wcagRatio.toFixed(2)}:1`);
  console.log();
});

console.log('\n=== WCAG STANDARDS ===');
console.log('3:1   - Large text (18pt+) or graphics');
console.log('4.5:1 - Normal text (body copy)');
console.log('7:1   - Enhanced contrast (AAA)');
