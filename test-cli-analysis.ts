/**
 * Test the CLI analysis with summary prioritization
 */

import { AdvancedReleaseCLI } from './src/release-analysis/cli/AdvancedReleaseCLI';
import { DEFAULT_ANALYSIS_CONFIG } from './src/release-analysis/config/AnalysisConfig';

async function testCLIAnalysis() {
  console.log('🧪 Testing CLI Analysis with Summary Prioritization');
  console.log('===================================================\n');

  const cli = new AdvancedReleaseCLI(process.cwd(), DEFAULT_ANALYSIS_CONFIG);

  console.log('📊 Configuration:');
  console.log(`   preferSummaries: ${DEFAULT_ANALYSIS_CONFIG.extraction.preferSummaries}`);
  console.log(`   summaryPatterns: ${DEFAULT_ANALYSIS_CONFIG.extraction.summaryPatterns.join(', ')}`);
  console.log('');

  console.log('🔍 Running analysis (this may take a moment)...\n');

  try {
    const result = await cli.analyze({
      format: 'summary',
      output: 'test-cli-analysis-output.md'
    });

    console.log('✅ Analysis Complete!');
    console.log('');
    console.log('📈 Results:');
    console.log(`   Documents analyzed: ${result.metadata?.documentsAnalyzed || 'N/A'}`);
    console.log(`   Version recommendation: ${result.versionRecommendation?.recommendedVersion || 'N/A'}`);
    console.log(`   Breaking changes: ${result.changes?.breakingChanges?.length || 0}`);
    console.log(`   New features: ${result.changes?.features?.length || 0}`);
    console.log(`   Bug fixes: ${result.changes?.bugFixes?.length || 0}`);
    console.log('');
    console.log('📝 Output saved to: test-cli-analysis-output.md');
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

testCLIAnalysis().catch(console.error);
