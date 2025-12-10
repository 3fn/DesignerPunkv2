/**
 * Compare Material Design WCAG vs Cyberpunk WCAG contrast ratios
 * 
 * Tests both palettes against:
 * - Light mode: #FFFFFF background
 * - Dark mode: #0A0A0F background
 */

// Material Design WCAG values (currently in ColorTokens.ts)
const materialDesignWCAG = {
  light: {
    yellow: {
      100: '#FFF8E1',
      200: '#F5D700',
      300: '#B8A100',
      400: '#7A6B00',
      500: '#3D3500'
    },
    orange: {
      100: '#FFF3E0',
      200: '#F59E00',
      300: '#B87500',
      400: '#8C5A00',
      500: '#4D3100'
    },
    purple: {
      100: '#F3E5F5',
      200: '#9C27B0',
      300: '#7B1FA2',
      400: '#4A148C',
      500: '#2E0854'
    },
    pink: {
      100: '#FCE4EC',
      200: '#E91E63',
      300: '#C2185B',
      400: '#880E4F',
      500: '#4D0829'
    },
    cyan: {
      100: '#E0F7FA',
      200: '#00BCD4',
      300: '#0097A7',
      400: '#006064',
      500: '#003840'
    },
    teal: {
      100: '#E0F2F1',
      200: '#009688',
      300: '#00796B',
      400: '#004D40',
      500: '#002920'
    },
    green: {
      100: '#E8F5E9',
      200: '#4CAF50',
      300: '#388E3C',
      400: '#1B5E20',
      500: '#0D3010'
    }
  },
  dark: {
    yellow: {
      100: '#FFF9B3',
      200: '#FFE866',
      300: '#E6C200',
      400: '#B39400',
      500: '#665400'
    },
    orange: {
      100: '#FFD9A3',
      200: '#FFB84D',
      300: '#D99500',
      400: '#A67000',
      500: '#5C3D00'
    },
    purple: {
      100: '#E6B3FF',
      200: '#C966FF',
      300: '#A347E0',
      400: '#7D2FB3',
      500: '#3D1759'
    },
    pink: {
      100: '#FFB3D1',
      200: '#FF6BA3',
      300: '#E63075',
      400: '#B32659',
      500: '#5C1A33'
    },
    cyan: {
      100: '#B3F9FF',
      200: '#66E6F5',
      300: '#33C7D9',
      400: '#1F99A6',
      500: '#0D4D59'
    },
    teal: {
      100: '#A3F0E6',
      200: '#5CD9C7',
      300: '#2DB39F',
      400: '#1F8C7A',
      500: '#0F4D43'
    },
    green: {
      100: '#B3FFB3',
      200: '#66FF66',
      300: '#33E033',
      400: '#26B326',
      500: '#145914'
    }
  }
};

// Cyberpunk WCAG values (from cyberpunk-wcag-palette.tsx)
const cyberpunkWCAG = {
  light: {
    yellow: {
      100: '#FFF9B3',
      300: '#F5E34A',
      500: '#E6D200',
      700: '#9B8E00',
      900: '#5C5400'
    },
    amber: {
      100: '#FFD4C2',
      300: '#FFA380',
      500: '#E65A2A',
      700: '#B34621',
      900: '#6B2A14'
    },
    purple: {
      100: '#F5D4FF',
      300: '#D580FF',
      500: '#A928E6',
      700: '#7A1DA6',
      900: '#4A1166'
    },
    cyan: {
      100: '#B3F5FF',
      300: '#66E5F5',
      500: '#00C5D9',
      700: '#008C99',
      900: '#005259'
    },
    teal: {
      100: '#B3D9E0',
      300: '#66A6B3',
      500: '#2D7380',
      700: '#1F5159',
      900: '#143740'
    }
  },
  dark: {
    yellow: {
      100: '#FFF9B3',
      300: '#F5E34A',
      500: '#E6D200',
      700: '#9B8E00',
      900: '#5C5400'
    },
    amber: {
      100: '#FFD4C2',
      300: '#FFA380',
      500: '#E65A2A',
      700: '#B34621',
      900: '#6B2A14'
    },
    purple: {
      100: '#F5D4FF',
      300: '#D580FF',
      500: '#A928E6',
      700: '#7A1DA6',
      900: '#4A1166'
    },
    cyan: {
      100: '#B3F5FF',
      300: '#66E5F5',
      500: '#00C5D9',
      700: '#008C99',
      900: '#005259'
    },
    teal: {
      100: '#B3D9E0',
      300: '#66A6B3',
      500: '#2D7380',
      700: '#1F5159',
      900: '#143740'
    }
  }
};

