#!/usr/bin/env node

/**
 * Release Management System - Issue Diagnostic Tool
 * 
 * This script diagnoses common issues with the release management system by:
 * - Analyzing recent logs for errors
 * - Checking pipeline state
 * - Validating release artifacts
 * - Providing specific recommendations
 * 
 * Usage:
 *   node scripts/diagnose-release-issues.js
 *   npm run diagnose:release-issues
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m',
  bold: '\x1b[1m'
};

// Diagnostic results
const issues = [];
const recommendations = [];

/**
 * Print colored output
 */
function print(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section header
 */
function printSection(title) {
  print(`\n${'='.repeat(60)}`, 'blue');
  print(title, 'blue');
  print('='.repeat(60), 'blue');
}

/**
 * Add issue
 */
function addIssue(severity, category, description, recommendation) {
  issues.push({ severity, category, description });
  recommendations.push({ category, recommendation });
}

/**
 * Execute command safely
 */
function execCommand(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      stdio: 'pipe',
      ...options
    }).trim();
  } catch (error) {
    return null;
  }
}

/**
 * Read file safely
 */
function readFileSafe(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

/**
 * Check log files for errors
 */
function checkLogFiles() {
  printSection('Log File Analysis');
  
  const logDir = path.join(process.cwd(), '.kiro', 'logs');
  const logFiles = [
    'release-manager.log',
    'file-organization.log'
  ];
  
  if (!fs.existsSync(logDir)) {
    print('⚠ Log directory not found', 'yellow');
    addIssue('info', 'logs', 'Log directory does not exist', 
      'Logs will be created when release system runs');
    return;
  }
  
  for (const logFile of logFiles) {
    const logPath = path.join(logDir, logFile);
    
    if (!fs.existsSync(logPath)) {
      print(`ℹ ${logFile} not found`, 'gray');
      continue;
    }
    
    const content = readFileSafe(logPath);
    
    if (!content) {
      continue;
    }
    
    print(`\nAnalyzing ${logFile}...`, 'blue');
    
    // Check for errors
    const errorLines = content.split('\n').filter(line => 
      line.includes('ERROR') || line.includes('Error:') || line.includes('Failed')
    );
    
    if (errorLines.length > 0) {
      print(`✗ Found ${errorLines.length} error(s)`, 'red');
      
      // Show recent errors
      const recentErrors = errorLines.slice(-5);
      
      for (const error of recentErrors) {
        print(`  ${error}`, 'gray');
      }
      
      // Categorize errors
      if (content.includes('authentication failed') || content.includes('401')) {
        addIssue('high', 'authentication', 'Authentication errors detected in logs',
          'Check GitHub and npm tokens: npm run validate:release-setup');
      }
      
      if (content.includes('ENOENT') || content.includes('not found')) {
        addIssue('high', 'files', 'File not found errors detected',
          'Verify file paths in configuration and ensure all required files exist');
      }
      
      if (content.includes('timeout') || content.includes('ETIMEDOUT')) {
        addIssue('medium', 'network', 'Network timeout errors detected',
          'Check network connectivity and retry the operation');
      }
      
      if (content.includes('validation failed')) {
        addIssue('medium', 'validation', 'Validation errors detected',
          'Review completion documents and ensure proper formatting');
      }
    } else {
      print('✓ No errors found', 'green');
    }
    
    // Check for warnings
    const warningLines = content.split('\n').filter(line => 
      line.includes('WARN') || line.includes('Warning:')
    );
    
    if (warningLines.length > 0) {
      print(`⚠ Found ${warningLines.length} warning(s)`, 'yellow');
      
      const recentWarnings = warningLines.slice(-3);
      
      for (const warning of recentWarnings) {
        print(`  ${warning}`, 'gray');
      }
    }
  }
}

/**
 * Check pipeline state
 */
function checkPipelineState() {
  printSection('Pipeline State Analysis');
  
  const stateDir = path.join(process.cwd(), '.kiro', 'release-state');
  
  if (!fs.existsSync(stateDir)) {
    print('ℹ No active pipeline state', 'gray');
    return;
  }
  
  const stateFiles = fs.readdirSync(stateDir).filter(f => f.endsWith('.json'));
  
  if (stateFiles.length === 0) {
    print('ℹ No active pipeline state', 'gray');
    return;
  }
  
  print(`Found ${stateFiles.length} pipeline state file(s)`, 'blue');
  
  for (const stateFile of stateFiles) {
    const statePath = path.join(stateDir, stateFile);
    const content = readFileSafe(statePath);
    
    if (!content) {
      continue;
    }
    
    try {
      const state = JSON.parse(content);
      
      print(`\nPipeline: ${stateFile}`, 'blue');
      print(`  Status: ${state.status}`, 'gray');
      print(`  Stage: ${state.currentStage || 'unknown'}`, 'gray');
      
      if (state.status === 'in-progress') {
        const startTime = new Date(state.startTime);
        const now = new Date();
        const duration = Math.floor((now - startTime) / 1000 / 60);
        
        print(`  Duration: ${duration} minutes`, 'gray');
        
        if (duration > 30) {
          addIssue('high', 'pipeline', 'Pipeline stuck in progress for over 30 minutes',
            'Pipeline may be hung. Consider manual recovery: rm -rf .kiro/release-state/');
        } else if (duration > 10) {
          addIssue('medium', 'pipeline', 'Pipeline running longer than expected',
            'Monitor progress. If stuck, consider manual recovery.');
        }
      }
      
      if (state.status === 'failed') {
        print(`  Error: ${state.error || 'Unknown error'}`, 'red');
        
        addIssue('high', 'pipeline', 'Pipeline failed',
          'Review error message and logs. Fix underlying issue and retry release.');
      }
    } catch (error) {
      print(`✗ Invalid state file: ${stateFile}`, 'red');
      
      addIssue('medium', 'pipeline', 'Corrupted pipeline state file',
        'Remove corrupted state: rm -rf .kiro/release-state/');
    }
  }
}

/**
 * Check release triggers
 */
function checkReleaseTriggers() {
  printSection('Release Trigger Analysis');
  
  const triggerDir = path.join(process.cwd(), '.kiro', 'release-triggers');
  
  if (!fs.existsSync(triggerDir)) {
    print('ℹ No release triggers directory', 'gray');
    addIssue('info', 'triggers', 'Release triggers directory does not exist',
      'Directory will be created when release detection runs');
    return;
  }
  
  const triggers = fs.readdirSync(triggerDir).filter(f => f.endsWith('.json'));
  
  if (triggers.length === 0) {
    print('ℹ No pending release triggers', 'gray');
    return;
  }
  
  print(`Found ${triggers.length} release trigger(s)`, 'blue');
  
  for (const trigger of triggers) {
    const triggerPath = path.join(triggerDir, trigger);
    const content = readFileSafe(triggerPath);
    
    if (!content) {
      continue;
    }
    
    try {
      const data = JSON.parse(content);
      
      print(`\nTrigger: ${trigger}`, 'blue');
      print(`  Type: ${data.type || 'unknown'}`, 'gray');
      print(`  Created: ${data.timestamp || 'unknown'}`, 'gray');
      
      if (data.completionDocument) {
        print(`  Document: ${data.completionDocument}`, 'gray');
      }
    } catch (error) {
      print(`✗ Invalid trigger file: ${trigger}`, 'red');
      
      addIssue('low', 'triggers', 'Corrupted trigger file',
        `Remove corrupted trigger: rm ${triggerPath}`);
    }
  }
}

/**
 * Check completion documents
 */
function checkCompletionDocuments() {
  printSection('Completion Document Analysis');
  
  const specsDir = path.join(process.cwd(), '.kiro', 'specs');
  
  if (!fs.existsSync(specsDir)) {
    print('ℹ No specs directory found', 'gray');
    return;
  }
  
  const specs = fs.readdirSync(specsDir).filter(name => {
    const specPath = path.join(specsDir, name);
    return fs.statSync(specPath).isDirectory();
  });
  
  if (specs.length === 0) {
    print('ℹ No specs found', 'gray');
    return;
  }
  
  print(`Found ${specs.length} spec(s)`, 'blue');
  
  let totalDocs = 0;
  let docsWithIssues = 0;
  
  for (const spec of specs) {
    const completionDir = path.join(specsDir, spec, 'completion');
    
    if (!fs.existsSync(completionDir)) {
      continue;
    }
    
    const docs = fs.readdirSync(completionDir).filter(name => name.endsWith('.md'));
    totalDocs += docs.length;
    
    for (const doc of docs) {
      const docPath = path.join(completionDir, doc);
      const content = readFileSafe(docPath);
      
      if (!content) {
        continue;
      }
      
      // Check for common issues
      const issues = [];
      
      if (!content.includes('## Changes') && !content.includes('## What Was Done')) {
        issues.push('Missing Changes section');
      }
      
      if (content.includes('BREAKING') && !content.includes('## Breaking Changes')) {
        issues.push('Breaking changes not in dedicated section');
      }
      
      if (content.length < 100) {
        issues.push('Document may be too short');
      }
      
      if (issues.length > 0) {
        docsWithIssues++;
        
        if (docsWithIssues <= 3) {
          print(`\n⚠ ${spec}/${doc}:`, 'yellow');
          
          for (const issue of issues) {
            print(`  - ${issue}`, 'gray');
          }
        }
      }
    }
  }
  
  print(`\nTotal completion documents: ${totalDocs}`, 'blue');
  
  if (docsWithIssues > 0) {
    print(`Documents with potential issues: ${docsWithIssues}`, 'yellow');
    
    addIssue('low', 'documents', 'Some completion documents may have formatting issues',
      'Review completion documents and ensure proper structure');
  } else {
    print('✓ All documents appear well-formatted', 'green');
  }
}

/**
 * Check git state
 */
function checkGitState() {
  printSection('Git State Analysis');
  
  // Check for uncommitted changes
  const status = execCommand('git status --porcelain');
  
  if (status) {
    const lines = status.split('\n').length;
    print(`⚠ ${lines} uncommitted change(s) detected`, 'yellow');
    
    addIssue('medium', 'git', 'Uncommitted changes in working directory',
      'Commit changes before creating a release: git add . && git commit -m "message"');
  } else {
    print('✓ Working directory clean', 'green');
  }
  
  // Check current branch
  const branch = execCommand('git branch --show-current');
  
  if (branch) {
    print(`Current branch: ${branch}`, 'blue');
    
    if (branch !== 'main' && branch !== 'master') {
      addIssue('low', 'git', `Not on main branch (current: ${branch})`,
        'Consider switching to main branch for releases');
    }
  }
  
  // Check for unpushed commits
  const unpushed = execCommand('git log @{u}.. --oneline');
  
  if (unpushed) {
    const lines = unpushed.split('\n').length;
    print(`⚠ ${lines} unpushed commit(s)`, 'yellow');
    
    addIssue('medium', 'git', 'Unpushed commits detected',
      'Push commits before release: git push origin ' + (branch || 'main'));
  } else {
    print('✓ All commits pushed', 'green');
  }
  
  // Check tags
  const tags = execCommand('git tag -l');
  
  if (tags) {
    const tagCount = tags.split('\n').length;
    print(`Found ${tagCount} git tag(s)`, 'blue');
  } else {
    print('ℹ No git tags found', 'gray');
  }
}

/**
 * Check package.json
 */
function checkPackageJson() {
  printSection('Package Configuration Analysis');
  
  const packagePath = path.join(process.cwd(), 'package.json');
  const content = readFileSafe(packagePath);
  
  if (!content) {
    print('✗ package.json not found', 'red');
    
    addIssue('high', 'package', 'package.json not found',
      'Ensure you are in the project root directory');
    return;
  }
  
  try {
    const pkg = JSON.parse(content);
    
    print(`Package: ${pkg.name}`, 'blue');
    print(`Version: ${pkg.version}`, 'blue');
    
    // Check for release scripts
    const requiredScripts = [
      'release:analyze',
      'release:cli'
    ];
    
    const missingScripts = requiredScripts.filter(script => !pkg.scripts?.[script]);
    
    if (missingScripts.length > 0) {
      print(`⚠ Missing scripts: ${missingScripts.join(', ')}`, 'yellow');
      
      addIssue('medium', 'package', 'Missing required npm scripts',
        'Add release scripts to package.json');
    } else {
      print('✓ All required scripts configured', 'green');
    }
    
    // Check version format
    const versionRegex = /^\d+\.\d+\.\d+(-[a-z]+\.\d+)?$/;
    
    if (!versionRegex.test(pkg.version)) {
      print(`⚠ Version format may be invalid: ${pkg.version}`, 'yellow');
      
      addIssue('low', 'package', 'Version format does not follow semantic versioning',
        'Use semantic versioning format: major.minor.patch');
    }
  } catch (error) {
    print('✗ package.json is invalid JSON', 'red');
    
    addIssue('high', 'package', 'package.json contains invalid JSON',
      'Fix JSON syntax errors in package.json');
  }
}

/**
 * Print recommendations
 */
function printRecommendations() {
  printSection('Recommendations');
  
  if (issues.length === 0) {
    print('\n✓ No issues detected! Release management system appears healthy.', 'green');
    print('\nNext steps:', 'blue');
    print('  1. Run: npm run release:analyze', 'gray');
    print('  2. Run: npm run release:cli release auto', 'gray');
    return;
  }
  
  // Group by severity
  const high = issues.filter(i => i.severity === 'high');
  const medium = issues.filter(i => i.severity === 'medium');
  const low = issues.filter(i => i.severity === 'low');
  const info = issues.filter(i => i.severity === 'info');
  
  print(`\nFound ${issues.length} issue(s):`, 'blue');
  
  if (high.length > 0) {
    print(`  High priority: ${high.length}`, 'red');
  }
  
  if (medium.length > 0) {
    print(`  Medium priority: ${medium.length}`, 'yellow');
  }
  
  if (low.length > 0) {
    print(`  Low priority: ${low.length}`, 'gray');
  }
  
  if (info.length > 0) {
    print(`  Informational: ${info.length}`, 'blue');
  }
  
  // Print recommendations by priority
  if (high.length > 0) {
    print('\n🔴 High Priority Issues:', 'red');
    
    for (const rec of recommendations.filter(r => 
      high.some(i => i.category === r.category)
    )) {
      print(`\n${rec.category}:`, 'bold');
      print(`  ${rec.recommendation}`, 'gray');
    }
  }
  
  if (medium.length > 0) {
    print('\n🟡 Medium Priority Issues:', 'yellow');
    
    for (const rec of recommendations.filter(r => 
      medium.some(i => i.category === r.category)
    )) {
      print(`\n${rec.category}:`, 'bold');
      print(`  ${rec.recommendation}`, 'gray');
    }
  }
  
  if (low.length > 0 || info.length > 0) {
    print('\n🔵 Low Priority / Informational:', 'blue');
    
    for (const rec of recommendations.filter(r => 
      low.some(i => i.category === r.category) || 
      info.some(i => i.category === r.category)
    )) {
      print(`\n${rec.category}:`, 'bold');
      print(`  ${rec.recommendation}`, 'gray');
    }
  }
  
  print('\nFor more help:', 'blue');
  print('  - Troubleshooting Guide: docs/troubleshooting-guide.md', 'gray');
  print('  - Run validation: npm run validate:release-setup', 'gray');
  print('  - Check logs: cat .kiro/logs/release-manager.log', 'gray');
  print('');
}

/**
 * Main diagnostic function
 */
function main() {
  print('\n' + '='.repeat(60), 'blue');
  print('Release Management System - Issue Diagnostics', 'blue');
  print('='.repeat(60), 'blue');
  print('');
  
  // Run all diagnostic checks
  checkLogFiles();
  checkPipelineState();
  checkReleaseTriggers();
  checkCompletionDocuments();
  checkGitState();
  checkPackageJson();
  
  // Print recommendations
  printRecommendations();
  
  // Exit with appropriate code
  const highPriorityIssues = issues.filter(i => i.severity === 'high').length;
  process.exit(highPriorityIssues > 0 ? 1 : 0);
}

// Run diagnostics
main();
