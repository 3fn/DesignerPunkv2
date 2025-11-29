#!/usr/bin/env node

/**
 * Release Management System - Setup Validation Script
 * 
 * This script validates the release management system setup by checking:
 * - Authentication (GitHub and npm tokens)
 * - Configuration (required settings)
 * - Environment (Node version, dependencies)
 * - File structure (completion documents, state directories)
 * 
 * Usage:
 *   node scripts/validate-release-setup.js
 *   npm run validate:release-setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
  gray: '\x1b[90m'
};

// Validation results
const results = {
  passed: [],
  warnings: [],
  failed: [],
  info: []
};

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
 * Print validation result
 */
function printResult(status, message, details = null) {
  const symbols = {
    pass: '✓',
    warn: '⚠',
    fail: '✗',
    info: 'ℹ'
  };
  
  const colorMap = {
    pass: 'green',
    warn: 'yellow',
    fail: 'red',
    info: 'blue'
  };
  
  print(`${symbols[status]} ${message}`, colorMap[status]);
  
  if (details) {
    print(`  ${details}`, 'gray');
  }
}

/**
 * Check if command exists
 */
function commandExists(command) {
  try {
    execSync(`which ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Execute command and return output
 */
function execCommand(command, options = {}) {
  try {
    return execSync(command, { 
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options
    }).trim();
  } catch (error) {
    return null;
  }
}

/**
 * Check Node.js version
 */
function checkNodeVersion() {
  printSection('Environment Validation');
  
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion >= 18) {
    results.passed.push('Node.js version');
    printResult('pass', `Node.js version: ${nodeVersion}`);
  } else {
    results.failed.push('Node.js version');
    printResult('fail', `Node.js version: ${nodeVersion}`, 'Requires Node.js 18 or higher');
  }
}

/**
 * Check npm version
 */
function checkNpmVersion() {
  const npmVersion = execCommand('npm --version', { silent: true });
  
  if (npmVersion) {
    results.passed.push('npm version');
    printResult('pass', `npm version: ${npmVersion}`);
  } else {
    results.failed.push('npm version');
    printResult('fail', 'npm not found');
  }
}

/**
 * Check git installation
 */
function checkGit() {
  if (commandExists('git')) {
    const gitVersion = execCommand('git --version', { silent: true });
    results.passed.push('git installation');
    printResult('pass', `git installed: ${gitVersion}`);
  } else {
    results.failed.push('git installation');
    printResult('fail', 'git not found', 'git is required for release management');
  }
}

/**
 * Check GitHub token
 */
function checkGitHubToken() {
  printSection('Authentication Validation');
  
  const token = process.env.GITHUB_TOKEN;
  
  if (!token) {
    results.failed.push('GitHub token');
    printResult('fail', 'GITHUB_TOKEN not set', 'Set via: export GITHUB_TOKEN=ghp_xxx');
    return;
  }
  
  // Check token format
  if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
    results.warnings.push('GitHub token format');
    printResult('warn', 'GitHub token format may be invalid', 'Expected ghp_ or github_pat_ prefix');
  }
  
  // Verify token with GitHub API
  const curlCommand = `curl -s -H "Authorization: token ${token}" https://api.github.com/user`;
  const response = execCommand(curlCommand, { silent: true });
  
  if (response && !response.includes('Bad credentials')) {
    try {
      const user = JSON.parse(response);
      results.passed.push('GitHub authentication');
      printResult('pass', `GitHub token valid for user: ${user.login}`);
      
      // Check token scopes
      const scopeCommand = `curl -s -I -H "Authorization: token ${token}" https://api.github.com/user | grep -i x-oauth-scopes`;
      const scopes = execCommand(scopeCommand, { silent: true });
      
      if (scopes) {
        const scopeList = scopes.split(':')[1]?.trim() || '';
        if (scopeList.includes('repo')) {
          results.passed.push('GitHub token scopes');
          printResult('pass', 'GitHub token has required repo scope');
        } else {
          results.warnings.push('GitHub token scopes');
          printResult('warn', 'GitHub token may be missing repo scope', 'Required for creating releases');
        }
      }
    } catch (error) {
      results.warnings.push('GitHub token validation');
      printResult('warn', 'Could not parse GitHub API response');
    }
  } else {
    results.failed.push('GitHub authentication');
    printResult('fail', 'GitHub token authentication failed', 'Token may be invalid or expired');
  }
}

/**
 * Check npm token
 */
function checkNpmToken() {
  const token = process.env.NPM_TOKEN;
  
  if (!token) {
    results.warnings.push('npm token');
    printResult('warn', 'NPM_TOKEN not set', 'Required for npm publishing. Set via: export NPM_TOKEN=npm_xxx');
    return;
  }
  
  // Check token format
  if (!token.startsWith('npm_')) {
    results.warnings.push('npm token format');
    printResult('warn', 'npm token format may be invalid', 'Expected npm_ prefix');
  }
  
  // Verify token with npm registry
  const whoami = execCommand('npm whoami --registry https://registry.npmjs.org', { silent: true });
  
  if (whoami) {
    results.passed.push('npm authentication');
    printResult('pass', `npm token valid for user: ${whoami}`);
  } else {
    results.warnings.push('npm authentication');
    printResult('warn', 'npm token authentication failed', 'Token may be invalid or not configured');
  }
}

/**
 * Check configuration file
 */
function checkConfiguration() {
  printSection('Configuration Validation');
  
  const configPath = path.join(process.cwd(), '.kiro', 'release-config.json');
  
  if (!fs.existsSync(configPath)) {
    results.warnings.push('configuration file');
    printResult('warn', 'Configuration file not found', `Expected at: ${configPath}`);
    return;
  }
  
  try {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    results.passed.push('configuration file');
    printResult('pass', 'Configuration file found and valid');
    
    // Check required fields
    const requiredFields = [
      { path: 'github.owner', name: 'GitHub owner' },
      { path: 'github.repo', name: 'GitHub repository' }
    ];
    
    for (const field of requiredFields) {
      const value = field.path.split('.').reduce((obj, key) => obj?.[key], config);
      
      if (value) {
        results.passed.push(field.name);
        printResult('pass', `${field.name}: ${value}`);
      } else {
        results.warnings.push(field.name);
        printResult('warn', `${field.name} not configured`);
      }
    }
    
    // Check package configuration
    if (config.packages?.packages?.length > 0) {
      results.passed.push('package configuration');
      printResult('pass', `Configured packages: ${config.packages.packages.length}`);
      
      // Verify package paths
      for (const pkg of config.packages.packages) {
        const pkgPath = path.join(process.cwd(), pkg.path, 'package.json');
        
        if (fs.existsSync(pkgPath)) {
          results.passed.push(`package: ${pkg.name}`);
          printResult('pass', `Package found: ${pkg.name}`, `Path: ${pkg.path}`);
        } else {
          results.failed.push(`package: ${pkg.name}`);
          printResult('fail', `Package not found: ${pkg.name}`, `Expected at: ${pkgPath}`);
        }
      }
    } else {
      results.warnings.push('package configuration');
      printResult('warn', 'No packages configured', 'Add packages to configuration for multi-package support');
    }
  } catch (error) {
    results.failed.push('configuration file');
    printResult('fail', 'Configuration file is invalid', error.message);
  }
}

/**
 * Check directory structure
 */
function checkDirectoryStructure() {
  printSection('Directory Structure Validation');
  
  const requiredDirs = [
    { path: '.kiro', name: 'Kiro directory' },
    { path: '.kiro/specs', name: 'Specs directory' },
    { path: '.kiro/logs', name: 'Logs directory' },
    { path: '.kiro/release-triggers', name: 'Release triggers directory' }
  ];
  
  for (const dir of requiredDirs) {
    const dirPath = path.join(process.cwd(), dir.path);
    
    if (fs.existsSync(dirPath)) {
      results.passed.push(dir.name);
      printResult('pass', `${dir.name} exists`, dirPath);
    } else {
      results.warnings.push(dir.name);
      printResult('warn', `${dir.name} not found`, `Will be created at: ${dirPath}`);
    }
  }
  
  // Check for completion documents
  const specsDir = path.join(process.cwd(), '.kiro', 'specs');
  
  if (fs.existsSync(specsDir)) {
    const specs = fs.readdirSync(specsDir).filter(name => {
      const specPath = path.join(specsDir, name);
      return fs.statSync(specPath).isDirectory();
    });
    
    if (specs.length > 0) {
      results.info.push('specs found');
      printResult('info', `Found ${specs.length} spec(s)`);
      
      let completionDocsFound = 0;
      
      for (const spec of specs) {
        const completionDir = path.join(specsDir, spec, 'completion');
        
        if (fs.existsSync(completionDir)) {
          const docs = fs.readdirSync(completionDir).filter(name => name.endsWith('.md'));
          completionDocsFound += docs.length;
        }
      }
      
      if (completionDocsFound > 0) {
        results.passed.push('completion documents');
        printResult('pass', `Found ${completionDocsFound} completion document(s)`);
      } else {
        results.info.push('completion documents');
        printResult('info', 'No completion documents found', 'Create completion docs to enable release detection');
      }
    } else {
      results.info.push('specs');
      printResult('info', 'No specs found', 'Specs will be created as you develop features');
    }
  }
}

/**
 * Check dependencies
 */
function checkDependencies() {
  printSection('Dependencies Validation');
  
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packageJsonPath)) {
    results.failed.push('package.json');
    printResult('fail', 'package.json not found');
    return;
  }
  
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    results.passed.push('package.json');
    printResult('pass', 'package.json found');
    
    // Check for release scripts
    const requiredScripts = [
      'release:analyze',
      'release:cli'
    ];
    
    for (const script of requiredScripts) {
      if (packageJson.scripts?.[script]) {
        results.passed.push(`script: ${script}`);
        printResult('pass', `Script configured: ${script}`);
      } else {
        results.warnings.push(`script: ${script}`);
        printResult('warn', `Script not configured: ${script}`, 'Add to package.json scripts');
      }
    }
    
    // Check node_modules
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    
    if (fs.existsSync(nodeModulesPath)) {
      results.passed.push('node_modules');
      printResult('pass', 'Dependencies installed');
    } else {
      results.failed.push('node_modules');
      printResult('fail', 'Dependencies not installed', 'Run: npm install');
    }
  } catch (error) {
    results.failed.push('package.json');
    printResult('fail', 'package.json is invalid', error.message);
  }
}

