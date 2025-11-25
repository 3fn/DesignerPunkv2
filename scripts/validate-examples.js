#!/usr/bin/env node

/**
 * Example Validation Script
 * 
 * Validates that HTML example files are syntactically correct and reference
 * the ButtonCTA component correctly. This ensures examples stay in sync with
 * the component API.
 * 
 * Validation Checks:
 * - Presence of button-cta elements
 * - Required label attribute on all buttons
 * - Valid attribute names (label, size, variant, icon, no-wrap, disabled, test-id, id)
 * - Valid size values (small, medium, large)
 * - Valid variant values (primary, secondary, tertiary)
 * - Component import (ButtonCTA.web.js)
 * - Proper HTML structure (DOCTYPE, html, head, body tags)
 * - Warning comment present (VALIDATION FILE - NOT DOCUMENTATION)
 * - Basic HTML syntax validation (unclosed/mismatched tags)
 * 
 * Usage: 
 *   node scripts/validate-examples.js
 * 
 * Exit Codes:
 *   0 - All validations passed (or passed with warnings only)
 *   1 - Validation failed with errors
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

// Example files to validate
const exampleFiles = [
  'src/components/core/ButtonCTA/examples/BasicUsage.html',
  'src/components/core/ButtonCTA/examples/WithIcon.html',
  'src/components/core/ButtonCTA/examples/Variants.html'
];

// Valid ButtonCTA attributes based on component API
const validAttributes = [
  'label',      // Required: button text
  'size',       // Optional: 'small' | 'medium' | 'large'
  'variant',    // Optional: 'primary' | 'secondary' | 'tertiary'
  'icon',       // Optional: icon name from Icon System
  'no-wrap',    // Optional: prevent text wrapping
  'disabled',   // Optional: disable button
  'test-id',    // Optional: test identifier
  'id'          // Standard HTML attribute for DOM queries
];

// Valid size values
const validSizes = ['small', 'medium', 'large'];

// Valid variant values
const validVariants = ['primary', 'secondary', 'tertiary'];

let totalErrors = 0;
let totalWarnings = 0;

/**
 * Validate a single HTML example file
 */
