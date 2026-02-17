#!/usr/bin/env node
/**
 * Browser Bundle Build Script
 * 
 * Generates browser-ready bundles for DesignerPunk web components.
 * Produces both ESM and UMD formats with minified variants.
 * 
 * Output files:
 * - dist/browser/designerpunk.esm.js (ES2020, source maps)
 * - dist/browser/designerpunk.esm.min.js (minified, source maps)
 * - dist/browser/designerpunk.umd.js (ES2017, source maps)
 * - dist/browser/designerpunk.umd.min.js (minified, source maps)
 * - dist/browser/tokens.css (copy of DesignTokens.web.css)
 * 
 * @see .kiro/specs/028-web-component-browser-distribution/design.md
 * @see Requirements: 1.4, 1.5, 2.4, 2.5, 5.1, 5.2, 5.4, 7.3, 11.1-11.4
 */

const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { cssAsStringPlugin } = require('./esbuild-css-plugin');

// Configuration
const ENTRY_POINT = 'src/browser-entry.ts';
const OUTPUT_DIR = 'dist/browser';
const SOFT_CEILING_KB = 125; // 125KB gzipped soft ceiling (raised from 100KB as component count grows)

/**
 * Calculate file size in bytes
 * @param {string} filePath - Path to file
 * @returns {number} File size in bytes
 */
function getFileSize(filePath) {
  return fs.statSync(filePath).size;
}

/**
 * Calculate gzipped size of a file
 * @param {string} filePath - Path to file
 * @returns {number} Gzipped size in bytes
 */
function getGzippedSize(filePath) {
  const content = fs.readFileSync(filePath);
  return zlib.gzipSync(content).length;
}

/**
 * Format bytes to human-readable string
 * @param {number} bytes - Size in bytes
 * @returns {string} Formatted size string
 */
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

/**
 * Build a single bundle with esbuild
 * @param {Object} options - Build options
 * @returns {Promise<void>}
 */
async function buildBundle(options) {
  const { format, outfile, minify, target, globalName } = options;
  
  const buildOptions = {
    entryPoints: [ENTRY_POINT],
    bundle: true,
    format,
    outfile,
    minify,
    sourcemap: true,
    target,
    platform: 'browser',
    // External dependencies that should not be bundled
    external: [],
    // Define for browser environment
    define: {
      'process.env.NODE_ENV': minify ? '"production"' : '"development"'
    },
    // Plugins for CSS handling
    // CSS-as-string plugin inlines CSS imports as JavaScript strings
    // This enables web components to use CSS in shadow DOM without external file dependencies
    plugins: [
      cssAsStringPlugin({ minify })
    ]
  };
  
  // Add globalName for UMD/IIFE format
  if (globalName) {
    buildOptions.globalName = globalName;
  }
  
  await esbuild.build(buildOptions);
}

/**
 * Copy token CSS file to browser distribution
 * Tries multiple source locations for flexibility
 * Merges DesignTokens.web.css and ComponentTokens.web.css into a single tokens.css
 * @returns {boolean} True if copy succeeded
 */
function copyTokenCSS() {
  // Possible source locations for the design token CSS file
  // Priority order: output/ (primary), dist/ (fallback)
  const possibleDesignTokenSources = [
    'output/DesignTokens.web.css',
    'dist/DesignTokens.web.css',
    'output/web/DesignTokens.web.css',
    'dist/web/DesignTokens.web.css'
  ];
  
  // Possible source locations for the component token CSS file
  const possibleComponentTokenSources = [
    'output/ComponentTokens.web.css',
    'dist/ComponentTokens.web.css',
    'output/web/ComponentTokens.web.css',
    'dist/web/ComponentTokens.web.css'
  ];
  
  const destPath = path.join(OUTPUT_DIR, 'tokens.css');
  
  // Find the first existing design token source file
  let designTokenSourcePath = null;
  for (const candidate of possibleDesignTokenSources) {
    if (fs.existsSync(candidate)) {
      designTokenSourcePath = candidate;
      break;
    }
  }
  
  if (!designTokenSourcePath) {
    console.warn(`⚠️  Design Token CSS not found in any of these locations:`);
    for (const candidate of possibleDesignTokenSources) {
      console.warn(`      - ${candidate}`);
    }
    console.warn('   Run the token build first to generate DesignTokens.web.css');
    return false;
  }
  
  // Find the first existing component token source file (optional)
  let componentTokenSourcePath = null;
  for (const candidate of possibleComponentTokenSources) {
    if (fs.existsSync(candidate)) {
      componentTokenSourcePath = candidate;
      break;
    }
  }
  
  // Read design tokens
  let combinedContent = fs.readFileSync(designTokenSourcePath, 'utf-8');
  console.log(`      Copied design tokens from: ${designTokenSourcePath}`);
  
  // Append component tokens if they exist
  if (componentTokenSourcePath) {
    const componentContent = fs.readFileSync(componentTokenSourcePath, 'utf-8');
    
    // Extract the :root { ... } content from component tokens and merge
    // Component tokens CSS has its own :root block, we need to merge them
    const componentRootMatch = componentContent.match(/:root\s*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}/s);
    
    if (componentRootMatch) {
      // Insert component tokens before the closing } of the design tokens :root block
      const componentTokensContent = componentRootMatch[1];
      
      // Find the last :root closing brace in design tokens and insert before it
      const lastRootClose = combinedContent.lastIndexOf('}');
      if (lastRootClose !== -1) {
        combinedContent = 
          combinedContent.slice(0, lastRootClose) + 
          '\n\n  /* ============================================\n' +
          '   * COMPONENT TOKENS\n' +
          '   * Generated from ComponentTokenRegistry\n' +
          '   * ============================================ */\n' +
          componentTokensContent +
          '\n' +
          combinedContent.slice(lastRootClose);
      }
    }
    
    console.log(`      Merged component tokens from: ${componentTokenSourcePath}`);
  } else {
    console.log(`      Note: No component tokens found (ComponentTokens.web.css)`);
  }
  
  // Write combined content
  fs.writeFileSync(destPath, combinedContent);
  
  // Fix color token values (temporary workaround for token generation issue)
  // The token generator outputs JSON objects for color tokens instead of hex values
  // This fix extracts the actual color values from the JSON objects
  fixTokenColorValues(destPath);
  
  return true;
}

