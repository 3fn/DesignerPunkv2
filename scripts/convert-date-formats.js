#!/usr/bin/env node

/**
 * Convert date formats in steering documents to ISO 8601
 * 
 * Converts human-readable dates (Month DD, YYYY) to ISO 8601 (YYYY-MM-DD)
 * Updates Date and Last Reviewed fields while preserving all other content
 */

const fs = require('fs');
const path = require('path');

// Month name to number mapping
const MONTHS = {
  'January': '01',
  'February': '02',
  'March': '03',
  'April': '04',
  'May': '05',
  'June': '06',
  'July': '07',
  'August': '08',
  'September': '09',
  'October': '10',
  'November': '11',
  'December': '12'
};

/**
 * Parse human-readable date format (Month DD, YYYY)
 * @param {string} dateStr - Date string like "October 20, 2025"
 * @returns {string|null} - ISO 8601 date (YYYY-MM-DD) or null if invalid
 */
function parseHumanDate(dateStr) {
  // Match pattern: Month DD, YYYY
  const match = dateStr.match(/^([A-Za-z]+)\s+(\d{1,2}),?\s+(\d{4})$/);
  
  if (!match) {
    return null;
  }
  
  const [, monthName, day, year] = match;
  const month = MONTHS[monthName];
  
  if (!month) {
    return null;
  }
  
  // Pad day with leading zero if needed
  const paddedDay = day.padStart(2, '0');
  
  return `${year}-${month}-${paddedDay}`;
}

/**
 * Convert dates in a markdown file
 * @param {string} filePath - Path to markdown file
 * @returns {Object} - Conversion results
 */
function convertDatesInFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  let modified = false;
  const conversions = [];
  
  const newLines = lines.map((line, index) => {
    // Match Date or Last Reviewed fields
    const dateMatch = line.match(/^\*\*Date\*\*:\s*(.+)$/);
    const reviewedMatch = line.match(/^\*\*Last Reviewed\*\*:\s*(.+)$/);
    
    if (dateMatch) {
      const originalDate = dateMatch[1].trim();
      const isoDate = parseHumanDate(originalDate);
      
      if (isoDate && isoDate !== originalDate) {
        conversions.push({
          line: index + 1,
          field: 'Date',
          from: originalDate,
          to: isoDate
        });
        modified = true;
        return `**Date**: ${isoDate}`;
      }
    }
    
    if (reviewedMatch) {
      const originalDate = reviewedMatch[1].trim();
      const isoDate = parseHumanDate(originalDate);
      
      if (isoDate && isoDate !== originalDate) {
        conversions.push({
          line: index + 1,
          field: 'Last Reviewed',
          from: originalDate,
          to: isoDate
        });
        modified = true;
        return `**Last Reviewed**: ${isoDate}`;
      }
    }
    
    return line;
  });
  
  if (modified) {
    fs.writeFileSync(filePath, newLines.join('\n'), 'utf8');
  }
  
  return {
    modified,
    conversions
  };
}

/**
 * Process all steering documents
 */
function main() {
  const steeringDir = path.join(process.cwd(), '.kiro', 'steering');
  
  console.log('🔄 Converting date formats to ISO 8601...\n');
  
  // Get all markdown files
  const files = fs.readdirSync(steeringDir)
    .filter(file => file.endsWith('.md'))
    .map(file => path.join(steeringDir, file));
  
  let totalFiles = 0;
  let modifiedFiles = 0;
  let totalConversions = 0;
  
  files.forEach(filePath => {
    const fileName = path.basename(filePath);
    totalFiles++;
    
    const result = convertDatesInFile(filePath);
    
    if (result.modified) {
      modifiedFiles++;
      totalConversions += result.conversions.length;
      
      console.log(`✅ ${fileName}`);
      result.conversions.forEach(conv => {
        console.log(`   Line ${conv.line}: ${conv.field}`);
        console.log(`   ${conv.from} → ${conv.to}`);
      });
      console.log();
    }
  });
  
  console.log('📊 Summary:');
  console.log(`   Total files scanned: ${totalFiles}`);
  console.log(`   Files modified: ${modifiedFiles}`);
  console.log(`   Total conversions: ${totalConversions}`);
  
  if (modifiedFiles === 0) {
    console.log('\n✨ All dates already in ISO 8601 format!');
  } else {
    console.log('\n✨ Date conversion complete!');
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { parseHumanDate, convertDatesInFile };