/**
 * Check git repository
 */
function checkGitRepository() {
  printSection('Git Repository Validation');
  
  const gitDir = path.join(process.cwd(), '.git');
  
  if (!fs.existsSync(gitDir)) {
    results.failed.push('git repository');
    printResult('fail', 'Not a git repository', 'Initialize with: git init');
    return;
  }
  
  results.passed.push('git repository');
  printResult('pass', 'Git repository initialized');
  
  // Check remote
  const remote = execCommand('git remote get-url origin', { silent: true });
  
  if (remote) {
    results.passed.push('git remote');
    printResult('pass', `Git remote configured: ${remote}`);
  } else {
    results.warnings.push('git remote');
    printResult('warn', 'Git remote not configured', 'Add with: git remote add origin <url>');
  }
  
  // Check for uncommitted changes
  const status = execCommand('git status --porcelain', { silent: true });
  
  if (status) {
    results.warnings.push('git status');
    printResult('warn', 'Uncommitted changes detected', 'Commit changes before release');
  } else {
    results.passed.push('git status');
    printResult('pass', 'Working directory clean');
  }
  
  // Check current branch
  const branch = execCommand('git branch --show-current', { silent: true });
  
  if (branch) {
    results.info.push('git branch');
    printResult('info', `Current branch: ${branch}`);
  }
}

