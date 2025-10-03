import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CyberpunkPalette() {
  const [copiedColor, setCopiedColor] = useState(null);

  const paletteGroups = [
    {
      category: 'Electric Yellow',
      baseColor: '#F9F002',
      colors: [
        { name: 'Yellow 100', descriptive: 'Lightest', hex: '#FEFBCC', role: 'Subtle backgrounds' },
        { name: 'Yellow 300', descriptive: 'Light', hex: '#FCF680', role: 'Hover states' },
        { name: 'Yellow 500', descriptive: 'Base', hex: '#F9F002', role: 'High energy CTA' },
        { name: 'Yellow 700', descriptive: 'Dark', hex: '#C7C002', role: 'Active states' },
        { name: 'Yellow 900', descriptive: 'Darkest', hex: '#8F8B01', role: 'Deep accents' },
      ]
    },
    {
      category: 'Burnt Amber',
      baseColor: '#FF6B35',
      colors: [
        { name: 'Amber 100', descriptive: 'Lightest', hex: '#FFE5DC', role: 'Subtle backgrounds' },
        { name: 'Amber 300', descriptive: 'Light', hex: '#FFB8A0', role: 'Hover states' },
        { name: 'Amber 500', descriptive: 'Base', hex: '#FF6B35', role: 'Secondary CTA' },
        { name: 'Amber 700', descriptive: 'Dark', hex: '#CC5529', role: 'Active states' },
        { name: 'Amber 900', descriptive: 'Darkest', hex: '#8F3C1D', role: 'Deep accents' },
      ]
    },
    {
      category: 'Deep Neon Purple',
      baseColor: '#B026FF',
      colors: [
        { name: 'Purple 100', descriptive: 'Lightest', hex: '#F3E0FF', role: 'Subtle backgrounds' },
        { name: 'Purple 300', descriptive: 'Light', hex: '#D98AFF', role: 'Hover states' },
        { name: 'Purple 500', descriptive: 'Base', hex: '#B026FF', role: 'Main brand' },
        { name: 'Purple 700', descriptive: 'Dark', hex: '#8D1ECC', role: 'Active states' },
        { name: 'Purple 900', descriptive: 'Darkest', hex: '#63158F', role: 'Deep accents' },
      ]
    },
    {
      category: 'Shadow Violet',
      baseColor: '#5B2C91',
      colors: [
        { name: 'Violet 100', descriptive: 'Lightest', hex: '#E8DDF3', role: 'Subtle backgrounds' },
        { name: 'Violet 300', descriptive: 'Light', hex: '#9A6BC2', role: 'Hover states' },
        { name: 'Violet 500', descriptive: 'Base', hex: '#5B2C91', role: 'Depth & hover' },
        { name: 'Violet 700', descriptive: 'Dark', hex: '#482374', role: 'Active states' },
        { name: 'Violet 900', descriptive: 'Darkest', hex: '#331951', role: 'Deep accents' },
      ]
    },
    {
      category: 'Cyber Cyan',
      baseColor: '#00F0FF',
      colors: [
        { name: 'Cyan 100', descriptive: 'Lightest', hex: '#CCFBFF', role: 'Subtle backgrounds' },
        { name: 'Cyan 300', descriptive: 'Light', hex: '#80F6FF', role: 'Hover states' },
        { name: 'Cyan 500', descriptive: 'Base', hex: '#00F0FF', role: 'Tech elements' },
        { name: 'Cyan 700', descriptive: 'Dark', hex: '#00C0CC', role: 'Active states' },
        { name: 'Cyan 900', descriptive: 'Darkest', hex: '#00888F', role: 'Deep accents' },
      ]
    },
    {
      category: 'Deep Teal',
      baseColor: '#1A535C',
      colors: [
        { name: 'Teal 100', descriptive: 'Lightest', hex: '#D9E8EA', role: 'Subtle backgrounds' },
        { name: 'Teal 300', descriptive: 'Light', hex: '#4D9BA5', role: 'Hover states' },
        { name: 'Teal 500', descriptive: 'Base', hex: '#1A535C', role: 'Secondary UI' },
        { name: 'Teal 700', descriptive: 'Dark', hex: '#15424A', role: 'Active states' },
        { name: 'Teal 900', descriptive: 'Darkest', hex: '#0F2E33', role: 'Deep accents' },
      ]
    },
    {
      category: 'Void Black',
      baseColor: '#0A0A0F',
      colors: [
        { name: 'Black 100', descriptive: 'Lightest', hex: '#3A3A45', role: 'Elevated surfaces' },
        { name: 'Black 300', descriptive: 'Light', hex: '#22222A', role: 'Cards' },
        { name: 'Black 500', descriptive: 'Base', hex: '#0A0A0F', role: 'Background' },
        { name: 'Black 700', descriptive: 'Dark', hex: '#06060A', role: 'Deep shadows' },
        { name: 'Black 900', descriptive: 'Darkest', hex: '#000000', role: 'Pure black' },
      ]
    },
    {
      category: 'Ghost Gray',
      baseColor: '#2D2B3E',
      colors: [
        { name: 'Gray 100', descriptive: 'Lightest', hex: '#B8B6C8', role: 'Subtle text' },
        { name: 'Gray 300', descriptive: 'Light', hex: '#68658A', role: 'Secondary text' },
        { name: 'Gray 500', descriptive: 'Base', hex: '#2D2B3E', role: 'Surfaces' },
        { name: 'Gray 700', descriptive: 'Dark', hex: '#1F1D2E', role: 'Borders' },
        { name: 'Gray 900', descriptive: 'Darkest', hex: '#15131F', role: 'Deep surfaces' },
      ]
    },
    {
      category: 'Neon White',
      baseColor: '#E8E8F0',
      colors: [
        { name: 'White 100', descriptive: 'Lightest', hex: '#FFFFFF', role: 'Pure white' },
        { name: 'White 300', descriptive: 'Light', hex: '#F5F5FA', role: 'Bright highlights' },
        { name: 'White 500', descriptive: 'Base', hex: '#E8E8F0', role: 'Primary text' },
        { name: 'White 700', descriptive: 'Dark', hex: '#C5C5D5', role: 'Muted text' },
        { name: 'White 900', descriptive: 'Darkest', hex: '#9999AB', role: 'Subtle text' },
      ]
    },
  ];

  const copyToClipboard = (hex, name) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(name);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white mb-3">
            Cyberpunk 2077 Complete Palette
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            45 colors · 9 families with 5 variants each
          </p>
          <p className="text-gray-500 text-sm">
            Click any swatch or hex code to copy · Numeric + descriptive naming
          </p>
        </div>

        {/* Color Families */}
        <div className="space-y-8">
          {paletteGroups.map((group, idx) => (
            <div key={idx} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-white text-xl font-semibold mb-4 flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded border-2 border-gray-600"
                  style={{ backgroundColor: group.baseColor }}
                />
                {group.category}
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {group.colors.map((color) => (
                  <div
                    key={color.name}
                    className="bg-gray-900 rounded-lg overflow-hidden border border-gray-700 hover:border-gray-500 transition-all cursor-pointer"
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
                    </div>

                    {/* Color Info */}
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-white font-semibold text-sm">
                          {color.name}
                        </h3>
                        <span className="text-gray-500 text-xs uppercase">
                          {color.descriptive}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs mb-2">{color.role}</p>
                      <div className="bg-gray-800 text-gray-300 px-2 py-1 rounded text-xs font-mono text-center">
                        {color.hex}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Usage Examples */}
        <div className="mt-10 bg-gray-800 rounded-lg p-8 border border-gray-700">
          <h2 className="text-white text-2xl font-bold mb-6">Palette In Action</h2>
          
          <div style={{ backgroundColor: '#0A0A0F' }} className="p-8 rounded-lg">
            {/* Hero Section Example */}
            <div style={{ backgroundColor: '#2D2B3E' }} className="p-6 rounded-lg mb-6">
              <h3 style={{ color: '#E8E8F0' }} className="text-2xl font-bold mb-3">
                Welcome to Night City
              </h3>
              <p style={{ color: '#C5C5D5' }} className="mb-4">
                Experience the full spectrum of cyberpunk design with precise control over every shade and tint.
              </p>
              
              <div className="flex gap-3 flex-wrap">
                <button 
                  style={{ backgroundColor: '#B026FF', color: '#FFFFFF' }}
                  className="px-6 py-2 rounded font-semibold hover:opacity-90 transition-opacity"
                >
                  Primary Action
                </button>
                <button 
                  style={{ backgroundColor: '#8D1ECC', color: '#FFFFFF' }}
                  className="px-6 py-2 rounded font-semibold hover:opacity-90 transition-opacity"
                >
                  Primary Dark
                </button>
                <button 
                  style={{ backgroundColor: '#F9F002', color: '#000000' }}
                  className="px-6 py-2 rounded font-semibold hover:opacity-90 transition-opacity"
                >
                  High Energy
                </button>
                <button 
                  style={{ backgroundColor: '#00F0FF', color: '#000000' }}
                  className="px-6 py-2 rounded font-semibold hover:opacity-90 transition-opacity"
                >
                  Cyber Link
                </button>
              </div>
            </div>

            {/* Cards Example */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div style={{ backgroundColor: '#22222A', borderColor: '#5B2C91' }} className="p-4 rounded-lg border-2">
                <div style={{ color: '#D98AFF' }} className="text-sm font-semibold mb-2">VIOLET ACCENT</div>
                <div style={{ color: '#E8E8F0' }} className="text-lg font-bold mb-1">Card Title</div>
                <p style={{ color: '#9999AB' }} className="text-sm">Using tints for hierarchy and depth.</p>
              </div>
              
              <div style={{ backgroundColor: '#22222A', borderColor: '#00F0FF' }} className="p-4 rounded-lg border-2">
                <div style={{ color: '#80F6FF' }} className="text-sm font-semibold mb-2">CYAN ACCENT</div>
                <div style={{ color: '#E8E8F0' }} className="text-lg font-bold mb-1">Card Title</div>
                <p style={{ color: '#9999AB' }} className="text-sm">Lighter tints work great for labels.</p>
              </div>
              
              <div style={{ backgroundColor: '#22222A', borderColor: '#FF6B35' }} className="p-4 rounded-lg border-2">
                <div style={{ color: '#FFB8A0' }} className="text-sm font-semibold mb-2">AMBER ACCENT</div>
                <div style={{ color: '#E8E8F0' }} className="text-lg font-bold mb-1">Card Title</div>
                <p style={{ color: '#9999AB' }} className="text-sm">Warm tones for approachable UI.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Design System Notes */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-white text-lg font-semibold mb-4">Using This Palette</h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div>
              <strong className="text-white">100 (Lightest):</strong> Subtle backgrounds, ghost buttons, very light overlays
            </div>
            <div>
              <strong className="text-white">300 (Light):</strong> Hover states, secondary elements, labels, tags
            </div>
            <div>
              <strong className="text-white">500 (Base):</strong> Your primary brand colors - use these for main actions and key UI
            </div>
            <div>
              <strong className="text-white">700 (Dark):</strong> Active/pressed states, emphasis, slightly deeper accents
            </div>
            <div>
              <strong className="text-white">900 (Darkest):</strong> Deep shadows, maximum contrast, anchoring elements
            </div>
            <div className="pt-3 border-t border-gray-700">
              <strong className="text-white">Pro tip:</strong> For accessible text, use White 500 on Black 500, or pair high contrast combinations like Purple 500 with White 100. Test lighter tints carefully for readability.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}