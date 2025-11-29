/**
 * Debug extraction from summary documents
 */

import { CompletionDocumentCollector } from './src/release-analysis/collection/CompletionDocumentCollector';
import { DEFAULT_ANALYSIS_CONFIG } from './src/release-analysis/config/AnalysisConfig';

async function debugExtraction() {
  console.log('🔍 Debugging Summary Document Extraction\n');

  const collector = new CompletionDocumentCollector(process.cwd(), DEFAULT_ANALYSIS_CONFIG);

  const testPath = 'docs/specs/001-token-data-quality-fix/task-1-summary.md';
  
  console.log(`📄 Testing: ${testPath}\n`);

  const result = await collector.collectFromPaths([testPath]);

  console.log('📊 Collection Results:');
  console.log(`   Documents found: ${result.metadata.documentsFound}`);
  console.log(`   Documents loaded: ${result.metadata.documentsLoaded}`);
  console.log(`   Documents filtered: ${result.metadata.documentsFiltered}`);
  console.log('');

  if (result.documents.length > 0) {
    const doc = result.documents[0];
    console.log('✅ Document loaded successfully:');
    console.log(`   Path: ${doc.path}`);
    console.log(`   Title: ${doc.metadata.title}`);
    console.log(`   Type: ${doc.metadata.type}`);
    console.log(`   Content length: ${doc.content.length} characters`);
    console.log('');
    console.log('📝 Content preview (first 500 chars):');
    console.log(doc.content.substring(0, 500));
    console.log('...\n');
  } else {
    console.log('❌ No documents collected');
  }

  if (result.warnings.length > 0) {
    console.log('⚠️  Warnings:');
    result.warnings.forEach(w => console.log(`   - ${w}`));
    console.log('');
  }

  if (result.errors.length > 0) {
    console.log('❌ Errors:');
    result.errors.forEach(e => console.log(`   - ${e.filePath}: ${e.error}`));
  }
}

debugExtraction().catch(console.error);
