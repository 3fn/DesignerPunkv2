/**
 * Contract Test Reporter
 *
 * Utility for generating test reports for behavioral contract validation.
 * Provides structured output for cross-platform consistency verification.
 *
 * @see .kiro/steering/Test-Behavioral-Contract-Validation.md
 */

import * as fs from 'fs';

// Types
export interface ContractTestResult {
  contractName: string;
  component: string;
  platform: string;
  passed: boolean;
  assertions: AssertionResult[];
  duration: number;
}

export interface AssertionResult {
  description: string;
  passed: boolean;
  expected?: any;
  actual?: any;
  error?: string;
}

export interface PlatformReport {
  platform: string;
  totalTests: number;
  passed: number;
  failed: number;
  contracts: ContractTestResult[];
}

export interface ComponentReport {
  component: string;
  family: string;
  platforms: PlatformReport[];
  overallConsistency: boolean;
  issues: string[];
}

export interface ConsistencyReport {
  timestamp: string;
  components: ComponentReport[];
  summary: {
    totalComponents: number;
    consistentComponents: number;
    totalContracts: number;
    passedContracts: number;
    platformCoverage: Record<string, number>;
  };
}

/**
 * Generate a consistency report for all components
 */
export function generateConsistencyReport(
  componentReports: ComponentReport[]
): ConsistencyReport {
  const totalContracts = componentReports.reduce((sum, c) => 
    sum + c.platforms.reduce((pSum, p) => pSum + p.totalTests, 0), 0
  );
  
  const passedContracts = componentReports.reduce((sum, c) => 
    sum + c.platforms.reduce((pSum, p) => pSum + p.passed, 0), 0
  );
  
  const platformCoverage: Record<string, number> = {};
  for (const component of componentReports) {
    for (const platform of component.platforms) {
      platformCoverage[platform.platform] = 
        (platformCoverage[platform.platform] || 0) + platform.totalTests;
    }
  }
  
  return {
    timestamp: new Date().toISOString(),
    components: componentReports,
    summary: {
      totalComponents: componentReports.length,
      consistentComponents: componentReports.filter(c => c.overallConsistency).length,
      totalContracts,
      passedContracts,
      platformCoverage,
    },
  };
}

/**
 * Format report as markdown
 */
export function formatReportAsMarkdown(report: ConsistencyReport): string {
  const lines: string[] = [];
  
  lines.push('# Behavioral Contract Validation Report');
  lines.push('');
  lines.push(`**Generated**: ${report.timestamp}`);
  lines.push('');
  
  // Summary
  lines.push('## Summary');
  lines.push('');
  lines.push(`| Metric | Value |`);
  lines.push(`|--------|-------|`);
  lines.push(`| Total Components | ${report.summary.totalComponents} |`);
  lines.push(`| Consistent Components | ${report.summary.consistentComponents} |`);
  lines.push(`| Total Contracts | ${report.summary.totalContracts} |`);
  lines.push(`| Passed Contracts | ${report.summary.passedContracts} |`);
  lines.push(`| Pass Rate | ${((report.summary.passedContracts / report.summary.totalContracts) * 100).toFixed(1)}% |`);
  lines.push('');
  
  // Platform Coverage
  lines.push('## Platform Coverage');
  lines.push('');
  lines.push(`| Platform | Tests |`);
  lines.push(`|----------|-------|`);
  for (const [platform, count] of Object.entries(report.summary.platformCoverage)) {
    lines.push(`| ${platform} | ${count} |`);
  }
  lines.push('');
  
  // Component Details
  lines.push('## Component Details');
  lines.push('');
  
  for (const component of report.components) {
    const status = component.overallConsistency ? '✅' : '⚠️';
    lines.push(`### ${status} ${component.component}`);
    lines.push('');
    lines.push(`**Family**: ${component.family}`);
    lines.push('');
    
    if (component.issues.length > 0) {
      lines.push('**Issues**:');
      for (const issue of component.issues) {
        lines.push(`- ${issue}`);
      }
      lines.push('');
    }
    
    lines.push('| Platform | Total | Passed | Failed |');
    lines.push('|----------|-------|--------|--------|');
    for (const platform of component.platforms) {
      lines.push(`| ${platform.platform} | ${platform.totalTests} | ${platform.passed} | ${platform.failed} |`);
    }
    lines.push('');
  }
  
  return lines.join('\n');
}

/**
 * Format report as JSON
 */
export function formatReportAsJson(report: ConsistencyReport): string {
  return JSON.stringify(report, null, 2);
}

/**
 * Save report to file
 */
export function saveReport(
  report: ConsistencyReport,
  outputPath: string,
  format: 'markdown' | 'json' = 'markdown'
): void {
  const content = format === 'markdown' 
    ? formatReportAsMarkdown(report)
    : formatReportAsJson(report);
  
  fs.writeFileSync(outputPath, content, 'utf-8');
}

/**
 * Create a contract test result
 */
export function createContractTestResult(
  contractName: string,
  component: string,
  platform: string,
  assertions: AssertionResult[],
  duration: number
): ContractTestResult {
  return {
    contractName,
    component,
    platform,
    passed: assertions.every(a => a.passed),
    assertions,
    duration,
  };
}

/**
 * Create an assertion result
 */
export function createAssertionResult(
  description: string,
  passed: boolean,
  expected?: any,
  actual?: any,
  error?: string
): AssertionResult {
  return {
    description,
    passed,
    expected,
    actual,
    error,
  };
}

/**
 * Aggregate contract results into a platform report
 */
export function aggregatePlatformResults(
  platform: string,
  results: ContractTestResult[]
): PlatformReport {
  return {
    platform,
    totalTests: results.length,
    passed: results.filter(r => r.passed).length,
    failed: results.filter(r => !r.passed).length,
    contracts: results,
  };
}

/**
 * Aggregate platform reports into a component report
 */
export function aggregateComponentResults(
  component: string,
  family: string,
  platformReports: PlatformReport[]
): ComponentReport {
  const issues: string[] = [];
  
  // Check for platform parity
  const platforms = platformReports.map(p => p.platform);
  const expectedPlatforms = ['web', 'ios', 'android'];
  const missingPlatforms = expectedPlatforms.filter(p => !platforms.includes(p));
  
  if (missingPlatforms.length > 0) {
    issues.push(`Missing platform implementations: ${missingPlatforms.join(', ')}`);
  }
  
  // Check for failed contracts
  for (const platform of platformReports) {
    if (platform.failed > 0) {
      const failedContracts = platform.contracts
        .filter(c => !c.passed)
        .map(c => c.contractName);
      issues.push(`${platform.platform}: Failed contracts - ${failedContracts.join(', ')}`);
    }
  }
  
  return {
    component,
    family,
    platforms: platformReports,
    overallConsistency: issues.length === 0,
    issues,
  };
}
