/**
 * Analyze contrast ratios for all color families against white background
 * Determines which families need WCAG proposal values vs which are already functional
 */

// Contrast ratio calculation (WCAG formula)
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

function getContrastRatio(hex1, hex2) {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

// White background for testing
const WHITE = '#FFFFFF';

// Color families to analyze
const colorFamilies = {
  yellow: {
    yellow100: { base: '#FEFBCC', wcag: '#FFF8E1' },
    yellow200: { base: '#FCF680', wcag: '#F5D700' },
    yellow300: { base: '#F9F002', wcag: '#B8A100' },
    yellow400: { base: '#C7C002', wcag: '#7A6B00' },
    yellow500: { base: '#8F8B01', wcag: '#3D3500' }
  },
  orange: {
    orange100: { base: '#FFE5DC', wcag: '#FFF3E0' },
    orange200: { base: '#FFB8A0', wcag: '#F59E00' },
    orange300: { base: '#FF6B35', wcag: '#B87500' },
    orange400: { base: '#CC5529', wcag: '#8C5A00' },
    orange500: { base: '#8F3C1D', wcag: '#4D3100' }
  },
  pink: {
    pink100: { base: '#FFDAE8', wcag: '#FFDAE8' },
    pink200: { base: '#FF82B4', wcag: '#FF82B4' },
    pink300: { base: '#FF2A6D', wcag: '#FF2A6D' },
    pink400: { base: '#CC2257', wcag: '#CC2257' },
    pink500: { base: '#801537', wcag: '#801537' }
  },
  cyan: {
    cyan100: { base: '#CCFBFF', wcag: '#B3F5FF' },
    cyan200: { base: '#80F6FF', wcag: '#66E5F5' },
    cyan300: { base: '#00F0FF', wcag: '#00C5D9' },
    cyan400: { base: '#00C0CC', wcag: '#008C99' },
    cyan500: { base: '#00888F', wcag: '#005259' }
  },
  teal: {
    teal100: { base: '#D9E8EA', wcag: '#B3D9E0' },
    teal200: { base: '#4D9BA5', wcag: '#66A6B3' },
    teal300: { base: '#1A535C', wcag: '#2D7380' },
    teal400: { base: '#15424A', wcag: '#1F5159' },
    teal500: { base: '#0F2E33', wcag: '#143740' }
  }
};

// WCAG standards
const WCAG_STANDARDS = {
  'AAA Large Text (7:1)': 7,
  'AA Body Text (4.5:1)': 4.5,
  'AA Large Text (3:1)': 3,
  'Non-Text (3:1)': 3
};

console.log('='.repeat(80));
console.log('COLOR CONTRAST ANALYSIS - All Remaining Families vs White Background');
console.log('='.repeat(80));
console.log();

// Analyze each family
Object.entries(colorFamilies).forEach(([familyName, tokens]) => {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`${familyName.toUpperCase()} FAMILY`);
  console.log('='.repeat(80));
  
  let familyNeedsProposal = false;
  const failedTokens = [];
  
  Object.entries(tokens).forEach(([tokenName, themes]) => {
    const baseRatio = getContrastRatio(themes.base, WHITE);
    const wcagRatio = getContrastRatio(themes.wcag, WHITE);
    
    console.log(`\n${tokenName}:`);
    console.log(`  Base: ${themes.base} → ${baseRatio.toFixed(2)}:1`);
    console.log(`  WCAG: ${themes.wcag} → ${wcagRatio.toFixed(2)}:1`);
    
    // Check against standards
    const basePassesBodyText = baseRatio >= 4.5;
    const wcagPassesBodyText = wcagRatio >= 4.5;
    const basePassesNonText = baseRatio >= 3;
    const wcagPassesNonText = wcagRatio >= 3;
    
    console.log(`  Base passes 4.5:1 (body text): ${basePassesBodyText ? '✅' : '❌'}`);
    console.log(`  WCAG passes 4.5:1 (body text): ${wcagPassesBodyText ? '✅' : '❌'}`);
    console.log(`  Base passes 3:1 (non-text): ${basePassesNonText ? '✅' : '❌'}`);
    console.log(`  WCAG passes 3:1 (non-text): ${wcagPassesNonText ? '✅' : '❌'}`);
    
    // Track if this token needs proposal values
    if (!wcagPassesBodyText) {
      familyNeedsProposal = true;
      failedTokens.push(tokenName);
    }
  });
  
  // Summary for family
  console.log(`\n${'─'.repeat(80)}`);
  if (familyNeedsProposal) {
    console.log(`❌ ${familyName.toUpperCase()} NEEDS PROPOSAL VALUES`);
    console.log(`   Failed tokens: ${failedTokens.join(', ')}`);
  } else {
    console.log(`✅ ${familyName.toUpperCase()} IS FUNCTIONAL (existing WCAG values work)`);
  }
  console.log('─'.repeat(80));
});

// Final summary
console.log('\n\n' + '='.repeat(80));
console.log('FINAL SUMMARY');
console.log('='.repeat(80));
console.log();
console.log('Based on contrast analysis against white background:');
console.log();
console.log('Families that NEED user\'s proposal values:');
console.log('  - Check results above for specific families');
console.log();
console.log('Families that are FUNCTIONAL with existing WCAG values:');
console.log('  - Check results above for specific families');
console.log();
console.log('Note: This analysis is for light mode on white background.');
console.log('Dark mode analysis would require testing against dark backgrounds.');
console.log('='.repeat(80));
