import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CyberpunkThemeComparison() {
  const [copiedColor, setCopiedColor] = useState(null);
  const [theme, setTheme] = useState('original'); // 'original' or 'wcag'
  const [mode, setMode] = useState('dark'); // 'dark' or 'light'
  const [showExport, setShowExport] = useState(false);

  const themes = {
    original: {
      dark: {
        yellow: [
          { name: 'Yellow 100', hex: '#FEFBCC', role: 'Subtle backgrounds' },
          { name: 'Yellow 300', hex: '#FCF680', role: 'Hover states' },
          { name: 'Yellow 500', hex: '#F9F002', role: 'High energy CTA' },
          { name: 'Yellow 700', hex: '#C7C002', role: 'Active states' },
          { name: 'Yellow 900', hex: '#8F8B01', role: 'Deep accents' },
        ],
        amber: [
          { name: 'Amber 100', hex: '#FFE5DC', role: 'Subtle backgrounds' },
          { name: 'Amber 300', hex: '#FFB8A0', role: 'Hover states' },
          { name: 'Amber 500', hex: '#FF6B35', role: 'Secondary CTA' },
          { name: 'Amber 700', hex: '#CC5529', role: 'Active states' },
          { name: 'Amber 900', hex: '#8F3C1D', role: 'Deep accents' },
        ],
        purple: [
          { name: 'Purple 100', hex: '#F3E0FF', role: 'Subtle backgrounds' },
          { name: 'Purple 300', hex: '#D98AFF', role: 'Hover states' },
          { name: 'Purple 500', hex: '#B026FF', role: 'Main brand' },
          { name: 'Purple 700', hex: '#8D1ECC', role: 'Active states' },
          { name: 'Purple 900', hex: '#63158F', role: 'Deep accents' },
        ],
        violet: [
          { name: 'Violet 100', hex: '#E8DDF3', role: 'Subtle backgrounds' },
          { name: 'Violet 300', hex: '#9A6BC2', role: 'Hover states' },
          { name: 'Violet 500', hex: '#5B2C91', role: 'Depth & hover' },
          { name: 'Violet 700', hex: '#482374', role: 'Active states' },
          { name: 'Violet 900', hex: '#331951', role: 'Deep accents' },
        ],
        cyan: [
          { name: 'Cyan 100', hex: '#CCFBFF', role: 'Subtle backgrounds' },
          { name: 'Cyan 300', hex: '#80F6FF', role: 'Hover states' },
          { name: 'Cyan 500', hex: '#00F0FF', role: 'Tech elements' },
          { name: 'Cyan 700', hex: '#00C0CC', role: 'Active states' },
          { name: 'Cyan 900', hex: '#00888F', role: 'Deep accents' },
        ],
        teal: [
          { name: 'Teal 100', hex: '#D9E8EA', role: 'Subtle backgrounds' },
          { name: 'Teal 300', hex: '#4D9BA5', role: 'Hover states' },
          { name: 'Teal 500', hex: '#1A535C', role: 'Secondary UI' },
          { name: 'Teal 700', hex: '#15424A', role: 'Active states' },
          { name: 'Teal 900', hex: '#0F2E33', role: 'Deep accents' },
        ],
        black: [
          { name: 'Black 100', hex: '#3A3A45', role: 'Elevated surfaces' },
          { name: 'Black 300', hex: '#22222A', role: 'Cards' },
          { name: 'Black 500', hex: '#0A0A0F', role: 'Background' },
          { name: 'Black 700', hex: '#06060A', role: 'Deep shadows' },
          { name: 'Black 900', hex: '#000000', role: 'Pure black' },
        ],
        gray: [
          { name: 'Gray 100', hex: '#B8B6C8', role: 'Subtle text' },
          { name: 'Gray 300', hex: '#68658A', role: 'Secondary text' },
          { name: 'Gray 500', hex: '#2D2B3E', role: 'Surfaces' },
          { name: 'Gray 700', hex: '#1F1D2E', role: 'Borders' },
          { name: 'Gray 900', hex: '#15131F', role: 'Deep surfaces' },
        ],
        white: [
          { name: 'White 100', hex: '#FFFFFF', role: 'Pure white' },
          { name: 'White 300', hex: '#F5F5FA', role: 'Bright highlights' },
          { name: 'White 500', hex: '#E8E8F0', role: 'Primary text' },
          { name: 'White 700', hex: '#C5C5D5', role: 'Muted text' },
          { name: 'White 900', hex: '#9999AB', role: 'Subtle text' },
        ],
      },
      light: {
        yellow: [
          { name: 'Yellow 100', hex: '#FEFBCC', role: 'Subtle backgrounds' },
          { name: 'Yellow 300', hex: '#FCF680', role: 'Hover states' },
          { name: 'Yellow 500', hex: '#F9F002', role: 'High energy CTA' },
          { name: 'Yellow 700', hex: '#C7C002', role: 'Active states' },
          { name: 'Yellow 900', hex: '#8F8B01', role: 'Deep accents' },
        ],
        amber: [
          { name: 'Amber 100', hex: '#FFE5DC', role: 'Subtle backgrounds' },
          { name: 'Amber 300', hex: '#FFB8A0', role: 'Hover states' },
          { name: 'Amber 500', hex: '#FF6B35', role: 'Secondary CTA' },
          { name: 'Amber 700', hex: '#CC5529', role: 'Active states' },
          { name: 'Amber 900', hex: '#8F3C1D', role: 'Deep accents' },
        ],
        purple: [
          { name: 'Purple 100', hex: '#F3E0FF', role: 'Subtle backgrounds' },
          { name: 'Purple 300', hex: '#D98AFF', role: 'Hover states' },
          { name: 'Purple 500', hex: '#B026FF', role: 'Main brand' },
          { name: 'Purple 700', hex: '#8D1ECC', role: 'Active states' },
          { name: 'Purple 900', hex: '#63158F', role: 'Deep accents' },
        ],
        violet: [
          { name: 'Violet 100', hex: '#E8DDF3', role: 'Subtle backgrounds' },
          { name: 'Violet 300', hex: '#9A6BC2', role: 'Hover states' },
          { name: 'Violet 500', hex: '#5B2C91', role: 'Depth & hover' },
          { name: 'Violet 700', hex: '#482374', role: 'Active states' },
          { name: 'Violet 900', hex: '#331951', role: 'Deep accents' },
        ],
        cyan: [
          { name: 'Cyan 100', hex: '#CCFBFF', role: 'Subtle backgrounds' },
          { name: 'Cyan 300', hex: '#80F6FF', role: 'Hover states' },
          { name: 'Cyan 500', hex: '#00F0FF', role: 'Tech elements' },
          { name: 'Cyan 700', hex: '#00C0CC', role: 'Active states' },
          { name: 'Cyan 900', hex: '#00888F', role: 'Deep accents' },
        ],
        teal: [
          { name: 'Teal 100', hex: '#D9E8EA', role: 'Subtle backgrounds' },
          { name: 'Teal 300', hex: '#4D9BA5', role: 'Hover states' },
          { name: 'Teal 500', hex: '#1A535C', role: 'Secondary UI' },
          { name: 'Teal 700', hex: '#15424A', role: 'Active states' },
          { name: 'Teal 900', hex: '#0F2E33', role: 'Deep accents' },
        ],
        black: [
          { name: 'Black 100', hex: '#3A3A45', role: 'Elevated surfaces' },
          { name: 'Black 300', hex: '#22222A', role: 'Cards' },
          { name: 'Black 500', hex: '#0A0A0F', role: 'Background' },
          { name: 'Black 700', hex: '#06060A', role: 'Deep shadows' },
          { name: 'Black 900', hex: '#000000', role: 'Pure black' },
        ],
        gray: [
          { name: 'Gray 100', hex: '#B8B6C8', role: 'Subtle text' },
          { name: 'Gray 300', hex: '#68658A', role: 'Secondary text' },
          { name: 'Gray 500', hex: '#2D2B3E', role: 'Surfaces' },
          { name: 'Gray 700', hex: '#1F1D2E', role: 'Borders' },
          { name: 'Gray 900', hex: '#15131F', role: 'Deep surfaces' },
        ],
        white: [
          { name: 'White 100', hex: '#FFFFFF', role: 'Pure white' },
          { name: 'White 300', hex: '#F5F5FA', role: 'Bright highlights' },
          { name: 'White 500', hex: '#E8E8F0', role: 'Primary text' },
          { name: 'White 700', hex: '#C5C5D5', role: 'Muted text' },
          { name: 'White 900', hex: '#9999AB', role: 'Subtle text' },
        ],
      }
    },
    wcag: {
      dark: {
        yellow: [
          { name: 'Yellow 100', hex: '#FFF9B3', role: 'Subtle backgrounds' },
          { name: 'Yellow 300', hex: '#F5E34A', role: 'Hover states' },
          { name: 'Yellow 500', hex: '#E6D200', role: 'High energy CTA' },
          { name: 'Yellow 700', hex: '#9B8E00', role: 'Active states' },
          { name: 'Yellow 900', hex: '#5C5400', role: 'Deep accents' },
        ],
        amber: [
          { name: 'Amber 100', hex: '#FFD4C2', role: 'Subtle backgrounds' },
          { name: 'Amber 300', hex: '#FFA380', role: 'Hover states' },
          { name: 'Amber 500', hex: '#E65A2A', role: 'Secondary CTA' },
          { name: 'Amber 700', hex: '#B34621', role: 'Active states' },
          { name: 'Amber 900', hex: '#6B2A14', role: 'Deep accents' },
        ],
        purple: [
          { name: 'Purple 100', hex: '#F5D4FF', role: 'Subtle backgrounds' },
          { name: 'Purple 300', hex: '#D580FF', role: 'Hover states' },
          { name: 'Purple 500', hex: '#A928E6', role: 'Main brand' },
          { name: 'Purple 700', hex: '#7A1DA6', role: 'Active states' },
          { name: 'Purple 900', hex: '#4A1166', role: 'Deep accents' },
        ],
        violet: [
          { name: 'Violet 100', hex: '#DCC8F0', role: 'Subtle backgrounds' },
          { name: 'Violet 300', hex: '#A87DD9', role: 'Hover states' },
          { name: 'Violet 500', hex: '#7A48B3', role: 'Depth & hover' },
          { name: 'Violet 700', hex: '#5A3380', role: 'Active states' },
          { name: 'Violet 900', hex: '#3A2159', role: 'Deep accents' },
        ],
        cyan: [
          { name: 'Cyan 100', hex: '#B3F5FF', role: 'Subtle backgrounds' },
          { name: 'Cyan 300', hex: '#66E5F5', role: 'Hover states' },
          { name: 'Cyan 500', hex: '#00C5D9', role: 'Tech elements' },
          { name: 'Cyan 700', hex: '#008C99', role: 'Active states' },
          { name: 'Cyan 900', hex: '#005259', role: 'Deep accents' },
        ],
        teal: [
          { name: 'Teal 100', hex: '#B3D9E0', role: 'Subtle backgrounds' },
          { name: 'Teal 300', hex: '#66A6B3', role: 'Hover states' },
          { name: 'Teal 500', hex: '#2D7380', role: 'Secondary UI' },
          { name: 'Teal 700', hex: '#1F5159', role: 'Active states' },
          { name: 'Teal 900', hex: '#143740', role: 'Deep accents' },
        ],
        black: [
          { name: 'Black 100', hex: '#52525C', role: 'Elevated surfaces' },
          { name: 'Black 300', hex: '#2E2E38', role: 'Cards' },
          { name: 'Black 500', hex: '#0A0A0F', role: 'Background' },
          { name: 'Black 700', hex: '#06060A', role: 'Deep shadows' },
          { name: 'Black 900', hex: '#000000', role: 'Pure black' },
        ],
        gray: [
          { name: 'Gray 100', hex: '#C2C0D4', role: 'Subtle text' },
          { name: 'Gray 300', hex: '#8A879E', role: 'Secondary text' },
          { name: 'Gray 500', hex: '#4D4A5C', role: 'Surfaces' },
          { name: 'Gray 700', hex: '#2E2C3D', role: 'Borders' },
          { name: 'Gray 900', hex: '#1A1826', role: 'Deep surfaces' },
        ],
        white: [
          { name: 'White 100', hex: '#FFFFFF', role: 'Pure white' },
          { name: 'White 300', hex: '#F2F2FA', role: 'Bright highlights' },
          { name: 'White 500', hex: '#D9D9E6', role: 'Primary text' },
          { name: 'White 700', hex: '#A6A6BF', role: 'Muted text' },
          { name: 'White 900', hex: '#737388', role: 'Subtle text' },
        ],
      },
      light: {
        yellow: [
          { name: 'Yellow 100', hex: '#FFF9B3', role: 'Subtle backgrounds' },
          { name: 'Yellow 300', hex: '#F5E34A', role: 'Hover states' },
          { name: 'Yellow 500', hex: '#E6D200', role: 'High energy CTA' },
          { name: 'Yellow 700', hex: '#9B8E00', role: 'Active states' },
          { name: 'Yellow 900', hex: '#5C5400', role: 'Deep accents' },
        ],
        amber: [
          { name: 'Amber 100', hex: '#FFD4C2', role: 'Subtle backgrounds' },
          { name: 'Amber 300', hex: '#FFA380', role: 'Hover states' },
          { name: 'Amber 500', hex: '#E65A2A', role: 'Secondary CTA' },
          { name: 'Amber 700', hex: '#B34621', role: 'Active states' },
          { name: 'Amber 900', hex: '#6B2A14', role: 'Deep accents' },
        ],
        purple: [
          { name: 'Purple 100', hex: '#F5D4FF', role: 'Subtle backgrounds' },
          { name: 'Purple 300', hex: '#D580FF', role: 'Hover states' },
          { name: 'Purple 500', hex: '#A928E6', role: 'Main brand' },
          { name: 'Purple 700', hex: '#7A1DA6', role: 'Active states' },
          { name: 'Purple 900', hex: '#4A1166', role: 'Deep accents' },
        ],
        violet: [
          { name: 'Violet 100', hex: '#DCC8F0', role: 'Subtle backgrounds' },
          { name: 'Violet 300', hex: '#A87DD9', role: 'Hover states' },
          { name: 'Violet 500', hex: '#7A48B3', role: 'Depth & hover' },
          { name: 'Violet 700', hex: '#5A3380', role: 'Active states' },
          { name: 'Violet 900', hex: '#3A2159', role: 'Deep accents' },
        ],
        cyan: [
          { name: 'Cyan 100', hex: '#B3F5FF', role: 'Subtle backgrounds' },
          { name: 'Cyan 300', hex: '#66E5F5', role: 'Hover states' },
          { name: 'Cyan 500', hex: '#00C5D9', role: 'Tech elements' },
          { name: 'Cyan 700', hex: '#008C99', role: 'Active states' },
          { name: 'Cyan 900', hex: '#005259', role: 'Deep accents' },
        ],
        teal: [
          { name: 'Teal 100', hex: '#B3D9E0', role: 'Subtle backgrounds' },
          { name: 'Teal 300', hex: '#66A6B3', role: 'Hover states' },
          { name: 'Teal 500', hex: '#2D7380', role: 'Secondary UI' },
          { name: 'Teal 700', hex: '#1F5159', role: 'Active states' },
          { name: 'Teal 900', hex: '#143740', role: 'Deep accents' },
        ],
        black: [
          { name: 'Black 100', hex: '#52525C', role: 'Elevated surfaces' },
          { name: 'Black 300', hex: '#2E2E38', role: 'Cards' },
          { name: 'Black 500', hex: '#0A0A0F', role: 'Background' },
          { name: 'Black 700', hex: '#06060A', role: 'Deep shadows' },
          { name: 'Black 900', hex: '#000000', role: 'Pure black' },
        ],
        gray: [
          { name: 'Gray 100', hex: '#C2C0D4', role: 'Subtle text' },
          { name: 'Gray 300', hex: '#8A879E', role: 'Secondary text' },
          { name: 'Gray 500', hex: '#4D4A5C', role: 'Surfaces' },
          { name: 'Gray 700', hex: '#2E2C3D', role: 'Borders' },
          { name: 'Gray 900', hex: '#1A1826', role: 'Deep surfaces' },
        ],
        white: [
          { name: 'White 100', hex: '#FFFFFF', role: 'Pure white' },
          { name: 'White 300', hex: '#F2F2FA', role: 'Bright highlights' },
          { name: 'White 500', hex: '#D9D9E6', role: 'Primary text' },
          { name: 'White 700', hex: '#A6A6BF', role: 'Muted text' },
          { name: 'White 900', hex: '#737388', role: 'Subtle text' },
        ],
      }
    }
  };

  const currentTheme = themes[theme][mode];
  const colorFamilies = [
    { key: 'yellow', label: 'Electric Yellow' },
    { key: 'amber', label: 'Burnt Amber' },
    { key: 'purple', label: 'Deep Neon Purple' },
    { key: 'violet', label: 'Shadow Violet' },
    { key: 'cyan', label: 'Cyber Cyan' },
    { key: 'teal', label: 'Deep Teal' },
    { key: 'black', label: 'Void Black' },
    { key: 'gray', label: 'Ghost Gray' },
    { key: 'white', label: 'Neon White' },
  ];

  // Helper function to calculate relative luminance
  const getLuminance = (hex) => {
    const rgb = parseInt(hex.slice(1), 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  // Calculate contrast ratio
  const getContrastRatio = (hex1, hex2) => {
    const lum1 = getLuminance(hex1);
    const lum2 = getLuminance(hex2);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
  };

  const copyToClipboard = (hex, name) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(name);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const exportThemeJSON = () => {
    const currentThemeData = themes[theme];
    const exportData = {
      theme: theme === 'original' ? 'Cyberpunk Original' : 'Cyberpunk WCAG 2.2',
      version: '1.0.0',
      modes: {
        dark: {},
        light: {}
      }
    };

    // Build the JSON structure
    ['dark', 'light'].forEach(m => {
      colorFamilies.forEach(family => {
        currentThemeData[m][family.key].forEach(color => {
          const bg = m === 'dark' ? '#0A0A0F' : '#FFFFFF';
          const contrast = getContrastRatio(color.hex, bg);
          
          exportData.modes[m][color.name.toLowerCase().replace(' ', '-')] = {
            hex: color.hex,
            role: color.role,
            contrast: {
              ratio: parseFloat(contrast.toFixed(2)),
              aa: contrast >= 4.5,
              aaa: contrast >= 7.0
            }
          };
        });
      });
    });

    const jsonString = JSON.stringify(exportData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cyberpunk-${theme}-theme.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const bgColor = mode === 'dark' ? '#0A0A0F' : '#FFFFFF';
  const cardBg = mode === 'dark' ? '#1A1826' : '#F2F2FA';
  const textColor = mode === 'dark' ? '#E8E8F0' : '#0A0A0F';
  const mutedText = mode === 'dark' ? '#9999AB' : '#52525C';

  return (
    <div style={{ backgroundColor: bgColor, minHeight: '100vh' }} className="p-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header with Controls */}
        <div className="mb-10">
          <h1 style={{ color: textColor }} className="text-4xl font-bold mb-4">
            Cyberpunk Theme System
          </h1>
          <p style={{ color: mutedText }} className="text-lg mb-6">
            45 tokens per theme · Compare Original vs WCAG Compliant · Dark & Light modes
          </p>
          
          {/* Theme & Mode Switcher */}
          <div className="flex flex-wrap gap-4">
            <div>
              <label style={{ color: mutedText }} className="text-sm font-semibold block mb-2">
                THEME
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTheme('original')}
                  style={{
                    backgroundColor: theme === 'original' ? '#B026FF' : cardBg,
                    color: theme === 'original' ? '#FFFFFF' : textColor,
                    borderColor: theme === 'original' ? '#B026FF' : (mode === 'dark' ? '#2E2C3D' : '#C2C0D4')
                  }}
                  className="px-4 py-2 rounded-lg font-semibold border-2 transition-all"
                >
                  Original
                </button>
                <button
                  onClick={() => setTheme('wcag')}
                  style={{
                    backgroundColor: theme === 'wcag' ? '#00C5D9' : cardBg,
                    color: theme === 'wcag' ? '#000000' : textColor,
                    borderColor: theme === 'wcag' ? '#00C5D9' : (mode === 'dark' ? '#2E2C3D' : '#C2C0D4')
                  }}
                  className="px-4 py-2 rounded-lg font-semibold border-2 transition-all"
                >
                  WCAG 2.2
                </button>
              </div>
            </div>

            <div>
              <label style={{ color: mutedText }} className="text-sm font-semibold block mb-2">
                MODE
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setMode('dark')}
                  style={{
                    backgroundColor: mode === 'dark' ? '#5B2C91' : cardBg,
                    color: mode === 'dark' ? '#FFFFFF' : textColor,
                    borderColor: mode === 'dark' ? '#5B2C91' : (mode === 'dark' ? '#2E2C3D' : '#C2C0D4')
                  }}
                  className="px-4 py-2 rounded-lg font-semibold border-2 transition-all"
                >
                  Dark
                </button>
                <button
                  onClick={() => setMode('light')}
                  style={{
                    backgroundColor: mode === 'light' ? '#F9F002' : cardBg,
                    color: mode === 'light' ? '#000000' : textColor,
                    borderColor: mode === 'light' ? '#F9F002' : (mode === 'dark' ? '#2E2C3D' : '#C2C0D4')
                  }}
                  className="px-4 py-2 rounded-lg font-semibold border-2 transition-all"
                >
                  Light
                </button>
              </div>
            </div>
          </div>

          {/* Current Selection Display */}
          <div 
            style={{ 
              backgroundColor: cardBg,
              borderColor: mode === 'dark' ? '#2E2C3D' : '#C2C0D4',
              color: textColor
            }}
            className="mt-6 p-4 rounded-lg border flex items-center justify-between"
          >
            <div className="text-sm">
              <strong>Viewing:</strong> {theme === 'original' ? 'Original Cyberpunk' : 'WCAG 2.2 Compliant'} · {mode === 'dark' ? 'Dark Mode' : 'Light Mode'}
            </div>
            <button
              onClick={exportThemeJSON}
              style={{
                backgroundColor: '#00C5D9',
                color: '#000000'
              }}
              className="px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Color Families Grid */}
        <div className="space-y-6">
          {colorFamilies.map((family) => (
            <div 
              key={family.key}
              style={{ 
                backgroundColor: cardBg,
                borderColor: mode === 'dark' ? '#2E2C3D' : '#C2C0D4'
              }}
              className="rounded-lg p-6 border"
            >
              <h2 style={{ color: textColor }} className="text-lg font-semibold mb-4">
                {family.label}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {currentTheme[family.key].map((color) => {
                  const bg = mode === 'dark' ? '#0A0A0F' : '#FFFFFF';
                  const contrastRatio = getContrastRatio(color.hex, bg);
                  const passesAA = contrastRatio >= 4.5;
                  const passesAAA = contrastRatio >= 7.0;
                  
                  return (
                    <div
                      key={color.name}
                      style={{ 
                        backgroundColor: mode === 'dark' ? '#0A0A0F' : '#FFFFFF',
                        borderColor: mode === 'dark' ? '#2E2C3D' : '#C2C0D4'
                      }}
                      className="rounded-lg overflow-hidden border hover:shadow-lg transition-all cursor-pointer"
                      onClick={() => copyToClipboard(color.hex, color.name)}
                    >
                      {/* Color Swatch */}
                      <div
                        className="h-24 w-full relative group"
                        style={{ backgroundColor: color.hex }}
                      >
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                          {copiedColor === color.name ? (
                            <Check className="text-white w-6 h-6 drop-shadow-lg opacity-0 group-hover:opacity-100" />
                          ) : (
                            <Copy className="text-white w-6 h-6 drop-shadow-lg opacity-0 group-hover:opacity-100" />
                          )}
                        </div>
                        
                        {/* Contrast Badge */}
                        <div 
                          style={{ 
                            backgroundColor: passesAAA ? '#00C5D9' : passesAA ? '#E6D200' : '#E65A2A'
                          }}
                          className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold text-black"
                        >
                          {passesAAA ? 'AAA' : passesAA ? 'AA' : 'Fail'}
                        </div>
                      </div>

                      {/* Color Info */}
                      <div className="p-3">
                        <h3 style={{ color: textColor }} className="font-semibold text-sm mb-1">
                          {color.name}
                        </h3>
                        <p style={{ color: mutedText }} className="text-xs mb-2">
                          {color.role}
                        </p>
                        <div style={{ color: mutedText }} className="text-xs mb-2">
                          Contrast: {contrastRatio.toFixed(1)}:1
                        </div>
                        <div 
                          style={{ 
                            backgroundColor: mode === 'dark' ? '#2E2C3D' : '#E8E8F0',
                            color: mode === 'dark' ? '#C2C0D4' : '#2E2E38'
                          }}
                          className="px-2 py-1 rounded text-xs font-mono text-center"
                        >
                          {color.hex}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Theme Comparison Notes */}
        <div 
          style={{ 
            backgroundColor: cardBg,
            borderColor: mode === 'dark' ? '#2E2C3D' : '#C2C0D4'
          }}
          className="mt-10 rounded-lg p-6 border"
        >
          <h3 style={{ color: textColor }} className="text-lg font-semibold mb-4">
            {theme === 'original' ? 'Original Theme' : 'WCAG 2.2 Theme'}
          </h3>
          <div style={{ color: mutedText }} className="space-y-2 text-sm">
            {theme === 'original' ? (
              <>
                <p>Pure cyberpunk aesthetic with maximum neon intensity. Best for:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Marketing sites and landing pages</li>
                  <li>Hero sections and attention-grabbing elements</li>
                  <li>Decorative UI where accessibility is less critical</li>
                  <li>Branding and visual identity work</li>
                </ul>
              </>
            ) : (
              <>
                <p>Adjusted for WCAG 2.2 AA compliance (4.5:1 contrast minimum). Best for:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Applications and dashboards</li>
                  <li>E-commerce and transactional interfaces</li>
                  <li>Any product requiring legal accessibility compliance</li>
                  <li>Long-form content and reading experiences</li>
                </ul>
                <p className="mt-3">Key adjustments: Increased saturation for yellows, deepened purples/cyans, brightened light tints for dark mode.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}