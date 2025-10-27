#!/usr/bin/env node
"use strict";
/**
 * Example usage of GitHistoryAnalyzer
 *
 * This script demonstrates how to use the GitHistoryAnalyzer to:
 * 1. Find the last release tag
 * 2. Get changes since that release
 * 3. Find completion documents in those changes
 * 4. Validate the analysis scope
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.demonstrateGitAnalysis = demonstrateGitAnalysis;
const GitHistoryAnalyzer_1 = require("./GitHistoryAnalyzer");
async function demonstrateGitAnalysis() {
    console.log('🔍 Git History Analysis Demo\n');
    // Initialize analyzer for current directory
    const analyzer = new GitHistoryAnalyzer_1.GitHistoryAnalyzer();
    try {
        // Step 1: Find last release
        console.log('📋 Step 1: Finding last release tag...');
        const lastRelease = await analyzer.findLastRelease();
        if (lastRelease) {
            console.log(`✅ Found last release: ${lastRelease.name}`);
            console.log(`   Commit: ${lastRelease.commit}`);
            console.log(`   Date: ${lastRelease.date.toISOString()}`);
            if (lastRelease.message) {
                console.log(`   Message: ${lastRelease.message}`);
            }
        }
        else {
            console.log('❌ No release tags found');
            console.log('   This could mean:');
            console.log('   - No Git repository in current directory');
            console.log('   - No semantic version tags exist');
            console.log('   - Repository has no tags at all');
            return;
        }
        console.log('\n📋 Step 2: Getting changes since last release...');
        // Step 2: Get changes since last release
        const changes = await analyzer.getChangesSince(lastRelease.name);
        console.log(`✅ Found ${changes.commits.length} commits since ${lastRelease.name}`);
        console.log(`   Added files: ${changes.addedFiles.length}`);
        console.log(`   Modified files: ${changes.modifiedFiles.length}`);
        console.log(`   Deleted files: ${changes.deletedFiles.length}`);
        console.log(`   Time range: ${changes.timeRange.from.toISOString()} to ${changes.timeRange.to.toISOString()}`);
        if (changes.commits.length > 0) {
            console.log('\n   Recent commits:');
            changes.commits.slice(0, 3).forEach(commit => {
                console.log(`   - ${commit.shortHash}: ${commit.message} (${commit.author})`);
            });
            if (changes.commits.length > 3) {
                console.log(`   ... and ${changes.commits.length - 3} more commits`);
            }
        }
        console.log('\n📋 Step 3: Finding completion documents...');
        // Step 3: Find completion documents
        const completionDocs = await analyzer.findCompletionDocuments(changes);
        console.log(`✅ Found ${completionDocs.length} completion documents`);
        if (completionDocs.length > 0) {
            console.log('\n   Completion documents:');
            completionDocs.forEach(doc => {
                console.log(`   - ${doc.path}`);
                console.log(`     Title: ${doc.metadata.title}`);
                console.log(`     Type: ${doc.metadata.type}`);
                if (doc.metadata.task) {
                    console.log(`     Task: ${doc.metadata.task}`);
                }
                if (doc.metadata.spec) {
                    console.log(`     Spec: ${doc.metadata.spec}`);
                }
                console.log(`     Last modified: ${doc.lastModified.toISOString()}`);
                console.log('');
            });
        }
        else {
            console.log('   No completion documents found in changes');
            console.log('   This could mean:');
            console.log('   - No tasks were completed since last release');
            console.log('   - Completion documents are not in expected locations');
            console.log('   - Changes only include non-completion files');
        }
        console.log('📋 Step 4: Validating analysis scope...');
        // Step 4: Validate analysis scope
        const scope = {
            fromTag: lastRelease.name,
            fromCommit: lastRelease.commit,
            toCommit: changes.commits.length > 0 ? changes.commits[0].hash : lastRelease.commit,
            completionDocuments: completionDocs,
            analysisDate: new Date()
        };
        const validation = analyzer.validateAnalysisScope(scope);
        if (validation.isValid) {
            console.log('✅ Analysis scope is valid');
        }
        else {
            console.log('❌ Analysis scope has errors:');
            validation.errors.forEach(error => {
                console.log(`   - ${error}`);
            });
        }
        if (validation.warnings.length > 0) {
            console.log('⚠️  Warnings:');
            validation.warnings.forEach(warning => {
                console.log(`   - ${warning}`);
            });
        }
        console.log('\n🎉 Git history analysis complete!');
        // Summary
        console.log('\n📊 Summary:');
        console.log(`   Last release: ${lastRelease.name} (${lastRelease.date.toDateString()})`);
        console.log(`   Commits since release: ${changes.commits.length}`);
        console.log(`   Completion documents: ${completionDocs.length}`);
        console.log(`   Analysis scope valid: ${validation.isValid ? 'Yes' : 'No'}`);
    }
    catch (error) {
        console.error('❌ Error during Git analysis:');
        console.error(`   ${error instanceof Error ? error.message : String(error)}`);
        console.error('\n   This could be due to:');
        console.error('   - Not being in a Git repository');
        console.error('   - Git not being installed or accessible');
        console.error('   - Invalid Git repository state');
        console.error('   - Permission issues accessing Git data');
    }
}
// Run the demo if this file is executed directly
if (require.main === module) {
    demonstrateGitAnalysis().catch(console.error);
}
//# sourceMappingURL=example-usage.js.map