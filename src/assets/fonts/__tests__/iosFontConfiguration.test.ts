/**
 * iOS Font Configuration Tests
 * 
 * Validates that iOS font integration documentation is complete and accurate
 * for Inter and Rajdhani font families.
 * 
 * Requirements: 7.1, 7.2
 */

import { describe, test, expect } from '@jest/globals';
import * as fs from 'fs';
import * as path from 'path';

describe('iOS Font Configuration', () => {
  const docsPath = path.join(__dirname, '../../../../docs/platform-integration/ios-font-setup.md');
  
  test('iOS font setup documentation exists', () => {
    expect(fs.existsSync(docsPath)).toBe(true);
  });

  test('documentation includes all required Inter font files', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    const requiredInterFonts = [
      'Inter-Regular.ttf',
      'Inter-Medium.ttf',
      'Inter-SemiBold.ttf',
      'Inter-Bold.ttf'
    ];

    requiredInterFonts.forEach(fontFile => {
      expect(content).toContain(fontFile);
    });
  });

  test('documentation includes all required Rajdhani font files', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    const requiredRajdhaniFonts = [
      'Rajdhani-Regular.ttf',
      'Rajdhani-Medium.ttf',
      'Rajdhani-SemiBold.ttf',
      'Rajdhani-Bold.ttf'
    ];

    requiredRajdhaniFonts.forEach(fontFile => {
      expect(content).toContain(fontFile);
    });
  });

  test('documentation includes UIAppFonts array configuration', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    expect(content).toContain('UIAppFonts');
    expect(content).toContain('<key>UIAppFonts</key>');
    expect(content).toContain('<array>');
  });

  test('documentation includes Info.plist XML example', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    expect(content).toContain('<?xml version="1.0" encoding="UTF-8"?>');
    expect(content).toContain('<!DOCTYPE plist');
    expect(content).toContain('<plist version="1.0">');
  });

  test('documentation includes SwiftUI usage examples', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    expect(content).toContain('SwiftUI');
    expect(content).toContain('.custom("Rajdhani"');
    expect(content).toContain('.custom("Inter"');
  });

  test('documentation includes UIKit usage examples', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    expect(content).toContain('UIKit');
    expect(content).toContain('UIFont(name: "Rajdhani-');
    expect(content).toContain('UIFont(name: "Inter-');
  });

  test('documentation includes font weight mapping', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    const weights = ['400', '500', '600', '700'];
    weights.forEach(weight => {
      expect(content).toContain(weight);
    });

    expect(content).toContain('Regular');
    expect(content).toContain('Medium');
    expect(content).toContain('SemiBold');
    expect(content).toContain('Bold');
  });

  test('documentation includes fallback font guidance', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    expect(content).toContain('SF Pro Display');
    expect(content).toContain('SF Pro Text');
    expect(content).toContain('fallback');
  });

  test('documentation includes verification code', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    expect(content).toContain('verifyCustomFonts');
    expect(content).toContain('UIFont(name:');
  });

  test('documentation includes troubleshooting section', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    expect(content).toContain('Troubleshooting');
    expect(content).toContain('Fonts Not Loading');
    expect(content).toContain('Copy Bundle Resources');
  });

  test('documentation references requirements', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    expect(content).toContain('Requirement 7.1');
    expect(content).toContain('Requirement 7.2');
  });

  test('all 8 font files are documented', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    // Count occurrences of each font file in UIAppFonts section
    const uiAppFontsSection = content.match(/<key>UIAppFonts<\/key>[\s\S]*?<\/array>/);
    expect(uiAppFontsSection).toBeTruthy();
    
    if (uiAppFontsSection) {
      const fontFileMatches = uiAppFontsSection[0].match(/<string>.*?\.ttf<\/string>/g);
      expect(fontFileMatches).toHaveLength(8);
    }
  });

  test('documentation includes PostScript name reference', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    expect(content).toContain('PostScript');
    expect(content).toContain('Inter-Regular');
    expect(content).toContain('Rajdhani-Regular');
  });

  test('documentation includes Xcode setup instructions', () => {
    const content = fs.readFileSync(docsPath, 'utf-8');
    
    expect(content).toContain('Xcode');
    expect(content).toContain('Add Files to');
    expect(content).toContain('Build Phases');
    expect(content).toContain('Copy items if needed');
  });
});

describe('iOS Font File Validation', () => {
  const interFontPath = path.join(__dirname, '../inter');
  const rajdhaniFontPath = path.join(__dirname, '../rajdhani');

  test('Inter font directory exists', () => {
    expect(fs.existsSync(interFontPath)).toBe(true);
  });

  test('Rajdhani font directory exists', () => {
    expect(fs.existsSync(rajdhaniFontPath)).toBe(true);
  });

  test('Inter font files exist', () => {
    const requiredFiles = [
      'Inter-Regular.ttf',
      'Inter-Medium.ttf',
      'Inter-SemiBold.ttf',
      'Inter-Bold.ttf'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(interFontPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  test('Rajdhani font files exist', () => {
    const requiredFiles = [
      'Rajdhani-Regular.ttf',
      'Rajdhani-Medium.ttf',
      'Rajdhani-SemiBold.ttf',
      'Rajdhani-Bold.ttf'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(rajdhaniFontPath, file);
      expect(fs.existsSync(filePath)).toBe(true);
    });
  });

  test('all font files are TTF format', () => {
    const interFiles = fs.readdirSync(interFontPath).filter(f => f.endsWith('.ttf'));
    const rajdhaniFiles = fs.readdirSync(rajdhaniFontPath).filter(f => f.endsWith('.ttf'));

    expect(interFiles.length).toBeGreaterThanOrEqual(4);
    expect(rajdhaniFiles.length).toBeGreaterThanOrEqual(4);
  });
});

describe('iOS Font Configuration Completeness', () => {
  test('documentation covers all required aspects', () => {
    const docsPath = path.join(__dirname, '../../../../docs/platform-integration/ios-font-setup.md');
    const content = fs.readFileSync(docsPath, 'utf-8');

    const requiredSections = [
      'Overview',
      'Font Files Required',
      'Info.plist Configuration',
      'Xcode Project Setup',
      'SwiftUI Usage',
      'UIKit Usage',
      'Fallback Fonts',
      'Verification',
      'Troubleshooting',
      'Requirements Compliance'
    ];

    requiredSections.forEach(section => {
      expect(content).toContain(section);
    });
  });

  test('documentation provides complete UIAppFonts array', () => {
    const docsPath = path.join(__dirname, '../../../../docs/platform-integration/ios-font-setup.md');
    const content = fs.readFileSync(docsPath, 'utf-8');

    // Extract UIAppFonts array
    const arrayMatch = content.match(/<key>UIAppFonts<\/key>\s*<array>([\s\S]*?)<\/array>/);
    expect(arrayMatch).toBeTruthy();

    if (arrayMatch) {
      const arrayContent = arrayMatch[1];
      
      // Verify all 8 fonts are listed
      expect(arrayContent).toContain('Inter-Regular.ttf');
      expect(arrayContent).toContain('Inter-Medium.ttf');
      expect(arrayContent).toContain('Inter-SemiBold.ttf');
      expect(arrayContent).toContain('Inter-Bold.ttf');
      expect(arrayContent).toContain('Rajdhani-Regular.ttf');
      expect(arrayContent).toContain('Rajdhani-Medium.ttf');
      expect(arrayContent).toContain('Rajdhani-SemiBold.ttf');
      expect(arrayContent).toContain('Rajdhani-Bold.ttf');
    }
  });
});
