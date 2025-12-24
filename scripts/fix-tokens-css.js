#!/usr/bin/env node
/**
 * Fix Tokens CSS
 * 
 * Temporary fix for the token generation issue where color tokens
 * are outputting JSON objects instead of actual color values.
 * 
 * This script processes the generated tokens.css file and extracts
 * the actual color values from the JSON objects.
 */

const fs = require('fs');
const path = require('path');

const inputFile = process.argv[2] || 'dist/browser/tokens.css';
const outputFile = process.argv[3] || inputFile;

console.log(`Processing: ${inputFile}`);

let content = fs.readFileSync(inputFile, 'utf8');

// Regular expression to match JSON object values in CSS custom properties
// Matches: --token-name: {"light":{"base":"#HEXVAL",...},...};
const jsonValueRegex = /^(\s*--[\w-]+:\s*)\{[^}]*"base"\s*:\s*"(#[A-Fa-f0-9]{6})"[^}]*\}[^;]*;/gm;

let fixedCount = 0;

// Replace JSON objects with the base color value
content = content.replace(jsonValueRegex, (match, prefix, colorValue) => {
  fixedCount++;
  return `${prefix}${colorValue};`;
});

// Also handle multi-line JSON objects (the grep output shows they span multiple lines)
// This regex handles the case where the JSON is split across lines
const multiLineJsonRegex = /^(\s*--[\w-]+:\s*)\{"light":\{"base":"(#[A-Fa-f0-9]{6})"[^}]*\}[^}]*\}[^;]*;/gm;
content = content.replace(multiLineJsonRegex, (match, prefix, colorValue) => {
  fixedCount++;
  return `${prefix}${colorValue};`;
});

// Handle any remaining malformed JSON values by looking for patterns like:
// --token: {"light":{"base":"#HEX"...
// and extracting just the hex value
const remainingJsonRegex = /^(\s*--[\w-]+:\s*)\{[^;]+?"base"\s*:\s*"(#[A-Fa-f0-9]{6})"[^;]*;/gm;
content = content.replace(remainingJsonRegex, (match, prefix, colorValue) => {
  fixedCount++;
  return `${prefix}${colorValue};`;
});

fs.writeFileSync(outputFile, content);

console.log(`Fixed ${fixedCount} color token values`);
console.log(`Output: ${outputFile}`);