function validateExample(filePath) {
  console.log(`\n${colors.blue}Validating:${colors.reset} ${filePath}`);
  
  // Check file exists
  if (!fs.existsSync(filePath)) {
    console.log(`  ${colors.red}✗ File not found${colors.reset}`);
    totalErrors++;
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf-8');
  let fileErrors = 0;
  let fileWarnings = 0;
  
  // Check 1: File contains button-cta elements
  const buttonCtaRegex = /<button-cta\b[^>]*>/g;
  const buttons = content.match(buttonCtaRegex);
  
  if (!buttons || buttons.length === 0) {
    console.log(`  ${colors.red}✗ No <button-cta> elements found${colors.reset}`);
    fileErrors++;
  } else {
    console.log(`  ${colors.green}✓ Found ${buttons.length} button-cta element(s)${colors.reset}`);
    
    // Check 2: Validate each button element
    buttons.forEach((button, index) => {
      const buttonNum = index + 1;
      
      // Check for required label attribute
      if (!button.includes('label=')) {
        console.log(`  ${colors.red}✗ Button ${buttonNum}: Missing required 'label' attribute${colors.reset}`);
        fileErrors++;
      }
      
      // Check for invalid attributes
      const attrRegex = /(\w+(?:-\w+)*)=/g;
      const attrs = button.match(attrRegex);
      if (attrs) {
        attrs.forEach(attr => {
          const attrName = attr.replace('=', '');
          if (!validAttributes.includes(attrName)) {
            console.log(`  ${colors.yellow}⚠ Button ${buttonNum}: Unknown attribute '${attrName}'${colors.reset}`);
            fileWarnings++;
          }
        });
      }
      
      // Check for valid size values
      const sizeMatch = button.match(/size="([^"]*)"/);
      if (sizeMatch && !validSizes.includes(sizeMatch[1])) {
        console.log(`  ${colors.red}✗ Button ${buttonNum}: Invalid size '${sizeMatch[1]}' (must be: ${validSizes.join(', ')})${colors.reset}`);
        fileErrors++;
      }
      
      // Check for valid variant values
      const variantMatch = button.match(/variant="([^"]*)"/);
      if (variantMatch && !validVariants.includes(variantMatch[1])) {
        console.log(`  ${colors.red}✗ Button ${buttonNum}: Invalid variant '${variantMatch[1]}' (must be: ${validVariants.join(', ')})${colors.reset}`);
        fileErrors++;
      }
    });
  }
  
  // Check 3: File imports ButtonCTA component
  if (!content.includes('ButtonCTA.web.js')) {
    console.log(`  ${colors.yellow}⚠ No import of ButtonCTA.web.js found${colors.reset}`);
    fileWarnings++;
  } else {
    console.log(`  ${colors.green}✓ Imports ButtonCTA component${colors.reset}`);
  }
  
  // Check 4: File has proper HTML structure
  if (!content.includes('<!DOCTYPE html>')) {
    console.log(`  ${colors.yellow}⚠ Missing DOCTYPE declaration${colors.reset}`);
    fileWarnings++;
  }
  
  if (!content.includes('<html')) {
    console.log(`  ${colors.red}✗ Missing <html> tag${colors.reset}`);
    fileErrors++;
  }
  
  if (!content.includes('<head>')) {
    console.log(`  ${colors.red}✗ Missing <head> tag${colors.reset}`);
    fileErrors++;
  }
  
  if (!content.includes('<body>')) {
    console.log(`  ${colors.red}✗ Missing <body> tag${colors.reset}`);
    fileErrors++;
  }
  
  // Check 5: File includes warning comment
  const warningCommentPattern = /VALIDATION FILE - NOT DOCUMENTATION/;
  if (!warningCommentPattern.test(content)) {
    console.log(`  ${colors.red}✗ Missing required warning comment "VALIDATION FILE - NOT DOCUMENTATION"${colors.reset}`);
    fileErrors++;
  } else {
    console.log(`  ${colors.green}✓ Contains warning comment${colors.reset}`);
  }
  
  // Check 6: File can be loaded without syntax errors (basic check)
  // Check for common HTML syntax errors
  const unclosedTags = [];
  const tagRegex = /<(\/?)([\w-]+)[^>]*>/g;
  const tagStack = [];
  let match;
  
  while ((match = tagRegex.exec(content)) !== null) {
    const isClosing = match[1] === '/';
    const tagName = match[2].toLowerCase();
    
    // Skip self-closing tags
    if (['meta', 'link', 'br', 'hr', 'img', 'input'].includes(tagName)) {
      continue;
    }
    
    if (isClosing) {
      if (tagStack.length === 0 || tagStack[tagStack.length - 1] !== tagName) {
        unclosedTags.push(tagName);
      } else {
        tagStack.pop();
      }
    } else {
      tagStack.push(tagName);
    }
  }
  
  if (tagStack.length > 0) {
    console.log(`  ${colors.red}✗ Unclosed HTML tags: ${tagStack.join(', ')}${colors.reset}`);
    fileErrors++;
  } else if (unclosedTags.length > 0) {
    console.log(`  ${colors.yellow}⚠ Mismatched closing tags: ${unclosedTags.join(', ')}${colors.reset}`);
    fileWarnings++;
  } else {
    console.log(`  ${colors.green}✓ HTML structure appears valid${colors.reset}`);
  }
  
  // Summary for this file
  if (fileErrors === 0 && fileWarnings === 0) {
    console.log(`  ${colors.green}✓ All checks passed${colors.reset}`);
  } else {
    if (fileErrors > 0) {
      console.log(`  ${colors.red}✗ ${fileErrors} error(s) found${colors.reset}`);
    }
    if (fileWarnings > 0) {
      console.log(`  ${colors.yellow}⚠ ${fileWarnings} warning(s) found${colors.reset}`);
    }
  }
  
  totalErrors += fileErrors;
  totalWarnings += fileWarnings;
}

/**
 * Main validation function
 */
function main() {
  console.log(`${colors.blue}ButtonCTA Example Validation${colors.reset}`);
  console.log('='.repeat(50));
  
  // Validate each example file
  exampleFiles.forEach(validateExample);
  
  // Overall summary
  console.log('\n' + '='.repeat(50));
  console.log(`${colors.blue}Validation Summary${colors.reset}`);
  console.log(`Files checked: ${exampleFiles.length}`);
  console.log(`Total errors: ${totalErrors > 0 ? colors.red : colors.green}${totalErrors}${colors.reset}`);
  console.log(`Total warnings: ${totalWarnings > 0 ? colors.yellow : colors.green}${totalWarnings}${colors.reset}`);
  
  // Exit with appropriate code
  if (totalErrors > 0) {
    console.log(`\n${colors.red}✗ Validation failed${colors.reset}`);
    process.exit(1);
  } else if (totalWarnings > 0) {
    console.log(`\n${colors.yellow}⚠ Validation passed with warnings${colors.reset}`);
    process.exit(0);
  } else {
    console.log(`\n${colors.green}✓ All validations passed${colors.reset}`);
    process.exit(0);
  }
}

// Run validation
main();