/**
 * Print summary
 */
function printSummary() {
  printSection('Validation Summary');
  
  const total = results.passed.length + results.warnings.length + results.failed.length;
  
  print(`\nTotal checks: ${total}`, 'blue');
  printResult('pass', `Passed: ${results.passed.length}`);
  printResult('warn', `Warnings: ${results.warnings.length}`);
  printResult('fail', `Failed: ${results.failed.length}`);
  printResult('info', `Info: ${results.info.length}`);
  
  if (results.failed.length === 0 && results.warnings.length === 0) {
    print('\n✓ All validations passed! Release management system is ready.', 'green');
    print('\nNext steps:', 'blue');
    print('  1. Complete a task and create a completion document', 'gray');
    print('  2. Run: npm run release:analyze', 'gray');
    print('  3. Run: npm run release:cli release auto', 'gray');
  } else if (results.failed.length === 0) {
    print('\n⚠ Validation completed with warnings. System is functional but some features may be limited.', 'yellow');
    print('\nRecommended actions:', 'blue');
    
    if (results.warnings.some(w => w.includes('npm'))) {
      print('  - Configure npm token for publishing: export NPM_TOKEN=npm_xxx', 'gray');
    }
    
    if (results.warnings.some(w => w.includes('configuration'))) {
      print('  - Review configuration: npm run release:cli config show', 'gray');
    }
  } else {
    print('\n✗ Validation failed. Please fix the issues above before using the release management system.', 'red');
    print('\nRequired actions:', 'blue');
    
    if (results.failed.some(f => f.includes('GitHub'))) {
      print('  - Set GitHub token: export GITHUB_TOKEN=ghp_xxx', 'gray');
    }
    
    if (results.failed.some(f => f.includes('node_modules'))) {
      print('  - Install dependencies: npm install', 'gray');
    }
    
    if (results.failed.some(f => f.includes('git'))) {
      print('  - Initialize git repository: git init', 'gray');
    }
  }
  
  print('\nFor more help, see:', 'blue');
  print('  - Troubleshooting Guide: docs/troubleshooting-guide.md', 'gray');
  print('  - Configuration Reference: docs/configuration-reference.md', 'gray');
  print('  - Release Management Guide: docs/release-management-guide.md', 'gray');
  print('');
}

/**
 * Main validation function
 */
function main() {
  print('\n' + '='.repeat(60), 'blue');
  print('Release Management System - Setup Validation', 'blue');
  print('='.repeat(60), 'blue');
  print('');
  
  // Run all validation checks
  checkNodeVersion();
  checkNpmVersion();
  checkGit();
  checkGitHubToken();
  checkNpmToken();
  checkConfiguration();
  checkDirectoryStructure();
  checkDependencies();
  checkGitRepository();
  
  // Print summary
  printSummary();
  
  // Exit with appropriate code
  process.exit(results.failed.length > 0 ? 1 : 0);
}

// Run validation
main();
