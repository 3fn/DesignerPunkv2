/**
 * Quick test to verify summary document discovery and prioritization
 */

import { CompletionDocumentCollector } from './src/release-analysis/collection/CompletionDocumentCollector';
import { DEFAULT_ANALYSIS_CONFIG } from './src/release-analysis/config/AnalysisConfig';

async function testSummaryDiscovery() {
  console.log('🧪 Testing Summary Document Discovery');
  console.log('=====================================\n');

  const collector = new CompletionDocumentCollector(process.cwd(), DEFAULT_ANALYSIS_CONFIG);

  // Test with a mix of summary and completion documents
  const testPaths = [
    'docs/specs/008-icon-web-component-conversion/task-1-summary.md',
    '.kiro/specs/008-icon-web-component-conversion/completion/task-1-parent-completion.md',
    'docs/specs/007-accessibility-token-family/task-1-summary.md',
    '.kiro/specs/007-accessibility-token-family/completion/task-1-completion.md',
    '.kiro/specs/some-spec-without-summary/completion/task-1-completion.md'
  ];

  console.log('📄 Test paths:');
  testPaths.forEach(path => console.log(`   - ${path}`));
  console.log('');

  const result = await collector.collectFromPaths(testPaths);

  console.log('📊 Collection Results:');
  console.log(`   Total files scanned: ${result.metadata.totalFilesScanned}`);
  console.log(`   Documents found: ${result.metadata.documentsFound}`);
  console.log(`   Documents loaded: ${result.metadata.documentsLoaded}`);
  console.log(`   Documents after filtering: ${result.metadata.documentsFiltered}`);
  console.log('');

  console.log('✅ Documents collected:');
  result.documents.forEach(doc => {
    const isSummary = doc.path.includes('summary.md');
    const icon = isSummary ? '📝' : '📄';
    console.log(`   ${icon} ${doc.path}`);
  });
  console.log('');

  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    result.warnings.forEach(warning => console.log(`   - ${warning}`));
    console.log('');
  }

  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(error => console.log(`   - ${error.filePath}: ${error.error}`));
    console.log('');
  }

  console.log('✅ Expected behavior:');
  console.log('   - Should collect task-1-summary.md for spec 008 (skip completion doc)');
  console.log('   - Should collect task-1-summary.md for spec 007 (skip completion doc)');
  console.log('   - Should collect task-1-completion.md for spec without summary (fallback)');
  console.log('');

  const summaryCount = result.documents.filter(d => d.path.includes('summary.md')).length;
  const completionCount = result.documents.filter(d => d.path.includes('completion.md')).length;

  console.log(`📈 Summary: ${summaryCount} summaries, ${completionCount} completions`);
  console.log(`   Preference working: ${summaryCount >= 2 && completionCount <= 1 ? '✅ YES' : '❌ NO'}`);
}

testSummaryDiscovery().catch(console.error);