/**
 * Fix color token values in the CSS file
 * 
 * The token generator outputs JSON objects for color tokens like:
 *   --purple-300: {"light":{"base":"#B026FF",...},...};
 * 
 * This function extracts the actual hex values:
 *   --purple-300: #B026FF;
 * 
 * @param {string} filePath - Path to the tokens.css file
 */
function fixTokenColorValues(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let fixedCount = 0;
  
  // Regular expression to match JSON object values in CSS custom properties
  // Matches: --token-name: {"light":{"base":"#HEXVAL",...},...};
  const jsonValueRegex = /^(\s*--[\w-]+:\s*)\{[^}]*"base"\s*:\s*"(#[A-Fa-f0-9]{6})"[^}]*\}[^;]*;/gm;
  
  // Replace JSON objects with the base color value
  content = content.replace(jsonValueRegex, (match, prefix, colorValue) => {
    fixedCount++;
    return `${prefix}${colorValue};`;
  });
  
  // Also handle multi-line JSON objects
  const multiLineJsonRegex = /^(\s*--[\w-]+:\s*)\{"light":\{"base":"(#[A-Fa-f0-9]{6})"[^}]*\}[^}]*\}[^;]*;/gm;
  content = content.replace(multiLineJsonRegex, (match, prefix, colorValue) => {
    fixedCount++;
    return `${prefix}${colorValue};`;
  });
  
  // Handle any remaining malformed JSON values
  const remainingJsonRegex = /^(\s*--[\w-]+:\s*)\{[^;]+?"base"\s*:\s*"(#[A-Fa-f0-9]{6})"[^;]*;/gm;
  content = content.replace(remainingJsonRegex, (match, prefix, colorValue) => {
    fixedCount++;
    return `${prefix}${colorValue};`;
  });
  
  fs.writeFileSync(filePath, content);
  
  if (fixedCount > 0) {
    console.log(`      Fixed ${fixedCount} color token values`);
  }
}

/**
 * Copy demo HTML and CSS files from demos/ to dist/browser/
 * Handles the case where demos/ directory doesn't exist gracefully.
 *
 * @returns {boolean} true if files were copied, false if demos/ not found
 * @see .kiro/specs/061-component-demo-system/design.md
 * @see Requirements: 4.3, 4.4
 */
function copyDemoFiles() {
  const DEMOS_DIR = path.join(__dirname, '..', 'demos');

  if (!fs.existsSync(DEMOS_DIR)) {
    console.log('      Note: No demos/ directory found, skipping demo copy');
    return false;
  }

  const files = fs.readdirSync(DEMOS_DIR)
    .filter(f => f.endsWith('.html') || f.endsWith('.css'));

  if (files.length === 0) {
    console.log('      Note: No HTML or CSS files found in demos/, skipping demo copy');
    return false;
  }

  for (const file of files) {
    fs.copyFileSync(
      path.join(DEMOS_DIR, file),
      path.join(OUTPUT_DIR, file)
    );
  }

  console.log(`      Copied ${files.length} demo file(s) to ${OUTPUT_DIR}`);
  return true;
}


/**
 * Report bundle sizes and check soft ceiling
 * @returns {Object} Size report with warnings
 */
