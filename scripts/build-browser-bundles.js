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

// Configuration
const ENTRY_POINT = 'src/browser-entry.ts';
const OUTPUT_DIR = 'dist/browser';
const SOFT_CEILING_KB = 100; // 100KB gzipped soft ceiling

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
    }
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
 * @returns {boolean} True if copy succeeded
 */
function copyTokenCSS() {
  // Possible source locations for the token CSS file
  // Priority order: output/ (primary), dist/ (fallback)
  const possibleSources = [
    'output/DesignTokens.web.css',
    'dist/DesignTokens.web.css',
    'output/web/DesignTokens.web.css',
    'dist/web/DesignTokens.web.css'
  ];
  
  const destPath = path.join(OUTPUT_DIR, 'tokens.css');
  
  // Find the first existing source file
  let sourcePath = null;
  for (const candidate of possibleSources) {
    if (fs.existsSync(candidate)) {
      sourcePath = candidate;
      break;
    }
  }
  
  if (!sourcePath) {
    console.warn(`⚠️  Token CSS not found in any of these locations:`);
    for (const candidate of possibleSources) {
      console.warn(`      - ${candidate}`);
    }
    console.warn('   Run the token build first to generate DesignTokens.web.css');
    return false;
  }
  
  fs.copyFileSync(sourcePath, destPath);
  console.log(`      Copied from: ${sourcePath}`);
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