// Calculate relative luminance
function getLuminance(hex) {
  const rgb = parseInt(hex.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG standards
function getWCAGLevel(ratio) {
  if (ratio >= 7.0) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3.0) return 'AA Large';
  return 'FAIL';
}

// Compare palettes
console.log('='.repeat(80));
console.log('MATERIAL DESIGN WCAG vs CYBERPUNK WCAG - CONTRAST RATIO COMPARISON');
console.log('='.repeat(80));
console.log('');

const lightBg = '#FFFFFF';
const darkBg = '#0A0A0F';

// Light Mode Comparison
console.log('LIGHT MODE (on #FFFFFF background)');
console.log('-'.repeat(80));
console.log('');

const lightFamilies = ['yellow', 'orange', 'purple', 'pink', 'cyan', 'teal', 'green'];

lightFamilies.forEach(family => {
  console.log(`${family.toUpperCase()} FAMILY:`);
  console.log('');
  
  const materialFamily = materialDesignWCAG.light[family];
  const cyberpunkFamily = cyberpunkWCAG.light[family === 'orange' ? 'amber' : family];
  
  if (!materialFamily) {
    console.log(`  Material Design: No data`);
    console.log('');
    return;
  }
  
  // Material Design
  console.log('  Material Design WCAG:');
  Object.entries(materialFamily).forEach(([token, hex]) => {
    const ratio = getContrastRatio(hex, lightBg);
    const level = getWCAGLevel(ratio);
    console.log(`    ${token}: ${hex} - ${ratio.toFixed(2)}:1 (${level})`);
  });
  console.log('');
  
  // Cyberpunk (if available)
  if (cyberpunkFamily) {
    console.log('  Cyberpunk WCAG:');
    Object.entries(cyberpunkFamily).forEach(([token, hex]) => {
      const ratio = getContrastRatio(hex, lightBg);
      const level = getWCAGLevel(ratio);
      console.log(`    ${token}: ${hex} - ${ratio.toFixed(2)}:1 (${level})`);
    });
  } else {
    console.log('  Cyberpunk WCAG: No equivalent data');
  }
  
  console.log('');
});

// Dark Mode Comparison
console.log('');
console.log('='.repeat(80));
console.log('DARK MODE (on #0A0A0F background)');
console.log('-'.repeat(80));
console.log('');

lightFamilies.forEach(family => {
  console.log(`${family.toUpperCase()} FAMILY:`);
  console.log('');
  
  const materialFamily = materialDesignWCAG.dark[family];
  const cyberpunkFamily = cyberpunkWCAG.dark[family === 'orange' ? 'amber' : family];
  
  if (!materialFamily) {
    console.log(`  Material Design: No data`);
    console.log('');
    return;
  }
  
  // Material Design
  console.log('  Material Design WCAG:');
  Object.entries(materialFamily).forEach(([token, hex]) => {
    const ratio = getContrastRatio(hex, darkBg);
    const level = getWCAGLevel(ratio);
    console.log(`    ${token}: ${hex} - ${ratio.toFixed(2)}:1 (${level})`);
  });
  console.log('');
  
  // Cyberpunk (if available)
  if (cyberpunkFamily) {
    console.log('  Cyberpunk WCAG:');
    Object.entries(cyberpunkFamily).forEach(([token, hex]) => {
      const ratio = getContrastRatio(hex, darkBg);
      const level = getWCAGLevel(ratio);
      console.log(`    ${token}: ${hex} - ${ratio.toFixed(2)}:1 (${level})`);
    });
  } else {
    console.log('  Cyberpunk WCAG: No equivalent data');
  }
  
  console.log('');
});

// Summary Statistics
console.log('');
console.log('='.repeat(80));
console.log('SUMMARY STATISTICS');
console.log('-'.repeat(80));
console.log('');

function analyzeFamily(palette, mode, bg) {
  const stats = {
    total: 0,
    aaa: 0,
    aa: 0,
    aaLarge: 0,
    fail: 0,
    avgRatio: 0
  };
  
  const families = mode === 'light' ? lightFamilies : lightFamilies;
  let totalRatio = 0;
  
  families.forEach(family => {
    const paletteFamily = palette[mode][family];
    if (!paletteFamily) return;
    
    Object.values(paletteFamily).forEach(hex => {
      const ratio = getContrastRatio(hex, bg);
      const level = getWCAGLevel(ratio);
      
      stats.total++;
      totalRatio += ratio;
      
      if (level === 'AAA') stats.aaa++;
      else if (level === 'AA') stats.aa++;
      else if (level === 'AA Large') stats.aaLarge++;
      else stats.fail++;
    });
  });
  
  stats.avgRatio = stats.total > 0 ? totalRatio / stats.total : 0;
  return stats;
}

const materialLightStats = analyzeFamily(materialDesignWCAG, 'light', lightBg);
const materialDarkStats = analyzeFamily(materialDesignWCAG, 'dark', darkBg);

console.log('Material Design WCAG:');
console.log(`  Light Mode: ${materialLightStats.total} colors`);
console.log(`    AAA (7:1+): ${materialLightStats.aaa} (${(materialLightStats.aaa/materialLightStats.total*100).toFixed(1)}%)`);
console.log(`    AA (4.5:1+): ${materialLightStats.aa} (${(materialLightStats.aa/materialLightStats.total*100).toFixed(1)}%)`);
console.log(`    AA Large (3:1+): ${materialLightStats.aaLarge} (${(materialLightStats.aaLarge/materialLightStats.total*100).toFixed(1)}%)`);
console.log(`    FAIL: ${materialLightStats.fail} (${(materialLightStats.fail/materialLightStats.total*100).toFixed(1)}%)`);
console.log(`    Average Ratio: ${materialLightStats.avgRatio.toFixed(2)}:1`);
console.log('');
console.log(`  Dark Mode: ${materialDarkStats.total} colors`);
console.log(`    AAA (7:1+): ${materialDarkStats.aaa} (${(materialDarkStats.aaa/materialDarkStats.total*100).toFixed(1)}%)`);
console.log(`    AA (4.5:1+): ${materialDarkStats.aa} (${(materialDarkStats.aa/materialDarkStats.total*100).toFixed(1)}%)`);
console.log(`    AA Large (3:1+): ${materialDarkStats.aaLarge} (${(materialDarkStats.aaLarge/materialDarkStats.total*100).toFixed(1)}%)`);
console.log(`    FAIL: ${materialDarkStats.fail} (${(materialDarkStats.fail/materialDarkStats.total*100).toFixed(1)}%)`);
console.log(`    Average Ratio: ${materialDarkStats.avgRatio.toFixed(2)}:1`);
console.log('');

console.log('Note: Cyberpunk WCAG uses different token numbering (100/300/500/700/900)');
console.log('      Direct statistical comparison requires mapping equivalent tokens');
console.log('');
console.log('='.repeat(80));