function reportSizes() {
  const bundles = [
    { name: 'ESM', path: path.join(OUTPUT_DIR, 'designerpunk.esm.js') },
    { name: 'ESM (minified)', path: path.join(OUTPUT_DIR, 'designerpunk.esm.min.js') },
    { name: 'UMD', path: path.join(OUTPUT_DIR, 'designerpunk.umd.js') },
    { name: 'UMD (minified)', path: path.join(OUTPUT_DIR, 'designerpunk.umd.min.js') }
  ];
  
  const warnings = [];
  let totalRaw = 0;
  let totalGzipped = 0;
  
  console.log('\n📦 Bundle Sizes:');
  console.log('─'.repeat(60));
  
  for (const bundle of bundles) {
    if (!fs.existsSync(bundle.path)) {
      console.log(`   ${bundle.name}: NOT FOUND`);
      continue;
    }
    
    const rawSize = getFileSize(bundle.path);
    const gzippedSize = getGzippedSize(bundle.path);
    const gzippedKB = gzippedSize / 1024;
    
    totalRaw += rawSize;
    totalGzipped += gzippedSize;
    
    const exceedsCeiling = gzippedKB > SOFT_CEILING_KB;
    const ceilingIndicator = exceedsCeiling ? ' ⚠️' : '';
    
    console.log(`   ${bundle.name}:`);
    console.log(`      Raw: ${formatSize(rawSize)}`);
    console.log(`      Gzipped: ${formatSize(gzippedSize)}${ceilingIndicator}`);
    
    if (exceedsCeiling) {
      warnings.push(`${bundle.name} exceeds ${SOFT_CEILING_KB}KB gzipped soft ceiling (${formatSize(gzippedSize)})`);
    }
  }
  
  // Check for tokens.css
  const tokensPath = path.join(OUTPUT_DIR, 'tokens.css');
  if (fs.existsSync(tokensPath)) {
    const tokensRaw = getFileSize(tokensPath);
    const tokensGzipped = getGzippedSize(tokensPath);
    totalRaw += tokensRaw;
    totalGzipped += tokensGzipped;
    
    console.log(`   tokens.css:`);
    console.log(`      Raw: ${formatSize(tokensRaw)}`);
    console.log(`      Gzipped: ${formatSize(tokensGzipped)}`);
  }
  
  console.log('─'.repeat(60));
  console.log(`   Total Raw: ${formatSize(totalRaw)}`);
  console.log(`   Total Gzipped: ${formatSize(totalGzipped)}`);
  
  // Output warnings
  if (warnings.length > 0) {
    console.log('\n⚠️  Size Warnings:');
    for (const warning of warnings) {
      console.log(`   - ${warning}`);
    }
  }
  
  return { totalRaw, totalGzipped, warnings };
}

/**
 * Main build function
 */
async function main() {
  console.log('🔨 Building browser bundles...\n');
  
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  
  try {
    // Build ESM bundle (ES2020 target)
    // Requirements: 1.4, 1.5
    console.log('   Building ESM bundle (ES2020)...');
    await buildBundle({
      format: 'esm',
      outfile: path.join(OUTPUT_DIR, 'designerpunk.esm.js'),
      minify: false,
      target: 'es2020'
    });
    
    // Build minified ESM bundle
    // Requirements: 5.1, 5.4
    console.log('   Building ESM bundle (minified)...');
    await buildBundle({
      format: 'esm',
      outfile: path.join(OUTPUT_DIR, 'designerpunk.esm.min.js'),
      minify: true,
      target: 'es2020'
    });
    
    // Build UMD bundle (ES2017 target with DesignerPunk global)
    // Requirements: 2.4, 2.5
    // Note: esbuild doesn't have native UMD, so we use IIFE with globalName
    console.log('   Building UMD bundle (ES2017)...');
    await buildBundle({
      format: 'iife',
      outfile: path.join(OUTPUT_DIR, 'designerpunk.umd.js'),
      minify: false,
      target: 'es2017',
      globalName: 'DesignerPunk'
    });
    
    // Build minified UMD bundle
    // Requirements: 5.2, 5.4
    console.log('   Building UMD bundle (minified)...');
    await buildBundle({
      format: 'iife',
      outfile: path.join(OUTPUT_DIR, 'designerpunk.umd.min.js'),
      minify: true,
      target: 'es2017',
      globalName: 'DesignerPunk'
    });
    
    // Copy token CSS
    // Requirements: 3.1
    console.log('   Copying token CSS...');
    const tokensCopied = copyTokenCSS();
    
    // Copy demo files
    // Requirements: 4.3, 4.4
    console.log('   Copying demo files...');
    copyDemoFiles();
    
    console.log('\n✅ Browser bundles built successfully!');
    
    // Report sizes
    // Requirements: 7.3, 11.1, 11.2, 11.3, 11.4
    const sizeReport = reportSizes();
    
    // Exit with success
    process.exit(0);
    
  } catch (error) {
    // Requirements: 7.4 - fail with descriptive error
    console.error('\n❌ Browser bundle build failed:');
    console.error(`   ${error.message}`);
    
    // Clean up partial outputs on failure
    if (fs.existsSync(OUTPUT_DIR)) {
      const files = fs.readdirSync(OUTPUT_DIR);
      for (const file of files) {
        if (file.startsWith('designerpunk.')) {
          fs.unlinkSync(path.join(OUTPUT_DIR, file));
        }
      }
    }
    
    process.exit(1);
  }
}

// Run the build
main();
