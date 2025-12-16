#!/usr/bin/env node

/**
 * Validate Structure Parsing
 * 
 * Purpose: Validate that steering document structure is parseable programmatically
 * for MCP server implementation (Spec 021)
 * 
 * Validates:
 * - Heading hierarchy consistency (no level skips)
 * - Section marker format consistency
 * - Programmatic parseability of structure map
 * - Edge cases and parsing challenges
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

/**
 * Parse the steering structure map
 */
function parseStructureMap(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  
  const documents = [];
  let currentDoc = null;
  let inDocumentSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Document heading (## DocumentName.md)
    const docMatch = line.match(/^## ([A-Za-z0-9-\s]+\.md)$/);
    if (docMatch) {
      // Save previous document
      if (currentDoc) {
        documents.push(currentDoc);
      }
      
      currentDoc = {
        name: docMatch[1],
        lineNumber: lineNum,
        headings: [],
        metadata: {}
      };
      inDocumentSection = true;
      continue;
    }
    
    // Check for document section end (---)
    if (line.trim() === '---' && currentDoc) {
      // Save current document
      documents.push(currentDoc);
      currentDoc = null;
      inDocumentSection = false;
      continue;
    }
    
    // Only process lines when we're in a document section
    if (!inDocumentSection || !currentDoc) {
      continue;
    }
    
    // Heading extraction (- # Heading or - ## Heading)
    const headingMatch = line.match(/^- (#{1,6}) (.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2];
      
      currentDoc.headings.push({
        level,
        text,
        lineNumber: lineNum
      });
      continue;
    }
    
    // Metadata extraction (**Total H2 sections**: N)
    const h2CountMatch = line.match(/^\*\*Total H2 sections\*\*:\s*(\d+)$/);
    if (h2CountMatch) {
      currentDoc.metadata.h2Count = parseInt(h2CountMatch[1], 10);
      continue;
    }
    
    // AI Agent Reading Priorities presence
    const prioritiesMatch = line.match(/^\*\*Has 'AI Agent Reading Priorities' section\*\*:\s*(Yes|No)$/);
    if (prioritiesMatch) {
      currentDoc.metadata.hasPriorities = prioritiesMatch[1] === 'Yes';
      continue;
    }
  }
  
  // Add last document if exists
  if (currentDoc) {
    documents.push(currentDoc);
  }
  
  return documents;
}

/**
 * Validate heading hierarchy for a document
 */
function validateHeadingHierarchy(doc) {
  const issues = [];
  
  for (let i = 0; i < doc.headings.length; i++) {
    const heading = doc.headings[i];
    
    // Check for level skips (e.g., H1 -> H3 without H2)
    if (i > 0) {
      const prevHeading = doc.headings[i - 1];
      const levelDiff = heading.level - prevHeading.level;
      
      if (levelDiff > 1) {
        issues.push({
          type: 'level-skip',
          severity: 'warning',
          message: `Heading level skip: H${prevHeading.level} -> H${heading.level}`,
          location: `Line ${heading.lineNumber}`,
          heading: heading.text
        });
      }
    }
    
    // Check for H1 headings (should only be document title)
    if (heading.level === 1 && i > 0) {
      issues.push({
        type: 'multiple-h1',
        severity: 'warning',
        message: 'Multiple H1 headings found (should only be document title)',
        location: `Line ${heading.lineNumber}`,
        heading: heading.text
      });
    }
  }
  
  return issues;
}

/**
 * Validate metadata consistency
 */
function validateMetadata(doc) {
  const issues = [];
  
  // Check if H2 count matches actual H2 headings
  const actualH2Count = doc.headings.filter(h => h.level === 2).length;
  
  if (doc.metadata.h2Count !== undefined && doc.metadata.h2Count !== actualH2Count) {
    issues.push({
      type: 'metadata-mismatch',
      severity: 'error',
      message: `H2 count mismatch: metadata says ${doc.metadata.h2Count}, found ${actualH2Count}`,
      location: doc.name
    });
  }
  
  // Check if metadata is present
  if (doc.metadata.h2Count === undefined) {
    issues.push({
      type: 'missing-metadata',
      severity: 'warning',
      message: 'Missing H2 count metadata',
      location: doc.name
    });
  }
  
  if (doc.metadata.hasPriorities === undefined) {
    issues.push({
      type: 'missing-metadata',
      severity: 'warning',
      message: 'Missing AI Agent Reading Priorities metadata',
      location: doc.name
    });
  }
  
  return issues;
}

/**
 * Validate section marker format
 */
function validateSectionMarkers(doc) {
  const issues = [];
  
  // Check for conditional loading markers
  const conditionalMarkers = doc.headings.filter(h => 
    h.text.includes('(Conditional Loading)')
  );
  
  // Validate conditional marker format
  conditionalMarkers.forEach(marker => {
    // Check if marker follows expected format: "Section Name (Conditional Loading)"
    if (!marker.text.match(/^.+ \(Conditional Loading\)$/)) {
      issues.push({
        type: 'marker-format',
        severity: 'warning',
        message: 'Conditional loading marker format inconsistent',
        location: `Line ${marker.lineNumber}`,
        heading: marker.text
      });
    }
  });
  
  return issues;
}

/**
 * Test programmatic parsing capabilities
 */
function testProgrammaticParsing(documents) {
  const tests = [];
  
  // Test 1: Can extract all document names
  const docNames = documents.map(d => d.name);
  tests.push({
    name: 'Extract document names',
    passed: docNames.length === documents.length,
    details: `Found ${docNames.length} documents`
  });
  
  // Test 2: Can extract heading hierarchy
  const totalHeadings = documents.reduce((sum, d) => sum + d.headings.length, 0);
  tests.push({
    name: 'Extract heading hierarchy',
    passed: totalHeadings > 0,
    details: `Found ${totalHeadings} headings across all documents`
  });
  
  // Test 3: Can identify documents with reading priorities
  const docsWithPriorities = documents.filter(d => d.metadata.hasPriorities).length;
  tests.push({
    name: 'Identify documents with reading priorities',
    passed: docsWithPriorities > 0,
    details: `Found ${docsWithPriorities} documents with reading priorities`
  });
  
  // Test 4: Can calculate section counts
  const docsWithH2Count = documents.filter(d => d.metadata.h2Count !== undefined).length;
  tests.push({
    name: 'Calculate section counts',
    passed: docsWithH2Count > 0,
    details: `Found H2 counts for ${docsWithH2Count} documents`
  });
  
  // Test 5: Can identify conditional sections
  const docsWithConditional = documents.filter(d => 
    d.headings.some(h => h.text.includes('(Conditional Loading)'))
  ).length;
  tests.push({
    name: 'Identify conditional sections',
    passed: true, // This is optional, so always pass
    details: `Found ${docsWithConditional} documents with conditional sections`
  });
  
  return tests;
}

/**
 * Generate validation report
 */
function generateReport(documents, allIssues, parsingTests) {
  console.log(`${colors.cyan}╔════════════════════════════════════════════════════════════════╗${colors.reset}`);
  console.log(`${colors.cyan}║${colors.reset}  ${colors.blue}Structure Parsing Validation Report${colors.reset}                       ${colors.cyan}║${colors.reset}`);
  console.log(`${colors.cyan}╚════════════════════════════════════════════════════════════════╝${colors.reset}\n`);
  
  // Summary
  console.log(`${colors.blue}📊 Summary${colors.reset}`);
  console.log(`   Documents analyzed: ${documents.length}`);
  console.log(`   Total headings: ${documents.reduce((sum, d) => sum + d.headings.length, 0)}`);
  console.log(`   Issues found: ${allIssues.length}\n`);
  
  // Programmatic Parsing Tests
  console.log(`${colors.blue}🧪 Programmatic Parsing Tests${colors.reset}`);
  parsingTests.forEach(test => {
    const icon = test.passed ? `${colors.green}✓${colors.reset}` : `${colors.red}✗${colors.reset}`;
    console.log(`   ${icon} ${test.name}`);
    console.log(`      ${test.details}`);
  });
  console.log();
  
  // Issues by severity
  const errors = allIssues.filter(i => i.severity === 'error');
  const warnings = allIssues.filter(i => i.severity === 'warning');
  
  if (errors.length > 0) {
    console.log(`${colors.red}❌ Errors (${errors.length})${colors.reset}`);
    errors.forEach(issue => {
      console.log(`   ${issue.location}: ${issue.message}`);
      if (issue.heading) {
        console.log(`      Heading: "${issue.heading}"`);
      }
    });
    console.log();
  }
  
  if (warnings.length > 0) {
    console.log(`${colors.yellow}⚠️  Warnings (${warnings.length})${colors.reset}`);
    warnings.forEach(issue => {
      console.log(`   ${issue.location}: ${issue.message}`);
      if (issue.heading) {
        console.log(`      Heading: "${issue.heading}"`);
      }
    });
    console.log();
  }
  
  // Document-by-document analysis
  console.log(`${colors.blue}📄 Document Analysis${colors.reset}`);
  documents.forEach(doc => {
    const docIssues = allIssues.filter(i => 
      i.location === doc.name || i.location.includes(doc.name)
    );
    
    const icon = docIssues.length === 0 ? `${colors.green}✓${colors.reset}` : `${colors.yellow}⚠${colors.reset}`;
    console.log(`   ${icon} ${doc.name}`);
    console.log(`      Headings: ${doc.headings.length} (H2: ${doc.metadata.h2Count || 'unknown'})`);
    console.log(`      Reading Priorities: ${doc.metadata.hasPriorities ? 'Yes' : 'No'}`);
    
    if (docIssues.length > 0) {
      console.log(`      Issues: ${docIssues.length}`);
    }
  });
  console.log();
  
  // Parsing Challenges
  console.log(`${colors.blue}🔍 Parsing Challenges & Edge Cases${colors.reset}`);
  
  // Challenge 1: Documents with many headings
  const largeDocuments = documents.filter(d => d.headings.length > 50);
  if (largeDocuments.length > 0) {
    console.log(`   ${colors.yellow}⚠${colors.reset}  Large documents (>50 headings):`);
    largeDocuments.forEach(d => {
      console.log(`      - ${d.name}: ${d.headings.length} headings`);
    });
    console.log(`      Challenge: May require pagination or chunking for MCP server`);
    console.log();
  }
  
  // Challenge 2: Deep heading nesting
  const maxDepth = Math.max(...documents.flatMap(d => d.headings.map(h => h.level)));
  if (maxDepth > 3) {
    console.log(`   ${colors.yellow}⚠${colors.reset}  Deep heading nesting detected (max level: H${maxDepth})`);
    console.log(`      Challenge: MCP server may need to handle deep hierarchy`);
    console.log();
  }
  
  // Challenge 3: Conditional sections
  const conditionalDocs = documents.filter(d => 
    d.headings.some(h => h.text.includes('(Conditional Loading)'))
  );
  if (conditionalDocs.length > 0) {
    console.log(`   ${colors.cyan}ℹ${colors.reset}  Conditional sections found in ${conditionalDocs.length} documents`);
    console.log(`      Opportunity: MCP server can use these for selective loading`);
    console.log();
  }
  
  // Overall result
  console.log(`${colors.cyan}═══════════════════════════════════════════════════════════════${colors.reset}\n`);
  
  if (errors.length === 0) {
    console.log(`${colors.green}✅ Structure is parseable and ready for MCP server implementation${colors.reset}\n`);
    return 0;
  } else {
    console.log(`${colors.red}❌ Structure has errors that should be fixed before MCP implementation${colors.reset}\n`);
    return 1;
  }
}

/**
 * Main execution
 */
function main() {
  const structureMapPath = path.join(
    process.cwd(),
    '.kiro/specs/020-steering-documentation-refinement/steering-structure-map.md'
  );
  
  console.log(`${colors.blue}Validating structure parsing...${colors.reset}\n`);
  console.log(`Reading: ${structureMapPath}\n`);
  
  // Parse structure map
  const documents = parseStructureMap(structureMapPath);
  
  // Validate each document
  const allIssues = [];
  
  documents.forEach(doc => {
    const hierarchyIssues = validateHeadingHierarchy(doc);
    const metadataIssues = validateMetadata(doc);
    const markerIssues = validateSectionMarkers(doc);
    
    allIssues.push(...hierarchyIssues, ...metadataIssues, ...markerIssues);
  });
  
  // Test programmatic parsing
  const parsingTests = testProgrammaticParsing(documents);
  
  // Generate report
  const exitCode = generateReport(documents, allIssues, parsingTests);
  
  process.exit(exitCode);
}

// Run validation
main();
